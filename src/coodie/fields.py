from dataclasses import dataclass


@dataclass(frozen=True)
class PrimaryKey:
    """Annotated marker: partition key column.

    Use ``partition_key_index`` to define composite partition keys::

        product_id: Annotated[UUID, PrimaryKey(partition_key_index=0)]
        category:   Annotated[str,  PrimaryKey(partition_key_index=1)]
    """

    partition_key_index: int = 0


@dataclass(frozen=True)
class ClusteringKey:
    """Annotated marker: clustering column.

    Args:
        order: ``"ASC"`` (default) or ``"DESC"``.
        clustering_key_index: Position within the clustering key (0-based).
    """

    order: str = "ASC"
    clustering_key_index: int = 0


@dataclass(frozen=True)
class Indexed:
    """Annotated marker: create a secondary index on this column."""

    index_name: str | None = None


@dataclass(frozen=True)
class Counter:
    """Annotated marker: counter column."""


@dataclass(frozen=True)
class BigInt:
    """Annotated marker: maps ``int`` to CQL ``bigint``."""


@dataclass(frozen=True)
class SmallInt:
    """Annotated marker: maps ``int`` to CQL ``smallint``."""


@dataclass(frozen=True)
class TinyInt:
    """Annotated marker: maps ``int`` to CQL ``tinyint``."""


@dataclass(frozen=True)
class VarInt:
    """Annotated marker: maps ``int`` to CQL ``varint``."""


@dataclass(frozen=True)
class Double:
    """Annotated marker: maps ``float`` to CQL ``double``."""


@dataclass(frozen=True)
class Ascii:
    """Annotated marker: maps ``str`` to CQL ``ascii``."""


@dataclass(frozen=True)
class TimeUUID:
    """Annotated marker: maps ``UUID`` to CQL ``timeuuid``."""


@dataclass(frozen=True)
class Time:
    """Annotated marker: maps to CQL ``time``."""


@dataclass(frozen=True)
class Static:
    """Annotated marker: declares a column as ``STATIC``.

    Static columns are shared across all rows within a partition.
    They can only appear on tables that have at least one clustering column.
    """


@dataclass(frozen=True)
class Frozen:
    """Annotated marker: wraps a collection or UDT type with ``frozen<>``."""


@dataclass(frozen=True)
class Discriminator:
    """Annotated marker: discriminator column for polymorphic (single-table inheritance) models."""
