from __future__ import annotations

import pytest

from coodie.cql_builder import (
    build_batch,
    build_count,
    build_counter_update,
    build_create_index,
    build_create_keyspace,
    build_create_table,
    build_delete,
    build_drop_table,
    build_insert,
    build_select,
    build_update,
    build_where_clause,
    parse_filter_kwargs,
)
from coodie.schema import ColumnDefinition


def make_col(**kwargs):  # type: ignore[no-untyped-def]
    defaults = dict(name="x", cql_type="text")
    defaults.update(kwargs)
    return ColumnDefinition(**defaults)


def test_create_keyspace_default():
    cql = build_create_keyspace("ks")
    assert "CREATE KEYSPACE IF NOT EXISTS ks" in cql
    assert "SimpleStrategy" in cql
    assert "'replication_factor': '1'" in cql


def test_create_keyspace_custom():
    cql = build_create_keyspace(
        "ks", replication_factor=3, strategy="NetworkTopologyStrategy"
    )
    assert "NetworkTopologyStrategy" in cql
    assert "'replication_factor': '3'" in cql


def test_create_table_simple():
    cols = [
        make_col(name="id", cql_type="uuid", primary_key=True),
        make_col(name="name", cql_type="text"),
    ]
    cql = build_create_table("products", "ks", cols)
    assert "CREATE TABLE IF NOT EXISTS ks.products" in cql
    assert '"id" uuid' in cql
    assert '"name" text' in cql
    assert 'PRIMARY KEY ("id")' in cql


def test_create_table_composite_pk():
    cols = [
        make_col(
            name="product_id", cql_type="uuid", primary_key=True, partition_key_index=0
        ),
        make_col(
            name="category", cql_type="text", primary_key=True, partition_key_index=1
        ),
    ]
    cql = build_create_table("products", "ks", cols)
    assert 'PRIMARY KEY (("product_id", "category"))' in cql


def test_create_table_with_clustering():
    cols = [
        make_col(name="product_id", cql_type="uuid", primary_key=True),
        make_col(
            name="created_at",
            cql_type="timestamp",
            clustering_key=True,
            clustering_order="DESC",
        ),
    ]
    cql = build_create_table("reviews", "ks", cols)
    assert '"created_at"' in cql
    assert "WITH CLUSTERING ORDER BY" in cql


def test_create_table_no_pk_raises():
    cols = [make_col(name="name", cql_type="text")]
    with pytest.raises(ValueError):
        build_create_table("t", "ks", cols)


def test_create_index():
    col = make_col(name="brand", cql_type="text", index=True)
    cql = build_create_index("products", "ks", col)
    assert "CREATE INDEX IF NOT EXISTS" in cql
    assert 'ON ks.products ("brand")' in cql


def test_drop_table():
    cql = build_drop_table("products", "ks")
    assert cql == "DROP TABLE IF EXISTS ks.products"


def test_parse_filter_kwargs_eq():
    result = parse_filter_kwargs({"name": "Alice"})
    assert result == [("name", "=", "Alice")]


def test_parse_filter_kwargs_operators():
    result = parse_filter_kwargs({"rating__gte": 4, "price__lt": 100})
    assert ("rating", ">=", 4) in result
    assert ("price", "<", 100) in result


def test_parse_filter_kwargs_in():
    result = parse_filter_kwargs({"id__in": [1, 2, 3]})
    assert result == [("id", "IN", [1, 2, 3])]


def test_build_where_clause_empty():
    clause, params = build_where_clause([])
    assert clause == ""
    assert params == []


def test_build_where_clause_eq():
    clause, params = build_where_clause([("name", "=", "Alice")])
    assert clause == 'WHERE "name" = ?'
    assert params == ["Alice"]


def test_build_where_clause_in():
    clause, params = build_where_clause([("id", "IN", [1, 2])])
    assert "IN (?, ?)" in clause
    assert params == [1, 2]


def test_build_select_simple():
    cql, params = build_select("products", "ks")
    assert cql == "SELECT * FROM ks.products"
    assert params == []


def test_build_select_with_where():
    cql, params = build_select("products", "ks", where=[("name", "=", "Alice")])
    assert 'WHERE "name" = ?' in cql
    assert params == ["Alice"]


def test_build_select_with_limit():
    cql, params = build_select("products", "ks", limit=10)
    assert "LIMIT 10" in cql


def test_build_select_order_by_desc():
    cql, _ = build_select("products", "ks", order_by=["-created_at"])
    assert '"created_at" DESC' in cql


def test_build_select_allow_filtering():
    cql, _ = build_select("products", "ks", allow_filtering=True)
    assert "ALLOW FILTERING" in cql


def test_build_count():
    cql, params = build_count("products", "ks")
    assert "SELECT COUNT(*)" in cql
    assert params == []


def test_build_insert():
    cql, params = build_insert("products", "ks", {"id": "1", "name": "X"})
    assert "INSERT INTO ks.products" in cql
    assert "VALUES (?, ?)" in cql
    assert params == ["1", "X"]


def test_build_insert_if_not_exists():
    cql, _ = build_insert("products", "ks", {"id": "1"}, if_not_exists=True)
    assert "IF NOT EXISTS" in cql


def test_build_insert_ttl():
    cql, _ = build_insert("products", "ks", {"id": "1"}, ttl=60)
    assert "USING TTL 60" in cql


def test_build_update():
    cql, params = build_update(
        "products",
        "ks",
        set_data={"name": "Y"},
        where=[("id", "=", "1")],
    )
    assert "UPDATE ks.products" in cql
    assert 'SET "name" = ?' in cql
    assert 'WHERE "id" = ?' in cql
    assert params == ["Y", "1"]


def test_build_delete():
    cql, params = build_delete("products", "ks", [("id", "=", "1")])
    assert "DELETE FROM ks.products" in cql
    assert params == ["1"]


def test_build_batch():
    stmts = [
        ("INSERT INTO ks.t (id) VALUES (?)", ["1"]),
        ("INSERT INTO ks.t (id) VALUES (?)", ["2"]),
    ]
    cql, params = build_batch(stmts)
    assert "BEGIN LOGGED BATCH" in cql
    assert "APPLY BATCH" in cql
    assert params == ["1", "2"]


def test_build_counter_update_single():
    cql, params = build_counter_update(
        "page_views",
        "ks",
        deltas={"view_count": 1},
        where=[("url", "=", "/home")],
    )
    assert "UPDATE ks.page_views" in cql
    assert '"view_count" = "view_count" + ?' in cql
    assert 'WHERE "url" = ?' in cql
    assert params == [1, "/home"]


def test_build_counter_update_multiple():
    cql, params = build_counter_update(
        "page_views",
        "ks",
        deltas={"view_count": 5, "unique_visitors": 1},
        where=[("url", "=", "/home")],
    )
    assert '"view_count" = "view_count" + ?' in cql
    assert '"unique_visitors" = "unique_visitors" + ?' in cql
    assert params == [5, 1, "/home"]


def test_build_counter_update_decrement():
    cql, params = build_counter_update(
        "page_views",
        "ks",
        deltas={"view_count": -1},
        where=[("url", "=", "/home")],
    )
    assert '"view_count" = "view_count" + ?' in cql
    assert params == [-1, "/home"]
