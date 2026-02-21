from __future__ import annotations

import typing
from dataclasses import dataclass
from typing import Any, get_type_hints


@dataclass
class ColumnDefinition:
    name: str
    cql_type: str
    primary_key: bool = False
    partition_key_index: int = 0
    clustering_key: bool = False
    clustering_key_index: int = 0
    clustering_order: str = "ASC"
    index: bool = False
    index_name: str | None = None
    required: bool = True


def build_schema(doc_cls: type) -> list[ColumnDefinition]:
    """Inspect a Document subclass and return its ColumnDefinition list.

    Result is cached on ``doc_cls.__schema__``.
    """
    if hasattr(doc_cls, "__schema__") and doc_cls.__schema__ is not None:
        # Return cached if it's already built for this specific class (not inherited)
        if "__schema__" in doc_cls.__dict__:
            return doc_cls.__schema__

    from coodie.fields import PrimaryKey, ClusteringKey, Indexed, Counter
    from coodie.types import python_type_to_cql_type_str

    try:
        hints = get_type_hints(doc_cls, include_extras=True)
    except Exception:
        hints = doc_cls.__annotations__

    cols: list[ColumnDefinition] = []

    for field_name, annotation in hints.items():
        # Skip ClassVar, private attributes, Settings inner class
        if field_name.startswith("_"):
            continue
        if field_name == "Settings":
            continue

        origin = typing.get_origin(annotation)
        args = typing.get_args(annotation)

        # Check if it's ClassVar
        if origin is typing.ClassVar or (
            hasattr(typing, "ClassVar") and str(annotation).startswith("typing.ClassVar")
        ):
            continue

        # Extract Annotated metadata
        metadata: list[Any] = []
        base_type = annotation
        if origin is typing.Annotated:
            base_type = args[0]
            metadata = list(args[1:])

        # Determine CQL type
        try:
            cql_type = python_type_to_cql_type_str(base_type)
        except Exception:
            continue

        # Defaults
        is_primary_key = False
        partition_key_index = 0
        is_clustering_key = False
        clustering_key_index = 0
        clustering_order = "ASC"
        is_indexed = False
        index_name: str | None = None

        for meta in metadata:
            if isinstance(meta, PrimaryKey):
                is_primary_key = True
                partition_key_index = meta.partition_key_index
            elif isinstance(meta, ClusteringKey):
                is_clustering_key = True
                clustering_key_index = meta.clustering_key_index
                clustering_order = meta.order
            elif isinstance(meta, Indexed):
                is_indexed = True
                index_name = meta.index_name
            elif isinstance(meta, Counter):
                cql_type = "counter"

        # Determine required: check pydantic model_fields
        required = True
        model_fields = getattr(doc_cls, "model_fields", {})
        if field_name in model_fields:
            mf = model_fields[field_name]
            required = mf.is_required()

        cols.append(
            ColumnDefinition(
                name=field_name,
                cql_type=cql_type,
                primary_key=is_primary_key,
                partition_key_index=partition_key_index,
                clustering_key=is_clustering_key,
                clustering_key_index=clustering_key_index,
                clustering_order=clustering_order,
                index=is_indexed,
                index_name=index_name,
                required=required,
            )
        )

    doc_cls.__schema__ = cols
    return cols
