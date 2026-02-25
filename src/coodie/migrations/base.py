"""Migration base class and execution context."""

from __future__ import annotations

import hashlib
from pathlib import Path
from typing import Any


class MigrationContext:
    """Execution context passed to :meth:`Migration.upgrade` and :meth:`Migration.downgrade`.

    Wraps a coodie driver and provides a simple ``execute`` interface
    for running arbitrary CQL statements inside a migration.
    """

    __slots__ = ("_driver", "_dry_run", "_executed_cql")

    def __init__(self, driver: Any, *, dry_run: bool = False) -> None:
        self._driver = driver
        self._dry_run = dry_run
        self._executed_cql: list[str] = []

    async def execute(self, cql: str, params: list[Any] | None = None) -> list[dict[str, Any]]:
        """Execute a CQL statement.

        In dry-run mode the statement is recorded but not sent to the database.
        """
        self._executed_cql.append(cql)
        if self._dry_run:
            return []
        return await self._driver.execute_async(cql, params or [])

    @property
    def planned_cql(self) -> list[str]:
        """Return the list of CQL statements executed (or planned in dry-run)."""
        return list(self._executed_cql)


class Migration:
    """Base class for coodie migration files.

    Subclass this in a migration file and override :meth:`upgrade` (and
    optionally :meth:`downgrade`) to define schema or data changes.

    Example::

        from coodie.migrations import Migration

        class ForwardMigration(Migration):
            description = "Add rating column to reviews table"
            allow_destructive = False

            async def upgrade(self, ctx):
                await ctx.execute(
                    'ALTER TABLE catalog.reviews ADD "rating" int'
                )

            async def downgrade(self, ctx):
                await ctx.execute(
                    'ALTER TABLE catalog.reviews DROP "rating"'
                )
    """

    description: str = ""
    allow_destructive: bool = False
    reversible: bool = True

    async def upgrade(self, ctx: MigrationContext) -> None:
        """Apply the migration. Must be overridden."""
        raise NotImplementedError("Migration.upgrade() must be implemented")

    async def downgrade(self, ctx: MigrationContext) -> None:
        """Reverse the migration. Optional — override when reversible."""
        raise NotImplementedError("Migration.downgrade() is not implemented for this migration")

    @staticmethod
    def compute_checksum(path: Path) -> str:
        """Compute a SHA-256 checksum of a migration file."""
        return hashlib.sha256(path.read_bytes()).hexdigest()
