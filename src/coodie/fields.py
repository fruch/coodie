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
