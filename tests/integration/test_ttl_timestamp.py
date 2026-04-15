"""Integration tests for TTL and USING TIMESTAMP modifiers.

Covers:
- save(ttl=N) causes row to expire after N seconds.
- __default_ttl__ in Settings applies TTL to all saves.
- save(timestamp=...) uses explicit write timestamp.
- QuerySet.ttl(N) on bulk update.

Every test runs twice (sync and async) via the ``variant`` fixture.

See docs/plans/cqlengine-test-coverage-plan.md §1.6.
"""

from __future__ import annotations

import asyncio
import time
from uuid import uuid4

import pytest
from pydantic import ValidationError

from tests.conftest import _maybe_await

pytestmark = [
    pytest.mark.integration,
    pytest.mark.asyncio(loop_scope="session"),
]


class TestTTLModifiers:
    """Integration tests for TTL modifiers on save and update."""

    async def test_save_with_ttl_causes_row_to_expire(self, coodie_driver, Product) -> None:
        """save(ttl=2) inserts a row that disappears after ~2 seconds."""
        pid = uuid4()
        p = Product(id=pid, name="TTLExpire")
        await _maybe_await(p.save, ttl=2)

        # Row should exist immediately
        fetched = await _maybe_await(Product.find_one, id=pid)
        assert fetched is not None
        assert fetched.name == "TTLExpire"

        # Wait for TTL to elapse
        await asyncio.sleep(3)

        # Row should have expired
        fetched = await _maybe_await(Product.find_one, id=pid)
        assert fetched is None

    async def test_default_ttl_in_settings_applies_ttl(self, coodie_driver, PhaseATTL) -> None:
        """__default_ttl__ in Settings applies default_time_to_live to the table.

        The PhaseATTL model has __default_ttl__ = 7200 in its Settings.
        After sync_table, the table's default_time_to_live should be 7200.
        We verify by querying the system_schema.tables metadata.
        """
        await _maybe_await(PhaseATTL.sync_table)

        # Save a row to ensure the table is set up
        rid = uuid4()
        await _maybe_await(PhaseATTL(id=rid, name="TTLDefault").save)

        # Verify the table was created with the correct default TTL
        from coodie.drivers import get_driver

        drv = get_driver()
        table_name = PhaseATTL.Settings.name
        ks = PhaseATTL.Settings.keyspace
        rows = drv.execute(
            "SELECT default_time_to_live FROM system_schema.tables WHERE keyspace_name = ? AND table_name = ?",
            [ks, table_name],
        )
        assert rows, "Expected system_schema.tables to return the table metadata"
        ttl_val = rows[0].get("default_time_to_live")
        assert ttl_val == 7200, f"Expected default_time_to_live=7200, got {ttl_val}"

        # Cleanup
        await _maybe_await(PhaseATTL(id=rid).delete)

    async def test_save_with_explicit_timestamp(self, coodie_driver, Product) -> None:
        """save(timestamp=...) uses explicit write timestamp.

        We save two rows with different explicit timestamps and verify that
        the row with the higher timestamp wins a conflict when the same PK
        is overwritten.
        """
        pid = uuid4()

        # Write with a low timestamp (1 microsecond)
        low_ts = 1
        await _maybe_await(Product(id=pid, name="OldValue").save, timestamp=low_ts)

        # Write with a high timestamp (far future, in microseconds)
        high_ts = int(time.time() * 1_000_000) + 10_000_000_000
        await _maybe_await(Product(id=pid, name="NewValue").save, timestamp=high_ts)

        # The high-timestamp write should win
        fetched = await _maybe_await(Product.find_one, id=pid)
        assert fetched is not None
        assert fetched.name == "NewValue"

        # Write again with the low timestamp — should NOT overwrite
        await _maybe_await(Product(id=pid, name="ShouldNotWin").save, timestamp=low_ts)

        fetched = await _maybe_await(Product.find_one, id=pid)
        assert fetched is not None
        assert fetched.name == "NewValue"

        await _maybe_await(Product(id=pid, name="").delete)

    async def test_queryset_ttl_on_bulk_update(self, coodie_driver, Product, QS) -> None:
        """QuerySet.ttl(N) applies TTL to a bulk update, causing updated rows to expire."""
        pid = uuid4()
        await _maybe_await(Product(id=pid, name="BulkTTL", brand="Original").save)

        # Bulk-update with TTL=2
        await _maybe_await(QS(Product).filter(id=pid).ttl(2).update, brand="Updated")

        # Row should exist with updated value immediately
        fetched = await _maybe_await(Product.find_one, id=pid)
        assert fetched is not None
        assert fetched.brand == "Updated"

        # Wait for TTL to elapse
        await asyncio.sleep(3)

        # After TTL, the updated column should have expired.  For UPDATE with
        # TTL in Cassandra/ScyllaDB, only the SET columns expire — the row may
        # still exist with the remaining (non-updated) columns.  The expired
        # column is returned as null by the database.
        #
        # Depending on the driver path:
        # - model_construct() (fast path): the model is built without
        #   validation, so brand will be None on the returned object.
        # - model_validate() (safe path, e.g. Acsylla): Pydantic rejects
        #   None for the ``brand: str`` field and raises ValidationError.
        #
        # Either outcome proves the TTL worked — the DB returned null.
        try:
            fetched = await _maybe_await(Product.find_one, id=pid)
        except ValidationError:
            # The DB returned brand=null, which failed Pydantic validation
            # for the non-optional ``brand: str`` field.  TTL worked.
            fetched = None

        if fetched is not None:
            assert fetched.brand is None or fetched.brand != "Updated", (
                f"Expected brand column to have expired after TTL, but got '{fetched.brand}'"
            )

        # Cleanup — use raw delete since the row may fail model validation
        from coodie.drivers import get_driver

        drv = get_driver()
        table = Product.Settings.name
        ks = Product.Settings.keyspace
        drv.execute(f"DELETE FROM {ks}.{table} WHERE id = ?", [pid])
