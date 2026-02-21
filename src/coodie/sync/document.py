from __future__ import annotations

from typing import Any, ClassVar

from pydantic import BaseModel

from coodie.cql_builder import build_insert, build_delete
from coodie.exceptions import DocumentNotFound, MultipleDocumentsFound
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

    def save(self, ttl: int | None = None) -> None:
        """Insert (upsert) this document."""
        data = self.model_dump(exclude_none=False)
        cql, params = build_insert(
            self.__class__._get_table(),
            self.__class__._get_keyspace(),
            data,
            ttl=ttl,
        )
        self.__class__._get_driver().execute(cql, params)

    def insert(self, ttl: int | None = None) -> None:
        """Insert IF NOT EXISTS (create-only)."""
        data = self.model_dump(exclude_none=False)
        cql, params = build_insert(
            self.__class__._get_table(),
            self.__class__._get_keyspace(),
            data,
            ttl=ttl,
            if_not_exists=True,
        )
        self.__class__._get_driver().execute(cql, params)

    def delete(self) -> None:
        """Delete this document by its primary key."""
        schema = self.__class__._schema()
        pk_cols = [c for c in schema if c.primary_key or c.clustering_key]
        where = [(c.name, "=", getattr(self, c.name)) for c in pk_cols]
        cql, params = build_delete(
            self.__class__._get_table(),
            self.__class__._get_keyspace(),
            where,
        )
        self.__class__._get_driver().execute(cql, params)

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
