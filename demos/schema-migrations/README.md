# 🔧 Schema Migrations Demo

> Demonstrates **coodie**'s versioned schema-migration framework — the
> `coodie migrate` CLI, migration file authoring, apply / rollback / dry-run
> lifecycle, state tracking via the `_coodie_migrations` table, and
> distributed locking.

## Quick Start

```bash
make demo       # interactive scripted walkthrough (recommended for first time)
make run        # start DB → create keyspace → apply migrations → seed → launch app
```

## Prerequisites

* Python ≥ 3.10
* [uv](https://docs.astral.sh/uv/) (recommended) or pip
* Docker & Docker Compose (for ScyllaDB)

## Interactive Demo

Run the scripted walkthrough — it pauses at each step with a brief
explanation and waits for you to press Enter before continuing:

```bash
make demo
```

The demo covers: start DB → list migrations → dry-run → apply → status →
seed → query state table → rollback → re-apply → data migration notes →
clean up.

## Step-by-Step Walkthrough

### 1. Start ScyllaDB and create the keyspace

```bash
make db-up
```

### 2. Apply all migrations

```bash
make migrate
```

This runs `coodie migrate --keyspace migrations_demo --migrations-dir migrations`
which processes the five migration files in order:

| # | File | What it does |
|---|---|---|
| 1 | `20260115_001_create_base_tables.py` | Creates `products` and `reviews` tables with indexes |
| 2 | `20260203_002_add_featured_column.py` | `ALTER TABLE products ADD "featured" boolean` + index |
| 3 | `20260220_003_set_reviews_ttl.py` | Sets `default_time_to_live = 31536000` (1 year) on reviews |
| 4 | `20260310_004_add_search_index.py` | Adds a secondary index on `products.name` |
| 5 | `20260325_005_rename_brand_to_manufacturer.py` | Renames `brand` → `manufacturer` with data migration |

### 3. Check migration status

```bash
make migrate-status
```

Output shows which migrations are applied, with timestamps and checksum
validation:

```
Status     Migration                                          Applied At
----
[x]        20260115_001_create_base_tables                    2026-01-15 10:00:00+00:00
[x]        20260203_002_add_featured_column                   2026-02-03 14:30:00+00:00
[x]        20260220_003_set_reviews_ttl                       2026-02-20 09:15:00+00:00
[x]        20260310_004_add_search_index                      2026-03-10 11:45:00+00:00
[x]        20260325_005_rename_brand_to_manufacturer           2026-03-25 16:00:00+00:00
```

### 4. Dry-run — preview CQL without applying

```bash
make migrate-dry-run
```

Shows the CQL statements each migration would execute **without** touching
the database.

### 5. Seed sample data

```bash
make seed
```

Inserts 50 products (20% featured) and random reviews.

### 6. Launch the app

```bash
make run
```

Opens a FastAPI server at <http://127.0.0.1:8000> with:

* `GET /products/featured` — featured products (uses the index from
  migration 002)
* `GET /products/{id}/reviews` — reviews for a product (newest-first,
  TTL from migration 003)
* `GET /health` — health check

### 7. Rollback the last migration

```bash
make migrate-rollback
```

Rolls back one migration (the most recently applied). Run it multiple times
to rollback further.

### 8. Clean up

```bash
make clean
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `SCYLLA_HOSTS` | `127.0.0.1` | Comma-separated ScyllaDB contact points |
| `SCYLLA_KEYSPACE` | `migrations_demo` | Keyspace name |

## Makefile Targets

| Target | Description |
|---|---|
| `make demo` | Run the interactive scripted walkthrough |
| `make db-up` | Start ScyllaDB and create the keyspace |
| `make db-down` | Stop ScyllaDB |
| `make migrate` | Apply all pending migrations (depends on `db-up`) |
| `make migrate-dry-run` | Show planned CQL without executing |
| `make migrate-rollback` | Rollback the last applied migration |
| `make migrate-status` | Show migration status with checksum validation |
| `make seed` | Seed sample data (depends on `migrate`) |
| `make run` | Full pipeline: db-up → migrate → seed → launch app |
| `make clean` | Stop DB and remove data volumes |

## State Tracking

coodie tracks applied migrations in a `_coodie_migrations` table inside the
target keyspace:

```sql
SELECT * FROM migrations_demo."_coodie_migrations";
```

Each row stores the migration name, applied timestamp, description, and a
SHA-256 checksum of the migration file.  If a file is modified after being
applied, `--status` flags it with `[CHECKSUM MISMATCH]`.

A companion `_coodie_migrations_lock` table provides LWT-based distributed
locking so that concurrent `coodie migrate` processes do not conflict.

## Migration Files

Migration files live in the `migrations/` directory and follow the naming
convention:

```
YYYYMMDD_NNN_description.py
```

* **YYYYMMDD** — date stamp (for chronological ordering)
* **NNN** — sequence number within the same day
* **description** — short snake_case summary

## Data Migrations & Rollback

Migration 005 demonstrates a **column rename with data migration** — a
common real-world scenario where a simple DDL change is not enough:

```
upgrade():
  1. ALTER TABLE ... ADD "manufacturer" text       ← new column
  2. scan_table() → copy brand → manufacturer      ← data migration
  3. ALTER TABLE ... DROP "brand"                   ← remove old column

downgrade():
  1. ALTER TABLE ... ADD "brand" text               ← re-create old column
  2. scan_table() → copy manufacturer → brand       ← reverse data migration
  3. ALTER TABLE ... DROP "manufacturer"             ← remove new column
```

### Rollback considerations

Rolling back a migration that involves data migration requires care:

* **Data written after upgrade uses the new column.**  If the application
  starts writing to `manufacturer` immediately after the migration, a
  rollback copies those values back to `brand`.  However, any rows
  inserted between upgrade and rollback may have `NULL` in the old column
  if the app already switched to the new name before rollback completes.

* **Large tables take time.**  `scan_table()` walks the full Cassandra
  token ring.  For large tables, use the `throttle_seconds` and
  `resume_token` parameters to control load and support resume-on-failure.

* **Consider marking destructive rollbacks as irreversible.**  If data
  loss during rollback is unacceptable, set `reversible = False` on the
  migration class and handle rollback manually with a backup/restore
  strategy.

* **Test rollbacks in staging first.**  Always validate that `downgrade()`
  produces the expected schema and data state before running in
  production.

* **Coordinate application deploys.**  The safest pattern for a column
  rename is a multi-phase rollout:
  1. Migration A: add new column + backfill data (keep old column).
  2. Deploy app code that reads/writes both columns.
  3. Migration B: drop old column once all nodes use the new code.
  This avoids any window where data is inaccessible.

## Writing Your Own Migration

Every migration file must define a `ForwardMigration` class that inherits
from `coodie.migrations.Migration`:

```python
"""Migration 006 — Add a color column to products."""

from coodie.migrations import Migration, MigrationContext


class ForwardMigration(Migration):
    description = "Add color column to products"
    reversible = True           # set False if downgrade is not supported

    async def upgrade(self, ctx: MigrationContext) -> None:
        await ctx.execute(
            'ALTER TABLE migrations_demo.products ADD "color" text'
        )

    async def downgrade(self, ctx: MigrationContext) -> None:
        await ctx.execute(
            'ALTER TABLE migrations_demo.products DROP "color"'
        )
```

Save the file as `migrations/20260401_006_add_color_column.py` and run:

```bash
coodie migrate --keyspace migrations_demo --migrations-dir migrations
```

### Key points

* `upgrade()` is called during `coodie migrate` (apply).
* `downgrade()` is called during `coodie migrate --rollback`.
* `ctx.execute(cql)` sends CQL to the database — or records it in dry-run
  mode.
* Set `reversible = False` if the migration cannot be safely rolled back.
* Set `allow_destructive = True` if the migration drops columns or tables.

## Models

### Product

```python
class Product(Document):
    id: Annotated[UUID, PrimaryKey()]
    name: Annotated[str, Indexed()]
    manufacturer: str                   # renamed from brand by migration 005
    category: Annotated[str, Indexed()]
    price: float
    description: Optional[str] = None
    tags: list[str] = Field(default_factory=list)
    featured: bool = False          # added by migration 002
    created_at: datetime

    class Settings:
        name = "products"
        keyspace = "migrations_demo"
```

### Review

```python
class Review(Document):
    product_id: Annotated[UUID, PrimaryKey()]
    created_at: Annotated[datetime, ClusteringKey(order="DESC")]
    id: UUID
    author: str
    rating: Annotated[int, Indexed()]
    content: Optional[str] = None

    class Settings:
        name = "reviews"
        keyspace = "migrations_demo"
```
