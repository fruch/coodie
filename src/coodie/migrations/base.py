"""Migration base class and execution context."""

from __future__ import annotations

import asyncio
import hashlib
import logging
from collections.abc import AsyncIterator
from pathlib import Path
from typing import Any

logger = logging.getLogger("coodie")

# Cassandra/ScyllaDB murmur3 token range
_TOKEN_MIN = -(2**63)
_TOKEN_MAX = 2**63 - 1


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

    # ------------------------------------------------------------------
    # D.1–D.4 — Data migration helpers
    # ------------------------------------------------------------------

    async def _get_partition_key_columns(self, keyspace: str, table: str) -> list[str]:
        """Query ``system_schema.columns`` to discover partition key column names."""
        rows = await self._driver.execute_async(
            "SELECT column_name, position FROM system_schema.columns "
            "WHERE keyspace_name = ? AND table_name = ? AND kind = 'partition_key'",
            [keyspace, table],
        )
        if not rows:
            raise ValueError(f"No partition key columns found for {keyspace}.{table}")
        rows.sort(key=lambda r: r.get("position", 0))
        return [r["column_name"] for r in rows]

    async def scan_table(
        self,
        keyspace: str,
        table: str,
        *,
        page_size: int = 1000,
        num_ranges: int = 1000,
        resume_token: int | None = None,
        throttle_seconds: float = 0.0,
    ) -> AsyncIterator[dict[str, Any]]:
        """Iterate over all rows in a table using token-range queries.

        Uses ``token()`` on the partition key to walk through the full
        token ring in *num_ranges* sub-ranges, fetching at most
        *page_size* rows per query.  Rows are yielded one at a time so
        the entire table is never loaded into memory.

        Parameters
        ----------
        keyspace:
            Keyspace containing the target table.
        table:
            Table name.
        page_size:
            Maximum rows per token-range query (``LIMIT``).
        num_ranges:
            Number of sub-ranges to divide the token ring into.
        resume_token:
            If provided, skip all ranges whose start token is ``<=``
            this value.  Useful for resuming a failed migration from
            where it stopped.
        throttle_seconds:
            If ``> 0``, sleep this many seconds between each token-range
            query to avoid overloading the cluster.

        Yields
        ------
        dict[str, Any]
            One row at a time from the table.

        Notes
        -----
        In dry-run mode the scan is skipped entirely and a single
        placeholder row ``{"__dry_run__": True}`` is yielded.
        """
        if self._dry_run:
            self._executed_cql.append(f"-- scan_table {keyspace}.{table} (dry-run)")
            yield {"__dry_run__": True}
            return

        pk_cols = await self._get_partition_key_columns(keyspace, table)
        token_expr = f"token({', '.join(pk_cols)})"

        # Build sub-range boundaries
        range_size = (_TOKEN_MAX - _TOKEN_MIN) // num_ranges
        boundaries: list[int] = []
        for i in range(num_ranges):
            boundaries.append(_TOKEN_MIN + range_size * i)
        boundaries.append(_TOKEN_MAX)

        total_ranges = len(boundaries) - 1
        ranges_done = 0

        for i in range(total_ranges):
            range_start = boundaries[i]
            range_end = boundaries[i + 1]

            # D.3 — Resume-from-token: skip already-processed ranges
            if resume_token is not None and range_start <= resume_token:
                ranges_done += 1
                continue

            cql = f"SELECT * FROM {keyspace}.{table} WHERE {token_expr} > ? AND {token_expr} <= ? LIMIT {page_size}"
            self._executed_cql.append(cql)

            rows = await self._driver.execute_async(cql, [range_start, range_end])
            for row in rows:
                yield row

            ranges_done += 1

            # D.2 — Progress reporting
            pct = (ranges_done / total_ranges) * 100
            if ranges_done % max(1, total_ranges // 10) == 0 or ranges_done == total_ranges:
                logger.info(
                    "scan_table %s.%s — %d/%d ranges (%.1f%%), last_token=%d",
                    keyspace,
                    table,
                    ranges_done,
                    total_ranges,
                    pct,
                    range_end,
                )

            # D.4 — Rate limiting / throttle
            if throttle_seconds > 0:
                await asyncio.sleep(throttle_seconds)


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
