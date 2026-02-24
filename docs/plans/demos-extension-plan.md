# Demo Suite Extension Plan

> **Goal:** Expand the demo suite from a single FastAPI app into a collection of
> standalone, colorful demo applications — each in its own folder — covering
> Django integration, Flask integration, Cassandra-specific features (TTL,
> counters, LWT, batch, collections, materialized views, vector search), migration
> patterns inspired by scylladb/argus, and built-in sample-data generation with
> options for real-data feeds.

---

## Table of Contents

1. [Current State](#1-current-state)
2. [Design Principles](#2-design-principles)
3. [Target Audience](#3-target-audience)
4. [Demo Inventory & Gap Analysis](#4-demo-inventory--gap-analysis)
   - [4.1 Framework Integrations](#41-framework-integrations)
   - [4.2 Cassandra Feature Showcases](#42-cassandra-feature-showcases)
   - [4.3 Migration & Real-World Patterns](#43-migration--real-world-patterns)
   - [4.4 Data Generation & Feeds](#44-data-generation--feeds)
5. [Demo Directory Structure](#5-demo-directory-structure)
6. [Implementation Phases](#6-implementation-phases)
7. [Vector Search — Library Development Scope](#7-vector-search--library-development-scope)
8. [Shared Infrastructure](#8-shared-infrastructure)
9. [References](#9-references)

---

## 1. Current State

The repository has a single demo application:

| Demo | Framework | Features Shown | Location |
|---|---|---|---|
| Product Catalog API | FastAPI + HTMX | Async CRUD, secondary indexes, clustering order, Jinja2 templates | `demo/` |

The existing demo is well-structured with a dark-theme HTMX UI, but covers only
basic CRUD via the async API. No Django, Flask, sync API, TTL, counters, LWT,
batch, collections, materialized views, vector search, or migration workflows
are demonstrated.

---

## 2. Design Principles

- **One folder per demo** — each demo is self-contained under `demos/<name>/`
  with its own `pyproject.toml`, `README.md`, and models
- **Colorful by default** — every demo with a UI uses a vibrant, themed color
  palette (dark backgrounds, accent colors, gradients) following the existing
  HTMX demo's style conventions
- **Sample data built in** — every demo includes a `seed.py` (or CLI command)
  that generates realistic sample data using Faker or hand-crafted generators;
  optionally accepts CSV/JSON feeds for real data
- **Makefile-driven** — every demo includes a `Makefile` with standard targets
  (`make db-up`, `make db-down`, `make seed`, `make run`, `make clean`) so a
  single `make run` spins the database up, creates the keyspace, syncs tables,
  seeds data, and starts the app
- **Copy-paste runnable** — each README has a numbered quick-start (start
  ScyllaDB → install → seed → run) that works in under 2 minutes
- **Showcases coodie, not the framework** — framework boilerplate is minimal;
  the focus is on coodie model definitions, queries, and Cassandra patterns

---

## 3. Target Audience

| Persona | What They Want |
|---|---|
| 🐍 **Python web dev** | See coodie work with Django / Flask / FastAPI |
| 🗄️ **Cassandra practitioner** | See TTL, counters, LWT, batch, materialized views in action |
| 🔄 **cqlengine migrator** | See side-by-side before/after migration from cqlengine models |
| 🚀 **Evaluator** | Run a colorful demo quickly to assess if coodie fits their project |

---

## 4. Demo Inventory & Gap Analysis

Legend:
- ✅ **Exists** — demo is implemented today
- ❌ **Missing** — demo does not exist yet

### 4.1 Framework Integrations

| Demo | Framework | API Style | Status |
|---|---|---|---|
| Product Catalog (existing) | FastAPI + HTMX | Async | ✅ |
| Flask Blog | Flask + Jinja2 | Sync | ❌ |
| Django Task Board | Django + templates | Sync | ❌ |

**Gap summary — framework integrations:**
- Flask Blog → demonstrate coodie's sync API with Flask's request lifecycle,
  `init_coodie()` in app factory, Jinja2 templates with a colorful UI
- Django Task Board → demonstrate coodie alongside Django's ORM (Cassandra for
  high-write task events, PostgreSQL/SQLite for auth), management commands for
  `sync_table`, Django templates with Bootstrap/Tailwind

### 4.2 Cassandra Feature Showcases

| Demo | Features Shown | Status |
|---|---|---|
| Product Catalog (existing) | Secondary indexes, clustering order, basic CRUD | ✅ |
| TTL & Ephemeral Data | `ttl=` on save, `__default_ttl__`, session tokens | ❌ |
| Real-Time Counters | `CounterDocument`, `increment()`, `decrement()`, analytics dashboard | ❌ |
| Lightweight Transactions | `if_exists`, `if_not_exists`, `if_conditions`, optimistic locking | ❌ |
| Batch Operations | `BatchQuery`, logged/unlogged batches, bulk imports | ❌ |
| Collections & UDTs | `list`, `set`, `map` fields, `add__`, `remove__`, frozen types | ❌ |
| Materialized Views | `MaterializedView`, `sync_view()`, read-only queries | ❌ |
| Time-Series Analytics | Clustering keys with DESC order, `per_partition_limit()`, `paged_all()` | ❌ |
| Polymorphic Models | Single-table inheritance, discriminator column | ❌ |
| Vector Similarity Search | `vector<float, N>` column, vector index, ANN queries, embeddings | ❌ |

**Gap summary — Cassandra features:**
- TTL → short-lived session/token store showing data that auto-expires
- Counters → page-view / vote analytics dashboard with live counter updates
- LWT → user registration with uniqueness guarantees, optimistic concurrency
- Batch → bulk CSV import tool using logged and unlogged batches
- Collections → tagging system with set operations, JSON-like map fields
- Materialized Views → product-by-category view auto-maintained by Cassandra
- Time-Series → IoT sensor data with time-bucketed partitions and pagination
- Polymorphic → content management with Article / Video / Podcast subtypes
- Vector Search → semantic product/document similarity search using embeddings,
  ANN (Approximate Nearest Neighbor) queries, and cosine similarity index;
  inspired by argus's `SCTErrorEventEmbedding` model

### 4.3 Migration & Real-World Patterns

| Demo | Pattern | Inspiration | Status |
|---|---|---|---|
| Argus-Style Test Tracker | Complex models, UDTs, composite keys, plugin architecture | scylladb/argus | ❌ |
| cqlengine → coodie Migration | Side-by-side models, sync_table migration, data verification | reddit/cqlmapper, argus | ❌ |

**Gap summary — migration patterns:**
- Argus-Style → scaled-down version of argus models (User, TestRun, Event,
  Notification) showing composite partition keys, clustering, UDT-like nested
  types, batch writes, and prepared-statement patterns
- Migration → step-by-step guide with cqlengine models on the left, coodie
  models on the right, and a migration script that syncs tables and verifies
  data round-trip

### 4.4 Data Generation & Feeds

| Capability | Status |
|---|---|
| Built-in `seed.py` with Faker-generated data | ❌ (existing demo has no seed script) |
| `--count N` flag to control volume | ❌ |
| CSV/JSON feed import | ❌ |
| Colorful CLI output (rich/click) | ❌ |

**Gap summary — data generation:**
- Every demo gets a `seed.py` using `faker` and `rich` for colorful progress
  output
- Accepts `--count N` for volume control and `--feed path.csv` for real data
- The existing FastAPI demo should be retrofitted with a `seed.py` as well

---

## 5. Demo Directory Structure

```
demos/
├── README.md                          # Index: list of all demos with descriptions
├── docker-compose.yml                 # Shared ScyllaDB container
├── fastapi-catalog/                   # Existing demo (moved from demo/)
│   ├── README.md
│   ├── Makefile                       # db-up, db-down, seed, run, clean
│   ├── pyproject.toml
│   ├── main.py
│   ├── models.py
│   ├── seed.py                        # NEW: sample data generator
│   └── templates/
│       ├── base.html
│       ├── index.html
│       └── partials/
├── flask-blog/                        # NEW: Flask integration
│   ├── README.md
│   ├── Makefile
│   ├── pyproject.toml
│   ├── app.py
│   ├── models.py
│   ├── seed.py
│   └── templates/
├── django-taskboard/                  # NEW: Django integration
│   ├── README.md
│   ├── Makefile
│   ├── pyproject.toml
│   ├── manage.py
│   ├── taskboard/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   ├── cassandra_models.py        # coodie models (separate from Django ORM)
│   │   └── management/commands/
│   │       └── sync_cassandra.py
│   ├── tasks/
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── templates/
│   └── seed.py
├── ttl-sessions/                      # NEW: TTL & ephemeral data
│   ├── README.md
│   ├── Makefile
│   ├── pyproject.toml
│   ├── main.py
│   ├── models.py
│   └── seed.py
├── realtime-counters/                 # NEW: Counter columns
│   ├── README.md
│   ├── Makefile
│   ├── pyproject.toml
│   ├── main.py
│   ├── models.py
│   └── seed.py
├── lwt-user-registry/                 # NEW: Lightweight transactions
│   ├── README.md
│   ├── Makefile
│   ├── pyproject.toml
│   ├── main.py
│   ├── models.py
│   └── seed.py
├── batch-importer/                    # NEW: Batch operations
│   ├── README.md
│   ├── Makefile
│   ├── pyproject.toml
│   ├── main.py
│   ├── models.py
│   └── seed.py
├── collections-tags/                  # NEW: Collections & nested types
│   ├── README.md
│   ├── Makefile
│   ├── pyproject.toml
│   ├── main.py
│   ├── models.py
│   └── seed.py
├── materialized-views/                # NEW: Materialized views
│   ├── README.md
│   ├── Makefile
│   ├── pyproject.toml
│   ├── main.py
│   ├── models.py
│   └── seed.py
├── timeseries-iot/                    # NEW: Time-series patterns
│   ├── README.md
│   ├── Makefile
│   ├── pyproject.toml
│   ├── main.py
│   ├── models.py
│   └── seed.py
├── polymorphic-cms/                   # NEW: Single-table inheritance
│   ├── README.md
│   ├── Makefile
│   ├── pyproject.toml
│   ├── main.py
│   ├── models.py
│   └── seed.py
├── vector-search/                     # NEW: Vector similarity search
│   ├── README.md
│   ├── Makefile
│   ├── pyproject.toml
│   ├── main.py
│   ├── models.py
│   └── seed.py
├── argus-tracker/                     # NEW: Argus-inspired complex models
│   ├── README.md
│   ├── Makefile
│   ├── pyproject.toml
│   ├── main.py
│   ├── models.py
│   └── seed.py
└── migration-guide/                   # NEW: cqlengine → coodie migration
    ├── README.md
    ├── Makefile
    ├── cqlengine_models.py
    ├── coodie_models.py
    ├── migrate.py
    └── verify.py
```

---

## 6. Implementation Phases

### Phase 1: Foundation & Existing Demo Retrofit (Priority: High)

**Goal:** Establish shared infrastructure, move the existing demo, and add seed tooling.

| Task | Description |
|---|---|
| 1.1 | Create `demos/` top-level directory with `README.md` index |
| 1.2 | Move existing `demo/` to `demos/fastapi-catalog/`, update paths and README |
| 1.3 | Add `Makefile` with `db-up`, `db-down`, `seed`, `run`, `clean` targets to `demos/fastapi-catalog/` |
| 1.4 | Add `seed.py` to `demos/fastapi-catalog/` with Faker-based product/review generation and `rich` progress output |
| 1.5 | Ensure `--count N` and `--feed products.csv` flags work |
| 1.6 | Verify the moved demo still runs end-to-end via `make run` |

### Phase 2: Flask Blog Demo (Priority: High)

**Goal:** Demonstrate coodie's sync API integrated with Flask, including a colorful blog UI.

| Task | Description |
|---|---|
| 2.1 | Create `demos/flask-blog/` with `pyproject.toml`, Flask app factory, and coodie `init_coodie()` in `create_app()` |
| 2.2 | Define `Post` and `Comment` models with clustering keys (newest-first), secondary indexes, and tags (list field) |
| 2.3 | Build Jinja2 templates with a colorful dark-theme UI (cards, gradients, accent colors) |
| 2.4 | Add `seed.py` with Faker blog posts and comments, `rich` progress bars |
| 2.5 | Write README with numbered quick-start and example `curl` commands |
| 2.6 | Manual end-to-end test: start → seed → browse → create post → verify |

### Phase 3: Django Task Board Demo (Priority: High)

**Goal:** Demonstrate coodie alongside Django, using Cassandra for high-write task events.

| Task | Description |
|---|---|
| 3.1 | Create `demos/django-taskboard/` with Django project scaffold and `pyproject.toml` |
| 3.2 | Define coodie models (`TaskEvent`, `TaskCounter`) in `cassandra_models.py`, separate from Django ORM models |
| 3.3 | Add `manage.py sync_cassandra` management command that calls `sync_table()` for all coodie models |
| 3.4 | Build Django views and templates with a colorful Kanban-style board UI |
| 3.5 | Add `seed.py` with Faker task events and counters |
| 3.6 | Write README explaining the dual-database pattern (Django ORM + coodie) |
| 3.7 | Manual end-to-end test |

### Phase 4: Cassandra Feature Demos — TTL, Counters, LWT (Priority: Medium)

**Goal:** Showcase TTL auto-expiry, counter columns, and lightweight transactions in standalone demos.

| Task | Description |
|---|---|
| 4.1 | Create `demos/ttl-sessions/` — ephemeral session store with `ttl=` on save and `__default_ttl__` on model |
| 4.2 | Create `demos/realtime-counters/` — page-view analytics with `CounterDocument`, `increment()`, and a live dashboard |
| 4.3 | Create `demos/lwt-user-registry/` — user registration with `if_not_exists`, optimistic locking with `if_conditions` |
| 4.4 | Each demo gets `seed.py`, colorful UI, and README |
| 4.5 | Manual end-to-end test for each demo |

### Phase 5: Cassandra Feature Demos — Batch, Collections, Views (Priority: Medium)

**Goal:** Showcase batch operations, collection types, and materialized views.

| Task | Description |
|---|---|
| 5.1 | Create `demos/batch-importer/` — CSV bulk import using `BatchQuery` (logged and unlogged), `rich` progress |
| 5.2 | Create `demos/collections-tags/` — article tagging with `set` fields, `add__`/`remove__` operations, `map` metadata |
| 5.3 | Create `demos/materialized-views/` — product catalog with auto-maintained `MaterializedView` by category |
| 5.4 | Each demo gets `seed.py`, colorful UI, and README |
| 5.5 | Manual end-to-end test for each demo |

### Phase 6: Vector Similarity Search Demo (Priority: High)

**Goal:** Add vector column support to coodie's type system and showcase it with a semantic search demo.

> **Note:** This phase requires library-level development in coodie itself
> (not just demo code), because coodie currently has **no vector support**.
> The scoped development work is listed below.

#### 6a. coodie library development (pre-requisites)

| Task | Description |
|---|---|
| 6a.1 | Add a `Vector(dimensions=N)` field annotation to `coodie/fields.py` that maps to the CQL `vector<float, N>` type |
| 6a.2 | Update `coodie/schema.py` type mapping to emit `vector<float, N>` in CREATE TABLE DDL |
| 6a.3 | Add `VectorIndex(similarity_function="COSINE")` annotation (or `Settings` option) to emit `CREATE INDEX ... USING 'vector_index' WITH OPTIONS = {'similarity_function': '...'}` |
| 6a.4 | Support ANN queries: `Model.find().order_by_ann(embedding_field, query_vector).limit(N)` or equivalent QuerySet method that emits `ORDER BY field ANN OF [...]` CQL |
| 6a.5 | Validate vector dimensions on save (list length must match declared dimensions) |
| 6a.6 | Unit tests for vector type mapping, DDL generation, ANN query building, and dimension validation |
| 6a.7 | Integration tests with ScyllaDB: create table with vector column, insert embeddings, ANN query returns nearest neighbors |

#### 6b. Vector search demo

| Task | Description |
|---|---|
| 6b.1 | Create `demos/vector-search/` — semantic product search using sentence-transformer embeddings (384-dim or smaller) |
| 6b.2 | Define `ProductEmbedding` model with `vector<float, N>` column, partition key, and vector index with cosine similarity |
| 6b.3 | `seed.py` generates product descriptions and computes embeddings (using a small model like `all-MiniLM-L6-v2` or pre-computed vectors from a JSON feed) |
| 6b.4 | Build a search UI: user enters a text query → compute embedding → ANN query → display ranked results with similarity scores |
| 6b.5 | Colorful dark-theme UI with similarity score badges and result cards |
| 6b.6 | README documents the CQL behind the scenes (`CREATE INDEX ... USING 'vector_index'`, `ORDER BY ... ANN OF`) |
| 6b.7 | Manual end-to-end test: seed → search → verify ranked results |

### Phase 7: Time-Series & Polymorphic Demos (Priority: Medium)

**Goal:** Showcase advanced data-modeling patterns.

| Task | Description |
|---|---|
| 7.1 | Create `demos/timeseries-iot/` — sensor readings with time-bucketed partitions, `per_partition_limit()`, `paged_all()` |
| 7.2 | Create `demos/polymorphic-cms/` — content management with `Article`/`Video`/`Podcast` subtypes via single-table inheritance |
| 7.3 | Each demo gets `seed.py`, colorful UI, and README |
| 7.4 | Manual end-to-end test for each demo |

### Phase 8: Argus-Inspired Tracker & Migration Guide (Priority: Medium)

**Goal:** Demonstrate complex real-world patterns from scylladb/argus and provide a cqlengine migration walkthrough.

| Task | Description |
|---|---|
| 8.1 | Create `demos/argus-tracker/` — scaled-down test tracker with User, TestRun (composite PK + clustering), Event (compound partition), Notification (TimeUUID) models |
| 8.2 | Include batch event ingestion, prepared-statement caching patterns, and partition-scoped queries |
| 8.3 | Create `demos/migration-guide/` — side-by-side `cqlengine_models.py` and `coodie_models.py` with a `migrate.py` script that syncs tables and a `verify.py` that checks data round-trip |
| 8.4 | Reference argus model patterns: composite partition keys, clustering DESC, multiple secondary indexes, List/Map collections |
| 8.5 | Each demo gets README with step-by-step walkthrough |
| 8.6 | Manual end-to-end test for each demo |

### Phase 9: Top-Level README & Polish (Priority: Low)

**Goal:** Tie all demos together with an index README and ensure consistent quality.

| Task | Description |
|---|---|
| 9.1 | Write `demos/README.md` with a table listing all demos, their focus area, and quick-start links |
| 9.2 | Add a `docker-compose.yml` at `demos/` level for shared ScyllaDB instance |
| 9.3 | Ensure every demo has consistent Makefile targets, color theming, README structure, and seed.py interface |
| 9.4 | Update the top-level `README.md` to link to the new `demos/` directory |
| 9.5 | Final review of all demos for consistency and correctness |

---

## 7. Vector Search — Library Development Scope

Phase 6 above requires adding vector support to coodie's core library **before**
the demo can be built. This section summarizes the scope of that work.

coodie currently has **no vector type, no vector index support, and no ANN query
syntax**. ScyllaDB (and Cassandra 5.0+) support the `vector<T, N>` CQL type
and `ORDER BY ... ANN OF [...]` queries for approximate nearest-neighbor search.

The argus project (`scylladb/argus`) implements a custom `Vector` column class
extending cqlengine's `columns.List` that emits `vector<float, 384>` DDL and
uses `CREATE INDEX ... USING 'vector_index' WITH OPTIONS = {'similarity_function': 'COSINE'}`
for cosine-similarity indexes.

### What coodie needs

| Area | What to Add | CQL Equivalent |
|---|---|---|
| **Field type** | `Vector(dimensions=N)` annotation in `fields.py` | `vector<float, N>` column type |
| **Schema DDL** | Type mapping in `schema.py` for CREATE TABLE | `embedding vector<float, 384>` |
| **Index DDL** | `VectorIndex(similarity="COSINE")` annotation or Settings hook | `CREATE INDEX ... USING 'vector_index' WITH OPTIONS = {'similarity_function': 'COSINE'}` |
| **Query builder** | `order_by_ann(field, query_vector)` on QuerySet | `ORDER BY embedding ANN OF [0.1, 0.2, ...]` |
| **Validation** | Dimension check on save (list length == declared N) | — |
| **Driver support** | Verify both cassandra-driver and acsylla handle `vector<float, N>` binding | — |

### Estimated complexity

- **Fields + schema**: Low — similar to adding any new CQL type annotation
- **Vector index DDL**: Medium — requires a new index creation path (not a
  standard secondary index)
- **ANN query syntax**: Medium — new QuerySet method that emits non-standard
  `ORDER BY` clause
- **Driver compatibility**: Unknown — needs testing with both drivers

---

## 8. Shared Infrastructure

### 8.1 Docker Compose (shared ScyllaDB)

All demos share a single ScyllaDB container via `demos/docker-compose.yml`:

```yaml
services:
  scylladb:
    image: scylladb/scylla:latest
    ports:
      - "9042:9042"
    command: --smp 1 --memory 512M --developer-mode 1
```

### 8.2 Makefile Convention

Every demo includes a `Makefile` with standard targets so that `make run` is the
only command a user needs to try the demo end-to-end:

```makefile
COMPOSE  := docker compose -f ../docker-compose.yml
KEYSPACE := <demo_keyspace>

.PHONY: db-up db-down seed run clean

db-up:                          ## Start ScyllaDB and create keyspace
	$(COMPOSE) up -d
	@echo "Waiting for ScyllaDB to be ready..."
	@until $(COMPOSE) exec scylladb nodetool status 2>/dev/null | grep -q "^UN"; do sleep 2; done
	$(COMPOSE) exec scylladb cqlsh -e \
	  "CREATE KEYSPACE IF NOT EXISTS $(KEYSPACE) \
	   WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'};"

db-down:                        ## Stop ScyllaDB
	$(COMPOSE) down

seed: db-up                     ## Seed sample data (depends on db-up)
	uv run python seed.py --count 50

run: seed                       ## Install deps, seed, and start the app
	uv run uvicorn main:app --reload

clean: db-down                  ## Stop DB and remove data volumes
	$(COMPOSE) down -v
```

**Rules:**
- Targets reference the shared `demos/docker-compose.yml` via `../docker-compose.yml`
- `db-up` waits for ScyllaDB to report `UN` (Up/Normal) before creating the keyspace
- `seed` depends on `db-up` so it works standalone
- `run` depends on `seed` so a single `make run` does everything
- Demo-specific targets (e.g., `migrate`, `sync-tables`) may be added as needed
- Django demos use `manage.py` commands in place of `uvicorn`

### 8.3 Seed Script Convention

Every `seed.py` follows a common pattern:

```python
"""Seed <demo-name> with sample data."""
import click
from rich.progress import track

@click.command()
@click.option("--count", default=50, help="Number of records to generate")
@click.option("--feed", type=click.Path(exists=True), help="CSV/JSON file with real data")
def seed(count: int, feed: str | None) -> None:
    ...

if __name__ == "__main__":
    seed()
```

### 8.4 Color Theme Convention

All demos with a web UI use a dark-theme palette consistent with the existing
FastAPI demo:

| Variable | Value | Purpose |
|---|---|---|
| `--bg` | `#0f172a` | Page background |
| `--surface` | `#1e293b` | Card background |
| `--border` | `#334155` | Borders |
| `--text` | `#e2e8f0` | Body text |
| `--accent` | `#38bdf8` | Links, highlights |
| `--success` | `#34d399` | Positive actions |
| `--danger` | `#f87171` | Destructive actions |

Each demo may add 1–2 custom accent colors to differentiate its identity.

---

## 9. References

- [Existing FastAPI demo](../../demo/) — current single-demo implementation
- [scylladb/argus](https://github.com/scylladb/argus) — production Flask + cqlengine app with complex models, UDTs, batch writes, composite keys
- [argus models: web.py](https://github.com/scylladb/argus/blob/master/argus/backend/models/web.py) — User, Release, Group, Test, Notification models
- [argus models: testrun.py](https://github.com/scylladb/argus/blob/master/argus/backend/plugins/sct/testrun.py) — SCTTestRun with composite PK, clustering, collections
- [argus UDTs: udt.py](https://github.com/scylladb/argus/blob/master/argus/backend/plugins/sct/udt.py) — PackageVersion, CloudResource, NemesisRunInfo
- [flask-cqlalchemy](https://github.com/thegeorgeous/flask-cqlalchemy) — Flask + cqlengine integration patterns
- [reddit/cqlmapper](https://github.com/reddit/cqlmapper) — production cqlengine fork with batch, UDT, advanced query patterns
- [coodie documentation plan](documentation-plan.md) — documentation milestones and style guide
- [coodie feature-parity plan](cqlengine-feature-parity.md) — full feature gap analysis against cqlengine
- [coodie benchmarks: argus models](../../benchmarks/models_argus_coodie.py) — existing benchmark models inspired by argus patterns
- [ScyllaDB vector search docs](https://cloud.docs.scylladb.com/stable/vector-search/work-with-vector-search.html) — CQL syntax for `vector<T, N>` type, vector indexes, and ANN queries
- [argus vector models: argus_ai.py](https://github.com/scylladb/argus/blob/master/argus/backend/models/argus_ai.py) — production `Vector` column type, `SCTErrorEventEmbedding` with 384-dim cosine-similarity index
