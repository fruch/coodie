"""Session document definitions for the coodie TTL Sessions demo."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Annotated, Optional
from uuid import UUID, uuid4

from pydantic import Field

from coodie.aio import Document
from coodie.fields import PrimaryKey


class Session(Document):
    """An ephemeral memory session stored with a TTL.

    Partition key = ``token`` (a short alphanumeric session ID).
    The ``__default_ttl__ = 30`` setting makes the entire table default to
    30-second expiry — rows auto-delete without any application-side cleanup.

    Individual ``save(ttl=N)`` calls can override the table default to
    demonstrate per-save TTL control.
    """

    token: Annotated[str, PrimaryKey()]
    user_id: UUID = Field(default_factory=uuid4)
    memory: str
    dimension: str = "Dimension-4"
    stolen_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
    )
    ttl_seconds: Optional[int] = None  # stored for display; actual TTL is in Cassandra

    class Settings:
        name = "sessions"
        keyspace = "ephemera"
        __default_ttl__ = 30  # table-level default: every row expires in 30 s
