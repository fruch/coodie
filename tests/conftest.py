from __future__ import annotations

import inspect
from typing import Any

import pytest


async def _maybe_await(fn, *args, **kwargs):
    """Call *fn* and ``await`` the result only when it is awaitable.

    This allows the same test body to drive both sync and async variants.
    The calling test must itself be ``async def`` so that ``await`` is valid::

        async def test_save(Product, registered_mock_driver):
            p = Product(name="Widget")
            await _maybe_await(p.save)
    """
    result = fn(*args, **kwargs)
    if inspect.isawaitable(result):
        return await result
    return result


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


class MockDriver:
    """Records CQL statements and params; returns configured rows."""

    def __init__(self) -> None:
        self.executed: list[tuple[str, list[Any]]] = []
        self._return_rows: list[list[dict[str, Any]]] = []
        self.last_consistency: str | None = None
        self.last_timeout: float | None = None
        self.last_fetch_size: int | None = None
        self.last_paging_state: bytes | None = None
        self._last_paging_state: bytes | None = None
        self._paging_states: list[bytes | None] = []

    def set_return_rows(self, rows: list[dict[str, Any]]) -> None:
        self._return_rows.append(rows)

    def set_paging_state(self, state: bytes | None) -> None:
        self._paging_states.append(state)

    def _pop_rows(self) -> list[dict[str, Any]]:
        if self._return_rows:
            return self._return_rows.pop(0)
        return []

    def _pop_paging_state(self) -> bytes | None:
        if self._paging_states:
            return self._paging_states.pop(0)
        return None

    def execute(
        self,
        stmt: str,
        params: list[Any],
        consistency: str | None = None,
        timeout: float | None = None,
        fetch_size: int | None = None,
        paging_state: bytes | None = None,
    ) -> list[dict[str, Any]]:
        self.executed.append((stmt, params))
        self.last_consistency = consistency
        self.last_timeout = timeout
        self.last_fetch_size = fetch_size
        self.last_paging_state = paging_state
        self._last_paging_state = self._pop_paging_state()
        return self._pop_rows()

    async def execute_async(
        self,
        stmt: str,
        params: list[Any],
        consistency: str | None = None,
        timeout: float | None = None,
        fetch_size: int | None = None,
        paging_state: bytes | None = None,
    ) -> list[dict[str, Any]]:
        self.executed.append((stmt, params))
        self.last_consistency = consistency
        self.last_timeout = timeout
        self.last_fetch_size = fetch_size
        self.last_paging_state = paging_state
        self._last_paging_state = self._pop_paging_state()
        return self._pop_rows()

    def sync_table(
        self,
        table: str,
        keyspace: str,
        cols: Any,
        table_options: Any = None,
        dry_run: bool = False,
        drop_removed_indexes: bool = False,
    ) -> list[str]:
        self.executed.append((f"SYNC_TABLE {keyspace}.{table}", []))
        return []

    async def sync_table_async(
        self,
        table: str,
        keyspace: str,
        cols: Any,
        table_options: Any = None,
        dry_run: bool = False,
        drop_removed_indexes: bool = False,
    ) -> list[str]:
        self.executed.append((f"SYNC_TABLE {keyspace}.{table}", []))
        return []

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
