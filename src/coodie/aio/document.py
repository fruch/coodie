from __future__ import annotations

from typing import Any, ClassVar

from pydantic import BaseModel

from coodie.cql_builder import build_insert, build_delete, build_counter_update
from coodie.exceptions import (
    DocumentNotFound,
    MultipleDocumentsFound,
    InvalidQueryError,
)
from coodie.schema import build_schema, ColumnDefinition
from coodie.aio.query import QuerySet
from coodie.sync.query import _snake_case


class Document(BaseModel):
    """Base class for asynchronous coodie documents."""

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
    async def sync_table(cls) -> None:
        """Idempotently create or update the table in the database."""
        schema = cls._schema()
        await cls._get_driver().sync_table_async(
            cls._get_table(), cls._get_keyspace(), schema
        )

    # ------------------------------------------------------------------
    # Write operations (all async)
    # ------------------------------------------------------------------

    async def save(self, ttl: int | None = None) -> None:
        """Insert (upsert) this document."""
        data = self.model_dump(exclude_none=False)
        cql, params = build_insert(
            self.__class__._get_table(),
            self.__class__._get_keyspace(),
            data,
            ttl=ttl,
        )
        await self.__class__._get_driver().execute_async(cql, params)

    async def insert(self, ttl: int | None = None) -> None:
        """Insert IF NOT EXISTS (create-only)."""
        data = self.model_dump(exclude_none=False)
        cql, params = build_insert(
            self.__class__._get_table(),
            self.__class__._get_keyspace(),
            data,
            ttl=ttl,
            if_not_exists=True,
        )
        await self.__class__._get_driver().execute_async(cql, params)

    async def delete(self) -> None:
        """Delete this document by its primary key."""
        schema = self.__class__._schema()
        pk_cols = [c for c in schema if c.primary_key or c.clustering_key]
        where = [(c.name, "=", getattr(self, c.name)) for c in pk_cols]
        cql, params = build_delete(
            self.__class__._get_table(),
            self.__class__._get_keyspace(),
            where,
        )
        await self.__class__._get_driver().execute_async(cql, params)

    # ------------------------------------------------------------------
    # Query / read operations
    # ------------------------------------------------------------------

    @classmethod
    def find(cls, **kwargs: Any) -> QuerySet:
        """Return an async QuerySet filtered by *kwargs*."""
        qs = QuerySet(cls)
        if kwargs:
            qs = qs.filter(**kwargs)
        return qs

    @classmethod
    async def find_one(cls, **kwargs: Any) -> Document | None:
        """Return a single document or None."""
        results = await cls.find(**kwargs).limit(2).all()
        if len(results) > 1:
            raise MultipleDocumentsFound(
                f"Expected one {cls.__name__} but found multiple matching {kwargs}"
            )
        return results[0] if results else None

    @classmethod
    async def get(cls, **kwargs: Any) -> Document:
        """Return a single document; raise DocumentNotFound if missing."""
        result = await cls.find_one(**kwargs)
        if result is None:
            raise DocumentNotFound(f"No {cls.__name__} found matching {kwargs}")
        return result

    model_config = {"arbitrary_types_allowed": True}


class CounterDocument(Document):
    """Base class for asynchronous counter-column documents.

    Counter tables only support increment/decrement operations.
    ``save()`` and ``insert()`` are forbidden.
    """

    async def save(self, ttl: int | None = None) -> None:  # noqa: ARG002
        raise InvalidQueryError(
            "Counter tables do not support save(). "
            "Use increment() or decrement() instead."
        )

    async def insert(self, ttl: int | None = None) -> None:  # noqa: ARG002
        raise InvalidQueryError(
            "Counter tables do not support insert(). "
            "Use increment() or decrement() instead."
        )

    async def _counter_update(self, deltas: dict[str, int]) -> None:
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
        await self.__class__._get_driver().execute_async(cql, params)

    async def increment(self, **field_deltas: int) -> None:
        """Increment counter columns by the given amounts.

        Example::

            await page_view.increment(view_count=1, unique_visitors=1)
        """
        await self._counter_update(field_deltas)

    async def decrement(self, **field_deltas: int) -> None:
        """Decrement counter columns by the given amounts.

        Example::

            await page_view.decrement(view_count=1)
        """
        negated = {k: -v for k, v in field_deltas.items()}
        await self._counter_update(negated)
