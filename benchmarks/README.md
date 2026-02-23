# Performance Benchmarks

Side-by-side benchmarks comparing **coodie** against **cqlengine** (from
cassandra-driver / scylla-driver) to ensure coodie introduces no regressions and
to surface bottlenecks early.

## Prerequisites

* **Docker** — benchmarks spin up a ScyllaDB container via
  [testcontainers](https://testcontainers-python.readthedocs.io/).
* **Python ≥ 3.10**
* Both `scylla-driver` (or `cassandra-driver`) **and** `pytest-benchmark` must
  be installed:

```bash
pip install pytest-benchmark scylla-driver
# or with uv
uv sync --all-groups
```

## Running Benchmarks

```bash
# Run all benchmarks (requires Docker for ScyllaDB container)
pytest benchmarks/ -v --benchmark-enable --benchmark-sort=mean

# Run a specific benchmark file
pytest benchmarks/bench_insert.py -v --benchmark-enable

# Compare coodie vs cqlengine side by side (grouped)
pytest benchmarks/ -v --benchmark-enable --benchmark-group-by=group

# Save results for historical tracking
pytest benchmarks/ --benchmark-enable --benchmark-save=baseline

# Compare against a saved baseline
pytest benchmarks/ --benchmark-enable --benchmark-compare=0001_baseline

# Generate HTML histogram report
pytest benchmarks/ --benchmark-enable --benchmark-histogram=bench_results
```

## Benchmark Files

| File | What It Benchmarks |
|---|---|
| `bench_insert.py` | Single INSERT, INSERT IF NOT EXISTS, INSERT with TTL |
| `bench_read.py` | GET by PK, filter by secondary index, filter + LIMIT, COUNT |
| `bench_update.py` | Partial UPDATE, UPDATE with IF condition (LWT) |
| `bench_delete.py` | Single DELETE, bulk DELETE via QuerySet |
| `bench_batch.py` | Batch INSERT (10 rows), batch INSERT (100 rows) |
| `bench_schema.py` | `sync_table` create, `sync_table` idempotent no-op |
| `bench_collections.py` | Collection field write/read/round-trip (list\<str\>) |
| `bench_serialization.py` | Model instantiation and serialization (no DB) |

## Interpreting Results

`pytest-benchmark` prints a table with min, max, mean, stddev, and rounds for
each benchmark.  When using `--benchmark-group-by=group`, coodie and cqlengine
results are displayed together for easy comparison.

Key columns:
- **Mean** — average time per call
- **StdDev** — lower is more consistent
- **Rounds** — number of iterations (more = more reliable)
- **OPS** — operations per second (higher is better)

## Performance Targets

| Metric | Target |
|---|---|
| Single INSERT latency | ≤ 1.2× cqlengine |
| Single GET by PK latency | ≤ 1.1× cqlengine |
| Bulk INSERT (100 rows, batch) | ≤ 1.1× cqlengine |
| Model instantiation from dict | ≤ 2× cqlengine |
| Memory per 1000 model instances | ≤ 1.5× cqlengine |
| `sync_table` DDL | ≤ 1.05× cqlengine |

> **Note:** Pydantic validation adds inherent overhead compared to cqlengine's
> lighter metaclass approach.  The targets above accept this trade-off in
> exchange for type safety, better IDE support, and FastAPI integration.

## Bottleneck Investigation

When a benchmark shows coodie is slower than cqlengine:

1. **Identify the hot path** — `py-spy record -o profile.svg -- python -m pytest benchmarks/bench_insert.py -v`
2. **Separate Python vs C time** — `scalene --- -m pytest benchmarks/bench_insert.py -v`
3. **Check memory** — `memray run -o output.bin -m pytest benchmarks/bench_insert.py -v && memray flamegraph output.bin`
4. **Isolate the layer** — Run the same CQL via raw `driver.execute()` to
   determine if overhead is in coodie's ORM layer or the driver
5. **Compare serialization** — Benchmark `model_dump()` vs cqlengine's internal
   serialization separately (see `bench_serialization.py`)
6. **Check prepared statements** — Verify coodie's prepared-statement cache is
   hit (cache miss = extra round-trip)

## CI Integration

The `benchmark.yml` GitHub Actions workflow runs benchmarks on pushes to `main`
and on a weekly schedule.  Results are exported as JSON artifacts and can be
tracked over time using
[github-action-benchmark](https://github.com/benchmark-action/github-action-benchmark).
