# Performance Improvement Plan for coodie

> **Based on**: Benchmark CI run [#64603357715](https://github.com/fruch/coodie/actions/runs/22325833587/job/64603357715?pr=31#step:5:305)
> **Date**: 2026-02-23
> **Status**: Draft — priorities based on initial benchmark data

---

## 1. Benchmark Summary

### 1.1 Where coodie is faster (Pydantic advantage)

| Operation | coodie | cqlengine | Ratio | Notes |
|-----------|--------|-----------|-------|-------|
| Model instantiation | 1.94 µs | 11.6 µs | **0.17× (6× faster)** | Pydantic compiled validators |
| Model serialization | 2.01 µs | 4.62 µs | **0.43× (2.3× faster)** | `model_dump()` vs cqlengine internals |

### 1.2 Where coodie is slower (ORM overhead)

| Operation | coodie | cqlengine | Ratio | Severity |
|-----------|--------|-----------|-------|----------|
| `sync_table` no-op | 4,199 µs | 233 µs | **18× slower** | 🔴 Critical |
| Filter (secondary index) | 19.3 ms | 4.6 ms | **4.2× slower** | 🔴 Critical |
| Partial UPDATE | 2,359 µs | 559 µs | **4.2× slower** | 🔴 Critical |
| Filter + LIMIT | 3.23 ms | 1.22 ms | **2.7× slower** | 🟠 High |
| GET by PK | 1,441 µs | 675 µs | **2.1× slower** | 🟠 High |
| UPDATE IF condition (LWT) | 3.09 ms | 1.34 ms | **2.3× slower** | 🟠 High |
| Collection read | 1,565 µs | 701 µs | **2.2× slower** | 🟠 High |
| Collection roundtrip | 2.63 ms | 1.42 ms | **1.85× slower** | 🟡 Medium |
| Bulk DELETE | 2.10 ms | 1.19 ms | **1.76× slower** | 🟡 Medium |
| Single INSERT | 1,055 µs | 612 µs | **1.72× slower** | 🟡 Medium |
| Single DELETE | 1.96 ms | 1.13 ms | **1.73× slower** | 🟡 Medium |
| Collection write | 1,086 µs | 677 µs | **1.60× slower** | 🟡 Medium |
| INSERT with TTL | 1,068 µs | 616 µs | **1.73× slower** | 🟡 Medium |
| COUNT | 1.54 ms | 1.05 ms | **1.46× slower** | 🟢 Acceptable |
| INSERT IF NOT EXISTS | 1.81 ms | 1.39 ms | **1.30× slower** | 🟢 Acceptable |

---

## 2. Root Cause Analysis

### 2.1 `_rows_to_dicts()` is the dominant bottleneck

Every query goes through `CassandraDriver._rows_to_dicts()` which iterates over
each row and converts it to a `dict`. This happens even when the driver already
returns Named Tuples (the default `row_factory`).

**Cost per row**: `hasattr` check + `_asdict()` call + `dict()` wrapping.

For queries returning N rows, this is O(N) dict allocations *before* Pydantic
even starts constructing model instances. cqlengine avoids this by working
directly with the driver's native row objects.

**Impact**: Affects every read operation — GET, filter, collection read, count.

### 2.2 `sync_table` always executes 3+ CQL queries

On every no-op `sync_table` call, coodie:
1. Executes `CREATE TABLE IF NOT EXISTS` (even if the table exists)
2. Queries `system_schema.columns` to detect missing columns
3. Scans all columns for index creation

cqlengine caches table metadata and skips the DDL if the table is already known.
coodie has no caching — every `sync_table` call hits the database.

### 2.3 `build_schema()` re-runs `get_type_hints()` on every write

`Document.save()` calls `_schema()` which calls `build_schema()`. Although there's
a cache check (`__schema__`), `_find_discriminator_column()` and
`_get_discriminator_value()` are called on every `save()` operation, each calling
`get_type_hints()` which is expensive (involves `typing` module introspection).

### 2.4 No CQL query caching at the QuerySet level

Each `QuerySet.all()`, `first()`, `get()`, etc. calls `build_select()` which
constructs a new CQL string via f-string interpolation every time. The same
logical query (e.g., "get product by id") builds the same CQL string repeatedly.

### 2.5 `get_driver()` function-level import on every call

`get_driver()` is called from inside method bodies, which means Python re-evaluates
the `from coodie.drivers import get_driver` import statement on every call.
While cached by Python's import system, the import machinery lookup has non-zero
cost at high call frequency.

### 2.6 Quadratic column scan in `sync_table`

The `sync_table` method iterates over all columns twice: once to check for missing
columns (`if col.name not in existing`) and once to check for indexes
(`if col.index`). For N columns, this is 2×N iterations plus an O(N) set lookup per
column.

---

## 3. Improvement Plan

### Phase 1 — Quick wins (estimated 30-50% improvement on reads)

#### 3.1 Optimize `_rows_to_dicts()` by type-checking once

**Current**: checks `hasattr(row, "_asdict")` for *every* row.
**Proposed**: Check the first row's type, then use the appropriate fast path
for all remaining rows.

```python
def _rows_to_dicts(result_set):
    if not result_set:
        return []
    rows = list(result_set)
    if not rows:
        return []
    sample = rows[0]
    if hasattr(sample, "_asdict"):
        return [dict(r._asdict()) for r in rows]
    elif isinstance(sample, dict):
        return rows  # already dicts — zero-copy!
    else:
        return [{k: v for k, v in r.__dict__.items() if not k.startswith("_")} for r in rows]
```

**Estimated impact**: ~20-30% faster reads when `dict_factory` is in use (zero-copy);
~10% faster for Named Tuple rows (no per-row `hasattr`).

#### 3.2 Cache discriminator metadata per class

Cache the discriminator column name and value as class-level attributes after first
computation:

```python
@classmethod
def _cached_disc_info(cls):
    if not hasattr(cls, "_disc_col_cache"):
        cls._disc_col_cache = _find_discriminator_column(cls)
        cls._disc_val_cache = _get_discriminator_value(cls)
    return cls._disc_col_cache, cls._disc_val_cache
```

**Estimated impact**: Eliminates `get_type_hints()` on every `save()`/`insert()` call.
~10-15% faster writes for non-polymorphic models.

#### 3.3 Move `from coodie.drivers import get_driver` to module level

Replace function-level imports of `get_driver` with a module-level import
(guarded by lazy initialization if needed to avoid circular imports).

**Estimated impact**: Marginal per-call (~1-5%), but compounds across all operations.

### Phase 2 — `sync_table` optimization (target: ≤ 2× cqlengine)

#### 3.4 Add table metadata cache to `CassandraDriver`

```python
class CassandraDriver:
    def __init__(self, ...):
        ...
        self._known_tables: set[str] = set()

    def sync_table(self, table, keyspace, cols, ...):
        cache_key = f"{keyspace}.{table}"
        if cache_key in self._known_tables:
            return  # table already synced this session
        # ... existing DDL logic ...
        self._known_tables.add(cache_key)
```

**Estimated impact**: Reduces `sync_table` no-op from 4,199 µs to ~0 µs (cache hit).
This alone closes the 18× gap.

#### 3.5 Use `CREATE TABLE IF NOT EXISTS` result to skip column introspection

If the `CREATE TABLE` succeeds (table was just created), skip the
`_get_existing_columns()` query since all columns are known to be present.

**Estimated impact**: Reduces first-run `sync_table` from 3 queries to 1.

### Phase 3 — Query path optimization (target: ≤ 1.5× cqlengine for reads)

#### 3.6 Build CQL for `model_dump()` directly, skipping intermediate dict

For `save()`/`insert()`, the current flow is:
```
model → model_dump() → dict → build_insert(dict) → CQL string
```

Optimize to:
```
model → build_insert_from_model(model) → CQL string
```

This avoids creating an intermediate dict for every write.

**Estimated impact**: ~15% faster writes.

#### 3.7 Construct Pydantic models from driver rows without intermediate dict

For reads, the current flow is:
```
driver rows → _rows_to_dicts() → list[dict] → [Model(**dict) for dict] → list[Model]
```

Optimize by passing `model_validate()` directly:
```
driver rows → [Model.model_validate(row) for row] → list[Model]
```

Pydantic's `model_validate()` can accept Named Tuples and mappings directly.

**Estimated impact**: Eliminates dict allocation per row. ~20-30% faster reads.

#### 3.8 Cache CQL query strings in QuerySet

For the common case of `Model.objects.filter(id=uuid).get()`, the CQL query
string is always `SELECT ... FROM ks.table WHERE "id" = ?`. Cache this:

```python
class QuerySet:
    _cql_cache: ClassVar[dict[tuple, tuple[str, list]]] = {}
```

**Estimated impact**: Eliminates f-string CQL construction on repeat queries.
~5-10% faster for repeated query patterns.

### Phase 4 — Filter path optimization (target: ≤ 2× for filtered queries)

#### 3.9 Optimize `parse_filter_kwargs()` string splitting

The current filter parsing splits kwargs on `__` to detect operators. This involves
string manipulation for every filter keyword argument. Pre-compile common patterns.

#### 3.10 Reduce `QuerySet._clone()` overhead

Every chained call (`.filter().limit().allow_filtering()`) creates a new `QuerySet`
instance. Each clone copies all parameters. Consider using a builder pattern that
mutates in place until a terminal method is called.

**Estimated impact**: ~10-15% faster for complex chained queries.

### Phase 5 — Async optimization

#### 3.11 Eliminate `run_in_executor` for CassandraDriver async path

The current async implementation uses `run_in_executor` to delegate to the sync
`execute()`. This adds thread-pool overhead. Instead, use the cassandra-driver's
native async `execute_async()` with proper callback handling.

**Estimated impact**: ~20-40% faster async operations (eliminates thread pool hop).

---

## 4. Priority Matrix

| Phase | Task | Effort | Impact | Priority |
|-------|------|--------|--------|----------|
| 1 | 3.1 Optimize `_rows_to_dicts()` | Small | High | **P0** |
| 1 | 3.2 Cache discriminator metadata | Small | Medium | **P0** |
| 2 | 3.4 Table metadata cache | Small | Critical | **P0** |
| 1 | 3.3 Module-level `get_driver` import | Small | Low | P1 |
| 2 | 3.5 Skip column introspection on create | Medium | Medium | P1 |
| 3 | 3.7 Skip intermediate dict on reads | Medium | High | **P1** |
| 3 | 3.6 Skip intermediate dict on writes | Medium | Medium | P1 |
| 3 | 3.8 CQL query string cache | Medium | Low | P2 |
| 4 | 3.10 Reduce `_clone()` overhead | Medium | Medium | P2 |
| 4 | 3.9 Pre-compile filter patterns | Small | Low | P2 |
| 5 | 3.11 Native async for CassandraDriver | Large | High | P2 |

---

## 5. Success Criteria

After implementing P0 and P1 items:

| Metric | Current | Target |
|--------|---------|--------|
| Single INSERT latency | 1.72× cqlengine | ≤ 1.3× |
| GET by PK latency | 2.13× cqlengine | ≤ 1.5× |
| Filter + LIMIT latency | 2.66× cqlengine | ≤ 1.8× |
| `sync_table` no-op | 18× cqlengine | ≤ 1.5× |
| Partial UPDATE | 4.22× cqlengine | ≤ 2× |
| Model instantiation | 0.17× cqlengine | ≤ 0.2× (maintain advantage) |
| Model serialization | 0.43× cqlengine | ≤ 0.5× (maintain advantage) |

---

## 6. Measurement

All improvements must be validated with the benchmark suite:

```bash
# Save current baseline
pytest benchmarks/ --benchmark-enable --benchmark-save=pre-optimization

# After changes
pytest benchmarks/ --benchmark-enable --benchmark-compare=0001_pre-optimization
```

Regressions in any benchmark > 5% must be investigated before merging.

---

## 7. Notes

- coodie's Pydantic-based model system is **already 6× faster** than cqlengine for
  pure Python model construction. The overhead is in the ORM ↔ driver interface.
- The biggest single improvement is task 3.4 (table cache) — it eliminates the
  **18× overhead** on `sync_table` with minimal code change.
- Tasks 3.1 and 3.7 together can significantly reduce read latency by eliminating
  unnecessary dict conversions.
- The filter-secondary-index benchmark (4.2× slower) likely includes Pydantic model
  construction overhead for multiple rows — task 3.7 directly addresses this.
