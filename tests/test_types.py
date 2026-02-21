from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal
from ipaddress import IPv4Address
from typing import Annotated, Optional
from uuid import UUID

import pytest

from coodie.exceptions import InvalidQueryError
from coodie.fields import PrimaryKey
from coodie.types import python_type_to_cql_type_str


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
