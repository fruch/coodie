"""Keyspace management integration tests — merged sync + async.

Every test runs twice (sync and async) via the ``variant`` fixture.
"""

from __future__ import annotations

import pytest

from tests.conftest import _maybe_await

pytestmark = [
    pytest.mark.integration,
    pytest.mark.asyncio(loop_scope="session"),
]


class TestKeyspaceManagement:
    """Test create_keyspace / drop_keyspace against a real ScyllaDB container."""

    async def test_create_and_drop_keyspace(
        self, coodie_driver, execute_raw_fn, create_keyspace_fn, drop_keyspace_fn, variant
    ) -> None:
        """create_keyspace + drop_keyspace round-trips a keyspace."""
        ks = f"it_{variant}_ks_test"
        await _maybe_await(drop_keyspace_fn, ks)

        await _maybe_await(create_keyspace_fn, ks, replication_factor=1)
        rows = await _maybe_await(
            execute_raw_fn,
            "SELECT keyspace_name FROM system_schema.keyspaces WHERE keyspace_name = ?",
            [ks],
        )
        assert len(rows) == 1
        assert rows[0]["keyspace_name"] == ks

        await _maybe_await(drop_keyspace_fn, ks)
        rows = await _maybe_await(
            execute_raw_fn,
            "SELECT keyspace_name FROM system_schema.keyspaces WHERE keyspace_name = ?",
            [ks],
        )
        assert rows == []

    async def test_create_keyspace_idempotent(
        self, coodie_driver, create_keyspace_fn, drop_keyspace_fn, variant
    ) -> None:
        """Calling create_keyspace twice must not raise (IF NOT EXISTS)."""
        ks = f"it_{variant}_ks_idem"
        await _maybe_await(drop_keyspace_fn, ks)
        await _maybe_await(create_keyspace_fn, ks, replication_factor=1)
        await _maybe_await(create_keyspace_fn, ks, replication_factor=1)
        await _maybe_await(drop_keyspace_fn, ks)

    async def test_drop_keyspace_idempotent(self, coodie_driver, drop_keyspace_fn, variant) -> None:
        """Calling drop_keyspace on a non-existent keyspace must not raise."""
        await _maybe_await(drop_keyspace_fn, f"it_{variant}_ks_nonexistent")
