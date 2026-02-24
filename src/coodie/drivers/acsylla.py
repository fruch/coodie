from __future__ import annotations

import asyncio
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

    **Sync bridge** — ``execute()``, ``sync_table()``, and ``close()`` run the
    async methods on the event loop that was passed at construction (or a new
    dedicated loop).  They **must only be called from non-async contexts**
    (scripts, CLI tools, Django/Flask views).
    """

    __slots__ = ("_acsylla", "_session", "_default_keyspace", "_prepared", "_loop", "_last_paging_state")

    def __init__(
        self,
        session: Any,
        default_keyspace: str | None = None,
        loop: asyncio.AbstractEventLoop | None = None,
    ) -> None:
        try:
            import acsylla  # type: ignore[import-untyped]
        except ImportError as exc:
            raise ImportError("acsylla is required for AcsyllaDriver. Install it with: pip install acsylla") from exc
        self._acsylla = acsylla
        self._session = session
        self._default_keyspace = default_keyspace
        self._prepared: dict[str, Any] = {}
        self._loop = loop or asyncio.new_event_loop()
        self._last_paging_state: bytes | None = None

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

    async def sync_table_async(
        self,
        table: str,
        keyspace: str,
        cols: list[Any],
        table_options: dict[str, Any] | None = None,
    ) -> None:
        from coodie.cql_builder import build_create_table, build_create_index

        create_cql = build_create_table(table, keyspace, cols, table_options=table_options)
        await self._session.execute(self._cql_to_statement(create_cql))

        # Introspect existing columns and add missing ones
        existing = await self._get_existing_columns_async(table, keyspace)
        for col in cols:
            if col.name not in existing:
                alter = f'ALTER TABLE {keyspace}.{table} ADD "{col.name}" {col.cql_type}'
                await self._session.execute(self._cql_to_statement(alter))

        # Secondary indexes
        for col in cols:
            if col.index:
                index_cql = build_create_index(table, keyspace, col)
                await self._session.execute(self._cql_to_statement(index_cql))

    async def close_async(self) -> None:
        await self._session.close()

    # ------------------------------------------------------------------
    # Synchronous interface (event-loop bridge)
    # Uses the stored event loop so the acsylla session — which is bound
    # to a specific loop — is always accessed from the correct one.
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
    ) -> None:
        self._loop.run_until_complete(self.sync_table_async(table, keyspace, cols, table_options=table_options))

    def close(self) -> None:
        self._loop.run_until_complete(self.close_async())
