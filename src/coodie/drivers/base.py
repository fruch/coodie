from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any

_DDL_PREFIXES = ("CREATE ", "DROP ", "ALTER ", "TRUNCATE ")


def _is_ddl(cql: str) -> bool:
    """Return ``True`` if *cql* is a DDL statement (cannot be prepared)."""
    return cql.lstrip().upper().startswith(_DDL_PREFIXES)


class AbstractDriver(ABC):
    """Abstract base class for coodie execution backends."""

    # ------------------------------------------------------------------
    # Synchronous interface
    # ------------------------------------------------------------------

    @abstractmethod
    def execute(
        self,
        stmt: str,
        params: list[Any],
        consistency: str | None = None,
        timeout: float | None = None,
        fetch_size: int | None = None,
        paging_state: bytes | None = None,
    ) -> list[dict[str, Any]]:
        """Execute *stmt* with *params*; return rows as a list of dicts."""

    @abstractmethod
    def sync_table(
        self,
        table: str,
        keyspace: str,
        cols: list[Any],  # list[ColumnDefinition]
        table_options: dict[str, Any] | None = None,
        dry_run: bool = False,
        drop_removed_indexes: bool = False,
    ) -> list[str]:
        """Idempotent CREATE TABLE + ALTER TABLE ADD for new columns.

        Returns the list of CQL statements that were (or would be) executed.
        When *dry_run* is ``True`` the database is not modified.
        """

    @abstractmethod
    def close(self) -> None:
        """Release sync resources."""

    # ------------------------------------------------------------------
    # Asynchronous interface
    # ------------------------------------------------------------------

    @abstractmethod
    async def execute_async(
        self,
        stmt: str,
        params: list[Any],
        consistency: str | None = None,
        timeout: float | None = None,
        fetch_size: int | None = None,
        paging_state: bytes | None = None,
    ) -> list[dict[str, Any]]:
        """Async version of :meth:`execute`."""

    @abstractmethod
    async def sync_table_async(
        self,
        table: str,
        keyspace: str,
        cols: list[Any],  # list[ColumnDefinition]
        table_options: dict[str, Any] | None = None,
        dry_run: bool = False,
        drop_removed_indexes: bool = False,
    ) -> list[str]:
        """Async version of :meth:`sync_table`."""

    @abstractmethod
    async def close_async(self) -> None:
        """Release async resources."""
