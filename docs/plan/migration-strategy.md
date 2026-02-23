# coodie Migration Strategy

> **Goal:** Define how coodie handles production schema evolution for
> ScyllaDB / Cassandra tables — comparing with cqlengine's current approach
> and drawing inspiration from Beanie ODM, Django, and Alembic.

---

## Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [How cqlengine Handles It Today](#2-how-cqlengine-handles-it-today)
3. [How Other ODMs / ORMs Handle Migrations](#3-how-other-odms--orms-handle-migrations)
   - [3.1 Beanie ODM (MongoDB)](#31-beanie-odm-mongodb)
   - [3.2 Django ORM](#32-django-orm)
   - [3.3 SQLAlchemy + Alembic](#33-sqlalchemy--alembic)
4. [Cassandra / ScyllaDB Schema Constraints](#4-cassandra--scylladb-schema-constraints)
5. [coodie Migration Design](#5-coodie-migration-design)
   - [5.1 Design Principles](#51-design-principles)
   - [5.2 Three-Tier Approach](#52-three-tier-approach)
   - [5.3 Tier 1 — Automatic `sync_table` (Dev & Simple Changes)](#53-tier-1--automatic-sync_table-dev--simple-changes)
   - [5.4 Tier 2 — Migration Files (Production Schema Changes)](#54-tier-2--migration-files-production-schema-changes)
   - [5.5 Tier 3 — Data Migrations (Complex Transforms)](#55-tier-3--data-migrations-complex-transforms)
   - [5.6 CLI Interface](#56-cli-interface)
   - [5.7 Migration State Tracking](#57-migration-state-tracking)
   - [5.8 Safety Features](#58-safety-features)
6. [Comparison: coodie vs cqlengine](#6-comparison-coodie-vs-cqlengine)
7. [Implementation Phases](#7-implementation-phases)
8. [References](#8-references)

---

## 1. Problem Statement

In production Cassandra / ScyllaDB deployments, table schemas evolve over
time — new columns are added, columns are dropped, table options change,
and sometimes data must be transformed to fit new structures.

Today, cqlengine's only tool is `sync_table()`, which silently applies
additive changes but ignores everything else.  Teams resort to ad-hoc CQL
scripts, losing traceability and risking partial migrations.

coodie needs a **safe, auditable, and Cassandra-aware migration system**
that works in CI/CD pipelines and multi-node production clusters.

---

## 2. How cqlengine Handles It Today

cqlengine provides a single function:
[`cassandra.cqlengine.management.sync_table(Model)`](https://python-driver.readthedocs.io/en/stable/api/cassandra/cqlengine/management.html)

### What `sync_table` does

| Operation | Supported | Notes |
|---|---|---|
| Create table if missing | ✅ | `CREATE TABLE IF NOT EXISTS …` |
| Add new columns | ✅ | `ALTER TABLE … ADD col type` |
| Drop columns | ❌ | Silently ignored |
| Rename columns | ❌ | Silently ignored |
| Change column types | ❌ | Silently ignored |
| Change primary key | ❌ | Impossible in CQL; silently ignored |
| Update table options | ❌ | Silently ignored |
| Create secondary indexes | ✅ | `CREATE INDEX IF NOT EXISTS …` |
| Track applied changes | ❌ | No history; re-runs are idempotent but untracked |
| Rollback / downgrade | ❌ | Not supported |
| Data migration | ❌ | Not supported |

### cqlengine Limitations

- **No visibility:** There is no record of what schema changes have been
  applied or when. Operators must inspect the database manually.
- **No destructive changes:** Removing a field from the Python model does
  not drop the corresponding column. This leads to schema drift where the
  database carries abandoned columns indefinitely.
- **No safety net:** `sync_table` runs `ALTER TABLE` from any client at any
  time. Concurrent calls from multiple application instances can cause schema
  disagreement across the cluster.
- **No data migration support:** Changing data format (e.g. splitting a
  `name` column into `first_name` / `last_name`) requires hand-written
  scripts with no framework support.
- **No CI/CD integration:** There is no way to preview, review, or approve
  schema changes before they reach production.

---

## 3. How Other ODMs / ORMs Handle Migrations

### 3.1 Beanie ODM (MongoDB)

[Beanie](https://beanie-odm.dev/tutorial/migrations/) is a Pydantic-based
async ODM for MongoDB — the direct inspiration for coodie's API design.

**Key concepts:**

- **Migration files** — timestamped Python files in a dedicated directory,
  each defining `Forward` and `Backward` classes.
- **Iterative migrations** — `@iterative_migration()` decorator receives an
  `input_document` (old model) and `output_document` (new model) and
  transforms documents one by one.
- **Free-fall migrations** — `@free_fall_migration()` gives direct access to
  the MongoDB session for complex operations (aggregation pipelines, cross-
  collection moves, etc.).
- **CLI** — `beanie new-migration` scaffolds a migration file;
  `beanie migrate` applies pending migrations; `--backward` rolls back.
- **Transactions** — migrations run inside MongoDB transactions (requires a
  replica set) for atomicity.

**Strengths:** Familiar Django-like workflow; reversible; works with async.
**Weaknesses:** Requires MongoDB replica set for transactions; iterative
migrations can be slow on large collections.

### 3.2 Django ORM

- **Auto-generation:** `makemigrations` diffs models against the last known
  state and generates migration scripts automatically.
- **Version tracking:** A `django_migrations` table records which migrations
  have been applied.
- **Rollback:** Each migration has a `forwards` and `backwards` operation
  list, enabling `migrate app_name 0003` to revert to a specific version.
- **Squashing:** Old migrations can be squashed into a single consolidated
  migration to reduce chain length.

**Strengths:** Fully automatic for most schema changes; battle-tested at
scale.
**Weaknesses:** Tightly coupled to Django; auto-detection can produce
incorrect migrations for complex changes; limited raw SQL escape hatches.

### 3.3 SQLAlchemy + Alembic

- **Semi-automatic:** `alembic revision --autogenerate` compares SQLAlchemy
  metadata to the live database and generates `upgrade()` / `downgrade()`
  Python functions.
- **Version tracking:** An `alembic_version` table stores the current
  migration head.
- **Full control:** Migration scripts are editable Python; complex data
  transforms, raw SQL, and multi-step operations are first-class.
- **Branching:** Supports parallel migration branches and merge points for
  teams working on separate features.

**Strengths:** Maximum flexibility; database-agnostic; widely adopted.
**Weaknesses:** More manual effort; auto-detection misses some changes
(e.g. column renames).

---

## 4. Cassandra / ScyllaDB Schema Constraints

Cassandra's data model imposes unique constraints that any migration system
must respect:

| Constraint | Impact on Migrations |
|---|---|
| **Primary key is immutable** | Cannot ALTER partition or clustering keys — requires a new table + data copy |
| **No column renames** (pre-4.0) | Rename only supported for clustering columns in Cassandra ≥ 4.0; ScyllaDB has limited support |
| **Type changes are restricted** | Only widening numeric types (e.g. `int → bigint`) is allowed; collections and counters cannot be altered |
| **Dropping columns leaves tombstones** | Dropped columns are not immediately reclaimed; excessive drops impact read performance |
| **Schema changes are cluster-wide** | DDL propagates via gossip — concurrent DDL from multiple clients can cause schema disagreement |
| **No transactional DDL** | Unlike PostgreSQL, there is no `BEGIN; ALTER TABLE …; COMMIT;` — each DDL is applied independently |
| **Counter tables are special** | Cannot mix counter and non-counter columns; counter tables cannot be altered to add non-counter columns |

These constraints mean that a Cassandra migration system **cannot** blindly
replicate what Django or Alembic do for SQL databases.  It needs to be
Cassandra-aware.

---

## 5. coodie Migration Design

### 5.1 Design Principles

1. **Cassandra-aware, not SQL-generic** — the migration system understands
   CQL constraints (immutable primary keys, limited ALTER, schema agreement)
   and prevents unsafe operations at generation time.
2. **Pydantic models are the source of truth** — the desired schema is always
   defined by the `Document` class; migrations describe the *transition* from
   the current database state to the desired state.
3. **Three tiers for three use cases** — automatic sync for development,
   reviewed migration files for production DDL, and data migrations for
   complex transforms.
4. **Async-first, sync-compatible** — migration execution uses the same
   pluggable driver system as the rest of coodie, supporting both sync and
   async drivers.
5. **Version-controlled and auditable** — migration files live in the
   repository and are code-reviewed like any other change; applied state is
   tracked in a Cassandra table.
6. **Safe by default** — destructive operations (DROP COLUMN, table
   recreation) require explicit opt-in flags; dry-run mode shows planned CQL
   without executing.

### 5.2 Three-Tier Approach

```
┌─────────────────────────────────────────────────────────────────────┐
│  Tier 1: sync_table()              Dev / prototyping               │
│  Automatic, idempotent, non-destructive additive changes           │
├─────────────────────────────────────────────────────────────────────┤
│  Tier 2: Migration files           Production DDL changes          │
│  Versioned, reviewable, with diff preview and dry-run              │
├─────────────────────────────────────────────────────────────────────┤
│  Tier 3: Data migrations           Complex data transforms         │
│  Python functions with full driver access; batched execution       │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.3 Tier 1 — Automatic `sync_table` (Dev & Simple Changes)

This is the **existing behavior** in coodie, enhanced with better
introspection and safety:

```python
# Application startup
await init_coodie(hosts=["127.0.0.1"], keyspace="catalog")
await Review.sync_table()  # CREATE TABLE IF NOT EXISTS + ALTER TABLE ADD
```

**Current capabilities (already implemented):**
- `CREATE TABLE IF NOT EXISTS` with full primary key, clustering order, and
  table options
- `ALTER TABLE … ADD` for new columns (checks `system_schema.columns`)
- `CREATE INDEX IF NOT EXISTS` for secondary indexes

**Planned enhancements:**

| Enhancement | Description |
|---|---|
| **Schema diff report** | `sync_table(dry_run=True)` returns the list of CQL statements that *would* be executed without running them |
| **Warn on drift** | Detect columns present in the database but absent from the model and log a warning (instead of silent ignore) |
| **Table option updates** | Detect and apply changed table options (compaction, compression, TTL) via `ALTER TABLE … WITH` |
| **Index management** | Detect and create missing indexes; optionally drop indexes no longer in the model |

**When to use:** Local development, CI test environments, and simple additive
changes in production where `ALTER TABLE ADD` is sufficient.

### 5.4 Tier 2 — Migration Files (Production Schema Changes)

Inspired by Beanie and Alembic, coodie will support versioned migration files
for production-grade schema changes.

#### Migration File Structure

```
migrations/
├── 20260115_001_add_rating_column.py
├── 20260203_002_create_reviews_by_author_mv.py
└── 20260220_003_drop_legacy_status_column.py
```

Each file is a Python module with an `upgrade()` and optional `downgrade()`
function:

```python
"""Add rating column to reviews table."""

from coodie.migrations import Migration


class ForwardMigration(Migration):
    description = "Add rating column to reviews table"
    # Optional: Cassandra-aware safety checks
    allow_destructive = False

    async def upgrade(self, ctx):
        """Apply the migration."""
        await ctx.execute(
            'ALTER TABLE catalog.reviews ADD "rating" int'
        )
        await ctx.execute(
            "CREATE INDEX IF NOT EXISTS reviews_rating_idx "
            'ON catalog.reviews ("rating")'
        )

    async def downgrade(self, ctx):
        """Reverse the migration (optional)."""
        await ctx.execute(
            "DROP INDEX IF EXISTS catalog.reviews_rating_idx"
        )
        await ctx.execute(
            'ALTER TABLE catalog.reviews DROP "rating"'
        )
```

#### Auto-Generation (Planned)

Like Django's `makemigrations` and Alembic's `--autogenerate`, coodie will
compare the current model definitions against the live database schema and
generate a migration file:

```bash
coodie makemigration --name add_rating_column
```

The auto-generator will:
1. Introspect the live database schema via `system_schema.columns` and
   `system_schema.tables`
2. Diff against the current `Document` class definitions
3. Generate an `upgrade()` function with the required CQL statements
4. Flag operations that are **unsafe or unsupported** (e.g. primary key
   changes) with `TODO` comments and warnings

**Cassandra-aware diff detection:**

| Change Detected | Generated CQL | Safety |
|---|---|---|
| New column | `ALTER TABLE … ADD` | ✅ Safe |
| Removed column | `ALTER TABLE … DROP` | ⚠️ Requires `allow_destructive` |
| Type widening (int → bigint) | `ALTER TABLE … ALTER` | ✅ Safe |
| Incompatible type change | ❌ Error with guidance | Requires new table + data copy |
| New secondary index | `CREATE INDEX IF NOT EXISTS` | ✅ Safe |
| Removed index | `DROP INDEX IF EXISTS` | ⚠️ Requires `allow_destructive` |
| Changed table options | `ALTER TABLE … WITH` | ✅ Safe |
| Changed primary key | ❌ Error with guidance | Requires new table + data copy |
| New materialized view | `CREATE MATERIALIZED VIEW` | ✅ Safe |

### 5.5 Tier 3 — Data Migrations (Complex Transforms)

For changes that require reading and rewriting data — like splitting a column,
populating a new column from existing data, or copying data to a new table
with a different primary key — coodie provides data migration support
inspired by Beanie's iterative migrations:

```python
"""Split name into first_name and last_name."""

from coodie.migrations import Migration


class ForwardMigration(Migration):
    description = "Split name into first_name and last_name"
    # Data migrations often can't be reversed automatically
    reversible = False

    async def upgrade(self, ctx):
        # Step 1: Add new columns (DDL)
        await ctx.execute(
            'ALTER TABLE catalog.users ADD "first_name" text'
        )
        await ctx.execute(
            'ALTER TABLE catalog.users ADD "last_name" text'
        )

        # Step 2: Transform data in batches
        async for page in ctx.scan_table("catalog", "users"):
            for row in page:
                parts = row["name"].split(" ", 1)
                first = parts[0]
                last = parts[1] if len(parts) > 1 else ""
                await ctx.execute(
                    'UPDATE catalog.users SET "first_name" = ?, '
                    '"last_name" = ? WHERE "user_id" = ?',
                    [first, last, row["user_id"]],
                )

        # Step 3: Optionally drop old column
        if self.allow_destructive:
            await ctx.execute(
                'ALTER TABLE catalog.users DROP "name"'
            )
```

**Key features of data migrations:**

- **Batched scanning** via `ctx.scan_table()` — uses token-range queries to
  iterate over all rows without loading the entire table into memory
- **Progress reporting** — logs progress percentage for long-running
  migrations
- **Resumable** — tracks the last processed token range so a failed migration
  can resume from where it stopped
- **Rate limiting** — optional throttle to avoid overwhelming the cluster

### 5.6 CLI Interface

coodie will provide a CLI (via a `coodie` entry point or `python -m coodie`)
for migration management:

```bash
# Scaffold a new migration file
coodie makemigration --name add_rating_column

# Show pending migrations without applying them (dry run)
coodie migrate --dry-run

# Apply all pending migrations
coodie migrate

# Apply migrations up to a specific version
coodie migrate --target 20260203_002

# Rollback the last N migrations
coodie migrate --rollback --steps 1

# Show migration history
coodie migrate --status

# Show the diff between models and database (no migration file created)
coodie schema-diff
```

### 5.7 Migration State Tracking

Applied migrations are tracked in a Cassandra table within the application's
keyspace:

```sql
CREATE TABLE IF NOT EXISTS <keyspace>._coodie_migrations (
    migration_name text PRIMARY KEY,
    applied_at     timestamp,
    description    text,
    checksum       text
);
```

- **`migration_name`** — the filename (e.g. `20260115_001_add_rating_column`)
- **`applied_at`** — timestamp when the migration was applied
- **`description`** — human-readable description from the migration file
- **`checksum`** — hash of the migration file content to detect tampering

This table is automatically created on first use.  The `_` prefix
communicates that it is an internal/system table.

### 5.8 Safety Features

| Feature | Description |
|---|---|
| **Dry-run mode** | `--dry-run` prints all CQL that would be executed without touching the database |
| **Destructive operation guard** | `DROP COLUMN`, `DROP TABLE`, `DROP INDEX` require explicit `--allow-destructive` flag or `allow_destructive = True` in the migration file |
| **Schema agreement check** | Before applying DDL, wait for all nodes to agree on the current schema (query `system.peers`) to prevent split-brain |
| **Single-writer lock** | Use a lightweight transaction (`INSERT … IF NOT EXISTS`) on the migrations table to prevent concurrent migration execution |
| **Checksum validation** | Detect if a previously applied migration file was modified after application |
| **Pre-flight validation** | Before executing, validate that the CQL statements are syntactically correct and compatible with the target Cassandra/ScyllaDB version |

---

## 6. Comparison: coodie vs cqlengine

| Capability | cqlengine `sync_table` | coodie Migration System |
|---|---|---|
| Create table | ✅ Automatic | ✅ Automatic (Tier 1) + migration file (Tier 2) |
| Add columns | ✅ Automatic | ✅ Automatic (Tier 1) + migration file (Tier 2) |
| Drop columns | ❌ Not supported | ✅ Via migration file with destructive guard |
| Change column types | ❌ Not supported | ✅ Auto-generated for safe widening; error for incompatible |
| Change table options | ❌ Not supported | ✅ Auto-detected and applied |
| Primary key changes | ❌ Silent failure | ⚠️ Clear error with guided new-table-copy workflow |
| Secondary index management | ✅ Create only | ✅ Create + drop (with guard) |
| Materialized views | ❌ Not supported | ✅ Via migration file |
| Data migrations | ❌ Not supported | ✅ Batched, resumable, rate-limited (Tier 3) |
| Version tracking | ❌ None | ✅ `_coodie_migrations` table with checksums |
| Rollback / downgrade | ❌ Not possible | ✅ `downgrade()` functions + `--rollback` CLI |
| Dry-run preview | ❌ Not available | ✅ `--dry-run` shows planned CQL |
| Schema diff | ❌ Not available | ✅ `coodie schema-diff` command |
| Concurrent execution safety | ❌ No protection | ✅ LWT-based single-writer lock |
| Schema agreement check | ❌ Not checked | ✅ Waits for cluster agreement before DDL |
| CI/CD integration | ❌ Not designed for it | ✅ Migration files are version-controlled and reviewable |
| Async support | ❌ sync only | ✅ async-first with sync fallback |

### Why coodie's Approach is Better

1. **Auditability** — Every schema change is a version-controlled file that
   goes through code review, just like application code.  cqlengine's
   `sync_table` is a black box that silently mutates production schemas.

2. **Safety** — Destructive operations require explicit opt-in.  Schema
   agreement checks prevent split-brain.  LWT locking prevents concurrent
   migrations.  cqlengine has none of these safeguards.

3. **Completeness** — coodie handles the full lifecycle: column additions,
   removals, type changes, table option updates, index management, and data
   migrations.  cqlengine only handles creation and additive changes.

4. **Reversibility** — Migration files with `downgrade()` functions enable
   rollback when a deployment goes wrong.  cqlengine has no concept of
   rollback.

5. **Visibility** — `--dry-run`, `--status`, and `schema-diff` give
   operators full visibility into what has changed and what will change.
   cqlengine provides no introspection.

6. **Cassandra-awareness** — The auto-generator understands CQL constraints
   and refuses to generate impossible migrations (e.g. primary key changes),
   providing guidance instead.  cqlengine silently ignores these cases.

7. **Production-readiness** — Tier 2 and Tier 3 migrations are designed for
   CI/CD pipelines, blue-green deployments, and multi-node clusters.
   cqlengine's `sync_table` was designed for development convenience.

---

## 7. Implementation Phases

### Phase A: Enhanced `sync_table` (Tier 1 improvements)

| Task | Description | Priority |
|---|---|---|
| A.1 | Add `dry_run=True` parameter returning planned CQL statements | High |
| A.2 | Detect and warn on schema drift (DB columns not in model) | High |
| A.3 | Apply table option changes via `ALTER TABLE … WITH` | Medium |
| A.4 | Detect and drop removed indexes (with flag) | Medium |

### Phase B: Migration Framework Core (Tier 2)

| Task | Description | Priority |
|---|---|---|
| B.1 | `coodie.migrations` module with `Migration` base class and `MigrationContext` | High |
| B.2 | Migration file discovery and ordering (timestamp prefix) | High |
| B.3 | `_coodie_migrations` state tracking table | High |
| B.4 | `coodie migrate` CLI command (apply / rollback / status / dry-run) | High |
| B.5 | LWT-based single-writer lock | Medium |
| B.6 | Schema agreement wait before DDL | Medium |

### Phase C: Auto-Generation

| Task | Description | Priority |
|---|---|---|
| C.1 | Database schema introspection (columns, types, indexes, table options) | High |
| C.2 | Model-to-schema diff engine | High |
| C.3 | `coodie makemigration` CLI command | High |
| C.4 | Cassandra-aware validation (flag impossible changes) | Medium |
| C.5 | Checksum validation for applied migrations | Low |

### Phase D: Data Migrations (Tier 3)

| Task | Description | Priority |
|---|---|---|
| D.1 | `ctx.scan_table()` — token-range batched iteration | Medium |
| D.2 | Progress reporting and logging | Medium |
| D.3 | Resume-from-token support for interrupted migrations | Low |
| D.4 | Rate limiting / throttle support | Low |

---

## 8. References

- [Beanie ODM — Migrations Tutorial](https://beanie-odm.dev/tutorial/migrations/)
- [cqlengine — Schema Management](https://python-driver.readthedocs.io/en/stable/api/cassandra/cqlengine/management.html)
- [Django — Migrations Documentation](https://docs.djangoproject.com/en/5.0/topics/migrations/)
- [Alembic — Tutorial](https://alembic.sqlalchemy.org/en/latest/tutorial.html)
- [Cassandra — ALTER TABLE Reference](https://cassandra.apache.org/doc/latest/cassandra/reference/cql-commands/alter-table.html)
- [cassandra-migration (Java)](https://github.com/patka/cassandra-migration)
- [cassachange — Cassandra Schema Migrations](https://cassachange.com/)
