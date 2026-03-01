"""Session models for the TTL Sessions demo.

Demonstrates two TTL patterns:
- ``__default_ttl__`` on ``Settings`` — every row written to this table
  expires after the default TTL unless overridden at write time.
- ``ttl=`` on individual ``save()`` calls — per-record TTL override.
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Annotated
from uuid import UUID, uuid4

from pydantic import Field

from coodie.aio import Document
from coodie.fields import PrimaryKey


class Session(Document):
    """An ephemeral user session stored with a default TTL.

    ``__default_ttl__ = 300`` means every row expires after 5 minutes
    unless a shorter TTL is supplied at write time via ``session.save(ttl=30)``.
    """

    token: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)
    user_name: str
    memory_fragment: str
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
    )
    ttl_seconds: int = 300
    """TTL in seconds stored alongside the row (informational; actual expiry
    is enforced by ScyllaDB via the CQL TTL mechanism)."""

    class Settings:
        name = "sessions"
        keyspace = "ephemera"
        __default_ttl__ = 300
