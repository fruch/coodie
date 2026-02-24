"""Raw CQL integration tests — merged sync + async.

Every test runs twice (sync and async) via the ``variant`` fixture.
"""

from __future__ import annotations

from uuid import uuid4

import pytest

from tests.conftest import _maybe_await

pytestmark = [
    pytest.mark.integration,
    pytest.mark.asyncio(loop_scope="session"),
]


class TestRawCQL:
    """Test execute_raw against a real ScyllaDB container."""

    async def test_raw_select(self, coodie_driver, Product, execute_raw_fn, variant) -> None:
        """Raw SELECT returns rows as list of dicts."""
        await _maybe_await(Product.sync_table)
        pid = uuid4()
        await _maybe_await(Product(id=pid, name="RawTest", brand="Test", price=1.0).save)

        table = Product.Settings.name
        rows = await _maybe_await(execute_raw_fn, f"SELECT name, brand FROM test_ks.{table} WHERE id = ?", [pid])
        assert len(rows) == 1
        assert rows[0]["name"] == "RawTest"
        assert rows[0]["brand"] == "Test"

        await _maybe_await(Product(id=pid, name="").delete)

    async def test_raw_insert_and_select(self, coodie_driver, Product, execute_raw_fn, variant) -> None:
        """Raw INSERT followed by raw SELECT round-trips data."""
        await _maybe_await(Product.sync_table)
        pid = uuid4()
        table = Product.Settings.name
        await _maybe_await(
            execute_raw_fn,
            f"INSERT INTO test_ks.{table} (id, name, brand, category, price) VALUES (?, ?, ?, ?, ?)",
            [pid, "RawInserted", "RawBrand", "general", 2.5],
        )

        rows = await _maybe_await(execute_raw_fn, f"SELECT name FROM test_ks.{table} WHERE id = ?", [pid])
        assert len(rows) == 1
        assert rows[0]["name"] == "RawInserted"

        await _maybe_await(Product(id=pid, name="").delete)

    async def test_raw_empty_result(self, coodie_driver, Product, execute_raw_fn, variant) -> None:
        """Raw SELECT returning no rows gives an empty list."""
        await _maybe_await(Product.sync_table)
        table = Product.Settings.name
        rows = await _maybe_await(execute_raw_fn, f"SELECT * FROM test_ks.{table} WHERE id = ?", [uuid4()])
        assert rows == []
