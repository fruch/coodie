from __future__ import annotations

import asyncio
from typing import Any

from coodie.drivers.base import AbstractDriver

_DDL_PREFIXES = ("CREATE ", "ALTER ", "DROP ", "TRUNCATE ")


def _is_ddl(stmt: str) -> bool:
    """Return ``True`` if *stmt* is a DDL statement that must not be prepared."""
    return stmt.lstrip().upper().startswith(_DDL_PREFIXES)


class PythonRsDriver(AbstractDriver):
    """Driver backed by `python-rs-driver <https://github.com/scylladb-zpp-2025-python-rs-driver/python-rs-driver>`_.

    ``python-rs-driver`` wraps the Rust-based *scylla-rust-driver* via PyO3 and
    provides a **native async** interface.  Sync methods use an event-loop
    bridge (same pattern as :class:`~coodie.drivers.acsylla.AcsyllaDriver`).

    .. note::

        python-rs-driver is not published on PyPI.  Build from source::

            git clone https://github.com/scylladb-zpp-2025-python-rs-driver/python-rs-driver
            cd python-rs-driver
            maturin develop --release

    **Typical async usage**:

    .. code-block:: python

        from scylla.session_builder import SessionBuilder
        from coodie.aio import Document, init_coodie
        from coodie.drivers import register_driver
        from coodie.drivers.python_rs import PythonRsDriver

        builder = SessionBuilder(contact_points=["127.0.0.1"])
        session = await builder.connect()

        driver = PythonRsDriver(session=session, default_keyspace="catalog")
        register_driver("default", driver, default=True)
    """

    __slots__ = (
        "_session",
        "_default_keyspace",
        "_prepared",
        "_loop",
        "_last_paging_state",
        "_known_tables",
    )

    def __init__(
        self,
        session: Any,
        default_keyspace: str | None = None,
        loop: asyncio.AbstractEventLoop | None = None,
    ) -> None:
        try:
            import scylla  # noqa: F401  # type: ignore[import-untyped]
        except ImportError as exc:
            raise ImportError(
                "python-rs-driver is required for PythonRsDriver. "
                "Build from source: https://github.com/scylladb-zpp-2025-python-rs-driver/python-rs-driver"
            ) from exc
        self._session = session
        self._default_keyspace = default_keyspace
        self._prepared: dict[str, Any] = {}
        self._loop = loop or asyncio.new_event_loop()
        self._last_paging_state: bytes | None = None
        self._known_tables: dict[str, frozenset[str]] = {}

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    async def _prepare(self, cql: str) -> Any:
        if cql not in self._prepared:
            self._prepared[cql] = await self._session.prepare(cql)
        return self._prepared[cql]

    @staticmethod
    def _rows_to_dicts(result: Any) -> list[dict[str, Any]]:
        """Convert a ``RequestResult`` to a list of dicts.

        python-rs-driver's ``iter_rows()`` already yields dicts.
        Non-row-returning statements (INSERT/UPDATE/DELETE) raise
        ``RuntimeError: Result does not have rows`` — return ``[]``.
        """
        if result is None:
            return []
        try:
            return list(result.iter_rows())
        except RuntimeError as exc:
            if "does not have rows" in str(exc):
                return []
            raise

    # ------------------------------------------------------------------
    # Asynchronous interface
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
        if _is_ddl(stmt):
            result = await self._session.execute(stmt, None)
            self._last_paging_state = None
            return self._rows_to_dicts(result)

        prepared = await self._prepare(stmt)
        result = await self._session.execute(prepared, params or None)
        self._last_paging_state = None
        return self._rows_to_dicts(result)

    async def _execute_cql_async(self, cql: str) -> Any:
        """Execute a raw CQL string asynchronously."""
        return await self._session.execute(cql, None)

    async def _get_existing_columns_async(self, table: str, keyspace: str) -> set[str]:
        """Introspect existing column names via system_schema."""
        stmt = "SELECT column_name FROM system_schema.columns WHERE keyspace_name = ? AND table_name = ?"
        rows = await self.execute_async(stmt, [keyspace, table])
        return {row["column_name"] for row in rows}

    async def _get_current_table_options_async(self, table: str, keyspace: str) -> dict[str, Any]:
        """Introspect current table options from ``system_schema.tables``."""
        stmt = "SELECT * FROM system_schema.tables WHERE keyspace_name = ? AND table_name = ?"
        rows = await self.execute_async(stmt, [keyspace, table])
        if rows:
            return rows[0]
        return {}

    async def _get_existing_indexes_async(self, table: str, keyspace: str) -> set[str]:
        """Introspect existing index names from ``system_schema.indexes``."""
        stmt = "SELECT index_name FROM system_schema.indexes WHERE keyspace_name = ? AND table_name = ?"
        rows = await self.execute_async(stmt, [keyspace, table])
        return {row["index_name"] for row in rows}

    async def sync_table_async(
        self,
        table: str,
        keyspace: str,
        cols: list[Any],
        table_options: dict[str, Any] | None = None,
        dry_run: bool = False,
        drop_removed_indexes: bool = False,
    ) -> list[str]:
        cache_key = f"{keyspace}.{table}"
        col_names = frozenset(col.name for col in cols)
        if not dry_run and not drop_removed_indexes and self._known_tables.get(cache_key) == col_names:
            return []  # table already synced this session with same columns

        from coodie.cql_builder import (
            build_create_table,
            build_create_index,
            build_drop_index,
            build_alter_table_options,
        )

        planned: list[str] = []

        # 1. CREATE TABLE IF NOT EXISTS
        create_cql = build_create_table(table, keyspace, cols, table_options=table_options)
        planned.append(create_cql)
        if not dry_run:
            await self._execute_cql_async(create_cql)

        # 2. Introspect existing columns and add missing ones
        existing = await self._get_existing_columns_async(table, keyspace)
        model_col_names = {col.name for col in cols}
        is_new_table = existing == model_col_names

        if not is_new_table:
            for col in cols:
                if col.name not in existing:
                    alter = f'ALTER TABLE {keyspace}.{table} ADD "{col.name}" {col.cql_type}'
                    planned.append(alter)
                    if not dry_run:
                        await self._execute_cql_async(alter)

        # 3. Schema drift detection — warn on DB columns not in model
        drift_cols = existing - model_col_names
        if drift_cols:
            import logging

            logger = logging.getLogger("coodie")
            logger.warning(
                "Schema drift detected: columns %s exist in %s.%s but are not defined in the model",
                drift_cols,
                keyspace,
                table,
            )

        # 4. Table option changes
        if table_options:
            current_options = await self._get_current_table_options_async(table, keyspace)
            changed = {}
            for k, v in table_options.items():
                if str(current_options.get(k)) != str(v):
                    changed[k] = v
            if changed:
                alter_cql = build_alter_table_options(table, keyspace, changed)
                planned.append(alter_cql)
                if not dry_run:
                    await self._execute_cql_async(alter_cql)

        # 5. Create secondary indexes
        model_indexes: dict[str, Any] = {}
        for col in cols:
            if col.index:
                idx_name = col.index_name or f"{table}_{col.name}_idx"
                model_indexes[idx_name] = col
                index_cql = build_create_index(table, keyspace, col)
                planned.append(index_cql)
                if not dry_run:
                    await self._execute_cql_async(index_cql)

        # 6. Drop removed indexes
        if drop_removed_indexes:
            existing_indexes = await self._get_existing_indexes_async(table, keyspace)
            for idx_name in existing_indexes:
                if idx_name not in model_indexes:
                    drop_cql = build_drop_index(idx_name, keyspace)
                    planned.append(drop_cql)
                    if not dry_run:
                        await self._execute_cql_async(drop_cql)

        if not dry_run:
            self._known_tables[cache_key] = col_names

        return planned

    async def close_async(self) -> None:
        """No-op — python-rs-driver has no explicit ``close()`` on Session."""

    # ------------------------------------------------------------------
    # Synchronous interface (event-loop bridge)
    # Uses the stored event loop so the python-rs-driver session — which
    # is bound to a specific tokio runtime — is always accessed correctly.
    # Must only be called from non-async contexts.
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
        return self._loop.run_until_complete(
            self.execute_async(
                stmt,
                params,
                consistency=consistency,
                timeout=timeout,
                fetch_size=fetch_size,
                paging_state=paging_state,
            )
        )

    def sync_table(
        self,
        table: str,
        keyspace: str,
        cols: list[Any],
        table_options: dict[str, Any] | None = None,
        dry_run: bool = False,
        drop_removed_indexes: bool = False,
    ) -> list[str]:
        return self._loop.run_until_complete(
            self.sync_table_async(
                table,
                keyspace,
                cols,
                table_options=table_options,
                dry_run=dry_run,
                drop_removed_indexes=drop_removed_indexes,
            )
        )

    def close(self) -> None:
        self._loop.run_until_complete(self.close_async())
