"""Product Catalog models for the schema-migrations demo.

These models represent the *final* state of the schema after all four
migrations have been applied.  The migration files themselves carry the
incremental DDL changes — ``models.py`` is used by the seed script and
FastAPI app layer.
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Annotated, Optional
from uuid import UUID, uuid4

from pydantic import Field

from coodie.aio import Document
from coodie.fields import ClusteringKey, Indexed, PrimaryKey


class Product(Document):
    """A product in the catalog.

    Partition key = ``id``; secondary indexes on ``brand``, ``category``,
    and ``name`` (added by migration 004).  The ``featured`` column is
    added by migration 002.
    """

    id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)
    name: Annotated[str, Indexed()]
    brand: Annotated[str, Indexed()]
    category: Annotated[str, Indexed()]
    price: float
    description: Optional[str] = None
    tags: list[str] = Field(default_factory=list)
    featured: bool = False
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
    )

    class Settings:
        name = "products"
        keyspace = "migrations_demo"


class Review(Document):
    """A product review.

    Partition key = ``product_id``; clustering = ``created_at DESC``
    (newest-first).  Migration 003 sets a one-year default TTL on this table.
    """

    product_id: Annotated[UUID, PrimaryKey()]
    created_at: Annotated[datetime, ClusteringKey(order="DESC")] = Field(
        default_factory=lambda: datetime.now(timezone.utc),
    )
    id: UUID = Field(default_factory=uuid4)
    author: str
    rating: Annotated[int, Indexed()]
    content: Optional[str] = None

    class Settings:
        name = "reviews"
        keyspace = "migrations_demo"
