from __future__ import annotations

from typing import Any

from coodie.cql_builder import build_batch


class BatchQuery:
    """Synchronous batch context manager.

    Accumulates CQL statements and executes them as a single batch on exit.

    Example::

        from coodie.sync import BatchQuery

        with BatchQuery() as batch:
            Product(name="A").save(batch=batch)
            Product(name="B").save(batch=batch)
    """

    def __init__(
        self,
        logged: bool = True,
        batch_type: str | None = None,
    ) -> None:
        self._logged = logged
        self._batch_type = batch_type
        self._statements: list[tuple[str, list[Any]]] = []

    def add(self, stmt: str, params: list[Any]) -> None:
        """Add a CQL statement to the batch."""
        self._statements.append((stmt, params))

    def __enter__(self) -> BatchQuery:
        self._statements.clear()
        return self

    def __exit__(
        self,
        exc_type: type[BaseException] | None,
        exc_val: BaseException | None,
        exc_tb: Any,
    ) -> None:
        if exc_type is None and self._statements:
            self.execute()

    def execute(self) -> None:
        """Execute the accumulated batch immediately."""
        if not self._statements:
            return
        from coodie.drivers import get_driver

        cql, params = build_batch(
            self._statements,
            logged=self._logged,
            batch_type=self._batch_type,
        )
        get_driver().execute(cql, params)
        self._statements.clear()


class AsyncBatchQuery:
    """Asynchronous batch context manager.

    Accumulates CQL statements and executes them as a single batch on exit.

    Example::

        from coodie.aio import AsyncBatchQuery

        async with AsyncBatchQuery() as batch:
            await Product(name="A").save(batch=batch)
            await Product(name="B").save(batch=batch)
    """

    def __init__(
        self,
        logged: bool = True,
        batch_type: str | None = None,
    ) -> None:
        self._logged = logged
        self._batch_type = batch_type
        self._statements: list[tuple[str, list[Any]]] = []

    def add(self, stmt: str, params: list[Any]) -> None:
        """Add a CQL statement to the batch."""
        self._statements.append((stmt, params))

    async def __aenter__(self) -> AsyncBatchQuery:
        self._statements.clear()
        return self

    async def __aexit__(
        self,
        exc_type: type[BaseException] | None,
        exc_val: BaseException | None,
        exc_tb: Any,
    ) -> None:
        if exc_type is None and self._statements:
            await self.execute()

    async def execute(self) -> None:
        """Execute the accumulated batch immediately."""
        if not self._statements:
            return
        from coodie.drivers import get_driver

        cql, params = build_batch(
            self._statements,
            logged=self._logged,
            batch_type=self._batch_type,
        )
        await get_driver().execute_async(cql, params)
        self._statements.clear()
