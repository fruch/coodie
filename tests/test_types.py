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


def test_str_to_text():
    assert python_type_to_cql_type_str(str) == "text"


def test_int_to_int():
    assert python_type_to_cql_type_str(int) == "int"


def test_float_to_float():
    assert python_type_to_cql_type_str(float) == "float"


def test_bool_to_boolean():
    assert python_type_to_cql_type_str(bool) == "boolean"


def test_bytes_to_blob():
    assert python_type_to_cql_type_str(bytes) == "blob"


def test_uuid_to_uuid():
    assert python_type_to_cql_type_str(UUID) == "uuid"


def test_datetime_to_timestamp():
    assert python_type_to_cql_type_str(datetime) == "timestamp"


def test_date_to_date():
    assert python_type_to_cql_type_str(date) == "date"


def test_decimal_to_decimal():
    assert python_type_to_cql_type_str(Decimal) == "decimal"


def test_ipv4_to_inet():
    assert python_type_to_cql_type_str(IPv4Address) == "inet"


def test_list_str():
    assert python_type_to_cql_type_str(list[str]) == "list<text>"


def test_set_int():
    assert python_type_to_cql_type_str(set[int]) == "set<int>"


def test_dict_str_int():
    assert python_type_to_cql_type_str(dict[str, int]) == "map<text, int>"


def test_optional_str():
    assert python_type_to_cql_type_str(Optional[str]) == "text"


def test_annotated_unwraps():
    assert python_type_to_cql_type_str(Annotated[UUID, PrimaryKey()]) == "uuid"


def test_unsupported_type_raises():
    with pytest.raises(InvalidQueryError):
        python_type_to_cql_type_str(object)


def test_no_cqlengine_import():
    import sys

    assert "cassandra.cqlengine" not in sys.modules


# ---- coerce_row_none_collections tests ----


class _FakeDoc:
    """Minimal stand-in with type annotations for coercion tests."""

    tags: list[str]
    labels: set[int]
    meta: dict[str, int]
    name: str
    description: Optional[str]


def test_coerce_none_list_to_empty_list():
    row: dict = {"tags": None, "name": "x"}
    result = coerce_row_none_collections(_FakeDoc, row)
    assert result["tags"] == []
    assert result["name"] == "x"


def test_coerce_none_set_to_empty_set():
    row: dict = {"labels": None}
    result = coerce_row_none_collections(_FakeDoc, row)
    assert result["labels"] == set()


def test_coerce_none_dict_to_empty_dict():
    row: dict = {"meta": None}
    result = coerce_row_none_collections(_FakeDoc, row)
    assert result["meta"] == {}


def test_coerce_leaves_non_none_collections_alone():
    row: dict = {"tags": ["a", "b"], "name": "x"}
    result = coerce_row_none_collections(_FakeDoc, row)
    assert result["tags"] == ["a", "b"]


def test_coerce_leaves_scalar_none_alone():
    row: dict = {"description": None}
    result = coerce_row_none_collections(_FakeDoc, row)
    assert result["description"] is None


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


# ---- Phase 1: Extended type system tests ----


def test_time_to_time():
    assert python_type_to_cql_type_str(dt_time) == "time"


def test_bigint_marker():
    assert python_type_to_cql_type_str(Annotated[int, BigInt()]) == "bigint"


def test_smallint_marker():
    assert python_type_to_cql_type_str(Annotated[int, SmallInt()]) == "smallint"


def test_tinyint_marker():
    assert python_type_to_cql_type_str(Annotated[int, TinyInt()]) == "tinyint"


def test_varint_marker():
    assert python_type_to_cql_type_str(Annotated[int, VarInt()]) == "varint"


def test_double_marker():
    assert python_type_to_cql_type_str(Annotated[float, Double()]) == "double"


def test_ascii_marker():
    assert python_type_to_cql_type_str(Annotated[str, Ascii()]) == "ascii"


def test_timeuuid_marker():
    assert python_type_to_cql_type_str(Annotated[UUID, TimeUUID()]) == "timeuuid"


def test_time_marker():
    assert python_type_to_cql_type_str(Annotated[dt_time, Time()]) == "time"


def test_frozen_list():
    assert python_type_to_cql_type_str(Annotated[list[str], Frozen()]) == "frozen<list<text>>"


def test_frozen_set():
    assert python_type_to_cql_type_str(Annotated[set[int], Frozen()]) == "frozen<set<int>>"


def test_frozen_map():
    assert (
        python_type_to_cql_type_str(Annotated[dict[str, int], Frozen()])
        == "frozen<map<text, int>>"
    )


def test_frozen_tuple():
    assert (
        python_type_to_cql_type_str(Annotated[tuple[str, int], Frozen()])
        == "frozen<tuple<text, int>>"
    )


def test_marker_with_primary_key():
    """Marker should work alongside other annotations like PrimaryKey."""
    assert (
        python_type_to_cql_type_str(Annotated[int, PrimaryKey(), BigInt()]) == "bigint"
    )


def test_frozen_with_marker():
    """Frozen combined with a type marker should wrap the marker's CQL type."""
    assert (
        python_type_to_cql_type_str(Annotated[UUID, Frozen(), TimeUUID()])
        == "frozen<timeuuid>"
    )
