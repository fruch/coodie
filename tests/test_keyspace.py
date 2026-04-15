"""Merged sync + async keyspace management tests.

Every test is parametrised over ``variant`` ("sync" / "async") so that a
single test body exercises both the synchronous and asynchronous code paths.
"""

import pytest

from tests.conftest import _maybe_await


# ------------------------------------------------------------------
# Fixtures
# ------------------------------------------------------------------


@pytest.fixture(params=["sync", "async"])
def variant(request):
    return request.param


@pytest.fixture
def keyspace_fns(variant):
    if variant == "sync":
        from coodie.sync import create_keyspace, drop_keyspace

        return create_keyspace, drop_keyspace
    from coodie.aio import create_keyspace, drop_keyspace

    return create_keyspace, drop_keyspace


# ------------------------------------------------------------------
# Tests
# ------------------------------------------------------------------


async def test_create_keyspace_simple(keyspace_fns, registered_mock_driver):
    create_keyspace, _ = keyspace_fns
    await _maybe_await(create_keyspace, "my_ks", replication_factor=3)
    assert len(registered_mock_driver.executed) == 1
    stmt, params = registered_mock_driver.executed[0]
    assert "CREATE KEYSPACE IF NOT EXISTS my_ks" in stmt
    assert "SimpleStrategy" in stmt
    assert "'replication_factor': '3'" in stmt
    assert params == []


async def test_create_keyspace_network_topology(keyspace_fns, registered_mock_driver):
    create_keyspace, _ = keyspace_fns
    await _maybe_await(create_keyspace, "my_ks", dc_replication_map={"dc1": 3, "dc2": 2})
    stmt, params = registered_mock_driver.executed[0]
    assert "NetworkTopologyStrategy" in stmt
    assert "'dc1': '3'" in stmt
    assert "'dc2': '2'" in stmt
    assert params == []


async def test_drop_keyspace(keyspace_fns, registered_mock_driver):
    _, drop_keyspace = keyspace_fns
    await _maybe_await(drop_keyspace, "my_ks")
    assert len(registered_mock_driver.executed) == 1
    stmt, params = registered_mock_driver.executed[0]
    assert stmt == "DROP KEYSPACE IF EXISTS my_ks"
    assert params == []


# ------------------------------------------------------------------
# Phase 3: alter_keyspace() tests
# ------------------------------------------------------------------

@pytest.fixture
def alter_keyspace_fn(variant):
    if variant == "sync":
        from coodie.sync import alter_keyspace
        return alter_keyspace
    from coodie.aio import alter_keyspace
    return alter_keyspace


async def test_alter_keyspace_replication(alter_keyspace_fn, registered_mock_driver):
    await _maybe_await(alter_keyspace_fn, "my_ks", replication_factor=5)
    assert len(registered_mock_driver.executed) == 1
    stmt, _ = registered_mock_driver.executed[0]
    assert "ALTER KEYSPACE my_ks WITH" in stmt
    assert "'replication_factor': '5'" in stmt


async def test_alter_keyspace_durable_writes(alter_keyspace_fn, registered_mock_driver):
    await _maybe_await(alter_keyspace_fn, "my_ks", durable_writes=False)
    stmt, _ = registered_mock_driver.executed[0]
    assert "durable_writes = false" in stmt


async def test_alter_keyspace_tablets(alter_keyspace_fn, registered_mock_driver):
    await _maybe_await(alter_keyspace_fn, "my_ks", tablets={"enabled": "true"})
    stmt, _ = registered_mock_driver.executed[0]
    assert "tablets = {'enabled': 'true'}" in stmt


# ------------------------------------------------------------------
# Phase 3: create_keyspace() with durable_writes and tablets
# ------------------------------------------------------------------


async def test_create_keyspace_durable_writes(keyspace_fns, registered_mock_driver):
    create_keyspace, _ = keyspace_fns
    await _maybe_await(create_keyspace, "my_ks", durable_writes=False)
    stmt, _ = registered_mock_driver.executed[0]
    assert "AND durable_writes = false" in stmt


async def test_create_keyspace_tablets(keyspace_fns, registered_mock_driver):
    create_keyspace, _ = keyspace_fns
    await _maybe_await(create_keyspace, "my_ks", tablets={"enabled": "true"})
    stmt, _ = registered_mock_driver.executed[0]
    assert "AND tablets = {'enabled': 'true'}" in stmt
