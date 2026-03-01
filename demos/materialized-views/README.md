# 🔮 coodie Materialized Views Demo — The Oracle's Mirror

> *Dimension-9: The Oracle's Mirror* — Create exactly the right materialized
> views and convince The Oracle that not every query deserves its own
> pre-computed table.

A runnable demo app showcasing **coodie**'s `MaterializedView` with
[FastAPI](https://fastapi.tiangolo.com/) and [HTMX](https://htmx.org/).

## What This Demo Shows

- **`sync_view()`** — Creating materialized views from a base table
- **Read-only queries** — Querying views by partition key without `ALLOW FILTERING`
- **Auto-updates** — When you insert/delete in the base table, the views update automatically
- **Read-only enforcement** — `save()`, `insert()`, `delete()`, `update()` all raise errors on views

## Quick Start

```bash
cd demos/materialized-views
make run
```

This single command starts ScyllaDB, creates the keyspace, syncs the base
table and materialized views, seeds 50 sample products, and launches the
FastAPI app.

## Prerequisites

* Python ≥ 3.10
* [uv](https://docs.astral.sh/uv/) (recommended) or pip
* Docker & Docker Compose (for ScyllaDB)

## Step-by-Step

### 1. Start ScyllaDB and create keyspace

```bash
make db-up
```

### 2. Seed sample data

```bash
make seed                        # 50 products (default)
uv run python seed.py --count 200  # custom count
```

### 3. Run the app

```bash
uv run uvicorn main:app --reload
```

The API will be available at <http://127.0.0.1:8000>.
Interactive docs at <http://127.0.0.1:8000/docs>.
**HTMX UI** at <http://127.0.0.1:8000/> — insert products into the base
table and query the materialized views in real time.

### Environment variables

| Variable | Default | Description |
|---|---|---|
| `SCYLLA_HOSTS` | `127.0.0.1` | Comma-separated ScyllaDB contact points |
| `SCYLLA_KEYSPACE` | `viewdemo` | Keyspace to use |

## Makefile Targets

| Target | Description |
|---|---|
| `make db-up` | Start ScyllaDB and create the `viewdemo` keyspace |
| `make db-down` | Stop ScyllaDB |
| `make seed` | Seed sample data (depends on `db-up`) |
| `make run` | Install deps, seed data, and start the app |
| `make clean` | Stop DB and remove data volumes |

## Models

### Base Table: `Product`

```python
class Product(Document):
    id: Annotated[UUID, PrimaryKey()]
    name: str
    category: Annotated[str, Indexed()]
    brand: Annotated[str, Indexed()]
    price: float
    description: Optional[str] = None
    created_at: datetime
```

### Materialized View: `ProductByCategory`

```python
class ProductByCategory(MaterializedView):
    category: Annotated[str, PrimaryKey()]
    id: Annotated[UUID, ClusteringKey()]
    name: str
    brand: str
    price: float

    class Settings:
        name = "products_by_category"
        __base_table__ = "products"
```

### Materialized View: `ProductByBrand`

```python
class ProductByBrand(MaterializedView):
    brand: Annotated[str, PrimaryKey()]
    id: Annotated[UUID, ClusteringKey()]
    name: str
    category: str
    price: float

    class Settings:
        name = "products_by_brand"
        __base_table__ = "products"
```

## Example API Requests

### Insert a product (base table)

```bash
curl -X POST http://127.0.0.1:8000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Quantum Entanglement Mouse",
    "category": "computing",
    "brand": "Dimension-7",
    "price": 2999.99
  }'
```

### List all products (base table)

```bash
curl http://127.0.0.1:8000/products
```

### Query by category (materialized view)

```bash
curl "http://127.0.0.1:8000/views/by-category?category=weapons"
```

### Query by brand (materialized view)

```bash
curl "http://127.0.0.1:8000/views/by-brand?brand=Dimension-7"
```

### Delete a product (base table — view auto-updates)

```bash
curl -X DELETE http://127.0.0.1:8000/products/<product-id>
```

## How It Works

1. **Base table** (`products`) holds all product data with `id` as the
   partition key.
2. **`ProductByCategory`** is a materialized view that re-partitions the data
   by `category`, allowing efficient lookups like
   `SELECT * FROM products_by_category WHERE category = 'weapons'`.
3. **`ProductByBrand`** does the same but partitions by `brand`.
4. When you insert or delete a product in the base table, Cassandra/ScyllaDB
   **automatically** updates both materialized views — no application code
   needed.
5. The views are **read-only** — any attempt to write to them raises
   `InvalidQueryError`.

## Cleanup

```bash
make clean
```
