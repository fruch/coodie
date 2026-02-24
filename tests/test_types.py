from __future__ import annotations

from datetime import date, datetime, time as dt_time
from decimal import Decimal
from ipaddress import IPv4Address
from typing import Annotated, Optional
from uuid import UUID

import pytest

from coodie.exceptions import InvalidQueryError
from coodie.fields import (
    Ascii,
    BigInt,
    Double,
    Frozen,
    PrimaryKey,
    SmallInt,
    Time,
    TimeUUID,
    TinyInt,
    VarInt,
)
from coodie.types import python_type_to_cql_type_str, coerce_row_none_collections


# ---- python_type_to_cql_type_str: basic types ----


@pytest.mark.parametrize(
    "python_type, expected_cql",
    [
        pytest.param(str, "text", id="str-to-text"),
        pytest.param(int, "int", id="int-to-int"),
        pytest.param(float, "float", id="float-to-float"),
        pytest.param(bool, "boolean", id="bool-to-boolean"),
        pytest.param(bytes, "blob", id="bytes-to-blob"),
        pytest.param(UUID, "uuid", id="uuid-to-uuid"),
        pytest.param(datetime, "timestamp", id="datetime-to-timestamp"),
        pytest.param(date, "date", id="date-to-date"),
        pytest.param(Decimal, "decimal", id="decimal-to-decimal"),
        pytest.param(IPv4Address, "inet", id="ipv4-to-inet"),
        pytest.param(dt_time, "time", id="time-to-time"),
        pytest.param(list[str], "list<text>", id="list-str"),
        pytest.param(set[int], "set<int>", id="set-int"),
        pytest.param(dict[str, int], "map<text, int>", id="dict-str-int"),
        pytest.param(Optional[str], "text", id="optional-str"),
        pytest.param(Annotated[UUID, PrimaryKey()], "uuid", id="annotated-unwraps"),
    ],
)
def test_python_type_to_cql_type_str(python_type, expected_cql):
    assert python_type_to_cql_type_str(python_type) == expected_cql


# ---- python_type_to_cql_type_str: extended-type markers ----


@pytest.mark.parametrize(
    "annotated_type, expected_cql",
    [
        pytest.param(Annotated[int, BigInt()], "bigint", id="bigint"),
        pytest.param(Annotated[int, SmallInt()], "smallint", id="smallint"),
        pytest.param(Annotated[int, TinyInt()], "tinyint", id="tinyint"),
        pytest.param(Annotated[int, VarInt()], "varint", id="varint"),
        pytest.param(Annotated[float, Double()], "double", id="double"),
        pytest.param(Annotated[str, Ascii()], "ascii", id="ascii"),
        pytest.param(Annotated[UUID, TimeUUID()], "timeuuid", id="timeuuid"),
        pytest.param(Annotated[dt_time, Time()], "time", id="time-marker"),
    ],
)
def test_extended_type_marker(annotated_type, expected_cql):
    assert python_type_to_cql_type_str(annotated_type) == expected_cql


# ---- python_type_to_cql_type_str: frozen types ----


@pytest.mark.parametrize(
    "annotated_type, expected_cql",
    [
        pytest.param(Annotated[list[str], Frozen()], "frozen<list<text>>", id="frozen-list"),
        pytest.param(Annotated[set[int], Frozen()], "frozen<set<int>>", id="frozen-set"),
        pytest.param(
            Annotated[dict[str, int], Frozen()],
            "frozen<map<text, int>>",
            id="frozen-map",
        ),
        pytest.param(
            Annotated[tuple[str, int], Frozen()],
            "frozen<tuple<text, int>>",
            id="frozen-tuple",
        ),
    ],
)
def test_frozen_type(annotated_type, expected_cql):
    assert python_type_to_cql_type_str(annotated_type) == expected_cql


def test_unsupported_type_raises():
    with pytest.raises(InvalidQueryError):
        python_type_to_cql_type_str(object)


def test_no_cqlengine_import():
    import sys

    assert "cassandra.cqlengine" not in sys.modules


def test_marker_with_primary_key():
    """Marker should work alongside other annotations like PrimaryKey."""
    assert python_type_to_cql_type_str(Annotated[int, PrimaryKey(), BigInt()]) == "bigint"


def test_frozen_with_marker():
    """Frozen combined with a type marker should wrap the marker's CQL type."""
    assert python_type_to_cql_type_str(Annotated[UUID, Frozen(), TimeUUID()]) == "frozen<timeuuid>"


# ---- coerce_row_none_collections tests ----


class _FakeDoc:
    """Minimal stand-in with type annotations for coercion tests."""

    tags: list[str]
    labels: set[int]
    meta: dict[str, int]
    name: str
    description: Optional[str]


@pytest.mark.parametrize(
    "field, input_val, expected",
    [
        pytest.param("tags", None, [], id="none-list-to-empty"),
        pytest.param("labels", None, set(), id="none-set-to-empty"),
        pytest.param("meta", None, {}, id="none-dict-to-empty"),
        pytest.param("tags", ["a", "b"], ["a", "b"], id="non-none-unchanged"),
        pytest.param("description", None, None, id="scalar-none-unchanged"),
    ],
)
def test_coerce_row_none_collections(field, input_val, expected):
    row = {field: input_val}
    if field == "tags":
        row.setdefault("name", "x")
    result = coerce_row_none_collections(_FakeDoc, row)
    assert result[field] == expected


def test_coerce_annotated_collection():
    """Collections wrapped in Annotated should also be coerced."""

    class _AnnotatedDoc:
        tags: Annotated[list[str], PrimaryKey()]

    row: dict = {"tags": None}
    result = coerce_row_none_collections(_AnnotatedDoc, row)
    assert result["tags"] == []


def test_coerce_optional_collection():
    """Optional[list[str]] with None should be coerced to empty list."""

    class _OptionalListDoc:
        tags: Optional[list[str]]

    row: dict = {"tags": None}
    result = coerce_row_none_collections(_OptionalListDoc, row)
    assert result["tags"] == []
