from __future__ import annotations

import asyncio
from typing import Any

import pytest


def pytest_addoption(parser: pytest.Parser) -> None:
    parser.addoption(
        "--driver-type",
        default="scylla",
        choices=["scylla", "cassandra", "acsylla"],
        help="Driver backend for integration tests (default: scylla)",
    )


@pytest.fixture(scope="session")
def driver_type(request: pytest.FixtureRequest) -> str:
    return request.config.getoption("--driver-type")


@pytest.fixture(scope="session")
def event_loop():
    """Session-scoped event loop.

    acsylla sessions are bound to the event loop they are created on, so all
    async tests and the session-scoped ``coodie_driver`` fixture must share
    the same loop.  A session-scoped loop is harmless for other drivers.
    """
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


class MockDriver:
    """Records CQL statements and params; returns configured rows."""

    def __init__(self) -> None:
        self.executed: list[tuple[str, list[Any]]] = []
        self._return_rows: list[list[dict[str, Any]]] = []
        self.last_consistency: str | None = None
        self.last_timeout: float | None = None

    def set_return_rows(self, rows: list[dict[str, Any]]) -> None:
        self._return_rows.append(rows)

    def _pop_rows(self) -> list[dict[str, Any]]:
        if self._return_rows:
            return self._return_rows.pop(0)
        return []

    def execute(
        self,
        stmt: str,
        params: list[Any],
        consistency: str | None = None,
        timeout: float | None = None,
    ) -> list[dict[str, Any]]:
        self.executed.append((stmt, params))
        self.last_consistency = consistency
        self.last_timeout = timeout
        return self._pop_rows()

    async def execute_async(
        self,
        stmt: str,
        params: list[Any],
        consistency: str | None = None,
        timeout: float | None = None,
    ) -> list[dict[str, Any]]:
        self.executed.append((stmt, params))
        self.last_consistency = consistency
        self.last_timeout = timeout
        return self._pop_rows()

    def sync_table(
        self, table: str, keyspace: str, cols: Any, table_options: Any = None
    ) -> None:
        self.executed.append((f"SYNC_TABLE {keyspace}.{table}", []))

    async def sync_table_async(
        self, table: str, keyspace: str, cols: Any, table_options: Any = None
    ) -> None:
        self.executed.append((f"SYNC_TABLE {keyspace}.{table}", []))

    def close(self) -> None:
        pass

    async def close_async(self) -> None:
        pass

    @property
    def _default_keyspace(self) -> str:
        return "test_ks"


@pytest.fixture
def mock_driver() -> MockDriver:
    return MockDriver()


@pytest.fixture
def registered_mock_driver(mock_driver: MockDriver) -> MockDriver:
    from coodie.drivers import _registry, register_driver

    _registry.clear()
    register_driver("default", mock_driver, default=True)
    yield mock_driver
    _registry.clear()
