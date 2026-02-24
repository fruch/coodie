from __future__ import annotations

import pytest

from coodie.cql_builder import (
    build_batch,
    build_count,
    build_counter_update,
    build_create_index,
    build_create_keyspace,
    build_create_materialized_view,
    build_create_table,
    build_delete,
    build_drop_materialized_view,
    build_drop_keyspace,
    build_drop_table,
    build_insert,
    build_select,
    build_update,
    build_where_clause,
    parse_filter_kwargs,
    parse_update_kwargs,
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
    cql = build_create_keyspace("ks", replication_factor=3, strategy="NetworkTopologyStrategy")
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
        make_col(name="product_id", cql_type="uuid", primary_key=True, partition_key_index=0),
        make_col(name="category", cql_type="text", primary_key=True, partition_key_index=1),
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


@pytest.mark.parametrize(
    "kwargs, expected_triple",
    [
        pytest.param({"name": "Alice"}, ("name", "=", "Alice"), id="eq"),
        pytest.param({"rating__gte": 4}, ("rating", ">=", 4), id="gte"),
        pytest.param({"price__lt": 100}, ("price", "<", 100), id="lt"),
        pytest.param({"id__in": [1, 2, 3]}, ("id", "IN", [1, 2, 3]), id="in"),
        pytest.param({"name__like": "Al%"}, ("name", "LIKE", "Al%"), id="like"),
    ],
)
def test_parse_filter_kwargs(kwargs, expected_triple):
    result = parse_filter_kwargs(kwargs)
    assert expected_triple in result


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


def test_build_select_per_partition_limit():
    cql, _ = build_select("products", "ks", per_partition_limit=5)
    assert "PER PARTITION LIMIT 5" in cql


def test_build_select_with_columns():
    cql, _ = build_select("products", "ks", columns=["id", "name"])
    assert 'SELECT "id", "name" FROM ks.products' == cql


def test_build_select_like_filter():
    cql, params = build_select("products", "ks", where=[("name", "LIKE", "Al%")])
    assert '"name" LIKE ?' in cql
    assert params == ["Al%"]


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


@pytest.mark.parametrize(
    "builder, extra_kwargs, expected_fragment",
    [
        pytest.param("insert", {"ttl": 60}, "USING TTL 60", id="insert-ttl"),
        pytest.param(
            "insert",
            {"timestamp": 1234567890},
            "USING TIMESTAMP 1234567890",
            id="insert-ts",
        ),
        pytest.param(
            "insert",
            {"ttl": 60, "timestamp": 1234567890},
            "USING TTL 60 AND TIMESTAMP 1234567890",
            id="insert-ttl-ts",
        ),
        pytest.param("update", {"ttl": 300}, "USING TTL 300", id="update-ttl"),
        pytest.param(
            "update",
            {"timestamp": 1234567890},
            "USING TIMESTAMP 1234567890",
            id="update-ts",
        ),
        pytest.param(
            "update",
            {"ttl": 60, "timestamp": 1234567890},
            "USING TTL 60 AND TIMESTAMP 1234567890",
            id="update-ttl-ts",
        ),
        pytest.param(
            "delete",
            {"timestamp": 1234567890},
            "USING TIMESTAMP 1234567890",
            id="delete-ts",
        ),
    ],
)
def test_using_clause(builder, extra_kwargs, expected_fragment):
    if builder == "insert":
        cql, _ = build_insert("products", "ks", {"id": "1"}, **extra_kwargs)
    elif builder == "update":
        cql, _ = build_update(
            "products",
            "ks",
            set_data={"name": "Y"},
            where=[("id", "=", "1")],
            **extra_kwargs,
        )
    else:
        cql, _ = build_delete("products", "ks", [("id", "=", "1")], **extra_kwargs)
    assert expected_fragment in cql


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


def test_build_update_with_if_exists():
    cql, params = build_update(
        "products",
        "ks",
        set_data={"name": "Y"},
        where=[("id", "=", "1")],
        if_exists=True,
    )
    assert "IF EXISTS" in cql
    assert params == ["Y", "1"]


def test_build_update_if_exists_takes_precedence_over_if_conditions():
    cql, params = build_update(
        "products",
        "ks",
        set_data={"name": "Y"},
        where=[("id", "=", "1")],
        if_conditions={"name": "X"},
        if_exists=True,
    )
    assert "IF EXISTS" in cql
    assert 'IF "name"' not in cql
    assert params == ["Y", "1"]


def test_build_delete():
    cql, params = build_delete("products", "ks", [("id", "=", "1")])
    assert "DELETE FROM ks.products" in cql
    assert params == ["1"]


def test_build_delete_if_exists():
    cql, params = build_delete("products", "ks", [("id", "=", "1")], if_exists=True)
    assert "DELETE FROM ks.products" in cql
    assert "IF EXISTS" in cql
    assert params == ["1"]


def test_build_batch():
    stmts = [
        ("INSERT INTO ks.t (id) VALUES (?)", ["1"]),
        ("INSERT INTO ks.t (id) VALUES (?)", ["2"]),
    ]
    cql, params = build_batch(stmts)
    assert "BEGIN BATCH" in cql
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


# --- Phase 3: Partial Update API ---


def test_parse_update_kwargs_regular():
    set_data, ops = parse_update_kwargs({"name": "Y", "price": 10})
    assert set_data == {"name": "Y", "price": 10}
    assert ops == []


def test_parse_update_kwargs_collection_ops():
    set_data, ops = parse_update_kwargs({"tags__add": {"new"}, "items__remove": ["old"], "name": "X"})
    assert set_data == {"name": "X"}
    assert ("tags", "add", {"new"}) in ops
    assert ("items", "remove", ["old"]) in ops


def test_parse_update_kwargs_append_prepend():
    set_data, ops = parse_update_kwargs({"items__append": ["z"], "items__prepend": ["a"]})
    assert set_data == {}
    assert ("items", "append", ["z"]) in ops
    assert ("items", "prepend", ["a"]) in ops


def test_build_update_with_if_conditions():
    cql, params = build_update(
        "products",
        "ks",
        set_data={"name": "Y"},
        where=[("id", "=", "1")],
        if_conditions={"name": "X"},
    )
    assert 'IF "name" = ?' in cql
    assert params == ["Y", "1", "X"]


@pytest.mark.parametrize(
    "op_key, op_name, value, expected_fragment, expected_params",
    [
        pytest.param(
            "tags",
            "add",
            {"new_tag"},
            '"tags" = "tags" + ?',
            [{"new_tag"}, "1"],
            id="set-add",
        ),
        pytest.param(
            "tags",
            "remove",
            {"old_tag"},
            '"tags" = "tags" - ?',
            [{"old_tag"}, "1"],
            id="set-remove",
        ),
        pytest.param(
            "items",
            "append",
            ["z"],
            '"items" = "items" + ?',
            [["z"], "1"],
            id="list-append",
        ),
        pytest.param(
            "items",
            "prepend",
            ["a"],
            '"items" = ? + "items"',
            [["a"], "1"],
            id="list-prepend",
        ),
    ],
)
def test_build_update_collection_op(op_key, op_name, value, expected_fragment, expected_params):
    cql, params = build_update(
        "products",
        "ks",
        set_data={},
        where=[("id", "=", "1")],
        collection_ops=[(op_key, op_name, value)],
    )
    assert expected_fragment in cql
    assert params == expected_params


def test_build_update_mixed_set_and_collection_ops():
    cql, params = build_update(
        "products",
        "ks",
        set_data={"name": "Y"},
        where=[("id", "=", "1")],
        collection_ops=[("tags", "add", {"new"})],
    )
    assert '"name" = ?' in cql
    assert '"tags" = "tags" + ?' in cql
    assert params == ["Y", {"new"}, "1"]


# ------------------------------------------------------------------
# Phase 8: build_create_table with table_options
# ------------------------------------------------------------------


def test_create_table_with_default_ttl():
    cols = [
        make_col(name="id", cql_type="uuid", primary_key=True),
        make_col(name="name", cql_type="text"),
    ]
    cql = build_create_table("products", "ks", cols, table_options={"default_time_to_live": 86400})
    assert "WITH default_time_to_live = 86400" in cql


def test_create_table_with_multiple_options():
    cols = [
        make_col(name="id", cql_type="uuid", primary_key=True),
    ]
    cql = build_create_table(
        "products",
        "ks",
        cols,
        table_options={"default_time_to_live": 3600, "gc_grace_seconds": 864000},
    )
    assert "default_time_to_live = 3600" in cql
    assert "gc_grace_seconds = 864000" in cql
    assert " AND " in cql


def test_create_table_with_string_option():
    cols = [
        make_col(name="id", cql_type="uuid", primary_key=True),
    ]
    cql = build_create_table("products", "ks", cols, table_options={"comment": "my table"})
    assert "comment = 'my table'" in cql


def test_create_table_with_clustering_and_options():
    cols = [
        make_col(name="id", cql_type="uuid", primary_key=True),
        make_col(
            name="created_at",
            cql_type="timestamp",
            clustering_key=True,
            clustering_order="DESC",
        ),
    ]
    cql = build_create_table("reviews", "ks", cols, table_options={"default_time_to_live": 3600})
    assert "WITH CLUSTERING ORDER BY" in cql
    assert "default_time_to_live = 3600" in cql
    assert " AND " in cql


def test_create_table_no_options():
    cols = [
        make_col(name="id", cql_type="uuid", primary_key=True),
    ]
    cql = build_create_table("products", "ks", cols, table_options=None)
    assert "default_time_to_live" not in cql
    assert "gc_grace_seconds" not in cql


# ------------------------------------------------------------------
# Phase 10: Token-range query support
# ------------------------------------------------------------------


@pytest.mark.parametrize(
    "kwargs, expected_triple",
    [
        pytest.param({"id__token__gt": 100}, ("id", "TOKEN >", 100), id="token-gt"),
        pytest.param({"id__token__gte": 100}, ("id", "TOKEN >=", 100), id="token-gte"),
        pytest.param({"id__token__lt": 200}, ("id", "TOKEN <", 200), id="token-lt"),
        pytest.param({"id__token__lte": 200}, ("id", "TOKEN <=", 200), id="token-lte"),
    ],
)
def test_parse_filter_kwargs_token(kwargs, expected_triple):
    result = parse_filter_kwargs(kwargs)
    assert result == [expected_triple]


def test_parse_filter_kwargs_token_range():
    result = parse_filter_kwargs({"id__token__gt": 100, "id__token__lte": 200})
    assert ("id", "TOKEN >", 100) in result
    assert ("id", "TOKEN <=", 200) in result


def test_build_where_clause_token():
    clause, params = build_where_clause([("id", "TOKEN >", 100)])
    assert clause == 'WHERE TOKEN("id") > ?'
    assert params == [100]


def test_build_where_clause_token_range():
    clause, params = build_where_clause([("id", "TOKEN >", 100), ("id", "TOKEN <=", 200)])
    assert 'TOKEN("id") > ?' in clause
    assert 'TOKEN("id") <= ?' in clause
    assert params == [100, 200]


def test_build_select_with_token_filter():
    cql, params = build_select(
        "products",
        "ks",
        where=[("id", "TOKEN >", 100), ("id", "TOKEN <=", 200)],
        allow_filtering=True,
    )
    assert 'TOKEN("id") > ?' in cql
    assert 'TOKEN("id") <= ?' in cql
    assert params == [100, 200]
    assert "ALLOW FILTERING" in cql


def test_parse_filter_kwargs_mixed_token_and_regular():
    result = parse_filter_kwargs({"id__token__gt": 100, "name": "Alice"})
    assert ("id", "TOKEN >", 100) in result
    assert ("name", "=", "Alice") in result


# ------------------------------------------------------------------
# Phase 12: Materialized Views
# ------------------------------------------------------------------


def test_build_create_materialized_view_simple():
    cql = build_create_materialized_view(
        view_name="products_by_brand",
        keyspace="ks",
        base_table="products",
        columns=["*"],
        primary_key_columns=["brand"],
        clustering_columns=["id"],
        where_clause='"brand" IS NOT NULL AND "id" IS NOT NULL',
    )
    assert "CREATE MATERIALIZED VIEW IF NOT EXISTS ks.products_by_brand" in cql
    assert "AS SELECT * FROM ks.products" in cql
    assert '"brand" IS NOT NULL AND "id" IS NOT NULL' in cql
    assert 'PRIMARY KEY ("brand", "id")' in cql


def test_build_create_materialized_view_specific_columns():
    cql = build_create_materialized_view(
        view_name="products_by_brand",
        keyspace="ks",
        base_table="products",
        columns=["id", "name", "brand"],
        primary_key_columns=["brand"],
        clustering_columns=["id"],
        where_clause='"brand" IS NOT NULL AND "id" IS NOT NULL',
    )
    assert 'SELECT "id", "name", "brand" FROM ks.products' in cql


def test_build_create_materialized_view_composite_pk():
    cql = build_create_materialized_view(
        view_name="mv_test",
        keyspace="ks",
        base_table="base",
        columns=["*"],
        primary_key_columns=["a", "b"],
        where_clause='"a" IS NOT NULL AND "b" IS NOT NULL',
    )
    assert 'PRIMARY KEY (("a", "b"))' in cql


def test_build_create_materialized_view_no_clustering():
    cql = build_create_materialized_view(
        view_name="mv_test",
        keyspace="ks",
        base_table="base",
        columns=["*"],
        primary_key_columns=["id"],
        where_clause='"id" IS NOT NULL',
    )
    assert 'PRIMARY KEY ("id")' in cql


def test_build_create_materialized_view_with_clustering_order():
    cql = build_create_materialized_view(
        view_name="products_by_brand",
        keyspace="ks",
        base_table="products",
        columns=["*"],
        primary_key_columns=["brand"],
        clustering_columns=["created_at"],
        where_clause='"brand" IS NOT NULL AND "created_at" IS NOT NULL',
        clustering_order={"created_at": "DESC"},
    )
    assert "WITH CLUSTERING ORDER BY" in cql
    assert '"created_at" DESC' in cql


def test_build_drop_materialized_view():
    cql = build_drop_materialized_view("products_by_brand", "ks")
    assert cql == "DROP MATERIALIZED VIEW IF EXISTS ks.products_by_brand"


# ------------------------------------------------------------------
# Phase 13: Keyspace Management
# ------------------------------------------------------------------


def test_build_create_keyspace_network_topology():
    cql = build_create_keyspace("ks", dc_replication_map={"dc1": 3, "dc2": 2})
    assert "CREATE KEYSPACE IF NOT EXISTS ks" in cql
    assert "NetworkTopologyStrategy" in cql
    assert "'dc1': '3'" in cql
    assert "'dc2': '2'" in cql


def test_build_create_keyspace_network_topology_single_dc():
    cql = build_create_keyspace("ks", dc_replication_map={"us-east": 3})
    assert "NetworkTopologyStrategy" in cql
    assert "'us-east': '3'" in cql


def test_build_create_keyspace_network_topology_overrides_strategy():
    cql = build_create_keyspace("ks", strategy="SimpleStrategy", dc_replication_map={"dc1": 3})
    assert "NetworkTopologyStrategy" in cql
    assert "SimpleStrategy" not in cql


def test_build_drop_keyspace():
    cql = build_drop_keyspace("my_ks")
    assert cql == "DROP KEYSPACE IF EXISTS my_ks"
