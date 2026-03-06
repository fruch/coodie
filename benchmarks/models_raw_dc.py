"""Raw+DC dataclass definitions for benchmarks.

These mirror the coodie / cqlengine models using plain Python dataclasses and
raw CQL — the "Raw+DC" pattern described by Michael Kennedy.

See: https://mkennedy.codes/posts/raw-dc-the-orm-pattern-of-2026/
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from uuid import UUID, uuid4


@dataclass
class RawProduct:
    """Product — basic CRUD benchmark target."""

    id: UUID = field(default_factory=uuid4)
    name: str = ""
    brand: str = "Unknown"
    category: str = "general"
    price: float = 0.0
    tags: list[str] = field(default_factory=list)
    description: str | None = None


@dataclass
class RawReview:
    """Review — composite key benchmark target."""

    product_id: UUID = field(default_factory=uuid4)
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    author: str = ""
    rating: int = 0


@dataclass
class RawEvent:
    """Event — used for batch and bulk benchmarks."""

    id: UUID = field(default_factory=uuid4)
    event_type: str = ""
    payload: str = ""
