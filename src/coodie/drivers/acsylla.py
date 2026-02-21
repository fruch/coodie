from __future__ import annotations

import asyncio
from typing import Any

from coodie.drivers.base import AbstractDriver


class AcsyllaDriver(AbstractDriver):
    """Driver backed by the acsylla async-native library (optional dependency)."""

    def __init__(self, session: Any, default_keyspace: str | None = None) -> None:
        try:
            import acsylla  # noqa: F401  # type: ignore[import-untyped]
        except ImportError as exc:
            raise ImportError(
                "acsylla is required for AcsyllaDriver. "
                "Install it with: pip install acsylla"
            ) from exc
        self._session = session
        self._default_keyspace = default_keyspace
        self._prepared: dict[str, Any] = {}

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    async def _prepare(self, cql: str) -> Any:
        if cql not in self._prepared:
            self._prepared[cql] = await self._session.create_prepared(cql)
        return self._prepared[cql]

    @staticmethod
    def _rows_to_dicts(result: Any) -> list[dict[str, Any]]:
        rows = []
        for row in result:
            rows.append(dict(row))
        return rows

    # ------------------------------------------------------------------
    # Asynchronous interface
    # ------------------------------------------------------------------

    async def execute_async(
        self, stmt: str, params: list[Any]
    ) -> list[dict[str, Any]]:
        prepared = await self._prepare(stmt)
        statement = prepared.bind(params)
        result = await self._session.execute(statement)
        return self._rows_to_dicts(result)

    async def sync_table_async(
        self,
        table: str,
        keyspace: str,
        cols: list[Any],
    ) -> None:
        from coodie.cql_builder import build_create_table, build_create_index

        create_cql = build_create_table(table, keyspace, cols)
        await self._session.execute(create_cql)

        # Secondary indexes
        for col in cols:
            if col.index:
                index_cql = build_create_index(table, keyspace, col)
                await self._session.execute(index_cql)

    async def close_async(self) -> None:
        await self._session.close()

    # ------------------------------------------------------------------
    # Synchronous interface (run_until_complete bridge)
    # ------------------------------------------------------------------

    def execute(self, stmt: str, params: list[Any]) -> list[dict[str, Any]]:
        return asyncio.get_event_loop().run_until_complete(
            self.execute_async(stmt, params)
        )

    def sync_table(
        self,
        table: str,
        keyspace: str,
        cols: list[Any],
    ) -> None:
        asyncio.get_event_loop().run_until_complete(
            self.sync_table_async(table, keyspace, cols)
        )

    def close(self) -> None:
        asyncio.get_event_loop().run_until_complete(self.close_async())
