"""Counter models for the Realtime Counters demo.

Demonstrates coodie's ``CounterDocument``:
- ``Annotated[int, Counter()]`` to declare counter columns
- ``increment(**field_deltas)`` to atomically add to counters
- ``decrement(**field_deltas)`` to atomically subtract from counters
- Counter tables forbid ``save()`` / ``insert()`` — only increments and decrements
"""

from __future__ import annotations

from typing import Annotated

from coodie.aio import CounterDocument
from coodie.fields import ClusteringKey, Counter, PrimaryKey


class PageViewCounter(CounterDocument):
    """Tracks page-view analytics per URL and date.

    Partition by ``url`` and cluster by ``date`` so you can query
    a single page's daily counters or scan all dates for a page.

    Counter columns (``view_count``, ``unique_visitors``) are updated
    exclusively via ``increment()`` / ``decrement()``.
    """

    url: Annotated[str, PrimaryKey()]
    date: Annotated[str, ClusteringKey()]
    view_count: Annotated[int, Counter()] = 0
    unique_visitors: Annotated[int, Counter()] = 0

    class Settings:
        name = "page_view_counters"
        keyspace = "analytics"
