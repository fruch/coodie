# 🔧 Schema Migrations Demo

> Demonstrates **coodie**'s versioned schema-migration framework — the
> `coodie migrate` CLI, migration file authoring, apply / rollback / dry-run
> lifecycle, state tracking via the `_coodie_migrations` table, and
> distributed locking.

## Quick Start

```bash
make run        # start DB → create keyspace → apply migrations → seed → launch app
```

## Prerequisites

* Python ≥ 3.10
* [uv](https://docs.astral.sh/uv/) (recommended) or pip
* Docker & Docker Compose (for ScyllaDB)

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
which processes the four migration files in order:

| # | File | What it does |
|---|---|---|
| 1 | `20260115_001_create_base_tables.py` | Creates `products` and `reviews` tables with indexes |
| 2 | `20260203_002_add_featured_column.py` | `ALTER TABLE products ADD "featured" boolean` + index |
| 3 | `20260220_003_set_reviews_ttl.py` | Sets `default_time_to_live = 31536000` (1 year) on reviews |
| 4 | `20260310_004_add_search_index.py` | Adds a secondary index on `products.name` |

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

Inserts 50 products (20 % featured) and random reviews.

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

## Writing Your Own Migration

Every migration file must define a `ForwardMigration` class that inherits
from `coodie.migrations.Migration`:

```python
"""Migration 005 — Add a color column to products."""

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

Save the file as `migrations/20260401_005_add_color_column.py` and run:

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
    brand: Annotated[str, Indexed()]
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
