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
        cluster = await acsylla.create_cluster(["127.0.0.1"])
        session = await cluster.create_session(keyspace="catalog")

        driver = AcsyllaDriver(session=session, default_keyspace="catalog")
        register_driver("default", driver, default=True)

        await Product.sync_table()

        product = Product(name="Widget")
        await product.save()

        results = await Product.find(name="Widget").all()

    **Sync bridge** — ``execute()``, ``sync_table()``, and ``close()`` wrap the
    async methods via :func:`asyncio.run` and therefore **must only be called
    from non-async contexts** (scripts, CLI tools, Django/Flask views).  Calling
    them from inside a running event loop will raise ``RuntimeError``.
    """

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
        self,
        stmt: str,
        params: list[Any],
        consistency: str | None = None,
        timeout: float | None = None,
    ) -> list[dict[str, Any]]:
        prepared = await self._prepare(stmt)
        statement = prepared.bind(params)
        if consistency is not None:
            statement.set_consistency(consistency)
        result = await self._session.execute(statement, timeout=timeout)
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
    # Synchronous interface (asyncio.run bridge)
    # Note: these methods must only be called from non-async contexts.
    # Calling them from within a running event loop will raise RuntimeError.
    # For async contexts, use the *_async variants directly.
    # ------------------------------------------------------------------

    def execute(
        self,
        stmt: str,
        params: list[Any],
        consistency: str | None = None,
        timeout: float | None = None,
    ) -> list[dict[str, Any]]:
        return asyncio.run(
            self.execute_async(stmt, params, consistency=consistency, timeout=timeout)
        )

    def sync_table(
        self,
        table: str,
        keyspace: str,
        cols: list[Any],
    ) -> None:
        asyncio.run(self.sync_table_async(table, keyspace, cols))

    def close(self) -> None:
        asyncio.run(self.close_async())
