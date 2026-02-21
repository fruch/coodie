from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any


class AbstractDriver(ABC):
    """Abstract base class for coodie execution backends."""

    # ------------------------------------------------------------------
    # Synchronous interface
    # ------------------------------------------------------------------

    @abstractmethod
    def execute(self, stmt: str, params: list[Any]) -> list[dict[str, Any]]:
        """Execute *stmt* with *params*; return rows as a list of dicts."""

    @abstractmethod
    def sync_table(
        self,
        table: str,
        keyspace: str,
        cols: list[Any],  # list[ColumnDefinition]
    ) -> None:
        """Idempotent CREATE TABLE + ALTER TABLE ADD for new columns."""

    @abstractmethod
    def close(self) -> None:
        """Release sync resources."""

    # ------------------------------------------------------------------
    # Asynchronous interface
    # ------------------------------------------------------------------

    @abstractmethod
    async def execute_async(
        self, stmt: str, params: list[Any]
    ) -> list[dict[str, Any]]:
        """Async version of :meth:`execute`."""

    @abstractmethod
    async def sync_table_async(
        self,
        table: str,
        keyspace: str,
        cols: list[Any],  # list[ColumnDefinition]
    ) -> None:
        """Async version of :meth:`sync_table`."""

    @abstractmethod
    async def close_async(self) -> None:
        """Release async resources."""
