# coodie Demo Suite

> A collection of standalone demo applications showcasing **coodie** — the
> Pydantic-native Cassandra/ScyllaDB ORM — across different frameworks and
> Cassandra features.

## Quick Start

Every demo is self-contained. Pick one, `cd` into its folder, and run:

```bash
make run
```

This single command starts ScyllaDB (via Docker Compose), creates the keyspace,
seeds sample data, and launches the app.

## Prerequisites

* Python ≥ 3.10
* [uv](https://docs.astral.sh/uv/) (recommended) or pip
* Docker & Docker Compose (for ScyllaDB)

## Demos

| Demo | Framework | Features Shown | Directory |
|---|---|---|---|
| 🛒 Product Catalog | FastAPI + HTMX | Async CRUD, secondary indexes, clustering order, Jinja2 templates, seed data | [`fastapi-catalog/`](fastapi-catalog/) |

## Shared Infrastructure

All demos share a single ScyllaDB container defined in
[`docker-compose.yml`](docker-compose.yml). Each demo's `Makefile` references
this shared file via `../docker-compose.yml`.

### Standard Makefile Targets

| Target | Description |
|---|---|
| `make db-up` | Start ScyllaDB and create the demo's keyspace |
| `make db-down` | Stop ScyllaDB |
| `make seed` | Seed sample data (depends on `db-up`) |
| `make run` | Install deps, seed data, and start the app |
| `make clean` | Stop DB and remove data volumes |

## Adding a New Demo

1. Create a folder under `demos/<name>/`
2. Add `pyproject.toml`, `README.md`, `Makefile`, `models.py`, `seed.py`
3. Follow the Makefile convention above
4. Update this README's demo table
