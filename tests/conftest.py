from __future__ import annotations

from typing import Any

import pytest


class MockDriver:
    """Records CQL statements and params; returns configured rows."""

    def __init__(self) -> None:
        self.executed: list[tuple[str, list[Any]]] = []
        self._return_rows: list[list[dict[str, Any]]] = []

    def set_return_rows(self, rows: list[dict[str, Any]]) -> None:
        self._return_rows.append(rows)

    def _pop_rows(self) -> list[dict[str, Any]]:
        if self._return_rows:
            return self._return_rows.pop(0)
        return []

    def execute(self, stmt: str, params: list[Any]) -> list[dict[str, Any]]:
        self.executed.append((stmt, params))
        return self._pop_rows()

    async def execute_async(self, stmt: str, params: list[Any]) -> list[dict[str, Any]]:
        self.executed.append((stmt, params))
        return self._pop_rows()

    def sync_table(self, table: str, keyspace: str, cols: Any) -> None:
        self.executed.append((f"SYNC_TABLE {keyspace}.{table}", []))

    async def sync_table_async(self, table: str, keyspace: str, cols: Any) -> None:
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
