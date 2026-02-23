from __future__ import annotations

from coodie.sync import create_keyspace, drop_keyspace


def test_create_keyspace_simple(registered_mock_driver):
    create_keyspace("my_ks", replication_factor=3)
    assert len(registered_mock_driver.executed) == 1
    stmt, params = registered_mock_driver.executed[0]
    assert "CREATE KEYSPACE IF NOT EXISTS my_ks" in stmt
    assert "SimpleStrategy" in stmt
    assert "'replication_factor': '3'" in stmt
    assert params == []


def test_create_keyspace_network_topology(registered_mock_driver):
    create_keyspace("my_ks", dc_replication_map={"dc1": 3, "dc2": 2})
    stmt, params = registered_mock_driver.executed[0]
    assert "NetworkTopologyStrategy" in stmt
    assert "'dc1': '3'" in stmt
    assert "'dc2': '2'" in stmt
    assert params == []


def test_drop_keyspace(registered_mock_driver):
    drop_keyspace("my_ks")
    assert len(registered_mock_driver.executed) == 1
    stmt, params = registered_mock_driver.executed[0]
    assert stmt == "DROP KEYSPACE IF EXISTS my_ks"
    assert params == []
