"""cqlengine model definitions for benchmarks.

These mirror the coodie models so that benchmarks compare equivalent schemas.
"""

from __future__ import annotations

import uuid

from cassandra.cqlengine import columns
from cassandra.cqlengine.models import Model


class CqlProduct(Model):
    """Product model — basic CRUD benchmark target."""

    __table_name__ = "bench_products"
    __keyspace__ = "bench_ks"

    id = columns.UUID(primary_key=True, default=uuid.uuid4)
    name = columns.Text(required=True)
    brand = columns.Text(index=True, default="Unknown")
    category = columns.Text(index=True, default="general")
    price = columns.Float(default=0.0)
    tags = columns.List(columns.Text)
    description = columns.Text()


class CqlReview(Model):
    """Review model — composite key benchmark target."""

    __table_name__ = "bench_reviews"
    __keyspace__ = "bench_ks"

    product_id = columns.UUID(primary_key=True)
    created_at = columns.DateTime(primary_key=True, clustering_order="DESC")
    author = columns.Text(required=True)
    rating = columns.Integer(index=True, default=0)


class CqlEvent(Model):
    """Event model — used for batch and bulk benchmarks."""

    __table_name__ = "bench_events"
    __keyspace__ = "bench_ks"

    id = columns.UUID(primary_key=True, default=uuid.uuid4)
    event_type = columns.Text(required=True)
    payload = columns.Text(default="")
