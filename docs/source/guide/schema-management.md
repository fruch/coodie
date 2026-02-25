# Schema Management

coodie provides a multi-tier approach to schema management, from
automatic table syncing during development to versioned migration
files for production deployments.

## Tier 1 — Automatic `sync_table()` (Phase A)

Every `Document` class has a `sync_table()` class method that
idempotently creates or updates the table to match the model
definition.

### Basic Usage

```python
from coodie.aio import Document, init_coodie
from coodie.fields import PrimaryKey, Indexed
from typing import Annotated
from uuid import UUID, uuid4
from pydantic import Field

class Product(Document):
    id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)
    name: str
    brand: Annotated[str, Indexed()] = "Unknown"
    price: float = 0.0

    class Settings:
        name = "products"
        keyspace = "catalog"

# At application startup:
await init_coodie(hosts=["127.0.0.1"], keyspace="catalog")
await Product.sync_table()
```

`sync_table()` performs the following operations:

| Operation | Description |
|-----------|-------------|
| `CREATE TABLE IF NOT EXISTS` | Creates the table with full primary key and options |
| `ALTER TABLE … ADD` | Adds columns present in the model but missing in the DB |
| Schema drift warning | Logs a warning when DB has columns not in the model |
| `ALTER TABLE … WITH` | Updates table options (TTL, compaction, etc.) when changed |
| `CREATE INDEX IF NOT EXISTS` | Creates secondary indexes for `Indexed()` columns |
| `DROP INDEX IF EXISTS` | Drops stale indexes (opt-in via flag) |

### Return Value

`sync_table()` returns a list of CQL statements that were executed:

```python
planned = await Product.sync_table()
for cql in planned:
    print(cql)
# CREATE TABLE IF NOT EXISTS catalog.products (...)
# CREATE INDEX IF NOT EXISTS products_brand_idx ON catalog.products ("brand")
```

### Dry-Run Mode

Preview what CQL would be executed without touching the database:

```python
planned = await Product.sync_table(dry_run=True)
for cql in planned:
    print(f"[WOULD EXECUTE] {cql}")
```

This is useful for CI/CD pipelines where you want to review planned
schema changes before applying them.

### Schema Drift Detection

When the database has columns that are not defined in the model,
`sync_table()` logs a warning:

```
WARNING coodie: Schema drift detected: columns {'legacy_col'} exist in
catalog.products but are not defined in the model
```

This helps identify abandoned columns that should be cleaned up or
added back to the model.

### Table Option Changes

If your model defines table options that differ from the current
database state, `sync_table()` automatically applies the changes:

```python
class Session(Document):
    token: Annotated[str, PrimaryKey()]
    user_id: UUID

    class Settings:
        name = "sessions"
        keyspace = "catalog"
        __default_ttl__ = 7200  # 2 hours
```

If the table already exists with a different TTL, `sync_table()` runs:

```sql
ALTER TABLE catalog.sessions WITH default_time_to_live = 7200
```

### Dropping Stale Indexes

By default, `sync_table()` only creates indexes — it never drops them.
To remove indexes that are no longer defined in the model, use the
`drop_removed_indexes` flag:

```python
await Product.sync_table(drop_removed_indexes=True)
```

```{warning}
Dropping an index is a destructive operation. Only use
`drop_removed_indexes=True` when you are certain the index is no
longer needed.
```

### When to Use

- **Local development** — run `sync_table()` at application startup
- **CI test environments** — create tables automatically before tests
- **Simple additive production changes** — adding a column or index


## Tier 2 — Migration Files (Phase B)

For production deployments, coodie provides a versioned migration
framework inspired by Django, Alembic, and Beanie. Migration files are
Python modules that define schema changes as `upgrade()` / `downgrade()`
methods.

### Migration File Structure

Migration files live in a directory (default: `migrations/`) and follow
a naming convention:

```
migrations/
├── 20260115_001_add_rating_column.py
├── 20260203_002_create_reviews_index.py
└── 20260220_003_drop_legacy_status.py
```

**Naming pattern:** `YYYYMMDD_NNN_<description>.py`

- `YYYYMMDD` — date prefix for chronological ordering
- `NNN` — sequence number within the same date
- `<description>` — human-readable description

### Writing a Migration

Each migration file defines a `ForwardMigration` class that inherits
from `coodie.migrations.Migration`:

```python
# migrations/20260115_001_add_rating_column.py
from coodie.migrations import Migration


class ForwardMigration(Migration):
    description = "Add rating column to reviews table"
    allow_destructive = False  # default

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

#### Migration Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `description` | `str` | `""` | Human-readable description |
| `allow_destructive` | `bool` | `False` | Allow DROP operations |
| `reversible` | `bool` | `True` | Whether `downgrade()` is implemented |

#### MigrationContext

The `ctx` parameter passed to `upgrade()` and `downgrade()` is a
`MigrationContext` that wraps the coodie driver:

```python
# Execute arbitrary CQL
await ctx.execute("ALTER TABLE ks.tbl ADD \"col\" int")

# With parameters
await ctx.execute(
    "INSERT INTO ks.tbl (id, name) VALUES (?, ?)",
    [some_uuid, "Widget"],
)
```

In dry-run mode, `ctx.execute()` records the CQL but does not send it
to the database.

### Applying Migrations

#### Using the CLI

```bash
# Apply all pending migrations
coodie migrate --keyspace catalog

# Preview what would be applied (dry-run)
coodie migrate --keyspace catalog --dry-run

# Apply up to a specific migration
coodie migrate --keyspace catalog --target 20260203_002

# Show migration status
coodie migrate --keyspace catalog --status

# Rollback the last migration
coodie migrate --keyspace catalog --rollback --steps 1
```

#### CLI Options

| Option | Default | Description |
|--------|---------|-------------|
| `--keyspace` | (required) | Target keyspace |
| `--hosts` | `127.0.0.1` | Cassandra/ScyllaDB contact points |
| `--migrations-dir` | `migrations` | Path to migration files |
| `--dry-run` | `False` | Show planned CQL without executing |
| `--status` | `False` | Show migration status |
| `--rollback` | `False` | Rollback migrations |
| `--steps` | `1` | Number of migrations to rollback |
| `--target` | (none) | Stop after this migration prefix |
| `--driver-type` | `scylla` | Driver type (`scylla` or `cassandra`) |

#### Using the Python API

```python
from coodie.drivers import init_coodie
from coodie.migrations import MigrationRunner

driver = init_coodie(hosts=["127.0.0.1"], keyspace="catalog")
runner = MigrationRunner(
    driver=driver,
    keyspace="catalog",
    migrations_dir="migrations",
)

# Apply all pending
results = await runner.apply()

# Dry-run
results = await runner.apply(dry_run=True)

# Apply up to a target
results = await runner.apply(target="20260203_002")

# Rollback
results = await runner.rollback(steps=1)

# Check status
statuses = await runner.status()

# Get pending migrations
pending = await runner.pending()
```

### State Tracking

Applied migrations are tracked in a `_coodie_migrations` table:

```sql
CREATE TABLE IF NOT EXISTS <keyspace>."_coodie_migrations" (
    migration_name text PRIMARY KEY,
    applied_at     timestamp,
    description    text,
    checksum       text
);
```

- **`migration_name`** — the filename without `.py`
- **`applied_at`** — when the migration was applied
- **`description`** — from the `ForwardMigration.description` attribute
- **`checksum`** — SHA-256 hash of the migration file

### Safety Features

#### LWT-Based Lock

Before applying or rolling back migrations, the runner acquires a
distributed lock using a Cassandra lightweight transaction (LWT):

```sql
INSERT INTO <keyspace>."_coodie_migrations_lock"
    (lock_id, acquired_at, owner)
    VALUES (?, ?, ?)
    IF NOT EXISTS
    USING TTL 300
```

This prevents concurrent migration runs from multiple application
instances. The lock auto-expires after 5 minutes (configurable via
`lock_ttl`).

#### Schema Agreement Wait

Before executing DDL statements, the runner waits for all cluster
nodes to agree on the current schema version. This prevents
split-brain scenarios where concurrent DDL causes schema disagreement.

### Data Migrations

For complex data transformations, write a migration that reads and
rewrites data:

```python
from coodie.migrations import Migration


class ForwardMigration(Migration):
    description = "Split name into first_name and last_name"
    reversible = False  # data migrations are often irreversible

    async def upgrade(self, ctx):
        # Step 1: Add new columns
        await ctx.execute(
            'ALTER TABLE catalog.users ADD "first_name" text'
        )
        await ctx.execute(
            'ALTER TABLE catalog.users ADD "last_name" text'
        )

        # Step 2: Read and transform existing data
        rows = await ctx.execute(
            "SELECT id, name FROM catalog.users"
        )
        for row in rows:
            parts = row["name"].split(" ", 1)
            first = parts[0]
            last = parts[1] if len(parts) > 1 else ""
            await ctx.execute(
                'UPDATE catalog.users SET "first_name" = ?, '
                '"last_name" = ? WHERE "id" = ?',
                [first, last, row["id"]],
            )
```

## Comparison with Other ORMs

The following table compares coodie's schema management capabilities
with other popular Python ORMs and ODMs:

| Feature | coodie | cqlengine | Beanie (MongoDB) | Django ORM | Alembic (SQLAlchemy) |
|---------|--------|-----------|------------------|------------|----------------------|
| **Database** | Cassandra / ScyllaDB | Cassandra | MongoDB | PostgreSQL, MySQL, SQLite | PostgreSQL, MySQL, SQLite |
| **Auto schema sync** | ✅ `sync_table()` | ✅ `sync_table()` | ✅ `init_beanie()` | ✅ `migrate` | ❌ (manual only) |
| **Dry-run preview** | ✅ `dry_run=True` | ❌ | ❌ | ✅ `--plan` | ✅ `--sql` |
| **Schema drift detection** | ✅ warns on extra DB columns | ❌ | ❌ | ❌ | ❌ |
| **Versioned migration files** | ✅ `YYYYMMDD_NNN_*.py` | ❌ | ✅ `*.py` | ✅ auto-generated | ✅ auto-generated |
| **Rollback / downgrade** | ✅ `downgrade()` method | ❌ | ✅ `backward()` method | ✅ `migrate <app> <N>` | ✅ `downgrade()` |
| **Auto-generate migrations** | ❌ (planned Phase C) | ❌ | ❌ (manual) | ✅ `makemigrations` | ✅ `--autogenerate` |
| **State tracking table** | ✅ `_coodie_migrations` | ❌ | ❌ (in-app tracking) | ✅ `django_migrations` | ✅ `alembic_version` |
| **Distributed lock** | ✅ LWT with TTL | ❌ | ❌ | ❌ | ❌ |
| **Schema agreement wait** | ✅ polls `system.peers` | ❌ | N/A (schemaless) | N/A | N/A |
| **Data migrations** | ✅ arbitrary CQL in `upgrade()` | ❌ | ✅ via iterative docs | ✅ `RunPython` | ✅ `op.execute()` |
| **CLI tool** | ✅ `coodie migrate` | ❌ | ❌ | ✅ `manage.py migrate` | ✅ `alembic upgrade` |
| **Checksum verification** | ✅ SHA-256 per file | ❌ | ❌ | ❌ | ❌ |
| **Table option changes** | ✅ `ALTER TABLE … WITH` | ❌ | N/A | ❌ | ❌ |
| **Index management** | ✅ create + drop stale | ✅ create only | ✅ (MongoDB indexes) | ✅ (via migrations) | ✅ (via migrations) |
| **Async support** | ✅ native async | ❌ | ✅ native async | ❌ (sync only) | ❌ (sync only) |

```{note}
cqlengine's ``sync_table()`` only creates tables and adds new columns —
it cannot detect drift, change table options, or drop stale indexes.
coodie's ``sync_table()`` is a superset of cqlengine's, adding dry-run,
drift detection, option changes, and index cleanup.

Django and Alembic have mature auto-generation that detects model
changes and produces migration files automatically. coodie's
auto-generation is planned for Phase C.
```

## Choosing the Right Tier

| Scenario | Recommended Approach |
|----------|---------------------|
| Local development / prototyping | `sync_table()` at startup |
| CI test environments | `sync_table()` in fixtures |
| Adding a column in production | Migration file or `sync_table()` |
| Dropping a column | Migration file with `allow_destructive = True` |
| Changing table options | `sync_table()` or migration file |
| Data transformation | Migration file with data logic |
| Primary key change | Migration file (new table + data copy) |

## What's Next?

- {doc}`/guide/defining-documents` — learn how Document classes work
- {doc}`/guide/drivers` — driver initialization and configuration
- {doc}`/guide/sync-vs-async` — choosing between sync and async APIs
