import typing
from datetime import date, datetime
from decimal import Decimal
from ipaddress import IPv4Address, IPv6Address
from typing import Any, Union
from uuid import UUID

from coodie.exceptions import InvalidQueryError

_SCALAR_CQL_TYPES: dict[type, str] = {
    str: "text",
    int: "int",
    float: "float",
    bool: "boolean",
    bytes: "blob",
    UUID: "uuid",
    datetime: "timestamp",
    date: "date",
    Decimal: "decimal",
    IPv4Address: "inet",
    IPv6Address: "inet",
}


def python_type_to_cql_type_str(annotation: Any) -> str:
    """Map a Python type annotation to its CQL type string."""
    origin = typing.get_origin(annotation)
    args = typing.get_args(annotation)

    # Annotated[X, ...] -> unwrap to X
    if origin is typing.Annotated:
        return python_type_to_cql_type_str(args[0])

    # Optional[X] == Union[X, None] -> unwrap to X
    if origin is Union:
        non_none = [a for a in args if a is not type(None)]
        if len(non_none) == 1:
            return python_type_to_cql_type_str(non_none[0])
        raise InvalidQueryError(f"Cannot map Union type {annotation} to CQL")

    # list[X] -> list<cql_type>
    if origin is list:
        inner = python_type_to_cql_type_str(args[0]) if args else "text"
        return f"list<{inner}>"

    # set[X] -> set<cql_type>
    if origin is set:
        inner = python_type_to_cql_type_str(args[0]) if args else "text"
        return f"set<{inner}>"

    # dict[K, V] -> map<k_type, v_type>
    if origin is dict:
        k = python_type_to_cql_type_str(args[0]) if args else "text"
        v = python_type_to_cql_type_str(args[1]) if len(args) > 1 else "text"
        return f"map<{k}, {v}>"

    # tuple[X, Y, ...] -> tuple<x_type, y_type, ...>
    if origin is tuple:
        if args:
            inner = ", ".join(python_type_to_cql_type_str(a) for a in args)
            return f"tuple<{inner}>"
        return "tuple<text>"

    # Scalar lookup
    if annotation in _SCALAR_CQL_TYPES:
        return _SCALAR_CQL_TYPES[annotation]

    raise InvalidQueryError(f"Cannot map Python type {annotation!r} to a CQL type")
