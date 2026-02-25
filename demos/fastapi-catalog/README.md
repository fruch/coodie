# ⚡ coodie FastAPI Demo — Product Catalog API

> *Dimension-1: The Infinite Bazaar* — Catalog interdimensional artifacts
> before MerchBot Prime sells a universe-ending weapon disguised as a USB Hub.

A runnable demo app showcasing **coodie**'s async API (`coodie.aio`) with
[FastAPI](https://fastapi.tiangolo.com/) and [HTMX](https://htmx.org/).

## Quick Start

```bash
cd demos/fastapi-catalog
make run
```

This single command starts ScyllaDB, creates the keyspace, seeds 50 sample
products with reviews, and launches the FastAPI app.

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
make seed                  # 50 products (default)
uv run python seed.py --count 200   # custom count
uv run python seed.py --feed products.csv  # load from CSV
```

### 3. Run the app

```bash
uv run uvicorn main:app --reload
```

The API will be available at <http://127.0.0.1:8000>.
Interactive docs at <http://127.0.0.1:8000/docs>.
**HTMX UI** at <http://127.0.0.1:8000/> — browse products, add reviews, all without page reloads.

### Environment variables

| Variable | Default | Description |
|---|---|---|
| `SCYLLA_HOSTS` | `127.0.0.1` | Comma-separated ScyllaDB contact points |
| `SCYLLA_KEYSPACE` | `catalog` | Keyspace to use |

## Makefile Targets

| Target | Description |
|---|---|
| `make db-up` | Start ScyllaDB and create the `catalog` keyspace |
| `make db-down` | Stop ScyllaDB |
| `make seed` | Seed sample data (depends on `db-up`) |
| `make run` | Install deps, seed data, and start the app |
| `make clean` | Stop DB and remove data volumes |

## Seed Script

The `seed.py` script generates realistic sample data using
[Faker](https://faker.readthedocs.io/) with colorful
[rich](https://rich.readthedocs.io/) progress output.

```bash
# Generate 100 products with reviews
uv run python seed.py --count 100

# Load products from a CSV file (columns: name, brand, category, price, description, tags)
uv run python seed.py --feed products.csv

# Load products from a JSON file (list of objects)
uv run python seed.py --feed products.json
```

## Example API Requests

### Create a product

```bash
curl -X POST http://127.0.0.1:8000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Wireless Mouse",
    "brand": "Acme",
    "category": "gadgets",
    "price": 29.99,
    "tags": ["electronics", "accessories"]
  }'
```

### List products (with optional filters)

```bash
curl "http://127.0.0.1:8000/products?category=gadgets&brand=Acme"
```

### Get a product by ID

```bash
curl http://127.0.0.1:8000/products/<product-id>
```

### Add a review

```bash
curl -X POST http://127.0.0.1:8000/products/<product-id>/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "author": "Jane",
    "rating": 5,
    "content": "Great mouse!"
  }'
```

### List reviews (newest-first, paginated)

```bash
curl "http://127.0.0.1:8000/products/<product-id>/reviews?limit=10"
```

## Cleanup

```bash
make clean
```
