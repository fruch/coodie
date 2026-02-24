import functools
import typing
from datetime import date, datetime, time as dt_time
from decimal import Decimal
from ipaddress import IPv4Address, IPv6Address
from typing import Any, Union
from uuid import UUID

from coodie.exceptions import InvalidQueryError
from coodie.fields import (
    Ascii,
    BigInt,
    Double,
    Frozen,
    SmallInt,
    Time,
    TimeUUID,
    TinyInt,
    VarInt,
)
from coodie.schema import _cached_type_hints

_SCALAR_CQL_TYPES: dict[type, str] = {
    str: "text",
    int: "int",
    float: "float",
    bool: "boolean",
    bytes: "blob",
    UUID: "uuid",
    datetime: "timestamp",
    date: "date",
    dt_time: "time",
    Decimal: "decimal",
    IPv4Address: "inet",
    IPv6Address: "inet",
}

# Annotation markers that override the CQL type of the base Python type.
_MARKER_CQL_OVERRIDES: dict[type, str] = {
    BigInt: "bigint",
    SmallInt: "smallint",
    TinyInt: "tinyint",
    VarInt: "varint",
    Double: "double",
    Ascii: "ascii",
    TimeUUID: "timeuuid",
    Time: "time",
}


def python_type_to_cql_type_str(annotation: Any) -> str:
    """Map a Python type annotation to its CQL type string."""
    origin = typing.get_origin(annotation)
    args = typing.get_args(annotation)

    # Annotated[X, ...] -> check for type markers, then unwrap to X
    if origin is typing.Annotated:
        has_frozen = False
        cql_override = None
        for meta in args[1:]:
            if isinstance(meta, Frozen):
                has_frozen = True
            override = _MARKER_CQL_OVERRIDES.get(type(meta))
            if override is not None:
                cql_override = override
        if cql_override is not None:
            return f"frozen<{cql_override}>" if has_frozen else cql_override
        inner = python_type_to_cql_type_str(args[0])
        return f"frozen<{inner}>" if has_frozen else inner

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


# Mapping from collection origin types to their empty factory
_COLLECTION_ORIGINS: dict[type, type] = {
    list: list,
    set: set,
    dict: dict,
    tuple: tuple,
    frozenset: frozenset,
}


def _unwrap_annotation(annotation: Any) -> Any:
    """Strip ``Annotated`` and ``Optional`` wrappers from a type annotation."""
    origin = typing.get_origin(annotation)
    args = typing.get_args(annotation)

    if origin is typing.Annotated:
        return _unwrap_annotation(args[0])

    if origin is Union:
        non_none = [a for a in args if a is not type(None)]
        if len(non_none) == 1:
            return _unwrap_annotation(non_none[0])

    return annotation


@functools.lru_cache(maxsize=128)
def _collection_fields(cls: type) -> dict[str, type]:
    """Return ``{field_name: factory}`` for fields with collection types."""
    hints = _cached_type_hints(cls)
    result: dict[str, type] = {}
    for name, ann in hints.items():
        base = _unwrap_annotation(ann)
        origin = typing.get_origin(base) or base
        factory = _COLLECTION_ORIGINS.get(origin)  # type: ignore[arg-type]
        if factory is not None:
            result[name] = factory
    return result


def coerce_row_none_collections(doc_cls: type, row: dict[str, Any]) -> dict[str, Any]:
    """Replace ``None`` values for collection-typed fields with empty collections.

    Cassandra returns ``None`` for empty collections (``list``, ``set``, ``map``).
    Pydantic rejects ``None`` for non-optional collection fields, so we coerce
    them to the appropriate empty container *before* constructing the model.
    """
    coll_fields = _collection_fields(doc_cls)
    for key, factory in coll_fields.items():
        if key in row and row[key] is None:
            row[key] = factory()

    return row
