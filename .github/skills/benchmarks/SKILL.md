---
name: benchmarks
description: Guide for running and writing coodie vs cqlengine performance benchmarks. Use when asked to run benchmarks, add new benchmarks, investigate performance, or debug benchmark failures.
---

# Performance Benchmarks

Side-by-side pytest-benchmark suite comparing **coodie** against **cqlengine**.
Benchmarks live in the `benchmarks/` directory at the repository root.

## When to Use This Skill

- Running performance benchmarks (coodie vs cqlengine)
- Adding a new benchmark for a coodie feature
- Investigating performance regressions or bottlenecks
- Debugging benchmark CI failures
- Comparing benchmark results over time

## Prerequisites

- **Docker** must be running — most benchmarks spin up a ScyllaDB container
  via [testcontainers](https://testcontainers-python.readthedocs.io/).
- **Python ≥ 3.10**
- `scylla-driver` (or `cassandra-driver`) and `pytest-benchmark` must be installed.

### Setup

See [setup-environment.md](../setup-environment.md) for the shared environment
setup (dev dependencies, pre-commit hooks, commit/push checklist).

Then install the scylla driver extra if not already present:

```bash
uv pip install -e ".[scylla]"
```

## Running Benchmarks

Benchmarks are disabled by default (`--benchmark-disable` in `pyproject.toml`
addopts).  Pass `--benchmark-enable` to activate them.

```bash
# Run all benchmarks (requires Docker)
uv run pytest benchmarks/ -v --benchmark-enable --benchmark-sort=mean

# Run a specific benchmark file
uv run pytest benchmarks/bench_insert.py -v --benchmark-enable

# Compare coodie vs cqlengine side by side (grouped)
uv run pytest benchmarks/ -v --benchmark-enable --benchmark-group-by=group

# Serialization benchmarks only — no Docker needed
uv run pytest benchmarks/bench_serialization.py -v --benchmark-enable
```

### Running with Different Drivers

Use `--driver-type` to choose which driver coodie uses for benchmarks.
The **cqlengine** side always uses cassandra-driver / scylla-driver.

```bash
# Default — coodie uses CassandraDriver backed by scylla-driver
uv run pytest benchmarks/ -v --benchmark-enable --driver-type=scylla

# coodie uses AcsyllaDriver (async-native)
uv pip install -e ".[acsylla]"
uv run pytest benchmarks/ -v --benchmark-enable --driver-type=acsylla
```

### Saving and Comparing Results

```bash
# Save results as a named baseline
uv run pytest benchmarks/ --benchmark-enable --benchmark-save=baseline

# Compare against a saved baseline
uv run pytest benchmarks/ --benchmark-enable --benchmark-compare=0001_baseline

# Generate an HTML histogram report
uv run pytest benchmarks/ --benchmark-enable --benchmark-histogram=bench_results
```

## Benchmark Directory Layout

```
benchmarks/
├── conftest.py              # Session fixtures: ScyllaDB container, cqlengine + coodie setup
├── models_cqlengine.py      # cqlengine model definitions (Product, Review, Event)
├── models_coodie.py         # coodie model definitions (identical schema)
├── bench_insert.py          # INSERT benchmarks
├── bench_read.py            # SELECT / query benchmarks
├── bench_update.py          # UPDATE benchmarks
├── bench_delete.py          # DELETE benchmarks
├── bench_batch.py           # Batch operation benchmarks
├── bench_schema.py          # DDL / sync_table benchmarks
├── bench_collections.py     # Collection type read/write benchmarks
├── bench_serialization.py   # Model instantiation + serialization (no DB)
└── README.md                # Full documentation
```

## Writing a New Benchmark

Each benchmark file contains paired functions — one for cqlengine, one for
coodie — grouped by `@pytest.mark.benchmark(group="<name>")`.

### Template

```python
"""<Feature> benchmarks — coodie vs cqlengine."""

from __future__ import annotations

from uuid import uuid4
import pytest


@pytest.mark.benchmark(group="my-feature")
def test_cqlengine_my_feature(benchmark, bench_env):
    from benchmarks.models_cqlengine import CqlProduct

    def _op():
        CqlProduct.create(id=uuid4(), name="Bench")

    benchmark(_op)


@pytest.mark.benchmark(group="my-feature")
def test_coodie_my_feature(benchmark, bench_env):
    from benchmarks.models_coodie import CoodieProduct

    def _op():
        CoodieProduct(id=uuid4(), name="Bench").save()

    benchmark(_op)
```

### Key Conventions

- Use the `bench_env` fixture for tests that need the database (ensures both
  cqlengine and coodie are initialised with a ScyllaDB container).
- Omit `bench_env` for pure-Python benchmarks (e.g. serialization).
- Name functions `test_cqlengine_<feature>` and `test_coodie_<feature>`.
- Use the same `group=` value so results are displayed side by side.

## Fixture Reference

| Fixture | Scope | Description |
|---------|-------|-------------|
| `scylla_container` | session | ScyllaDB Docker container (testcontainers) |
| `cql_session` | session | Raw cassandra-driver `Session` connected to `bench_ks` |
| `cqlengine_connection` | session | cqlengine registered + tables synced |
| `coodie_connection` | session | coodie driver registered + tables synced |
| `bench_env` | session | Ensures both cqlengine and coodie are ready |

## Performance Targets

| Metric | Target |
|--------|--------|
| Single INSERT latency | ≤ 1.2× cqlengine |
| Single GET by PK latency | ≤ 1.1× cqlengine |
| Bulk INSERT (100 rows, batch) | ≤ 1.1× cqlengine |
| Model instantiation from dict | ≤ 2× cqlengine |
| Memory per 1000 model instances | ≤ 1.5× cqlengine |
| `sync_table` DDL | ≤ 1.05× cqlengine |

Pydantic validation adds overhead versus cqlengine's metaclass approach.
These targets accept that trade-off in exchange for type safety and FastAPI
integration.

## Bottleneck Investigation

When a benchmark shows coodie is slower than cqlengine:

1. **Flame graph** — `py-spy record -o profile.svg -- python -m pytest benchmarks/bench_insert.py -v`
2. **Python vs C time** — `scalene --- -m pytest benchmarks/bench_insert.py -v`
3. **Memory** — `memray run -o output.bin -m pytest benchmarks/bench_insert.py -v && memray flamegraph output.bin`
4. **Isolate the layer** — run the same CQL via raw `driver.execute()` to check if overhead is in the ORM layer or the driver
5. **Serialization** — compare `model_dump()` vs cqlengine's internal serialization separately (see `bench_serialization.py`)
6. **Prepared-statement cache** — verify cache hits (a miss = extra round-trip)

## CI Integration

The `.github/workflows/benchmark.yml` workflow runs benchmarks:

- On every push to `main`
- On a weekly schedule (Monday 06:00 UTC)
- On pull requests when the **`benchmark`** label is added

Results are exported as a `benchmark-results.json` artifact (retained 90 days).

To trigger benchmarks on a PR, add the `benchmark` label.
