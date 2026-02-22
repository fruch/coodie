from __future__ import annotations

from typing import Any, AsyncIterator, TYPE_CHECKING

from coodie.cql_builder import (
    build_select,
    build_count,
    build_delete,
    build_update,
    build_insert,
    parse_filter_kwargs,
    parse_update_kwargs,
)
from coodie.results import LWTResult
from coodie.schema import (
    _find_discriminator_column,
    _resolve_polymorphic_base,
    _build_subclass_map,
)
from coodie.types import coerce_row_none_collections

if TYPE_CHECKING:
    from coodie.aio.document import Document


class QuerySet:
    """Asynchronous chainable query builder."""

    def __init__(
        self,
        doc_cls: type[Document],
        *,
        where: list[tuple[str, str, Any]] | None = None,
        limit_val: int | None = None,
        order_by_val: list[str] | None = None,
        allow_filtering_val: bool = False,
        if_not_exists_val: bool = False,
        if_exists_val: bool = False,
        ttl_val: int | None = None,
        timestamp_val: int | None = None,
        consistency_val: str | None = None,
        timeout_val: float | None = None,
    ) -> None:
        self._doc_cls = doc_cls
        self._where: list[tuple[str, str, Any]] = where or []
        self._limit_val = limit_val
        self._order_by_val: list[str] = order_by_val or []
        self._allow_filtering_val = allow_filtering_val
        self._if_not_exists_val = if_not_exists_val
        self._if_exists_val = if_exists_val
        self._ttl_val = ttl_val
        self._timestamp_val = timestamp_val
        self._consistency_val = consistency_val
        self._timeout_val = timeout_val

    # ------------------------------------------------------------------
    # Internal: clone with overrides
    # ------------------------------------------------------------------

    def _clone(self, **overrides: Any) -> QuerySet:
        defaults = dict(
            where=self._where,
            limit_val=self._limit_val,
            order_by_val=self._order_by_val,
            allow_filtering_val=self._allow_filtering_val,
            if_not_exists_val=self._if_not_exists_val,
            if_exists_val=self._if_exists_val,
            ttl_val=self._ttl_val,
            timestamp_val=self._timestamp_val,
            consistency_val=self._consistency_val,
            timeout_val=self._timeout_val,
        )
        defaults.update(overrides)
        return QuerySet(self._doc_cls, **defaults)

    # ------------------------------------------------------------------
    # Chainable builder methods
    # ------------------------------------------------------------------

    def filter(self, **kwargs: Any) -> QuerySet:
        triples = parse_filter_kwargs(kwargs)
        return self._clone(where=self._where + triples)

    def limit(self, n: int) -> QuerySet:
        return self._clone(limit_val=n)

    def order_by(self, *cols: str) -> QuerySet:
        return self._clone(order_by_val=list(cols))

    def allow_filtering(self) -> QuerySet:
        return self._clone(allow_filtering_val=True)

    def if_not_exists(self) -> QuerySet:
        return self._clone(if_not_exists_val=True)

    def if_exists(self) -> QuerySet:
        return self._clone(if_exists_val=True)

    def ttl(self, seconds: int) -> QuerySet:
        return self._clone(ttl_val=seconds)

    def timestamp(self, ts: int) -> QuerySet:
        return self._clone(timestamp_val=ts)

    def consistency(self, level: str) -> QuerySet:
        return self._clone(consistency_val=level)

    def timeout(self, seconds: float) -> QuerySet:
        return self._clone(timeout_val=seconds)

    def using(
        self,
        *,
        ttl: int | None = None,
        timestamp: int | None = None,
        consistency: str | None = None,
        timeout: float | None = None,
    ) -> QuerySet:
        overrides: dict[str, Any] = {}
        if ttl is not None:
            overrides["ttl_val"] = ttl
        if timestamp is not None:
            overrides["timestamp_val"] = timestamp
        if consistency is not None:
            overrides["consistency_val"] = consistency
        if timeout is not None:
            overrides["timeout_val"] = timeout
        return self._clone(**overrides)

    # ------------------------------------------------------------------
    # Terminal methods (all async)
    # ------------------------------------------------------------------

    def _get_driver(self) -> Any:
        from coodie.drivers import get_driver

        return get_driver()

    def _table(self) -> str:
        return self._doc_cls._get_table()

    def _keyspace(self) -> str:
        return self._doc_cls._get_keyspace()

    async def all(self) -> list[Document]:
        cql, params = build_select(
            self._table(),
            self._keyspace(),
            where=self._where or None,
            limit=self._limit_val,
            order_by=self._order_by_val or None,
            allow_filtering=self._allow_filtering_val,
        )
        rows = await self._get_driver().execute_async(
            cql, params, consistency=self._consistency_val, timeout=self._timeout_val
        )
        disc_col = _find_discriminator_column(self._doc_cls)
        if disc_col is not None:
            base = _resolve_polymorphic_base(self._doc_cls) or self._doc_cls
            subclass_map = _build_subclass_map(base)
            result = []
            for row in rows:
                disc_value = row.get(disc_col)
                target_cls = subclass_map.get(disc_value, self._doc_cls)
                coerced = coerce_row_none_collections(target_cls, row)
                known = target_cls.model_fields
                filtered = {k: v for k, v in coerced.items() if k in known}
                result.append(target_cls(**filtered))
            return result
        return [
            self._doc_cls(**coerce_row_none_collections(self._doc_cls, row))
            for row in rows
        ]

    async def first(self) -> Document | None:
        results = await self.limit(1).all()
        return results[0] if results else None

    async def count(self) -> int:
        cql, params = build_count(
            self._table(),
            self._keyspace(),
            where=self._where or None,
            allow_filtering=self._allow_filtering_val,
        )
        rows = await self._get_driver().execute_async(
            cql, params, consistency=self._consistency_val, timeout=self._timeout_val
        )
        if rows:
            row = rows[0]
            return int(next(iter(row.values())))
        return 0

    async def delete(self) -> LWTResult | None:
        cql, params = build_delete(
            self._table(),
            self._keyspace(),
            self._where,
            timestamp=self._timestamp_val,
            if_exists=self._if_exists_val,
        )
        rows = await self._get_driver().execute_async(
            cql, params, consistency=self._consistency_val, timeout=self._timeout_val
        )
        if self._if_exists_val:
            return _parse_lwt_result(rows)
        return None

    async def create(self, **kwargs: Any) -> LWTResult | None:
        """Insert a new document. Respects ``if_not_exists()`` chain modifier."""
        data = kwargs
        cql, params = build_insert(
            self._table(),
            self._keyspace(),
            data,
            if_not_exists=self._if_not_exists_val,
        )
        rows = await self._get_driver().execute_async(cql, params)
        if self._if_not_exists_val:
            return _parse_lwt_result(rows)
        return None

    async def update(
        self,
        ttl: int | None = None,
        if_conditions: dict[str, Any] | None = None,
        **kwargs: Any,
    ) -> None:
        """Bulk UPDATE matching rows."""
        set_data, collection_ops = parse_update_kwargs(kwargs)
        if not set_data and not collection_ops:
            return
        cql, params = build_update(
            self._table(),
            self._keyspace(),
            set_data,
            self._where,
            ttl=ttl,
            if_conditions=if_conditions,
            collection_ops=collection_ops or None,
        )
        await self._get_driver().execute_async(cql, params)

    async def __aiter__(self) -> AsyncIterator[Document]:
        for doc in await self.all():
            yield doc


def _parse_lwt_result(rows: list[dict[str, Any]]) -> LWTResult:
    """Parse the result of a LWT operation into a :class:`LWTResult`."""
    if not rows:
        return LWTResult(applied=True)
    row = rows[0]
    applied = row.get("[applied]", True)
    existing = {k: v for k, v in row.items() if k != "[applied]"} or None
    return LWTResult(applied=applied, existing=existing)
