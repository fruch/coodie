"""Coodie models for the Django Task Board.

These models live in Cassandra/ScyllaDB alongside Django's default SQLite
database — a dual-database pattern where Django ORM handles auth and sessions
while coodie handles high-write task events and counters.
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Annotated
from uuid import UUID, uuid4

from pydantic import Field

from coodie.fields import ClusteringKey, Counter, Indexed, PrimaryKey
from coodie.sync import CounterDocument, Document


class TaskEvent(Document):
    """A task event in the Kanban board.

    Partition key = ``board_id``; clustering = ``created_at DESC`` (newest-first).
    Secondary index on ``status`` for filtering by column.
    """

    board_id: Annotated[UUID, PrimaryKey()]
    created_at: Annotated[datetime, ClusteringKey(order="DESC")] = Field(
        default_factory=lambda: datetime.now(timezone.utc),
    )
    id: UUID = Field(default_factory=uuid4)
    title: str
    description: str = ""
    status: Annotated[str, Indexed()] = "todo"
    assignee: str = ""
    priority: str = "medium"
    sprint: int = 1

    class Settings:
        name = "task_events"
        keyspace = "taskboard"


class TaskCounter(CounterDocument):
    """Live counter columns for task statistics.

    Tracks the number of tasks in each status column per board.
    Uses Cassandra counter columns for atomic increment/decrement.
    """

    board_id: Annotated[UUID, PrimaryKey()]
    status: Annotated[str, ClusteringKey()]
    count: Annotated[int, Counter()] = 0

    class Settings:
        name = "task_counters"
        keyspace = "taskboard"
