from __future__ import annotations

from typing import Any, Iterator, TYPE_CHECKING

from coodie.cql_builder import (
    build_select,
    build_count,
    build_delete,
    parse_filter_kwargs,
)
from coodie.exceptions import InvalidQueryError

if TYPE_CHECKING:
    from coodie.sync.document import Document


class QuerySet:
    """Synchronous chainable query builder."""

    def __init__(
        self,
        doc_cls: type[Document],
        *,
        where: list[tuple[str, str, Any]] | None = None,
        limit_val: int | None = None,
        order_by_val: list[str] | None = None,
        allow_filtering_val: bool = False,
    ) -> None:
        self._doc_cls = doc_cls
        self._where: list[tuple[str, str, Any]] = where or []
        self._limit_val = limit_val
        self._order_by_val: list[str] = order_by_val or []
        self._allow_filtering_val = allow_filtering_val

    # ------------------------------------------------------------------
    # Chainable builder methods
    # ------------------------------------------------------------------

    def filter(self, **kwargs: Any) -> QuerySet:
        triples = parse_filter_kwargs(kwargs)
        return QuerySet(
            self._doc_cls,
            where=self._where + triples,
            limit_val=self._limit_val,
            order_by_val=self._order_by_val,
            allow_filtering_val=self._allow_filtering_val,
        )

    def limit(self, n: int) -> QuerySet:
        return QuerySet(
            self._doc_cls,
            where=self._where,
            limit_val=n,
            order_by_val=self._order_by_val,
            allow_filtering_val=self._allow_filtering_val,
        )

    def order_by(self, *cols: str) -> QuerySet:
        return QuerySet(
            self._doc_cls,
            where=self._where,
            limit_val=self._limit_val,
            order_by_val=list(cols),
            allow_filtering_val=self._allow_filtering_val,
        )

    def allow_filtering(self) -> QuerySet:
        return QuerySet(
            self._doc_cls,
            where=self._where,
            limit_val=self._limit_val,
            order_by_val=self._order_by_val,
            allow_filtering_val=True,
        )

    # ------------------------------------------------------------------
    # Terminal methods
    # ------------------------------------------------------------------

    def _get_driver(self) -> Any:
        from coodie.drivers import get_driver

        return get_driver()

    def _table(self) -> str:
        settings = getattr(self._doc_cls, "Settings", None)
        if settings and hasattr(settings, "name"):
            return settings.name
        return _snake_case(self._doc_cls.__name__)

    def _keyspace(self) -> str:
        settings = getattr(self._doc_cls, "Settings", None)
        if settings and hasattr(settings, "keyspace"):
            return settings.keyspace
        from coodie.drivers import get_driver

        driver = get_driver()
        ks = getattr(driver, "_default_keyspace", None)
        if ks:
            return ks
        raise InvalidQueryError("No keyspace configured")

    def all(self) -> list[Document]:
        cql, params = build_select(
            self._table(),
            self._keyspace(),
            where=self._where or None,
            limit=self._limit_val,
            order_by=self._order_by_val or None,
            allow_filtering=self._allow_filtering_val,
        )
        rows = self._get_driver().execute(cql, params)
        return [self._doc_cls(**row) for row in rows]

    def first(self) -> Document | None:
        results = self.limit(1).all()
        return results[0] if results else None

    def count(self) -> int:
        cql, params = build_count(
            self._table(),
            self._keyspace(),
            where=self._where or None,
            allow_filtering=self._allow_filtering_val,
        )
        rows = self._get_driver().execute(cql, params)
        if rows:
            row = rows[0]
            return int(next(iter(row.values())))
        return 0

    def delete(self) -> None:
        cql, params = build_delete(self._table(), self._keyspace(), self._where)
        self._get_driver().execute(cql, params)

    def __iter__(self) -> Iterator[Document]:
        return iter(self.all())

    def __len__(self) -> int:
        return self.count()


def _snake_case(name: str) -> str:
    import re

    s1 = re.sub(r"(.)([A-Z][a-z]+)", r"\1_\2", name)
    return re.sub(r"([a-z0-9])([A-Z])", r"\1_\2", s1).lower()
