# coodie FastAPI Demo — Product Catalog API

A runnable demo app showcasing **coodie**'s async API (`coodie.aio`) with
[FastAPI](https://fastapi.tiangolo.com/).

## Prerequisites

* Python ≥ 3.10
* [uv](https://docs.astral.sh/uv/) (recommended) or pip
* Docker (for ScyllaDB)

## 1. Start ScyllaDB

```bash
docker run --name scylla-demo \
  -d --rm \
  -p 9042:9042 \
  scylladb/scylla:latest \
  --smp 1 --memory 512M --developer-mode 1
```

Wait ~30 seconds for the node to become ready:

```bash
docker exec scylla-demo nodetool status   # UN = Up/Normal
```

Create the keyspace:

```bash
docker exec -it scylla-demo cqlsh -e \
  "CREATE KEYSPACE IF NOT EXISTS catalog
   WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'};"
```

## 2. Install dependencies

```bash
cd demo
uv sync
```

## 3. Run the app

```bash
cd demo
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

## 4. Example requests

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

## 5. Cleanup

```bash
docker stop scylla-demo
```
