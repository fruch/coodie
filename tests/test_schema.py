from __future__ import annotations

from typing import Annotated, Optional
from uuid import UUID

from pydantic import BaseModel

from coodie.fields import ClusteringKey, Indexed, PrimaryKey
from coodie.schema import ColumnDefinition, build_schema


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
    pk_cols = sorted(
        [c for c in schema if c.primary_key], key=lambda c: c.partition_key_index
    )
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
