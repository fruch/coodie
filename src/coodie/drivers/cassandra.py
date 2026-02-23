from __future__ import annotations

import asyncio
from typing import Any

from coodie.drivers.base import AbstractDriver


class CassandraDriver(AbstractDriver):
    """Driver backed by cassandra-driver / scylla-driver."""

    def __init__(
        self,
        session: Any,
        default_keyspace: str | None = None,
    ) -> None:
        self._session = session
        self._default_keyspace = default_keyspace
        self._prepared: dict[str, Any] = {}
        self._last_paging_state: bytes | None = None

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _prepare(self, cql: str) -> Any:
        if cql not in self._prepared:
            self._prepared[cql] = self._session.prepare(cql)
        return self._prepared[cql]

    @staticmethod
    def _rows_to_dicts(result_set: Any) -> list[dict[str, Any]]:
        if result_set is None:
            return []
        rows = []
        for row in result_set:
            if hasattr(row, "_asdict"):
                rows.append(dict(row._asdict()))
            elif hasattr(row, "__dict__"):
                rows.append(
                    {k: v for k, v in row.__dict__.items() if not k.startswith("_")}
                )
            else:
                rows.append(dict(row))
        return rows

    # ------------------------------------------------------------------
    # Synchronous interface
    # ------------------------------------------------------------------

    def execute(
        self,
        stmt: str,
        params: list[Any],
        consistency: str | None = None,
        timeout: float | None = None,
        fetch_size: int | None = None,
        paging_state: bytes | None = None,
    ) -> list[dict[str, Any]]:
        prepared = self._prepare(stmt)
        bound = prepared.bind(params)
        if consistency is not None:
            from cassandra import ConsistencyLevel  # type: ignore[import-untyped]

            bound.consistency_level = getattr(ConsistencyLevel, consistency)
        if fetch_size is not None:
            bound.fetch_size = fetch_size
        execute_kwargs: dict[str, Any] = {}
        if timeout is not None:
            execute_kwargs["timeout"] = timeout
        if paging_state is not None:
            execute_kwargs["paging_state"] = paging_state
        result = self._session.execute(bound, **execute_kwargs)
        self._last_paging_state = getattr(result, "paging_state", None)
        if fetch_size is not None:
            return self._rows_to_dicts(result.current_rows)
        return self._rows_to_dicts(result)

    def sync_table(
        self,
        table: str,
        keyspace: str,
        cols: list[Any],
        table_options: dict[str, Any] | None = None,
    ) -> None:
        from coodie.cql_builder import build_create_table, build_create_index

        create_cql = build_create_table(
            table, keyspace, cols, table_options=table_options
        )
        self._session.execute(create_cql)

        # Introspect existing columns
        existing = self._get_existing_columns(table, keyspace)

        for col in cols:
            if col.name not in existing:
                alter = (
                    f'ALTER TABLE {keyspace}.{table} ADD "{col.name}" {col.cql_type}'
                )
                self._session.execute(alter)

        # Create secondary indexes
        for col in cols:
            if col.index:
                index_cql = build_create_index(table, keyspace, col)
                self._session.execute(index_cql)

    def _get_existing_columns(self, table: str, keyspace: str) -> set[str]:
        rows = self._session.execute(
            "SELECT column_name FROM system_schema.columns "
            "WHERE keyspace_name = %s AND table_name = %s",
            (keyspace, table),
        )
        return {row.column_name for row in rows}

    def close(self) -> None:
        self._session.cluster.shutdown()

    # ------------------------------------------------------------------
    # Asynchronous interface (asyncio bridge)
    # ------------------------------------------------------------------

    async def execute_async(
        self,
        stmt: str,
        params: list[Any],
        consistency: str | None = None,
        timeout: float | None = None,
        fetch_size: int | None = None,
        paging_state: bytes | None = None,
    ) -> list[dict[str, Any]]:
        loop = asyncio.get_event_loop()
        if fetch_size is not None:
            # Paginated queries: delegate to the sync execute() via
            # run_in_executor.  The cassandra-driver's async callback
            # mechanism does not reliably expose paging_state on the
            # ResultSet delivered to add_callbacks.  The sync path
            # (session.execute) handles paging correctly and sets
            # self._last_paging_state.
            return await loop.run_in_executor(
                None,
                lambda: self.execute(
                    stmt,
                    params,
                    consistency=consistency,
                    timeout=timeout,
                    fetch_size=fetch_size,
                    paging_state=paging_state,
                ),
            )
        prepared = self._prepare(stmt)
        bound = prepared.bind(params)
        if consistency is not None:
            from cassandra import ConsistencyLevel  # type: ignore[import-untyped]

            bound.consistency_level = getattr(ConsistencyLevel, consistency)
        execute_kwargs: dict[str, Any] = {}
        if timeout is not None:
            execute_kwargs["timeout"] = timeout
        future = self._session.execute_async(bound, **execute_kwargs)

        result_future: asyncio.Future[Any] = loop.create_future()

        def on_success(result: Any) -> None:
            loop.call_soon_threadsafe(result_future.set_result, result)

        def on_error(exc: Exception) -> None:
            loop.call_soon_threadsafe(result_future.set_exception, exc)

        future.add_callbacks(on_success, on_error)
        result = await result_future
        self._last_paging_state = None
        return self._rows_to_dicts(result)

    async def sync_table_async(
        self,
        table: str,
        keyspace: str,
        cols: list[Any],
        table_options: dict[str, Any] | None = None,
    ) -> None:
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(
            None, self.sync_table, table, keyspace, cols, table_options
        )

    async def close_async(self) -> None:
        self.close()
