from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


@dataclass(frozen=True)
class LWTResult:
    """Typed result for Lightweight Transaction (LWT) operations.

    Cassandra returns an ``[applied]`` boolean column for conditional writes
    (IF NOT EXISTS, IF EXISTS, IF <conditions>).  This wrapper gives callers
    a convenient way to inspect the outcome.
    """

    applied: bool
    existing: dict[str, Any] | None = None


@dataclass(frozen=True)
class PagedResult:
    """Result of a paged query.

    Holds the documents for the current page and an opaque ``paging_state``
    that can be passed back to :meth:`QuerySet.page` to fetch the next page.
    When ``paging_state`` is ``None`` there are no more pages.
    """

    data: list[Any] = field(default_factory=list)
    paging_state: bytes | None = None
