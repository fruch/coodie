from __future__ import annotations

import asyncio
import threading
from typing import Any

from coodie.drivers.base import AbstractDriver


class AcsyllaDriver(AbstractDriver):
    """Driver backed by the `acsylla <https://github.com/acsylla/acsylla>`_ async-native library.

    ``acsylla`` is an **optional** dependency — install it separately::

        pip install acsylla

    **Typical async usage** (FastAPI / asyncio application):

    .. code-block:: python

        import acsylla
        from coodie.aio import Document, init_coodie
        from coodie.drivers import register_driver
        from coodie.drivers.acsylla import AcsyllaDriver
        from coodie import PrimaryKey
        from typing import Annotated
        from uuid import UUID, uuid4
        from pydantic import Field

        class Product(Document):
            id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)
            name: str

            class Settings:
                name = "products"
                keyspace = "catalog"

        # Build an acsylla session, then wrap it in AcsyllaDriver
        cluster = acsylla.create_cluster(["127.0.0.1"])
        session = await cluster.create_session(keyspace="catalog")

        driver = AcsyllaDriver(session=session, default_keyspace="catalog")
        register_driver("default", driver, default=True)

        await Product.sync_table()

        product = Product(name="Widget")
        await product.save()

        results = await Product.find(name="Widget").all()

    **Sync bridge** — ``execute()``, ``sync_table()``, and ``close()`` dispatch
    to a dedicated background event loop that is started in a daemon thread at
    construction time.  This means they work correctly even when called from
    within an already-running event loop (e.g. inside pytest-asyncio, ASGI
    middleware, or ``asyncio.run()``), avoiding the
    ``RuntimeError: This event loop is already running`` that
    ``loop.run_until_complete()`` would raise in those contexts.
    """

    __slots__ = (
        "_acsylla",
        "_session",
        "_default_keyspace",
        "_prepared",
        "_bg_loop",
        "_bg_thread",
        "_last_paging_state",
        "_known_tables",
    )

    def __init__(
        self,
        session: Any,
        default_keyspace: str | None = None,
    ) -> None:
        try:
            import acsylla  # type: ignore[import-untyped]
        except ImportError as exc:
            raise ImportError("acsylla is required for AcsyllaDriver. Install it with: pip install acsylla") from exc
        self._acsylla = acsylla
        self._session = session
        self._default_keyspace = default_keyspace
        self._prepared: dict[str, Any] = {}
        self._last_paging_state: bytes | None = None
        self._known_tables: dict[str, frozenset[str]] = {}
        # Spin up a dedicated background event loop in a daemon thread.
        # The sync bridge submits coroutines here via run_coroutine_threadsafe,
        # which works regardless of whether the calling thread has its own
        # running event loop.
        self._bg_loop: asyncio.AbstractEventLoop = asyncio.new_event_loop()
        self._bg_thread = threading.Thread(
            target=self._bg_loop.run_forever,
            daemon=True,
            name="coodie-acsylla-sync",
        )
        self._bg_thread.start()

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    async def _prepare(self, cql: str) -> Any:
        if cql not in self._prepared:
            self._prepared[cql] = await self._session.create_prepared(cql)
        return self._prepared[cql]

    @staticmethod
    def _rows_to_dicts(result: Any) -> list[dict[str, Any]]:
        return [dict(row) for row in result]

    def _cql_to_statement(self, cql: str) -> Any:
        """Wrap a raw CQL string in an acsylla Statement for session.execute()."""
        return self._acsylla.create_statement(cql, parameters=0)

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
        prepared = await self._prepare(stmt)
        bind_kwargs: dict[str, Any] = {}
        if consistency is not None:
            bind_kwargs["consistency"] = consistency
        if timeout is not None:
            bind_kwargs["timeout"] = timeout
        if fetch_size is not None:
            bind_kwargs["page_size"] = fetch_size
        statement = prepared.bind(params, **bind_kwargs)
        if paging_state is not None:
            statement.set_page_state(paging_state)
        result = await self._session.execute(statement)
        if fetch_size is not None:
            has_more = result.has_more_pages()
            self._last_paging_state = result.page_state() if has_more else None
        else:
            self._last_paging_state = None
        return self._rows_to_dicts(result)

    async def _get_existing_columns_async(self, table: str, keyspace: str) -> set[str]:
        """Introspect the existing column names via system_schema."""
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
            await self._session.execute(self._cql_to_statement(create_cql))

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
                        await self._session.execute(self._cql_to_statement(alter))

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
                    await self._session.execute(self._cql_to_statement(alter_cql))

        # 5. Create secondary indexes
        model_indexes: dict[str, Any] = {}
        for col in cols:
            if col.index:
                idx_name = col.index_name or f"{table}_{col.name}_idx"
                model_indexes[idx_name] = col
                index_cql = build_create_index(table, keyspace, col)
                planned.append(index_cql)
                if not dry_run:
                    await self._session.execute(self._cql_to_statement(index_cql))

        # 6. Drop removed indexes
        if drop_removed_indexes:
            existing_indexes = await self._get_existing_indexes_async(table, keyspace)
            for idx_name in existing_indexes:
                if idx_name not in model_indexes:
                    drop_cql = build_drop_index(idx_name, keyspace)
                    planned.append(drop_cql)
                    if not dry_run:
                        await self._session.execute(self._cql_to_statement(drop_cql))

        if not dry_run:
            self._known_tables[cache_key] = col_names

        return planned

    async def close_async(self) -> None:
        await self._session.close()

    # ------------------------------------------------------------------
    # Synchronous interface (event-loop bridge)
    # Submits coroutines to the dedicated background loop via
    # run_coroutine_threadsafe, then blocks with .result().  This is safe
    # to call from any thread — including one that already has a running
    # event loop (e.g. pytest-asyncio, ASGI request handlers).
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
        return asyncio.run_coroutine_threadsafe(
            self.execute_async(
                stmt,
                params,
                consistency=consistency,
                timeout=timeout,
                fetch_size=fetch_size,
                paging_state=paging_state,
            ),
            self._bg_loop,
        ).result()

    def sync_table(
        self,
        table: str,
        keyspace: str,
        cols: list[Any],
        table_options: dict[str, Any] | None = None,
        dry_run: bool = False,
        drop_removed_indexes: bool = False,
    ) -> list[str]:
        return asyncio.run_coroutine_threadsafe(
            self.sync_table_async(
                table,
                keyspace,
                cols,
                table_options=table_options,
                dry_run=dry_run,
                drop_removed_indexes=drop_removed_indexes,
            ),
            self._bg_loop,
        ).result()

    def close(self) -> None:
        asyncio.run_coroutine_threadsafe(self.close_async(), self._bg_loop).result()
        self._bg_loop.call_soon_threadsafe(self._bg_loop.stop)
        self._bg_thread.join(timeout=10)
