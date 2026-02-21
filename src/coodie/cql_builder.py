from __future__ import annotations

from typing import Any

from coodie.schema import ColumnDefinition


def build_create_keyspace(
    keyspace: str,
    replication_factor: int = 1,
    strategy: str = "SimpleStrategy",
) -> str:
    return (
        f"CREATE KEYSPACE IF NOT EXISTS {keyspace} "
        f"WITH replication = {{'class': '{strategy}', "
        f"'replication_factor': '{replication_factor}'}}"
    )


def build_create_table(
    table: str,
    keyspace: str,
    cols: list[ColumnDefinition],
) -> str:
    col_defs = []
    for col in cols:
        col_defs.append(f'"{col.name}" {col.cql_type}')

    # Partition key columns (ordered by partition_key_index)
    pk_cols = [c for c in cols if c.primary_key]
    pk_cols.sort(key=lambda c: c.partition_key_index)

    # Clustering key columns (ordered by clustering_key_index)
    ck_cols = [c for c in cols if c.clustering_key]
    ck_cols.sort(key=lambda c: c.clustering_key_index)

    if not pk_cols:
        raise ValueError(f"Table {table} has no primary key columns")

    if len(pk_cols) == 1:
        pk_str = f'"{pk_cols[0].name}"'
    else:
        pk_str = "(" + ", ".join(f'"{c.name}"' for c in pk_cols) + ")"

    if ck_cols:
        primary_key = f"PRIMARY KEY ({pk_str}, " + ", ".join(f'"{c.name}"' for c in ck_cols) + ")"
    else:
        primary_key = f"PRIMARY KEY ({pk_str})"

    col_defs_str = ", ".join(col_defs)

    clustering_order_parts = [
        f'"{c.name}" {c.clustering_order}' for c in ck_cols if c.clustering_order != "ASC"
    ]
    with_clause = ""
    if clustering_order_parts:
        with_clause = " WITH CLUSTERING ORDER BY (" + ", ".join(clustering_order_parts) + ")"

    return f"CREATE TABLE IF NOT EXISTS {keyspace}.{table} ({col_defs_str}, {primary_key}){with_clause}"


def build_create_index(
    table: str,
    keyspace: str,
    col: ColumnDefinition,
) -> str:
    index_name = col.index_name or f"{table}_{col.name}_idx"
    return (
        f"CREATE INDEX IF NOT EXISTS {index_name} ON {keyspace}.{table} (\"{col.name}\")"
    )


def build_drop_table(table: str, keyspace: str) -> str:
    return f"DROP TABLE IF EXISTS {keyspace}.{table}"


def parse_filter_kwargs(
    kwargs: dict[str, Any],
) -> list[tuple[str, str, Any]]:
    """Parse Django-style filter kwargs into (column, operator, value) triples."""
    operators = {
        "gt": ">",
        "gte": ">=",
        "lt": "<",
        "lte": "<=",
        "in": "IN",
        "contains": "CONTAINS",
        "contains_key": "CONTAINS KEY",
    }
    result = []
    for key, value in kwargs.items():
        parts = key.rsplit("__", 1)
        if len(parts) == 2 and parts[1] in operators:
            col, op_key = parts
            result.append((col, operators[op_key], value))
        else:
            result.append((key, "=", value))
    return result


def build_where_clause(
    filter_triples: list[tuple[str, str, Any]],
) -> tuple[str, list[Any]]:
    """Build WHERE clause from (col, op, value) triples. Returns (clause_str, params)."""
    if not filter_triples:
        return "", []
    parts = []
    params: list[Any] = []
    for col, op, value in filter_triples:
        if op == "IN":
            placeholders = ", ".join("?" * len(value))
            parts.append(f'"{col}" IN ({placeholders})')
            params.extend(value)
        else:
            parts.append(f'"{col}" {op} ?')
            params.append(value)
    return "WHERE " + " AND ".join(parts), params


def build_select(
    table: str,
    keyspace: str,
    columns: list[str] | None = None,
    where: list[tuple[str, str, Any]] | None = None,
    limit: int | None = None,
    order_by: list[str] | None = None,
    allow_filtering: bool = False,
    per_partition_limit: int | None = None,
) -> tuple[str, list[Any]]:
    cols_str = ", ".join(f'"{c}"' for c in columns) if columns else "*"
    cql = f"SELECT {cols_str} FROM {keyspace}.{table}"
    params: list[Any] = []

    if where:
        clause, where_params = build_where_clause(where)
        if clause:
            cql += " " + clause
            params.extend(where_params)

    if order_by:
        order_parts = []
        for col in order_by:
            if col.startswith("-"):
                order_parts.append(f'"{col[1:]}" DESC')
            else:
                order_parts.append(f'"{col}" ASC')
        cql += " ORDER BY " + ", ".join(order_parts)

    if per_partition_limit is not None:
        cql += f" PER PARTITION LIMIT {per_partition_limit}"

    if limit is not None:
        cql += f" LIMIT {limit}"

    if allow_filtering:
        cql += " ALLOW FILTERING"

    return cql, params


def build_count(
    table: str,
    keyspace: str,
    where: list[tuple[str, str, Any]] | None = None,
    allow_filtering: bool = False,
) -> tuple[str, list[Any]]:
    cql = f"SELECT COUNT(*) FROM {keyspace}.{table}"
    params: list[Any] = []

    if where:
        clause, where_params = build_where_clause(where)
        if clause:
            cql += " " + clause
            params.extend(where_params)

    if allow_filtering:
        cql += " ALLOW FILTERING"

    return cql, params


def build_insert(
    table: str,
    keyspace: str,
    data: dict[str, Any],
    ttl: int | None = None,
    if_not_exists: bool = False,
) -> tuple[str, list[Any]]:
    cols = list(data.keys())
    vals = list(data.values())
    cols_str = ", ".join(f'"{c}"' for c in cols)
    placeholders = ", ".join("?" * len(cols))
    cql = f"INSERT INTO {keyspace}.{table} ({cols_str}) VALUES ({placeholders})"
    if if_not_exists:
        cql += " IF NOT EXISTS"
    if ttl is not None:
        cql += f" USING TTL {ttl}"
    return cql, vals


def build_update(
    table: str,
    keyspace: str,
    set_data: dict[str, Any],
    where: list[tuple[str, str, Any]],
    ttl: int | None = None,
    if_conditions: dict[str, Any] | None = None,
) -> tuple[str, list[Any]]:
    set_parts = [f'"{k}" = ?' for k in set_data]
    params: list[Any] = list(set_data.values())

    cql = f"UPDATE {keyspace}.{table}"
    if ttl is not None:
        cql += f" USING TTL {ttl}"
    cql += " SET " + ", ".join(set_parts)

    clause, where_params = build_where_clause(where)
    cql += " " + clause
    params.extend(where_params)

    if if_conditions:
        cond_parts = [f'"{k}" = ?' for k in if_conditions]
        cql += " IF " + " AND ".join(cond_parts)
        params.extend(if_conditions.values())

    return cql, params


def build_delete(
    table: str,
    keyspace: str,
    where: list[tuple[str, str, Any]],
    columns: list[str] | None = None,
) -> tuple[str, list[Any]]:
    cols_str = ", ".join(f'"{c}"' for c in columns) if columns else ""
    cql = f"DELETE {cols_str} FROM {keyspace}.{table}".replace("DELETE  FROM", "DELETE FROM")

    clause, params = build_where_clause(where)
    cql += " " + clause

    return cql, params


def build_batch(
    statements: list[tuple[str, list[Any]]],
    logged: bool = True,
) -> tuple[str, list[Any]]:
    batch_type = "LOGGED" if logged else "UNLOGGED"
    all_params: list[Any] = []
    stmt_lines = []
    for stmt, p in statements:
        stmt_lines.append(stmt + ";")
        all_params.extend(p)
    inner = "\n  ".join(stmt_lines)
    cql = f"BEGIN {batch_type} BATCH\n  {inner}\nAPPLY BATCH"
    return cql, all_params
