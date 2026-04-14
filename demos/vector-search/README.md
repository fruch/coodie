# 📡 coodie Vector Search Demo — The Signal Graveyard

> *Dimension-10: The Signal Graveyard* — The rogue AI **ECHO-NULL** has flooded
> every emergency channel with synthetic noise, burying real distress calls from
> ships with hull breaches, failing life support, and dead engines.
> The Coodie Corps built a **semantic signal archive** to find the real ones.

A runnable demo app showcasing **coodie**'s async vector search API (`coodie.aio`)
with [FastAPI](https://fastapi.tiangolo.com/) and [HTMX](https://htmx.org/).

## Quick Start

```bash
cd demos/vector-search
make run
```

This single command starts ScyllaDB + vector-store sidecar, downloads the
embedding model (once, ~80MB), seeds 30 signals, and launches the FastAPI app.

## Prerequisites

* Python ≥ 3.10
* [uv](https://docs.astral.sh/uv/) (recommended) or pip
* Docker & Docker Compose (for ScyllaDB + vector-store)

> **Infrastructure**: This demo uses its own `docker-compose.yml` (not the shared
> one) because it requires the `scylladb/vector-store` sidecar alongside ScyllaDB.

## Step-by-Step

### 1. Start ScyllaDB + vector-store

```bash
make db-up
```

### 2. Seed the signal archive

```bash
make seed
```

The first run downloads `BAAI/bge-small-en-v1.5` (~67MB, ONNX) and
computes real 384-dimensional embeddings for every signal. No API key required.

### 3. Run the app

```bash
uv run uvicorn main:app --reload
```

Visit <http://127.0.0.1:8000>. Try these queries:

| Fragment | What it finds | Why |
|---|---|---|
| `ship is tearing apart` | Hull breach signals | Semantic match: "hull fractures", "structural failure" |
| `crew cannot breathe` | Life support failures | Matches: "oxygen recyclers down", "CO2 scrubbers failed" |
| `engines are dead` | Engine failure signals | Matches: "drive exploded", "reactor containment breach" |
| `we are lost in space` | Navigation failures | Matches: "positioning systems offline", "star charts corrupted" |
| `signal signal signal all is noise` | ECHO-NULL noise signals | Score ~0.9 — identical gibberish |

A **similarity score ≥ 0.7** means the same emergency in different words.
A **score ≤ 0.3** is ECHO-NULL noise — unrelated or incoherent.

## How It Works

1. **Models** (`models.py`):
   `DistressSignal` declares a 384-dimensional vector column with a cosine
   similarity index via `Vector(dimensions=384)` and
   `VectorIndex(similarity_function="COSINE")`.

2. **Seed** (`seed.py`):
   30 pre-written distress signals (hull breaches, life support failures,
   navigation failures, engine failures, and ECHO-NULL noise) are embedded
   with `BAAI/bge-small-en-v1.5` (fastembed, ONNX-based, ~67MB) — a real
   ML model that captures semantic meaning. No torch, no API key.

3. **Search** (`main.py`):
   User types a fragment → the same model embeds it in real time →
   `order_by_ann("embedding", vec)` runs `ORDER BY embedding ANN OF ?` →
   ScyllaDB returns the nearest neighbors ranked by cosine similarity.

4. **UI** (`templates/`):
   Dark-themed HTMX interface with threat-level badges, similarity score
   meters, and example chips.

## coodie API

```python
from coodie.aio import Document
from coodie.fields import PrimaryKey, Vector, VectorIndex

class DistressSignal(Document):
    embedding: Annotated[
        list[float],
        Vector(dimensions=384),
        VectorIndex(similarity_function="COSINE"),
    ]

results = await (
    DistressSignal.find()
    .order_by_ann("embedding", query_vector)
    .limit(10)
    .all()
)
```

## Files

| File | Purpose |
|---|---|
| `models.py` | `DistressSignal` document with 384-dim vector column |
| `seed.py` | Seeds 30 signals with real sentence-transformer embeddings |
| `main.py` | FastAPI app — embeds queries at request time |
| `templates/` | Dark-themed HTMX UI with threat-level badges |
| `docker-compose.yml` | ScyllaDB + vector-store sidecar (own compose, not shared) |
| `Makefile` | Standard `make run` / `make seed` / `make clean` targets |
| `pyproject.toml` | Dependencies including `fastembed` (ONNX, no torch) |

## Cleanup

```bash
make clean
```
