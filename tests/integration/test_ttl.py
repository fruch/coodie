"""Integration tests for TTL and USING TIMESTAMP modifiers.

Covers §1.6 of the cqlengine test coverage plan:
  (1) ``save(ttl=N)`` causes the row to expire.
  (2) ``__default_ttl__`` in Settings applies TTL to all saves.
  (3) ``save(timestamp=...)`` uses an explicit write timestamp.
  (4) ``QuerySet.ttl(N)`` on bulk update.

Every test runs twice (sync and async) via the ``variant`` fixture.
"""

from __future__ import annotations

import asyncio
from uuid import uuid4

import pytest

from tests.conftest import _maybe_await

pytestmark = [
    pytest.mark.integration,
    pytest.mark.asyncio(loop_scope="session"),
]


class TestTTLAndTimestamp:
    """Integration tests for TTL and USING TIMESTAMP modifiers."""

    # ------------------------------------------------------------------
    # (1) save(ttl=N) causes row to expire
    # ------------------------------------------------------------------

    async def test_save_with_ttl_row_expires(self, coodie_driver, Product) -> None:
        """Row inserted with save(ttl=2) disappears after the TTL elapses."""
        await _maybe_await(Product.sync_table)
        pid = uuid4()
        p = Product(id=pid, name="TTLExpiry")
        await _maybe_await(p.save, ttl=2)

        # Row is visible immediately after save
        fetched = await _maybe_await(Product.find_one, id=pid)
        assert fetched is not None
        assert fetched.name == "TTLExpiry"

        # Wait for TTL to elapse
        await asyncio.sleep(3)

        # Row should have expired
        assert await _maybe_await(Product.find_one, id=pid) is None

    # ------------------------------------------------------------------
    # (2) __default_ttl__ in Settings applies TTL to all saves
    # ------------------------------------------------------------------

    async def test_default_ttl_applies_to_all_saves(
        self, coodie_driver, TTLItem, execute_raw_fn
    ) -> None:
        """A model with __default_ttl__=2 causes rows to expire automatically."""
        await _maybe_await(TTLItem.sync_table)

        # Verify the table-level default_time_to_live was set
        table = TTLItem.Settings.name
        rows = await _maybe_await(
            execute_raw_fn,
            "SELECT default_time_to_live FROM system_schema.tables "
            "WHERE keyspace_name = ? AND table_name = ?",
            ["test_ks", table],
        )
        assert len(rows) == 1
        assert rows[0]["default_time_to_live"] == 2

        # Insert a row without explicit TTL — the table default should apply
        rid = uuid4()
        item = TTLItem(id=rid, name="DefaultTTL")
        await _maybe_await(item.save)

        fetched = await _maybe_await(TTLItem.find_one, id=rid)
        assert fetched is not None

        # Wait for the default TTL to elapse
        await asyncio.sleep(3)

        assert await _maybe_await(TTLItem.find_one, id=rid) is None

    # ------------------------------------------------------------------
    # (3) save(timestamp=...) uses explicit write timestamp
    # ------------------------------------------------------------------

    async def test_save_with_explicit_timestamp(
        self, coodie_driver, Product, execute_raw_fn
    ) -> None:
        """save(timestamp=<micros>) writes with the specified CQL timestamp."""
        await _maybe_await(Product.sync_table)
        pid = uuid4()
        explicit_ts = 1_700_000_000_000_000  # a fixed microsecond timestamp

        p = Product(id=pid, name="TimestampTest")
        await _maybe_await(p.save, timestamp=explicit_ts)

        # Verify the write timestamp via SELECT WRITETIME(name)
        table = Product.Settings.name
        rows = await _maybe_await(
            execute_raw_fn,
            f'SELECT WRITETIME("name") AS wt FROM test_ks.{table} WHERE id = ?',
            [pid],
        )
        assert len(rows) == 1
        assert rows[0]["wt"] == explicit_ts

        # Clean up
        await _maybe_await(Product(id=pid, name="").delete)

    # ------------------------------------------------------------------
    # (4) QuerySet.ttl(N) on bulk update
    # ------------------------------------------------------------------

    async def test_queryset_ttl_on_bulk_update(
        self, coodie_driver, Product, QS
    ) -> None:
        """QuerySet.ttl(N).update() applies TTL — updated cells expire."""
        await _maybe_await(Product.sync_table)
        pid = uuid4()
        p = Product(id=pid, name="BulkTTL", description="permanent")
        await _maybe_await(p.save)

        # Bulk-update the description column with a 2-second TTL
        await _maybe_await(
            QS(Product).filter(id=pid).ttl(2).update,
            description="temporary",
        )

        fetched = await _maybe_await(Product.find_one, id=pid)
        assert fetched is not None
        assert fetched.description == "temporary"

        # Wait for TTL to expire
        await asyncio.sleep(3)

        fetched2 = await _maybe_await(Product.find_one, id=pid)
        assert fetched2 is not None
        # The description column should have expired (null), but the row remains
        assert fetched2.description is None

        # Clean up
        await _maybe_await(Product(id=pid, name="").delete)
