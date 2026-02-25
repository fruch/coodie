from __future__ import annotations

from typing import Any

from coodie.schema import ColumnDefinition


def build_create_keyspace(
    keyspace: str,
    replication_factor: int = 1,
    strategy: str = "SimpleStrategy",
    dc_replication_map: dict[str, int] | None = None,
) -> str:
    if dc_replication_map is not None:
        strategy = "NetworkTopologyStrategy"
        dc_parts = ", ".join(f"'{dc}': '{rf}'" for dc, rf in dc_replication_map.items())
        return f"CREATE KEYSPACE IF NOT EXISTS {keyspace} WITH replication = {{'class': '{strategy}', {dc_parts}}}"
    return (
        f"CREATE KEYSPACE IF NOT EXISTS {keyspace} "
        f"WITH replication = {{'class': '{strategy}', "
        f"'replication_factor': '{replication_factor}'}}"
    )


def build_drop_keyspace(keyspace: str) -> str:
    return f"DROP KEYSPACE IF EXISTS {keyspace}"


def build_create_table(
    table: str,
    keyspace: str,
    cols: list[ColumnDefinition],
    table_options: dict[str, Any] | None = None,
) -> str:
    col_defs = []
    for col in cols:
        col_def = f'"{col.name}" {col.cql_type}'
        if col.static:
            col_def += " STATIC"
        col_defs.append(col_def)

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

    clustering_order_parts = []
    if any(c.clustering_order != "ASC" for c in ck_cols):
        # CQL requires ALL clustering columns to be listed in WITH CLUSTERING
        # ORDER BY whenever the clause is present — even those that are ASC.
        clustering_order_parts = [f'"{c.name}" {c.clustering_order}' for c in ck_cols]

    with_parts: list[str] = []
    if clustering_order_parts:
        with_parts.append("CLUSTERING ORDER BY (" + ", ".join(clustering_order_parts) + ")")
    if table_options:
        for k, v in table_options.items():
            if isinstance(v, str):
                with_parts.append(f"{k} = '{v}'")
            else:
                with_parts.append(f"{k} = {v}")

    with_clause = ""
    if with_parts:
        with_clause = " WITH " + " AND ".join(with_parts)

    return f"CREATE TABLE IF NOT EXISTS {keyspace}.{table} ({col_defs_str}, {primary_key}){with_clause}"


def build_create_index(
    table: str,
    keyspace: str,
    col: ColumnDefinition,
) -> str:
    index_name = col.index_name or f"{table}_{col.name}_idx"
    return f'CREATE INDEX IF NOT EXISTS {index_name} ON {keyspace}.{table} ("{col.name}")'


def build_drop_index(index_name: str, keyspace: str) -> str:
    """Build a ``DROP INDEX IF EXISTS`` CQL statement."""
    return f"DROP INDEX IF EXISTS {keyspace}.{index_name}"


def build_alter_table_options(
    table: str,
    keyspace: str,
    options: dict[str, Any],
) -> str:
    """Build an ``ALTER TABLE … WITH`` statement for table option changes."""
    parts = []
    for k, v in options.items():
        if isinstance(v, str):
            parts.append(f"{k} = '{v}'")
        else:
            parts.append(f"{k} = {v}")
    return f"ALTER TABLE {keyspace}.{table} WITH " + " AND ".join(parts)


def build_drop_table(table: str, keyspace: str) -> str:
    return f"DROP TABLE IF EXISTS {keyspace}.{table}"


def build_create_materialized_view(
    view_name: str,
    keyspace: str,
    base_table: str,
    columns: list[str],
    primary_key_columns: list[str],
    clustering_columns: list[str] | None = None,
    where_clause: str | None = None,
    clustering_order: dict[str, str] | None = None,
) -> str:
    """Build a ``CREATE MATERIALIZED VIEW`` CQL statement.

    Args:
        view_name: Name of the materialized view.
        keyspace: Keyspace for the view.
        base_table: The base table the view selects from.
        columns: Columns to include (use ``["*"]`` for all).
        primary_key_columns: Partition key column(s).
        clustering_columns: Optional clustering column(s).
        where_clause: The ``WHERE`` clause required by CQL (e.g.
            ``'"col" IS NOT NULL AND "pk" IS NOT NULL'``).
        clustering_order: Optional dict mapping column name to ``"ASC"``/``"DESC"``.
    """
    cols_str = ", ".join(c if c == "*" else f'"{c}"' for c in columns)

    if len(primary_key_columns) == 1:
        pk_str = f'"{primary_key_columns[0]}"'
    else:
        pk_str = "(" + ", ".join(f'"{c}"' for c in primary_key_columns) + ")"

    if clustering_columns:
        key_str = f"PRIMARY KEY ({pk_str}, " + ", ".join(f'"{c}"' for c in clustering_columns) + ")"
    else:
        key_str = f"PRIMARY KEY ({pk_str})"

    cql = (
        f"CREATE MATERIALIZED VIEW IF NOT EXISTS {keyspace}.{view_name} "
        f"AS SELECT {cols_str} FROM {keyspace}.{base_table}"
    )

    if where_clause:
        cql += f" WHERE {where_clause}"

    cql += f" {key_str}"

    with_parts: list[str] = []
    if clustering_order:
        order_parts = [f'"{c}" {d}' for c, d in clustering_order.items()]
        with_parts.append("CLUSTERING ORDER BY (" + ", ".join(order_parts) + ")")

    if with_parts:
        cql += " WITH " + " AND ".join(with_parts)

    return cql


def build_drop_materialized_view(view_name: str, keyspace: str) -> str:
    """Build a ``DROP MATERIALIZED VIEW`` CQL statement."""
    return f"DROP MATERIALIZED VIEW IF EXISTS {keyspace}.{view_name}"


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
        "like": "LIKE",
    }
    token_operators = {
        "token__gt": "TOKEN >",
        "token__gte": "TOKEN >=",
        "token__lt": "TOKEN <",
        "token__lte": "TOKEN <=",
    }
    result = []
    for key, value in kwargs.items():
        # Check for __token__<op> pattern first (two-level suffix)
        parts2 = key.rsplit("__", 2)
        if len(parts2) == 3:
            col, mid, op = parts2
            token_key = f"{mid}__{op}"
            if token_key in token_operators:
                result.append((col, token_operators[token_key], value))
                continue
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
        if op.startswith("TOKEN "):
            actual_op = op[len("TOKEN ") :]
            parts.append(f'TOKEN("{col}") {actual_op} ?')
            params.append(value)
        elif op == "IN":
            placeholders = ", ".join("?" * len(value))
            parts.append(f'"{col}" IN ({placeholders})')
            params.extend(value)
        else:
            parts.append(f'"{col}" {op} ?')
            params.append(value)
    return "WHERE " + " AND ".join(parts), params


# Cache for SELECT CQL templates keyed by query shape.
_select_cql_cache: dict[tuple, str] = {}


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
    # Build the cache key from the query *shape* (excludes actual values).
    where_shape: tuple = ()
    if where:
        where_shape = tuple((col, op, len(value)) if op == "IN" else (col, op) for col, op, value in where)
    cache_key = (
        table,
        keyspace,
        tuple(columns) if columns else None,
        where_shape,
        limit,
        tuple(order_by) if order_by else None,
        allow_filtering,
        per_partition_limit,
    )

    # Extract params (always needed regardless of cache hit).
    params: list[Any] = []
    if where:
        for _col, op, value in where:
            if op == "IN":
                params.extend(value)
            else:
                params.append(value)

    cached_cql = _select_cql_cache.get(cache_key)
    if cached_cql is not None:
        return cached_cql, params

    cols_str = ", ".join(f'"{c}"' for c in columns) if columns else "*"
    cql = f"SELECT {cols_str} FROM {keyspace}.{table}"

    if where:
        clause, _wp = build_where_clause(where)
        if clause:
            cql += " " + clause

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

    _select_cql_cache[cache_key] = cql
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


def _build_using_clause(
    ttl: int | None = None,
    timestamp: int | None = None,
) -> str:
    parts: list[str] = []
    if ttl is not None:
        parts.append(f"TTL {ttl}")
    if timestamp is not None:
        parts.append(f"TIMESTAMP {timestamp}")
    if not parts:
        return ""
    return " USING " + " AND ".join(parts)


def build_insert(
    table: str,
    keyspace: str,
    data: dict[str, Any],
    ttl: int | None = None,
    if_not_exists: bool = False,
    timestamp: int | None = None,
) -> tuple[str, list[Any]]:
    cols = list(data.keys())
    vals = list(data.values())
    cols_str = ", ".join(f'"{c}"' for c in cols)
    placeholders = ", ".join("?" * len(cols))
    cql = f"INSERT INTO {keyspace}.{table} ({cols_str}) VALUES ({placeholders})"
    if if_not_exists:
        cql += " IF NOT EXISTS"
    cql += _build_using_clause(ttl=ttl, timestamp=timestamp)
    return cql, vals


# Cache for INSERT CQL templates keyed by (table, keyspace, columns, if_not_exists).
_insert_cql_cache: dict[tuple, str] = {}


def build_insert_from_columns(
    table: str,
    keyspace: str,
    columns: tuple[str, ...],
    values: list[Any],
    ttl: int | None = None,
    if_not_exists: bool = False,
    timestamp: int | None = None,
) -> tuple[str, list[Any]]:
    """Build an INSERT statement from pre-computed column names and values.

    Like :func:`build_insert` but avoids creating an intermediate ``dict``.
    The base CQL (without ``USING`` clause) is cached per
    ``(table, keyspace, columns, if_not_exists)`` tuple.
    """
    cache_key = (table, keyspace, columns, if_not_exists)
    base_cql = _insert_cql_cache.get(cache_key)
    if base_cql is None:
        cols_str = ", ".join(f'"{c}"' for c in columns)
        placeholders = ", ".join("?" * len(columns))
        base_cql = f"INSERT INTO {keyspace}.{table} ({cols_str}) VALUES ({placeholders})"
        if if_not_exists:
            base_cql += " IF NOT EXISTS"
        _insert_cql_cache[cache_key] = base_cql
    cql = base_cql + _build_using_clause(ttl=ttl, timestamp=timestamp)
    return cql, values


def parse_update_kwargs(
    kwargs: dict[str, Any],
) -> tuple[dict[str, Any], list[tuple[str, str, Any]]]:
    """Parse update kwargs into regular set data and collection operations.

    Returns ``(set_data, collection_ops)`` where *collection_ops* is a list of
    ``(column, operator, value)`` tuples.  Supported operators: ``add``,
    ``remove``, ``append``, ``prepend``.
    """
    collection_operators = {"add", "remove", "append", "prepend"}
    set_data: dict[str, Any] = {}
    collection_ops: list[tuple[str, str, Any]] = []
    for key, value in kwargs.items():
        parts = key.rsplit("__", 1)
        if len(parts) == 2 and parts[1] in collection_operators:
            col, op = parts
            collection_ops.append((col, op, value))
        else:
            set_data[key] = value
    return set_data, collection_ops


def build_update(
    table: str,
    keyspace: str,
    set_data: dict[str, Any],
    where: list[tuple[str, str, Any]],
    ttl: int | None = None,
    if_conditions: dict[str, Any] | None = None,
    collection_ops: list[tuple[str, str, Any]] | None = None,
    if_exists: bool = False,
    timestamp: int | None = None,
) -> tuple[str, list[Any]]:
    set_parts = [f'"{k}" = ?' for k in set_data]
    params: list[Any] = list(set_data.values())

    if collection_ops:
        for col, op, value in collection_ops:
            if op in ("add", "append"):
                set_parts.append(f'"{col}" = "{col}" + ?')
                params.append(value)
            elif op == "prepend":
                set_parts.append(f'"{col}" = ? + "{col}"')
                params.append(value)
            elif op == "remove":
                set_parts.append(f'"{col}" = "{col}" - ?')
                params.append(value)

    cql = f"UPDATE {keyspace}.{table}"
    cql += _build_using_clause(ttl=ttl, timestamp=timestamp)
    cql += " SET " + ", ".join(set_parts)

    clause, where_params = build_where_clause(where)
    cql += " " + clause
    params.extend(where_params)

    if if_exists:
        cql += " IF EXISTS"
    elif if_conditions:
        cond_parts = [f'"{k}" = ?' for k in if_conditions]
        cql += " IF " + " AND ".join(cond_parts)
        params.extend(if_conditions.values())

    return cql, params


def build_delete(
    table: str,
    keyspace: str,
    where: list[tuple[str, str, Any]],
    columns: list[str] | None = None,
    if_exists: bool = False,
    timestamp: int | None = None,
) -> tuple[str, list[Any]]:
    cols_str = ", ".join(f'"{c}"' for c in columns) if columns else ""
    cql = f"DELETE {cols_str} FROM {keyspace}.{table}".replace("DELETE  FROM", "DELETE FROM")
    cql += _build_using_clause(timestamp=timestamp)

    clause, params = build_where_clause(where)
    cql += " " + clause

    if if_exists:
        cql += " IF EXISTS"

    return cql, params


def build_counter_update(
    table: str,
    keyspace: str,
    deltas: dict[str, int],
    where: list[tuple[str, str, Any]],
) -> tuple[str, list[Any]]:
    """Build an UPDATE statement for counter columns.

    Generates ``UPDATE … SET col = col + ?`` for each counter column.
    Negative delta values produce decrement operations.
    """
    set_parts = [f'"{k}" = "{k}" + ?' for k in deltas]
    params: list[Any] = list(deltas.values())

    cql = f"UPDATE {keyspace}.{table} SET " + ", ".join(set_parts)

    clause, where_params = build_where_clause(where)
    cql += " " + clause
    params.extend(where_params)

    return cql, params


def build_batch(
    statements: list[tuple[str, list[Any]]],
    logged: bool = True,
    batch_type: str | None = None,
) -> tuple[str, list[Any]]:
    if batch_type is not None:
        bt = batch_type.upper()
    else:
        bt = "" if logged else "UNLOGGED"
    all_params: list[Any] = []
    stmt_lines = []
    for stmt, p in statements:
        stmt_lines.append(stmt + ";")
        all_params.extend(p)
    inner = "\n  ".join(stmt_lines)
    prefix = f"BEGIN {bt} BATCH" if bt else "BEGIN BATCH"
    cql = f"{prefix}\n  {inner}\nAPPLY BATCH"
    return cql, all_params
