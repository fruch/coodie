# 🔍 Vector Search Demo

Semantic product search powered by **coodie's ANN (Approximate Nearest Neighbor)
query support** and ScyllaDB's vector indexing.

## What This Demo Shows

| Feature | CQL Behind the Scenes |
|---|---|
| Vector column | `embedding vector<float, 16>` |
| Vector index | `CREATE CUSTOM INDEX … USING 'StorageAttachedIndex' WITH OPTIONS = {'similarity_function': 'COSINE'}` |
| ANN query | `SELECT * FROM product_embeddings ORDER BY embedding ANN OF ? LIMIT 10` |
| Dimension validation | coodie validates `len(embedding) == 16` before saving |

## Quick Start

```bash
# From this directory:
make run    # starts ScyllaDB, seeds 30 products, launches FastAPI app

# Then visit:
open http://127.0.0.1:8000
```

## How It Works

1. **Models** (`models.py`):  
   `ProductEmbedding` declares a 16-dimensional vector column with a cosine
   similarity index using coodie's `Vector(dimensions=16)` and
   `VectorIndex(similarity_function="COSINE")` annotations.

2. **Seed** (`seed.py`):  
   Generates 30 products across 5 categories. Each product description is
   converted to a 16-dimensional embedding using a hash-based projection
   (no ML model required — deterministic and dependency-free).

3. **Search** (`main.py`):  
   User types a natural-language query → the same hash-based projection
   generates a query embedding → coodie's `order_by_ann("embedding", vec)`
   builds the CQL `ORDER BY embedding ANN OF ?` query → ScyllaDB returns
   the nearest neighbors ranked by cosine similarity.

4. **UI** (`templates/`):  
   Dark-themed HTMX interface with similarity score badges, category tags,
   and result cards.

## coodie API Examples

```python
from coodie.aio import Document
from coodie.fields import PrimaryKey, Vector, VectorIndex

class ProductEmbedding(Document):
    product_id: Annotated[UUID, PrimaryKey()]
    name: str
    embedding: Annotated[
        list[float],
        Vector(dimensions=16),
        VectorIndex(similarity_function="COSINE"),
    ]

# ANN search
results = await (
    ProductEmbedding.find()
    .order_by_ann("embedding", query_vector)
    .limit(10)
    .all()
)
```

## Files

| File | Purpose |
|---|---|
| `models.py` | `ProductEmbedding` document with vector column |
| `seed.py` | Seeds products with deterministic embeddings |
| `main.py` | FastAPI app with search endpoint |
| `templates/` | Dark-themed HTMX UI |
| `Makefile` | Standard `make run` / `make seed` / `make clean` targets |
| `pyproject.toml` | Dependencies |

## Cleanup

```bash
make clean   # stop ScyllaDB, remove data volumes
```
