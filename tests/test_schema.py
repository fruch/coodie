from __future__ import annotations

from datetime import time as dt_time
from typing import Annotated, Optional
from uuid import UUID

import pytest
from pydantic import BaseModel

from coodie.fields import (
    BigInt,
    ClusteringKey,
    Frozen,
    Indexed,
    PrimaryKey,
    Static,
    TimeUUID,
    Counter,
)
from coodie.schema import ColumnDefinition, build_schema
from coodie.exceptions import InvalidQueryError


class SimpleDoc(BaseModel):
    id: Annotated[UUID, PrimaryKey()]
    name: str
    rating: Optional[int] = None

    class Settings:
        name = "simple_docs"
        keyspace = "test_ks"


class CompositeDoc(BaseModel):
    product_id: Annotated[UUID, PrimaryKey(partition_key_index=0)]
    category: Annotated[str, PrimaryKey(partition_key_index=1)]
    created_at: Annotated[str, ClusteringKey(order="DESC")]
    brand: Annotated[str, Indexed()]

    class Settings:
        name = "composite_docs"
        keyspace = "test_ks"


def test_build_schema_returns_list():
    schema = build_schema(SimpleDoc)
    assert isinstance(schema, list)
    assert len(schema) == 3


def test_build_schema_primary_key():
    schema = build_schema(SimpleDoc)
    id_col = next(c for c in schema if c.name == "id")
    assert id_col.primary_key is True
    assert id_col.cql_type == "uuid"


def test_build_schema_regular_column():
    schema = build_schema(SimpleDoc)
    name_col = next(c for c in schema if c.name == "name")
    assert name_col.primary_key is False
    assert name_col.cql_type == "text"


def test_build_schema_optional_column():
    schema = build_schema(SimpleDoc)
    rating_col = next(c for c in schema if c.name == "rating")
    assert rating_col.cql_type == "int"
    assert rating_col.required is False


def test_build_schema_composite_primary_key():
    schema = build_schema(CompositeDoc)
    pk_cols = sorted([c for c in schema if c.primary_key], key=lambda c: c.partition_key_index)
    assert len(pk_cols) == 2
    assert pk_cols[0].name == "product_id"
    assert pk_cols[1].name == "category"


def test_build_schema_clustering_key():
    schema = build_schema(CompositeDoc)
    ck_col = next(c for c in schema if c.clustering_key)
    assert ck_col.name == "created_at"
    assert ck_col.clustering_order == "DESC"


def test_build_schema_indexed_column():
    schema = build_schema(CompositeDoc)
    idx_col = next(c for c in schema if c.index)
    assert idx_col.name == "brand"


def test_build_schema_cached():
    schema1 = build_schema(SimpleDoc)
    schema2 = build_schema(SimpleDoc)
    assert schema1 is schema2


def test_column_definition_defaults():
    col = ColumnDefinition(name="x", cql_type="text")
    assert col.primary_key is False
    assert col.clustering_key is False
    assert col.index is False
    assert col.required is True


# ---- Phase 1: Schema tests for extended types ----


class ExtendedTypesDoc(BaseModel):
    id: Annotated[UUID, PrimaryKey()]
    big_val: Annotated[int, BigInt()]
    event_id: Annotated[UUID, TimeUUID()]
    event_time: dt_time
    tags: Annotated[list[str], Frozen()]

    class Settings:
        name = "extended_docs"
        keyspace = "test_ks"


def test_build_schema_bigint_marker():
    schema = build_schema(ExtendedTypesDoc)
    col = next(c for c in schema if c.name == "big_val")
    assert col.cql_type == "bigint"


def test_build_schema_timeuuid_marker():
    schema = build_schema(ExtendedTypesDoc)
    col = next(c for c in schema if c.name == "event_id")
    assert col.cql_type == "timeuuid"


def test_build_schema_time_scalar():
    schema = build_schema(ExtendedTypesDoc)
    col = next(c for c in schema if c.name == "event_time")
    assert col.cql_type == "time"


def test_build_schema_frozen_collection():
    schema = build_schema(ExtendedTypesDoc)
    col = next(c for c in schema if c.name == "tags")
    assert col.cql_type == "frozen<list<text>>"


class ValidCounterDoc(BaseModel):
    url: Annotated[str, PrimaryKey()]
    view_count: Annotated[int, Counter()] = 0

    class Settings:
        name = "valid_counters"
        keyspace = "test_ks"


class InvalidCounterDoc(BaseModel):
    url: Annotated[str, PrimaryKey()]
    view_count: Annotated[int, Counter()] = 0
    name: str = ""  # non-counter data column — invalid

    class Settings:
        name = "invalid_counters"
        keyspace = "test_ks"


def test_counter_table_valid_schema():
    schema = build_schema(ValidCounterDoc)
    counter_cols = [c for c in schema if c.cql_type == "counter"]
    assert len(counter_cols) == 1
    assert counter_cols[0].name == "view_count"


def test_counter_table_mixed_columns_raises():
    with pytest.raises(InvalidQueryError, match="Non-counter data columns found"):
        build_schema(InvalidCounterDoc)


# -- _insert_columns (Phase 3: Task 3.6) ---


def test_insert_columns():
    from coodie.schema import _insert_columns

    cols = _insert_columns(SimpleDoc)
    assert isinstance(cols, tuple)
    assert cols == ("id", "name", "rating")


def test_insert_columns_cached():
    from coodie.schema import _insert_columns

    cols1 = _insert_columns(SimpleDoc)
    cols2 = _insert_columns(SimpleDoc)
    assert cols1 is cols2


# ---- Phase 1: Performance optimization tests ----


def test_cached_type_hints_returns_same_object():
    """_cached_type_hints should return the same object on repeated calls."""
    from coodie.schema import _cached_type_hints

    hints1 = _cached_type_hints(SimpleDoc)
    hints2 = _cached_type_hints(SimpleDoc)
    assert hints1 is hints2


def test_find_discriminator_column_cached():
    """_find_discriminator_column is cached via @lru_cache."""
    from coodie.schema import _find_discriminator_column

    result1 = _find_discriminator_column(SimpleDoc)
    result2 = _find_discriminator_column(SimpleDoc)
    assert result1 == result2
    assert result1 is None


def test_get_discriminator_value_cached():
    """_get_discriminator_value is cached via @lru_cache."""
    from coodie.schema import _get_discriminator_value

    result1 = _get_discriminator_value(SimpleDoc)
    result2 = _get_discriminator_value(SimpleDoc)
    assert result1 == result2
    assert result1 is None


def test_column_definition_has_slots():
    """ColumnDefinition should use __slots__ via @dataclass(slots=True)."""
    col = ColumnDefinition(name="x", cql_type="text")
    assert not hasattr(col, "__dict__")


# ---- Static column tests ----


class StaticDoc(BaseModel):
    sensor_id: Annotated[str, PrimaryKey()]
    reading_time: Annotated[str, ClusteringKey()]
    sensor_name: Annotated[str, Static()] = ""
    value: float = 0.0

    class Settings:
        name = "static_docs"
        keyspace = "test_ks"


def test_build_schema_static_column():
    schema = build_schema(StaticDoc)
    col = next(c for c in schema if c.name == "sensor_name")
    assert col.static is True
    assert col.cql_type == "text"


def test_build_schema_non_static_column_default():
    schema = build_schema(StaticDoc)
    col = next(c for c in schema if c.name == "value")
    assert col.static is False


# ------------------------------------------------------------------
# Frozen collection + Indexed metadata tests
# ------------------------------------------------------------------


class FrozenIndexedDoc(BaseModel):
    id: Annotated[UUID, PrimaryKey()]
    tags: Annotated[list[str], Frozen(), Indexed()]

    class Settings:
        name = "frozen_indexed_docs"
        keyspace = "test_ks"


def test_build_schema_frozen_indexed_cql_type():
    """Frozen collection with Indexed should have frozen<> CQL type."""
    schema = build_schema(FrozenIndexedDoc)
    col = next(c for c in schema if c.name == "tags")
    assert col.cql_type == "frozen<list<text>>"


def test_build_schema_frozen_indexed_preserves_index():
    """Indexed metadata should be preserved on a frozen collection column."""
    schema = build_schema(FrozenIndexedDoc)
    col = next(c for c in schema if c.name == "tags")
    assert col.index is True


# ------------------------------------------------------------------
# _pk_columns cache tests
# ------------------------------------------------------------------


def test_pk_columns_simple():
    """_pk_columns returns only the PK column names for a simple model."""
    from coodie.schema import _pk_columns

    result = _pk_columns(SimpleDoc)
    assert result == ("id",)


def test_pk_columns_composite():
    """_pk_columns returns PK + CK names for a composite-key model."""
    from coodie.schema import _pk_columns

    result = _pk_columns(CompositeDoc)
    assert set(result) == {"product_id", "category", "created_at"}


def test_pk_columns_cached():
    """Calling _pk_columns twice returns the same cached object."""
    from coodie.schema import _pk_columns

    first = _pk_columns(SimpleDoc)
    second = _pk_columns(SimpleDoc)
    assert first is second
