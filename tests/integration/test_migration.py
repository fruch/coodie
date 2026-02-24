"""Phase A migration-strategy integration tests — merged sync + async.

Tests the enhanced ``sync_table`` features: dry_run, schema drift detection,
table option changes, and index management.
Every test runs twice (sync and async) via the ``variant`` fixture.
"""

from __future__ import annotations

import logging

import pytest

from tests.conftest import _maybe_await
from tests.integration.conftest import _retry

pytestmark = [
    pytest.mark.integration,
    pytest.mark.asyncio(loop_scope="session"),
]


class TestMigrationPhaseA:
    """Integration tests for Phase A enhanced sync_table."""

    async def test_sync_table_returns_planned_cql(self, coodie_driver, PhaseAProduct) -> None:
        """sync_table should return a list of CQL that were executed."""
        planned = await _maybe_await(PhaseAProduct.sync_table)
        assert isinstance(planned, list)
        assert len(planned) >= 1
        assert any("CREATE TABLE" in s for s in planned)

    async def test_sync_table_dry_run_returns_cql(self, coodie_driver, PhaseAProduct) -> None:
        """dry_run=True should return planned CQL statements."""
        # Ensure the table exists first
        await _maybe_await(PhaseAProduct.sync_table)
        planned = await _maybe_await(PhaseAProduct.sync_table, dry_run=True)
        assert isinstance(planned, list)
        assert any("CREATE TABLE" in s for s in planned)

    async def test_sync_table_dry_run_does_not_create_table(self, coodie_driver, execute_raw_fn, PhaseADryRun) -> None:
        """dry_run=True must not create the table in the database."""
        # Drop the table first
        await _maybe_await(execute_raw_fn, "DROP TABLE IF EXISTS test_ks.it_phase_a_drytest", [])

        # dry_run should NOT create the table
        planned = await _maybe_await(PhaseADryRun.sync_table, dry_run=True)
        assert any("CREATE TABLE" in s for s in planned)

        # Verify the table does NOT exist by checking system_schema
        rows = await _maybe_await(
            execute_raw_fn,
            "SELECT table_name FROM system_schema.tables WHERE keyspace_name = ? AND table_name = ?",
            ["test_ks", "it_phase_a_drytest"],
        )
        assert len(rows) == 0

    async def test_sync_table_schema_drift_warning(self, coodie_driver, execute_raw_fn, PhaseADrift, caplog) -> None:
        """sync_table should warn when DB has columns not in the model."""
        # Create the table with an extra column
        await _maybe_await(execute_raw_fn, "DROP TABLE IF EXISTS test_ks.it_phase_a_drift", [])
        await _maybe_await(
            execute_raw_fn,
            'CREATE TABLE test_ks.it_phase_a_drift ("id" uuid PRIMARY KEY, "name" text, "legacy_col" text)',
            [],
        )

        with caplog.at_level(logging.WARNING, logger="coodie"):
            await _maybe_await(PhaseADrift.sync_table)

        assert "Schema drift detected" in caplog.text
        assert "legacy_col" in caplog.text

    async def test_sync_table_table_option_change(self, coodie_driver, execute_raw_fn, PhaseATTL) -> None:
        """sync_table should ALTER TABLE WITH when options differ."""
        # Create the table with default TTL = 0
        await _maybe_await(execute_raw_fn, "DROP TABLE IF EXISTS test_ks.it_phase_a_ttl", [])
        await _maybe_await(
            execute_raw_fn,
            'CREATE TABLE test_ks.it_phase_a_ttl ("id" uuid PRIMARY KEY, "name" text)',
            [],
        )

        # Model declares __default_ttl__ = 7200
        planned = await _maybe_await(PhaseATTL.sync_table)
        assert any("ALTER TABLE" in s and "default_time_to_live" in s for s in planned)

        # Verify the TTL was actually changed
        rows = await _maybe_await(
            execute_raw_fn,
            "SELECT default_time_to_live FROM system_schema.tables WHERE keyspace_name = ? AND table_name = ?",
            ["test_ks", "it_phase_a_ttl"],
        )
        assert len(rows) == 1
        assert rows[0]["default_time_to_live"] == 7200

    async def test_sync_table_drop_removed_indexes(self, coodie_driver, execute_raw_fn, PhaseAIndex) -> None:
        """drop_removed_indexes=True should remove stale indexes."""
        # Create the table with an extra index
        await _maybe_await(execute_raw_fn, "DROP TABLE IF EXISTS test_ks.it_phase_a_idx", [])
        await _maybe_await(
            execute_raw_fn,
            'CREATE TABLE test_ks.it_phase_a_idx ("id" uuid PRIMARY KEY, "name" text, "old_field" text)',
            [],
        )
        await _maybe_await(
            execute_raw_fn,
            'CREATE INDEX IF NOT EXISTS it_phase_a_idx_old_field_idx ON test_ks.it_phase_a_idx ("old_field")',
            [],
        )

        # Poll until the index is visible in system_schema
        async def _index_exists():
            rows = await _maybe_await(
                execute_raw_fn,
                "SELECT index_name FROM system_schema.indexes WHERE keyspace_name = ? AND table_name = ?",
                ["test_ks", "it_phase_a_idx"],
            )
            return "it_phase_a_idx_old_field_idx" in {r["index_name"] for r in rows} or None

        await _retry(_index_exists)

        # sync_table with drop_removed_indexes should drop the stale index
        planned = await _maybe_await(PhaseAIndex.sync_table, drop_removed_indexes=True)
        assert any("DROP INDEX" in s and "it_phase_a_idx_old_field_idx" in s for s in planned)

        # Poll until the index is gone
        async def _index_gone():
            rows = await _maybe_await(
                execute_raw_fn,
                "SELECT index_name FROM system_schema.indexes WHERE keyspace_name = ? AND table_name = ?",
                ["test_ks", "it_phase_a_idx"],
            )
            return "it_phase_a_idx_old_field_idx" not in {r["index_name"] for r in rows} or None

        await _retry(_index_gone)
