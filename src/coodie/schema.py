from __future__ import annotations

import functools
import typing
from dataclasses import dataclass
from typing import Any, get_type_hints


@functools.lru_cache(maxsize=128)
def _cached_type_hints(cls: type) -> dict[str, Any]:
    """Return ``get_type_hints(cls, include_extras=True)`` with caching.

    Type hints never change at runtime, so the result can be cached per class.
    """
    try:
        return get_type_hints(cls, include_extras=True)
    except Exception:
        return getattr(cls, "__annotations__", {})


@dataclass(slots=True)
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
    static: bool = False


def build_schema(doc_cls: type) -> list[ColumnDefinition]:
    """Inspect a Document subclass and return its ColumnDefinition list.

    Result is cached on ``doc_cls.__schema__``.
    """
    if hasattr(doc_cls, "__schema__") and doc_cls.__schema__ is not None:
        # Return cached if it's already built for this specific class (not inherited)
        if "__schema__" in doc_cls.__dict__:
            return doc_cls.__schema__

    from coodie.fields import PrimaryKey, ClusteringKey, Indexed, Counter, Static
    from coodie.types import python_type_to_cql_type_str
    from coodie.exceptions import InvalidQueryError

    hints = _cached_type_hints(doc_cls)

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
        if origin is typing.ClassVar or (hasattr(typing, "ClassVar") and str(annotation).startswith("typing.ClassVar")):
            continue

        # Extract Annotated metadata
        metadata: list[Any] = []
        if origin is typing.Annotated:
            metadata = list(args[1:])

        # Determine CQL type — pass full annotation so markers are visible
        try:
            cql_type = python_type_to_cql_type_str(annotation)
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
        is_static = False

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
            elif isinstance(meta, Static):
                is_static = True

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
                static=is_static,
            )
        )

    # Validate counter tables: non-PK/CK columns must all be counter, or none.
    counter_cols = [c for c in cols if c.cql_type == "counter"]
    if counter_cols:
        non_key_cols = [c for c in cols if not c.primary_key and not c.clustering_key]
        non_counter = [c for c in non_key_cols if c.cql_type != "counter"]
        if non_counter:
            names = ", ".join(c.name for c in non_counter)
            raise InvalidQueryError(
                f"Counter tables can only have counter and primary key columns. Non-counter data columns found: {names}"
            )

    doc_cls.__schema__ = cols
    return cols


@functools.lru_cache(maxsize=128)
def _insert_columns(doc_cls: type) -> tuple[str, ...]:
    """Return ordered column names for INSERT, cached per model class."""
    return tuple(doc_cls.model_fields.keys())


@functools.lru_cache(maxsize=128)
def _pk_columns(doc_cls: type) -> tuple[str, ...]:
    """Return primary key + clustering key column names, cached per class.

    Eliminates the per-call ``_schema()`` + list-comprehension overhead in
    ``update()`` and ``delete()``.
    """
    schema = build_schema(doc_cls)
    return tuple(c.name for c in schema if c.primary_key or c.clustering_key)


# ------------------------------------------------------------------
# Polymorphic (single-table inheritance) helpers
# ------------------------------------------------------------------


@functools.lru_cache(maxsize=128)
def _find_discriminator_column(doc_cls: type) -> str | None:
    """Return the name of the discriminator column, or ``None``."""
    from coodie.fields import Discriminator

    hints = _cached_type_hints(doc_cls)

    for field_name, annotation in hints.items():
        if field_name.startswith("_") or field_name == "Settings":
            continue
        origin = typing.get_origin(annotation)
        if origin is typing.Annotated:
            args = typing.get_args(annotation)
            for meta in args[1:]:
                if isinstance(meta, Discriminator):
                    return field_name
    return None


@functools.lru_cache(maxsize=128)
def _get_discriminator_value(doc_cls: type) -> str | None:
    """Return ``__discriminator_value__`` from *Settings*, or ``None``."""
    settings = getattr(doc_cls, "Settings", None)
    if settings is None:
        return None
    return getattr(settings, "__discriminator_value__", None)


def _own_annotations(cls: type) -> dict[str, Any]:
    """Return *only* the annotations declared directly on *cls*.

    On Python 3.14+ (PEP 749) annotations may be lazily stored via an
    ``__annotate__`` function rather than an ``__annotations__`` dict in
    ``cls.__dict__``.  Accessing ``cls.__annotations__`` (the descriptor)
    materialises them, but includes inherited annotations.  We therefore
    try ``annotationlib.get_annotations`` first (3.14+), then fall back to
    the ``__dict__`` lookup used by earlier Pythons.
    """
    try:
        import annotationlib  # Python 3.14+

        return annotationlib.get_annotations(cls, format=annotationlib.Format.FORWARDREF)
    except ImportError:
        return cls.__dict__.get("__annotations__", {})


def _resolve_polymorphic_base(doc_cls: type) -> type | None:
    """Return the class that defines the discriminator column.

    May return *doc_cls* itself.  Returns ``None`` when the hierarchy
    is not polymorphic.
    """
    disc_col = _find_discriminator_column(doc_cls)
    if disc_col is None:
        return None
    for cls in doc_cls.__mro__:
        own_annotations = _own_annotations(cls)
        if disc_col in own_annotations:
            return cls
    return None


def _build_subclass_map(base_cls: type) -> dict[str, type]:
    """Recursively build ``{discriminator_value: cls}`` for the hierarchy."""
    result: dict[str, type] = {}
    val = _get_discriminator_value(base_cls)
    if val is not None:
        result[val] = base_cls
    for sub in base_cls.__subclasses__():
        result.update(_build_subclass_map(sub))
    return result
