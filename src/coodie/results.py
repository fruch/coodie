from __future__ import annotations

from dataclasses import dataclass
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
