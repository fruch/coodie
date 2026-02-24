# Demo Suite Extension Plan

> **Goal:** Expand the demo suite from a single FastAPI app into a collection of
> standalone, colorful demo applications — each in its own folder — covering
> Django integration, Flask integration, Cassandra-specific features (TTL,
> counters, LWT, batch, collections, materialized views), migration patterns
> inspired by scylladb/argus, and built-in sample-data generation with options
> for real-data feeds.

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
7. [Shared Infrastructure](#7-shared-infrastructure)
8. [References](#8-references)

---

## 1. Current State

The repository has a single demo application:

| Demo | Framework | Features Shown | Location |
|---|---|---|---|
| Product Catalog API | FastAPI + HTMX | Async CRUD, secondary indexes, clustering order, Jinja2 templates | `demo/` |

The existing demo is well-structured with a dark-theme HTMX UI, but covers only
basic CRUD via the async API. No Django, Flask, sync API, TTL, counters, LWT,
batch, collections, materialized views, or migration workflows are demonstrated.

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

**Gap summary — Cassandra features:**
- TTL → short-lived session/token store showing data that auto-expires
- Counters → page-view / vote analytics dashboard with live counter updates
- LWT → user registration with uniqueness guarantees, optimistic concurrency
- Batch → bulk CSV import tool using logged and unlogged batches
- Collections → tagging system with set operations, JSON-like map fields
- Materialized Views → product-by-category view auto-maintained by Cassandra
- Time-Series → IoT sensor data with time-bucketed partitions and pagination
- Polymorphic → content management with Article / Video / Podcast subtypes

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
├── fastapi-catalog/                   # Existing demo (moved from demo/)
│   ├── README.md
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
│   ├── pyproject.toml
│   ├── app.py
│   ├── models.py
│   ├── seed.py
│   └── templates/
├── django-taskboard/                  # NEW: Django integration
│   ├── README.md
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
│   ├── pyproject.toml
│   ├── main.py
│   ├── models.py
│   └── seed.py
├── realtime-counters/                 # NEW: Counter columns
│   ├── README.md
│   ├── pyproject.toml
│   ├── main.py
│   ├── models.py
│   └── seed.py
├── lwt-user-registry/                 # NEW: Lightweight transactions
│   ├── README.md
│   ├── pyproject.toml
│   ├── main.py
│   ├── models.py
│   └── seed.py
├── batch-importer/                    # NEW: Batch operations
│   ├── README.md
│   ├── pyproject.toml
│   ├── main.py
│   ├── models.py
│   └── seed.py
├── collections-tags/                  # NEW: Collections & nested types
│   ├── README.md
│   ├── pyproject.toml
│   ├── main.py
│   ├── models.py
│   └── seed.py
├── materialized-views/                # NEW: Materialized views
│   ├── README.md
│   ├── pyproject.toml
│   ├── main.py
│   ├── models.py
│   └── seed.py
├── timeseries-iot/                    # NEW: Time-series patterns
│   ├── README.md
│   ├── pyproject.toml
│   ├── main.py
│   ├── models.py
│   └── seed.py
├── polymorphic-cms/                   # NEW: Single-table inheritance
│   ├── README.md
│   ├── pyproject.toml
│   ├── main.py
│   ├── models.py
│   └── seed.py
├── argus-tracker/                     # NEW: Argus-inspired complex models
│   ├── README.md
│   ├── pyproject.toml
│   ├── main.py
│   ├── models.py
│   └── seed.py
└── migration-guide/                   # NEW: cqlengine → coodie migration
    ├── README.md
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
| 1.3 | Add `seed.py` to `demos/fastapi-catalog/` with Faker-based product/review generation and `rich` progress output |
| 1.4 | Ensure `--count N` and `--feed products.csv` flags work |
| 1.5 | Verify the moved demo still runs end-to-end |

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

### Phase 6: Time-Series & Polymorphic Demos (Priority: Medium)

**Goal:** Showcase advanced data-modeling patterns.

| Task | Description |
|---|---|
| 6.1 | Create `demos/timeseries-iot/` — sensor readings with time-bucketed partitions, `per_partition_limit()`, `paged_all()` |
| 6.2 | Create `demos/polymorphic-cms/` — content management with `Article`/`Video`/`Podcast` subtypes via single-table inheritance |
| 6.3 | Each demo gets `seed.py`, colorful UI, and README |
| 6.4 | Manual end-to-end test for each demo |

### Phase 7: Argus-Inspired Tracker & Migration Guide (Priority: Medium)

**Goal:** Demonstrate complex real-world patterns from scylladb/argus and provide a cqlengine migration walkthrough.

| Task | Description |
|---|---|
| 7.1 | Create `demos/argus-tracker/` — scaled-down test tracker with User, TestRun (composite PK + clustering), Event (compound partition), Notification (TimeUUID) models |
| 7.2 | Include batch event ingestion, prepared-statement caching patterns, and partition-scoped queries |
| 7.3 | Create `demos/migration-guide/` — side-by-side `cqlengine_models.py` and `coodie_models.py` with a `migrate.py` script that syncs tables and a `verify.py` that checks data round-trip |
| 7.4 | Reference argus model patterns: composite partition keys, clustering DESC, multiple secondary indexes, List/Map collections |
| 7.5 | Each demo gets README with step-by-step walkthrough |
| 7.6 | Manual end-to-end test for each demo |

### Phase 8: Top-Level README & Polish (Priority: Low)

**Goal:** Tie all demos together with an index README and ensure consistent quality.

| Task | Description |
|---|---|
| 8.1 | Write `demos/README.md` with a table listing all demos, their focus area, and quick-start links |
| 8.2 | Add a `docker-compose.yml` at `demos/` level for shared ScyllaDB instance |
| 8.3 | Ensure every demo has consistent color theming, README structure, and seed.py interface |
| 8.4 | Update the top-level `README.md` to link to the new `demos/` directory |
| 8.5 | Final review of all demos for consistency and correctness |

---

## 7. Shared Infrastructure

### 7.1 Docker Compose (shared ScyllaDB)

All demos share a single ScyllaDB container via `demos/docker-compose.yml`:

```yaml
services:
  scylladb:
    image: scylladb/scylla:latest
    ports:
      - "9042:9042"
    command: --smp 1 --memory 512M --developer-mode 1
```

### 7.2 Seed Script Convention

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

### 7.3 Color Theme Convention

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

## 8. References

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
