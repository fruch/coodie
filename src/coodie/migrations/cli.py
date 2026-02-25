"""``coodie migrate`` CLI — apply, rollback, and inspect migrations.

Usage::

    coodie migrate                      # apply all pending migrations
    coodie migrate --dry-run            # show planned CQL without applying
    coodie migrate --target 20260203_002  # apply up to a specific migration
    coodie migrate --rollback --steps 1 # rollback the last migration
    coodie migrate --status             # show migration status
"""

from __future__ import annotations

import argparse
import asyncio
import sys
from typing import Any


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="coodie",
        description="coodie migration management CLI",
    )
    sub = parser.add_subparsers(dest="command")

    migrate = sub.add_parser("migrate", help="Apply or manage migrations")
    migrate.add_argument(
        "--hosts",
        nargs="+",
        default=["127.0.0.1"],
        help="Cassandra/ScyllaDB contact points (default: 127.0.0.1)",
    )
    migrate.add_argument(
        "--keyspace",
        required=True,
        help="Target keyspace",
    )
    migrate.add_argument(
        "--migrations-dir",
        default="migrations",
        help="Path to migration files directory (default: migrations)",
    )
    migrate.add_argument(
        "--dry-run",
        action="store_true",
        help="Show planned CQL without executing",
    )
    migrate.add_argument(
        "--status",
        action="store_true",
        help="Show migration status",
    )
    migrate.add_argument(
        "--rollback",
        action="store_true",
        help="Rollback migrations",
    )
    migrate.add_argument(
        "--steps",
        type=int,
        default=1,
        help="Number of migrations to rollback (default: 1)",
    )
    migrate.add_argument(
        "--target",
        type=str,
        default=None,
        help="Stop after applying migration matching this prefix",
    )
    migrate.add_argument(
        "--driver-type",
        default="scylla",
        choices=["scylla", "cassandra"],
        help="Driver type (default: scylla)",
    )

    return parser


async def _run_migrate(args: argparse.Namespace) -> int:
    """Execute the ``migrate`` subcommand."""
    from coodie.drivers import init_coodie
    from coodie.migrations.runner import MigrationRunner

    driver = init_coodie(
        hosts=args.hosts,
        keyspace=args.keyspace,
        driver_type=args.driver_type,
    )

    runner = MigrationRunner(
        driver=driver,
        keyspace=args.keyspace,
        migrations_dir=args.migrations_dir,
    )

    try:
        if args.status:
            return await _show_status(runner)
        elif args.rollback:
            return await _do_rollback(runner, steps=args.steps, dry_run=args.dry_run)
        else:
            return await _do_apply(runner, dry_run=args.dry_run, target=args.target)
    finally:
        driver.close()


async def _show_status(runner: Any) -> int:
    statuses = await runner.status()
    if not statuses:
        print("No migrations found.")
        return 0

    print(f"{'Status':<10} {'Migration':<50} {'Applied At'}")
    print("-" * 90)
    for s in statuses:
        marker = "[x]" if s["applied"] else "[ ]"
        applied_at = str(s["applied_at"] or "")
        print(f"{marker:<10} {s['name']:<50} {applied_at}")
    return 0


async def _do_apply(runner: Any, *, dry_run: bool, target: str | None) -> int:
    results = await runner.apply(dry_run=dry_run, target=target)
    if not results:
        print("No pending migrations.")
        return 0

    prefix = "[DRY RUN] " if dry_run else ""
    for r in results:
        print(f"{prefix}Applied: {r['name']}")
        if r["description"]:
            print(f"  {r['description']}")
        if dry_run and r["planned_cql"]:
            print("  Planned CQL:")
            for cql in r["planned_cql"]:
                print(f"    {cql}")
    return 0


async def _do_rollback(runner: Any, *, steps: int, dry_run: bool) -> int:
    results = await runner.rollback(steps=steps, dry_run=dry_run)
    if not results:
        print("No migrations to roll back.")
        return 0

    prefix = "[DRY RUN] " if dry_run else ""
    for r in results:
        print(f"{prefix}Rolled back: {r['name']}")
        if r["description"]:
            print(f"  {r['description']}")
        if dry_run and r["planned_cql"]:
            print("  Planned CQL:")
            for cql in r["planned_cql"]:
                print(f"    {cql}")
    return 0


def main(argv: list[str] | None = None) -> int:
    """Entry point for the ``coodie`` CLI."""
    parser = _build_parser()
    args = parser.parse_args(argv)

    if args.command is None:
        parser.print_help()
        return 1

    if args.command == "migrate":
        return asyncio.run(_run_migrate(args))

    parser.print_help()
    return 1


if __name__ == "__main__":
    sys.exit(main())
