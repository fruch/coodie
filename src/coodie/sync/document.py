from __future__ import annotations

from typing import Any, ClassVar

from pydantic import BaseModel

from coodie.cql_builder import (
    build_insert,
    build_delete,
    build_update,
    build_counter_update,
    parse_update_kwargs,
)

from coodie.exceptions import (
    DocumentNotFound,
    MultipleDocumentsFound,
    InvalidQueryError,
)
from coodie.results import LWTResult
from coodie.schema import build_schema, ColumnDefinition
from coodie.sync.query import QuerySet, _snake_case


class Document(BaseModel):
    """Base class for synchronous coodie documents."""

    __schema__: ClassVar[list[ColumnDefinition]]

    class Settings:
        name: str = ""
        keyspace: str = ""

    # ------------------------------------------------------------------
    # Schema / table helpers
    # ------------------------------------------------------------------

    @classmethod
    def _get_table(cls) -> str:
        settings = getattr(cls, "Settings", None)
        if settings and getattr(settings, "name", None):
            return settings.name
        return _snake_case(cls.__name__)

    @classmethod
    def _get_keyspace(cls) -> str:
        settings = getattr(cls, "Settings", None)
        if settings and getattr(settings, "keyspace", None):
            return settings.keyspace
        from coodie.drivers import get_driver

        driver = get_driver()
        ks = getattr(driver, "_default_keyspace", None)
        if ks:
            return ks
        from coodie.exceptions import InvalidQueryError

        raise InvalidQueryError("No keyspace configured")

    @classmethod
    def _get_driver(cls) -> Any:
        from coodie.drivers import get_driver

        return get_driver()

    @classmethod
    def _schema(cls) -> list[ColumnDefinition]:
        if not hasattr(cls, "__schema__") or cls.__schema__ is None:
            cls.__schema__ = build_schema(cls)
        return cls.__schema__

    @classmethod
    def sync_table(cls) -> None:
        """Idempotently create or update the table in the database."""
        schema = cls._schema()
        cls._get_driver().sync_table(cls._get_table(), cls._get_keyspace(), schema)

    # ------------------------------------------------------------------
    # Write operations
    # ------------------------------------------------------------------

    def save(
        self,
        ttl: int | None = None,
        timestamp: int | None = None,
        consistency: str | None = None,
        timeout: float | None = None,
    ) -> None:
        """Insert (upsert) this document."""
        data = self.model_dump(exclude_none=False)
        cql, params = build_insert(
            self.__class__._get_table(),
            self.__class__._get_keyspace(),
            data,
            ttl=ttl,
            timestamp=timestamp,
        )
        self.__class__._get_driver().execute(
            cql, params, consistency=consistency, timeout=timeout
        )

    def insert(
        self,
        ttl: int | None = None,
        timestamp: int | None = None,
        consistency: str | None = None,
        timeout: float | None = None,
    ) -> None:
        """Insert IF NOT EXISTS (create-only)."""
        data = self.model_dump(exclude_none=False)
        cql, params = build_insert(
            self.__class__._get_table(),
            self.__class__._get_keyspace(),
            data,
            ttl=ttl,
            if_not_exists=True,
            timestamp=timestamp,
        )
        self.__class__._get_driver().execute(
            cql, params, consistency=consistency, timeout=timeout
        )

    def delete(
        self,
        if_exists: bool = False,
        timestamp: int | None = None,
        consistency: str | None = None,
        timeout: float | None = None,
    ) -> LWTResult | None:
        """Delete this document by its primary key.

        When *if_exists* is ``True`` the generated CQL includes ``IF EXISTS``
        and a :class:`~coodie.results.LWTResult` is returned.
        """
        schema = self.__class__._schema()
        pk_cols = [c for c in schema if c.primary_key or c.clustering_key]
        where = [(c.name, "=", getattr(self, c.name)) for c in pk_cols]
        cql, params = build_delete(
            self.__class__._get_table(),
            self.__class__._get_keyspace(),
            where,
            if_exists=if_exists,
            timestamp=timestamp,
        )

        rows = self.__class__._get_driver().execute(
            cql, params, consistency=consistency, timeout=timeout
        )
        if if_exists:
            return _parse_lwt_result(rows)
        return None

    def update(
        self,
        *,
        if_conditions: dict[str, Any] | None = None,
        if_exists: bool = False,
        ttl: int | None = None,
        **kwargs: Any,
    ) -> LWTResult | None:
        """Partial update — sets only the given fields.

        Supports collection operations via ``parse_update_kwargs`` (e.g.
        ``add__``, ``remove__`` prefixed keys).

        When *if_conditions* or *if_exists* is supplied the generated CQL
        includes a lightweight-transaction clause and a
        :class:`~coodie.results.LWTResult` is returned.
        """
        set_data, collection_ops = parse_update_kwargs(kwargs)

        if not set_data and not collection_ops:
            return None

        schema = self.__class__._schema()
        pk_cols = [c for c in schema if c.primary_key or c.clustering_key]
        where = [(c.name, "=", getattr(self, c.name)) for c in pk_cols]

        cql, params = build_update(
            self.__class__._get_table(),
            self.__class__._get_keyspace(),
            set_data=set_data,
            where=where,
            ttl=ttl,
            if_conditions=if_conditions,
            if_exists=if_exists,
            collection_ops=collection_ops or None,
        )
        rows = self.__class__._get_driver().execute(cql, params)

        # Update in-memory model fields for regular set assignments
        for k, v in set_data.items():
            if hasattr(self, k):
                object.__setattr__(self, k, v)

        if if_conditions or if_exists:
            return _parse_lwt_result(rows)
        return None

    # ------------------------------------------------------------------
    # Query / read operations
    # ------------------------------------------------------------------

    @classmethod
    def find(cls, **kwargs: Any) -> QuerySet:
        """Return a QuerySet filtered by *kwargs*."""
        qs = QuerySet(cls)
        if kwargs:
            qs = qs.filter(**kwargs)
        return qs

    @classmethod
    def find_one(cls, **kwargs: Any) -> Document | None:
        """Return a single document or None."""
        results = cls.find(**kwargs).limit(2).all()
        if len(results) > 1:
            raise MultipleDocumentsFound(
                f"Expected one {cls.__name__} but found multiple matching {kwargs}"
            )
        return results[0] if results else None

    @classmethod
    def get(cls, **kwargs: Any) -> Document:
        """Return a single document; raise DocumentNotFound if missing."""
        result = cls.find_one(**kwargs)
        if result is None:
            raise DocumentNotFound(f"No {cls.__name__} found matching {kwargs}")
        return result

    model_config = {"arbitrary_types_allowed": True}


class CounterDocument(Document):
    """Base class for synchronous counter-column documents.

    Counter tables only support increment/decrement operations.
    ``save()`` and ``insert()`` are forbidden.
    """

    def save(  # noqa: ARG002
        self,
        ttl: int | None = None,
        timestamp: int | None = None,
        consistency: str | None = None,
        timeout: float | None = None,
    ) -> None:
        raise InvalidQueryError(
            "Counter tables do not support save(). "
            "Use increment() or decrement() instead."
        )

    def insert(  # noqa: ARG002
        self,
        ttl: int | None = None,
        timestamp: int | None = None,
        consistency: str | None = None,
        timeout: float | None = None,
    ) -> None:
        raise InvalidQueryError(
            "Counter tables do not support insert(). "
            "Use increment() or decrement() instead."
        )

    def _counter_update(self, deltas: dict[str, int]) -> None:
        """Execute a counter UPDATE with the given deltas."""
        schema = self.__class__._schema()
        pk_cols = [c for c in schema if c.primary_key or c.clustering_key]
        where = [(c.name, "=", getattr(self, c.name)) for c in pk_cols]
        cql, params = build_counter_update(
            self.__class__._get_table(),
            self.__class__._get_keyspace(),
            deltas,
            where,
        )
        self.__class__._get_driver().execute(cql, params)

    def increment(self, **field_deltas: int) -> None:
        """Increment counter columns by the given amounts.

        Example::

            page_view.increment(view_count=1, unique_visitors=1)
        """
        self._counter_update(field_deltas)

    def decrement(self, **field_deltas: int) -> None:
        """Decrement counter columns by the given amounts.

        Example::

            page_view.decrement(view_count=1)
        """
        negated = {k: -v for k, v in field_deltas.items()}
        self._counter_update(negated)


def _parse_lwt_result(rows: list[dict[str, Any]]) -> LWTResult:
    """Parse the result of a LWT operation into a :class:`LWTResult`."""
    if not rows:
        return LWTResult(applied=True)
    row = rows[0]
    applied = row.get("[applied]", True)
    existing = {k: v for k, v in row.items() if k != "[applied]"} or None
    return LWTResult(applied=applied, existing=existing)
