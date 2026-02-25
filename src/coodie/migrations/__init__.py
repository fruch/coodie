"""coodie migration framework — production-grade schema evolution for Cassandra/ScyllaDB.

Provides:

- :class:`Migration` — base class for migration files with ``upgrade`` / ``downgrade``
- :class:`MigrationContext` — execution context passed to migration methods
- :func:`discover_migrations` — find and order migration files in a directory
- :class:`MigrationRunner` — apply, rollback, and track migrations
"""

from __future__ import annotations

from coodie.migrations.base import Migration, MigrationContext
from coodie.migrations.runner import MigrationRunner, discover_migrations

__all__ = [
    "Migration",
    "MigrationContext",
    "MigrationRunner",
    "discover_migrations",
]
