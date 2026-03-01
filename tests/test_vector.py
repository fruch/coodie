"""Tests for vector column support: type mapping, schema, DDL, ANN queries, and validation."""

from __future__ import annotations

from typing import Annotated
from uuid import UUID, uuid4

import pytest
from pydantic import BaseModel, Field

from coodie.cql_builder import (
    build_create_table,
    build_create_vector_index,
    build_select,
    _select_cql_cache,
)
from coodie.exceptions import InvalidQueryError
from coodie.fields import PrimaryKey, Vector, VectorIndex
from coodie.schema import ColumnDefinition, build_schema, _vector_columns
from coodie.types import python_type_to_cql_type_str
from tests.conftest import _maybe_await


# ------------------------------------------------------------------
# Type mapping tests
# ------------------------------------------------------------------


def test_vector_type_mapping_3d():
    ann = Annotated[list[float], Vector(dimensions=3)]
    assert python_type_to_cql_type_str(ann) == "vector<float, 3>"


def test_vector_type_mapping_384d():
    ann = Annotated[list[float], Vector(dimensions=384)]
    assert python_type_to_cql_type_str(ann) == "vector<float, 384>"


def test_vector_type_mapping_with_pk():
    ann = Annotated[list[float], PrimaryKey(), Vector(dimensions=5)]
    assert python_type_to_cql_type_str(ann) == "vector<float, 5>"


# ------------------------------------------------------------------
# Schema tests
# ------------------------------------------------------------------


class VectorDoc(BaseModel):
    id: Annotated[UUID, PrimaryKey()]
    name: str
    embedding: Annotated[list[float], Vector(dimensions=3), VectorIndex(similarity_function="COSINE")]

    class Settings:
        name = "vector_docs"
        keyspace = "test_ks"


class VectorDocNoIndex(BaseModel):
    id: Annotated[UUID, PrimaryKey()]
    embedding: Annotated[list[float], Vector(dimensions=5)]

    class Settings:
        name = "vector_no_idx"
        keyspace = "test_ks"


def test_build_schema_vector_column_type():
    schema = build_schema(VectorDoc)
    col = next(c for c in schema if c.name == "embedding")
    assert col.cql_type == "vector<float, 3>"


def test_build_schema_vector_index_flag():
    schema = build_schema(VectorDoc)
    col = next(c for c in schema if c.name == "embedding")
    assert col.vector_index is True
    assert col.vector_index_options == {"similarity_function": "COSINE"}


def test_build_schema_vector_no_index():
    schema = build_schema(VectorDocNoIndex)
    col = next(c for c in schema if c.name == "embedding")
    assert col.cql_type == "vector<float, 5>"
    assert col.vector_index is False
    assert col.vector_index_options is None


def test_vector_columns_helper():
    result = _vector_columns(VectorDoc)
    assert result == (("embedding", 3),)


def test_vector_columns_helper_no_vectors():
    class PlainDoc(BaseModel):
        id: Annotated[UUID, PrimaryKey()]
        name: str

        class Settings:
            name = "plain"
            keyspace = "test_ks"

    result = _vector_columns(PlainDoc)
    assert result == ()


# ------------------------------------------------------------------
# DDL tests
# ------------------------------------------------------------------


def test_build_create_table_vector_column():
    cols = [
        ColumnDefinition(name="id", cql_type="uuid", primary_key=True),
        ColumnDefinition(name="embedding", cql_type="vector<float, 3>"),
    ]
    cql = build_create_table("products", "ks", cols)
    assert '"embedding" vector<float, 3>' in cql


def test_build_create_vector_index_cosine():
    col = ColumnDefinition(
        name="embedding",
        cql_type="vector<float, 3>",
        vector_index=True,
        vector_index_options={"similarity_function": "COSINE"},
    )
    cql = build_create_vector_index("products", "ks", col)
    assert "CREATE CUSTOM INDEX IF NOT EXISTS products_embedding_idx" in cql
    assert 'ON ks.products ("embedding")' in cql
    assert "USING 'StorageAttachedIndex'" in cql
    assert "'similarity_function': 'COSINE'" in cql


def test_build_create_vector_index_euclidean():
    col = ColumnDefinition(
        name="embedding",
        cql_type="vector<float, 5>",
        vector_index=True,
        vector_index_options={"similarity_function": "EUCLIDEAN"},
    )
    cql = build_create_vector_index("products", "ks", col)
    assert "'similarity_function': 'EUCLIDEAN'" in cql


def test_build_create_vector_index_no_options():
    col = ColumnDefinition(
        name="embedding",
        cql_type="vector<float, 3>",
        vector_index=True,
    )
    cql = build_create_vector_index("products", "ks", col)
    assert "USING 'StorageAttachedIndex'" in cql
    assert "WITH OPTIONS" not in cql


# ------------------------------------------------------------------
# ANN query tests
# ------------------------------------------------------------------


def test_build_select_ann_of():
    _select_cql_cache.clear()
    cql, params = build_select(
        "products",
        "ks",
        ann_of=("embedding", [0.1, 0.2, 0.3]),
        limit=5,
    )
    assert 'ORDER BY "embedding" ANN OF ?' in cql
    assert "LIMIT 5" in cql
    assert params == [[0.1, 0.2, 0.3]]


def test_build_select_ann_with_where():
    _select_cql_cache.clear()
    cql, params = build_select(
        "products",
        "ks",
        where=[("category", "=", "electronics")],
        ann_of=("embedding", [0.1, 0.2]),
        limit=10,
    )
    assert 'WHERE "category" = ?' in cql
    assert 'ORDER BY "embedding" ANN OF ?' in cql
    assert params == ["electronics", [0.1, 0.2]]


def test_build_select_ann_caching():
    _select_cql_cache.clear()
    cql1, p1 = build_select("t", "ks", ann_of=("emb", [0.1, 0.2]), limit=5)
    cql2, p2 = build_select("t", "ks", ann_of=("emb", [0.3, 0.4]), limit=5)
    assert cql1 == cql2
    assert p1 == [[0.1, 0.2]]
    assert p2 == [[0.3, 0.4]]


# ------------------------------------------------------------------
# QuerySet order_by_ann tests
# ------------------------------------------------------------------


@pytest.fixture(params=["sync", "async"])
def variant(request):
    return request.param


@pytest.fixture
def document_cls(variant):
    if variant == "sync":
        from coodie.sync.document import Document
        return Document
    from coodie.aio.document import Document
    return Document


@pytest.fixture
def queryset_cls(variant):
    if variant == "sync":
        from coodie.sync.query import QuerySet
        return QuerySet
    from coodie.aio.query import QuerySet
    return QuerySet


@pytest.fixture
def EmbeddingDoc(document_cls):
    class EmbeddingDoc(document_cls):
        id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)
        name: str = ""
        embedding: Annotated[list[float], Vector(dimensions=3)] = Field(default_factory=list)

        class Settings:
            name = "embedding_docs"
            keyspace = "test_ks"

    return EmbeddingDoc


def test_order_by_ann_returns_new_queryset(EmbeddingDoc, queryset_cls, registered_mock_driver):
    qs = queryset_cls(EmbeddingDoc)
    qs2 = qs.order_by_ann("embedding", [0.1, 0.2, 0.3])
    assert qs is not qs2
    assert qs2._ann_of_val == ("embedding", [0.1, 0.2, 0.3])


async def test_order_by_ann_generates_correct_cql(EmbeddingDoc, queryset_cls, registered_mock_driver):
    registered_mock_driver.set_return_rows([])
    qs = queryset_cls(EmbeddingDoc).order_by_ann("embedding", [0.1, 0.2, 0.3]).limit(5)
    await _maybe_await(qs.all)
    cql, _ = registered_mock_driver.executed[-1]
    assert 'ORDER BY "embedding" ANN OF ?' in cql
    assert "LIMIT 5" in cql


# ------------------------------------------------------------------
# Dimension validation tests
# ------------------------------------------------------------------


@pytest.fixture
def VecDoc(document_cls):
    class VecDoc(document_cls):
        id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)
        embedding: Annotated[list[float], Vector(dimensions=3)] = Field(default_factory=list)

        class Settings:
            name = "vec_docs"
            keyspace = "test_ks"

    return VecDoc


async def test_save_validates_vector_dimensions(VecDoc, registered_mock_driver):
    doc = VecDoc(embedding=[0.1, 0.2])
    with pytest.raises(InvalidQueryError, match="expects 3 dimensions, got 2"):
        await _maybe_await(doc.save)


async def test_save_allows_correct_dimensions(VecDoc, registered_mock_driver):
    doc = VecDoc(embedding=[0.1, 0.2, 0.3])
    await _maybe_await(doc.save)
    assert len(registered_mock_driver.executed) == 1


async def test_save_allows_empty_vector(VecDoc, registered_mock_driver):
    """Empty list (len 0) is rejected because 0 != 3."""
    doc = VecDoc(embedding=[])
    with pytest.raises(InvalidQueryError, match="expects 3 dimensions, got 0"):
        await _maybe_await(doc.save)


# ------------------------------------------------------------------
# ColumnDefinition defaults for vector fields
# ------------------------------------------------------------------


def test_column_definition_vector_defaults():
    col = ColumnDefinition(name="emb", cql_type="vector<float, 3>")
    assert col.vector_index is False
    assert col.vector_index_options is None
