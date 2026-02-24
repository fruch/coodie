# Performance Improvement Plan for coodie

> **Based on**: Benchmark CI run [#22353872673](https://github.com/fruch/coodie/actions/runs/22353872673) — scylla driver ([job](https://github.com/fruch/coodie/actions/runs/22353872673/job/64694559794?pr=31#step:5:122)) and acsylla driver ([job](https://github.com/fruch/coodie/actions/runs/22353872673/job/64694559911?pr=31#step:5:122))
> **Date**: 2026-02-24
> **Status**: Updated with latest benchmark results and cross-driver comparison

---

## 1. Benchmark Summary (scylla driver)

### 1.1 Where coodie is faster (Pydantic advantage)

| Operation | coodie | cqlengine | Ratio | Notes |
|-----------|--------|-----------|-------|-------|
| Model instantiation | 2.00 µs | 11.58 µs | **0.17× (5.8× faster)** | Pydantic compiled validators |
| Model serialization | 2.01 µs | 4.60 µs | **0.44× (2.3× faster)** | `model_dump()` vs cqlengine internals |
| Argus model instantiation (11 fields) | 18.2 µs | 33.4 µs | **0.55× (1.8× faster)** | Pydantic scales better with field count |
| Batch INSERT 100 rows | 28.6 ms | 53.2 ms | **0.54× (1.9× faster)** | coodie batch CQL builder is more efficient |

### 1.2 Where coodie is slower (ORM overhead)

| Operation | coodie | cqlengine | Ratio | Severity |
|-----------|--------|-----------|-------|----------|
| `sync_table` no-op | 3,827 µs | 224 µs | **17.1× slower** | 🔴 Critical |
| `sync_table` create | 2,646 µs | 173 µs | **15.3× slower** | 🔴 Critical |
| Filter (secondary index) | 18.1 ms | 4.5 ms | **4.0× slower** | 🔴 Critical |
| Partial UPDATE | 2,203 µs | 508 µs | **4.3× slower** | 🔴 Critical |
| Filter + LIMIT | 3.06 ms | 1.12 ms | **2.7× slower** | 🟠 High |
| GET by PK | 1,382 µs | 651 µs | **2.1× slower** | 🟠 High |
| Collection read | 1,405 µs | 654 µs | **2.1× slower** | 🟠 High |
| UPDATE IF condition (LWT) | 3.34 ms | 1.64 ms | **2.0× slower** | 🟠 High |
| Batch INSERT 10 rows | 3.38 ms | 1.67 ms | **2.0× slower** | 🟠 High |
| Collection roundtrip | 2.46 ms | 1.30 ms | **1.89× slower** | 🟡 Medium |
| Single DELETE | 1.97 ms | 1.04 ms | **1.89× slower** | 🟡 Medium |
| Single INSERT | 1,025 µs | 589 µs | **1.74× slower** | 🟡 Medium |
| Bulk DELETE | 2.01 ms | 1.17 ms | **1.72× slower** | 🟡 Medium |
| INSERT with TTL | 1,016 µs | 621 µs | **1.64× slower** | 🟡 Medium |
| Collection write | 1,015 µs | 627 µs | **1.62× slower** | 🟡 Medium |
| COUNT | 1.49 ms | 1.02 ms | **1.47× slower** | 🟢 Acceptable |
| INSERT IF NOT EXISTS | 2.20 ms | 1.69 ms | **1.30× slower** | 🟢 Acceptable |

### 1.3 Argus-inspired real-world patterns (scylla driver)

| Pattern | coodie | cqlengine | Ratio | Notes |
|---------|--------|-----------|-------|-------|
| Notification feed | 1.43 ms | 1.35 ms | **1.06×** | 🟢 Near parity |
| Comment with collections | 779 µs | 751 µs | **1.04×** | 🟢 Near parity |
| Batch events (10) | 3.56 ms | 3.04 ms | **1.17×** | 🟢 Acceptable |
| Get-or-create user | 902 µs | 747 µs | **1.21×** | 🟢 Acceptable |
| Latest N runs (clustering) | 1,188 µs | 928 µs | **1.28×** | 🟢 Acceptable |
| Filter by partition key | 1.43 ms | 1.07 ms | **1.34×** | 🟢 Acceptable |
| Multi-model lookup | 1.81 ms | 1.32 ms | **1.37×** | 🟡 Medium |
| Status update (read-modify-save) | 1,752 µs | 836 µs | **2.10×** | 🟠 High |
| List mutation + save | 1,647 µs | 758 µs | **2.17×** | 🟠 High |

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

## 7. General Speed Improvements

Beyond the operation-specific optimizations above, several cross-cutting techniques
can improve coodie's overall throughput and memory efficiency.

### 7.1 `__slots__` on internal classes

**Where**: `QuerySet`, `ColumnDefinition`, `PagedResult`, `LWTResult`, driver classes.

Python's `__slots__` eliminates the per-instance `__dict__`, which reduces memory
by ~40-60 bytes per object and speeds up attribute access by ~10-20%.

```python
# QuerySet — created on every chained call (.filter().limit().all())
class QuerySet:
    __slots__ = (
        "_doc_cls", "_where", "_limit_val", "_order_by_val",
        "_allow_filtering_val", "_if_not_exists_val", "_if_exists_val",
        "_ttl_val", "_timestamp_val", "_consistency_val", "_timeout_val",
        "_only_val", "_defer_val", "_values_list_val",
        "_per_partition_limit_val", "_fetch_size_val", "_paging_state_val",
    )
```

`QuerySet` is the highest-impact target — every chained method (`.filter()`,
`.limit()`, `.all()`) creates a new instance via `_clone()`. Removing `__dict__`
overhead on each clone directly speeds up query chains.

`ColumnDefinition` is already a `@dataclass` — adding `@dataclass(slots=True)`
(Python 3.10+) or `__slots__` eliminates dict overhead for schema introspection.

**Note**: Pydantic v2 `BaseModel` does **not** support `__slots__` on the model
itself (it uses its own `__dict__` for field storage). However, the internal
`model_config = ConfigDict(...)` can be tuned (see §7.3).

**Estimated impact**: ~5-10% faster query chain construction, ~30% less memory for
large result sets (fewer `QuerySet` dicts in flight).

### 7.2 `__slots__` on driver classes

```python
class CassandraDriver(AbstractDriver):
    __slots__ = ("_session", "_default_keyspace", "_prepared", "_last_paging_state")
```

Driver instances are long-lived singletons, so memory savings are marginal. The
real benefit is faster attribute access on the hot path (`self._prepare()`,
`self._session.execute()`).

**Estimated impact**: ~2-5% faster per-operation driver access.

### 7.3 Pydantic `model_config` tuning

coodie's `Document` base class currently only sets `arbitrary_types_allowed = True`.
Additional Pydantic v2 config options can improve performance:

```python
class Document(BaseModel):
    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        # Disable revalidation — trust data from Cassandra
        revalidate_instances="never",
        # Forbid extra fields — enables faster __init__
        extra="forbid",
        # Use enum values directly — skip .value conversion
        use_enum_values=True,
        # Populate by field name for direct dict construction
        populate_by_name=True,
    )
```

Key wins:
- **`revalidate_instances="never"`**: Skips re-validation when models are nested.
  coodie models are flat (no nested Documents), but this prevents accidental overhead.
- **`extra="forbid"`**: Pydantic can skip the "extra fields" check path entirely,
  making `__init__` faster.
- **`use_enum_values=True`**: Avoids `.value` attribute lookup for enum-typed fields.

**Estimated impact**: ~5-10% faster model construction from DB rows.

### 7.4 Lazy parsing for large documents (Beanie pattern)

Beanie ODM offers `lazy_parse=True` on queries, deferring Pydantic validation
until a field is actually accessed. This is highly effective for large documents
where only a few fields are read.

coodie could implement this via a `LazyDocument` proxy:

```python
class LazyDocument:
    """Proxy that defers Pydantic parsing until field access."""
    __slots__ = ("_doc_cls", "_raw_data", "_parsed")

    def __init__(self, doc_cls, raw_data):
        self._doc_cls = doc_cls
        self._raw_data = raw_data
        self._parsed = None

    def __getattr__(self, name):
        if self._parsed is None:
            self._parsed = self._doc_cls(**self._raw_data)
        return getattr(self._parsed, name)
```

Usage: `QuerySet.all(lazy=True)` returns `list[LazyDocument]` instead of
`list[Document]`, skipping Pydantic construction entirely until needed.

**Estimated impact**: Near-zero cost for queries where only PK fields are read
(common in exists-checks, pagination, or status dashboards).

### 7.5 LRU cache for `get_type_hints()` calls

`get_type_hints()` is called on every:
- `_find_discriminator_column()` — every `save()`, `find()`, `_rows_to_docs()`
- `coerce_row_none_collections()` — every row construction
- `build_schema()` — first call only (already cached)

Since type hints never change at runtime, cache the result:

```python
import functools

@functools.lru_cache(maxsize=128)
def _cached_type_hints(cls: type) -> dict[str, Any]:
    try:
        return typing.get_type_hints(cls, include_extras=True)
    except Exception:
        return getattr(cls, "__annotations__", {})
```

Then replace all `get_type_hints(cls, include_extras=True)` calls with
`_cached_type_hints(cls)`.

**Estimated impact**: Eliminates the #1 per-call overhead in `save()` and `find()`.
~15-25% faster for polymorphic models, ~5-10% for regular models (removes
`typing` module introspection on every call).

### 7.6 Projection support (Beanie pattern)

Beanie's `projection_model` returns only requested fields, reducing both network
transfer and parsing cost. coodie already has `.only("col1", "col2")` but still
constructs the full model.

Enhance with projection models:

```python
class ProductNameOnly(BaseModel):
    name: str
    price: float

# Returns list[ProductNameOnly] — lighter, faster
products = Product.objects.project(ProductNameOnly).all()
```

This avoids validating/defaulting unused fields entirely.

**Estimated impact**: 2-5× faster for wide tables where only a few columns are needed.

### 7.7 Pre-compute collection coercion map per class

`coerce_row_none_collections()` currently calls `get_type_hints()` and scans
all annotations on **every row**. Pre-compute a set of collection-typed field names:

```python
@functools.lru_cache(maxsize=128)
def _collection_fields(cls: type) -> set[str]:
    """Return field names that have collection types (list, set, dict, tuple)."""
    hints = _cached_type_hints(cls)
    result = set()
    for name, ann in hints.items():
        base = _unwrap_annotation(ann)
        origin = typing.get_origin(base) or base
        if origin in (list, set, dict, tuple, frozenset):
            result.add(name)
    return result
```

Then coercion becomes a simple set lookup per row:

```python
def coerce_row_none_collections(doc_cls, row):
    for key in _collection_fields(doc_cls):
        if row.get(key) is None:
            row[key] = _COLLECTION_ORIGINS[...]()
    return row
```

**Estimated impact**: ~10-15% faster row construction for models with collections.

### 7.8 `model_validate()` instead of `**dict` construction

Pydantic v2's `model_validate()` accepts mappings directly and is optimized
internally (compiled Rust validators). Using it instead of `Model(**dict)`:

```python
# Current (slower)
self._doc_cls(**coerce_row_none_collections(self._doc_cls, row))

# Proposed (faster — Pydantic compiled path)
self._doc_cls.model_validate(coerce_row_none_collections(self._doc_cls, row))
```

**Estimated impact**: ~5-10% faster model construction (Pydantic's optimized path).

---

## 8. Updated Priority Matrix (including general improvements)

| Phase | Task | Effort | Impact | Priority |
|-------|------|--------|--------|----------|
| 1 | 3.1 Optimize `_rows_to_dicts()` | Small | High | **P0** |
| 1 | 3.2 Cache discriminator metadata | Small | Medium | **P0** |
| 2 | 3.4 Table metadata cache | Small | Critical | **P0** |
| 1 | 7.5 LRU cache for `get_type_hints()` | Small | High | **P0** |
| 1 | 7.7 Pre-compute collection coercion map | Small | Medium | **P0** |
| 1 | 7.1 `__slots__` on QuerySet | Small | Medium | **P1** |
| 1 | 7.3 Pydantic `model_config` tuning | Small | Medium | **P1** |
| 1 | 7.8 Use `model_validate()` | Small | Low-Med | **P1** |
| 1 | 3.3 Module-level `get_driver` import | Small | Low | P1 |
| 2 | 3.5 Skip column introspection on create | Medium | Medium | P1 |
| 3 | 3.7 Skip intermediate dict on reads | Medium | High | **P1** |
| 3 | 3.6 Skip intermediate dict on writes | Medium | Medium | P1 |
| 1 | 7.2 `__slots__` on driver classes | Small | Low | P2 |
| 3 | 3.8 CQL query string cache | Medium | Low | P2 |
| 4 | 3.10 Reduce `_clone()` overhead | Medium | Medium | P2 |
| 4 | 3.9 Pre-compile filter patterns | Small | Low | P2 |
| 5 | 3.11 Native async for CassandraDriver | Large | High | P2 |
| 3 | 7.4 Lazy parsing (LazyDocument) | Medium | High | P2 |
| 3 | 7.6 Projection model support | Medium | Medium | P2 |

---

## 9. Driver Comparison: scylla-driver vs acsylla

> **Run**: [#22353872673](https://github.com/fruch/coodie/actions/runs/22353872673) — same ScyllaDB container, same benchmark code, different coodie driver.
> cqlengine always uses scylla-driver regardless of the `--driver-type` option.

### 9.1 coodie performance by driver (Mean times)

| Operation | scylla-driver | acsylla | Δ | Winner |
|-----------|--------------|---------|---|--------|
| **DDL / Schema** | | | | |
| `sync_table` create | 2,646 µs | 1,345 µs | **−49%** | 🏆 acsylla |
| `sync_table` no-op | 3,827 µs | 2,624 µs | **−31%** | 🏆 acsylla |
| **Writes** | | | | |
| Single INSERT | 1,025 µs | 1,109 µs | +8% | scylla |
| INSERT with TTL | 1,016 µs | 1,113 µs | +10% | scylla |
| INSERT IF NOT EXISTS | 2,200 µs | 1,616 µs | **−27%** | 🏆 acsylla |
| Collection write | 1,015 µs | 1,101 µs | +8% | scylla |
| **Reads** | | | | |
| GET by PK | 1,382 µs | 1,373 µs | ~0% | tie |
| Filter + LIMIT | 3,058 µs | 2,916 µs | −5% | acsylla |
| Filter (secondary index) | 18,120 µs | 18,843 µs | +4% | scylla |
| COUNT | 1,492 µs | 1,487 µs | ~0% | tie |
| Collection read | 1,405 µs | 1,402 µs | ~0% | tie |
| Collection roundtrip | 2,459 µs | 2,433 µs | ~0% | tie |
| **Updates** | | | | |
| Partial UPDATE | 2,203 µs | 2,253 µs | +2% | tie |
| UPDATE IF condition (LWT) | 3,342 µs | 2,931 µs | **−12%** | 🏆 acsylla |
| **Deletes** | | | | |
| Single DELETE | 1,967 µs | 2,007 µs | +2% | tie |
| Bulk DELETE | 2,010 µs | 2,187 µs | +9% | scylla |
| **Batch** | | | | |
| Batch INSERT 10 | 3,379 µs | 3,374 µs | ~0% | tie |
| Batch INSERT 100 | 28,612 µs | 28,992 µs | ~0% | tie |
| **Serialization (no DB)** | | | | |
| Model instantiation | 2.00 µs | 2.03 µs | ~0% | tie |
| Model serialization | 2.01 µs | 1.94 µs | ~0% | tie |

### 9.2 Argus patterns by driver

| Pattern | scylla-driver | acsylla | Δ | Winner |
|---------|--------------|---------|---|--------|
| Get-or-create user | 902 µs | 905 µs | ~0% | tie |
| Filter by partition key | 1,429 µs | 1,418 µs | ~0% | tie |
| Latest N runs (clustering) | 1,188 µs | 1,245 µs | +5% | scylla |
| List mutation + save | 1,647 µs | 1,595 µs | −3% | acsylla |
| Batch events (10) | 3,557 µs | 3,534 µs | ~0% | tie |
| Notification feed | 1,433 µs | 1,393 µs | −3% | acsylla |
| Status update | 1,752 µs | 1,665 µs | −5% | acsylla |
| Comment with collections | 779 µs | 757 µs | −3% | acsylla |
| Multi-model lookup | 1,813 µs | 1,819 µs | ~0% | tie |
| Argus model instantiation | 18.2 µs | 18.3 µs | ~0% | tie |

### 9.3 Key Findings

1. **acsylla dominates DDL operations**: `sync_table` is 31–49% faster with acsylla.
   This is likely because acsylla's C++ core handles the CQL round-trips more
   efficiently than scylla-driver's Python-level protocol handling.

2. **acsylla wins on LWT/conditional writes**: INSERT IF NOT EXISTS is 27% faster,
   UPDATE IF is 12% faster. LWT operations involve extra coordinator round-trips
   where acsylla's native event loop outperforms scylla-driver's thread-pool model.

3. **scylla-driver is slightly faster for simple writes**: Single INSERT and INSERT
   with TTL are 8-10% faster with scylla-driver. The prepared-statement caching
   in scylla-driver's Python layer may avoid the async bridge overhead that acsylla
   pays when called from sync code.

4. **Read performance is identical**: GET by PK, COUNT, collection reads, and most
   Argus patterns are within ±3% — well within noise. The read path is dominated
   by coodie's ORM overhead (`_rows_to_dicts()`, Pydantic construction), not driver
   overhead.

5. **Serialization is driver-independent**: Model instantiation and serialization
   benchmarks don't touch the database, confirming they measure pure Pydantic
   performance.

6. **For Argus-style real-world patterns**: acsylla shows a slight but consistent
   advantage in multi-step operations (status update −5%, list mutation −3%,
   notification feed −3%), likely due to lower per-operation overhead accumulating
   across multiple CQL calls.

### 9.4 Recommendations

- **Default driver**: Keep scylla-driver as default — it has the best overall
  ecosystem support, documentation, and debuggability.
- **acsylla for DDL-heavy workloads**: Applications that frequently call `sync_table`
  (e.g., multi-tenant schemas, dynamic table creation) should consider acsylla.
- **acsylla for LWT-heavy workloads**: Applications using many conditional writes
  (IF NOT EXISTS, IF condition) will see measurable improvement with acsylla.
- **Future**: Once coodie implements `sync_table` caching (Phase 2, task 3.4), the
  DDL advantage of acsylla will be reduced since the cache eliminates repeat calls.

---

## 10. Phase 1 Results

> **Post-optimization run**: [#22371151749](https://github.com/fruch/coodie/actions/runs/22371151749) — scylla driver ([job](https://github.com/fruch/coodie/actions/runs/22371151749/job/64752712030?pr=46#step:5:124))
> **PR**: [#46](https://github.com/fruch/coodie/pull/46) — `perf: implement Phase 1 performance improvements`

### 10.1 Phase 1 Changes Implemented

| Task | Description | Status |
|------|-------------|--------|
| 3.1 | `_rows_to_dicts()` — type-check first row once, fast-path all rows (CassandraDriver) | ✅ Done |
| 3.2 | `@lru_cache` on `_find_discriminator_column()` / `_get_discriminator_value()` | ✅ Done |
| 3.3 | Module-level `get_driver` import in both query.py files | ✅ Done |
| 7.1 | `__slots__` on QuerySet (sync + async), CassandraDriver, AcsyllaDriver, ColumnDefinition | ✅ Done |
| 7.3 | Pydantic `model_config` tuning (`revalidate_instances`, `use_enum_values`, `populate_by_name`) | ✅ Done |
| 7.5 | `_cached_type_hints(cls)` — `@lru_cache` wrapper around `get_type_hints()` | ✅ Done |
| 7.7 | `_collection_fields(cls)` — pre-compute collection coercion map per class | ✅ Done |
| 7.8 | `model_validate()` instead of `Model(**dict)` in `_rows_to_docs()` | ✅ Done |

**Note**: `extra="forbid"` (§7.3) was intentionally omitted — materialized views and partial
models read DB rows containing columns not defined in the model, which Pydantic would reject.

### 10.2 Core Operations — Before vs After

| Operation | Before (coodie) | After (coodie) | coodie Speedup | Before ratio | After ratio | Δ |
|-----------|----------------|----------------|----------------|--------------|-------------|---|
| **Reads** | | | | | | |
| GET by PK | 1,382 µs | 486 µs | **−65%** | 2.12× slower | 0.75× (1.3× faster) | 🆕 now beats cqlengine |
| Filter + LIMIT | 3,060 µs | 604 µs | **−80%** | 2.73× slower | 0.52× (1.9× faster) | 🆕 now beats cqlengine |
| Filter (secondary index) | 18,120 µs | 1,555 µs | **−91%** | 4.03× slower | 0.33× (3.0× faster) | 🆕 now beats cqlengine |
| COUNT | 1,492 µs | 896 µs | **−40%** | 1.46× slower | 0.89× (1.1× faster) | 🆕 now beats cqlengine |
| Collection read | 1,405 µs | 495 µs | **−65%** | 2.15× slower | 0.74× (1.4× faster) | 🆕 now beats cqlengine |
| Collection roundtrip | 2,460 µs | 970 µs | **−61%** | 1.89× slower | 0.70× (1.4× faster) | 🆕 now beats cqlengine |
| **Writes** | | | | | | |
| Single INSERT | 1,025 µs | 451 µs | **−56%** | 1.74× slower | 0.76× (1.3× faster) | 🆕 now beats cqlengine |
| INSERT with TTL | 1,016 µs | 461 µs | **−55%** | 1.64× slower | 0.76× (1.3× faster) | 🆕 now beats cqlengine |
| INSERT IF NOT EXISTS | 2,200 µs | 1,469 µs | **−33%** | 1.30× slower | 0.95× (1.1× faster) | 🆕 now beats cqlengine |
| Collection write | 1,015 µs | 460 µs | **−55%** | 1.62× slower | 0.72× (1.4× faster) | 🆕 now beats cqlengine |
| **Updates** | | | | | | |
| Partial UPDATE | 2,203 µs | 923 µs | **−58%** | 4.34× slower | 1.72× slower | improved but still slower |
| UPDATE IF condition (LWT) | 3,340 µs | 1,823 µs | **−45%** | 2.04× slower | 1.18× slower | improved |
| **Deletes** | | | | | | |
| Single DELETE | 1,970 µs | 939 µs | **−52%** | 1.89× slower | 0.87× (1.1× faster) | 🆕 now beats cqlengine |
| Bulk DELETE | 2,010 µs | 900 µs | **−55%** | 1.72× slower | 0.79× (1.3× faster) | 🆕 now beats cqlengine |
| **Batch** | | | | | | |
| Batch INSERT 10 | 3,380 µs | 631 µs | **−81%** | 2.02× slower | 0.36× (2.8× faster) | 🆕 now beats cqlengine |
| Batch INSERT 100 | 28,612 µs | 2,276 µs | **−92%** | 0.54× faster | 0.04× (23.8× faster) | was faster, now dominant |
| **Schema** | | | | | | |
| sync_table create | 2,646 µs | 2,508 µs | −5% | 15.3× slower | 14.3× slower | Phase 2 target |
| sync_table no-op | 3,827 µs | 3,410 µs | −11% | 17.1× slower | 16.2× slower | Phase 2 target |
| **Serialization (no DB)** | | | | | | |
| Model instantiation | 2.00 µs | 2.05 µs | ≈0% | 0.17× (5.8× faster) | 0.17× (5.9× faster) | maintained |
| Model serialization | 2.01 µs | 1.94 µs | +4% | 0.44× (2.3× faster) | 0.42× (2.4× faster) | maintained |

### 10.3 Argus Real-World Patterns — Before vs After

| Pattern | Before (coodie) | After (coodie) | coodie Speedup | Before ratio | After ratio | Δ |
|---------|----------------|----------------|----------------|--------------|-------------|---|
| Batch events (10) | 3,560 µs | 1,219 µs | **−66%** | 1.17× slower | 0.40× (2.5× faster) | 🆕 now beats cqlengine |
| Comment with collections | 779 µs | 531 µs | **−32%** | 1.04× slower | 0.69× (1.4× faster) | 🆕 now beats cqlengine |
| Filter by partition key | 1,430 µs | 604 µs | **−58%** | 1.34× slower | 0.59× (1.7× faster) | 🆕 now beats cqlengine |
| Get-or-create user | 902 µs | 497 µs | **−45%** | 1.21× slower | 0.68× (1.5× faster) | 🆕 now beats cqlengine |
| Latest N runs (clustering) | 1,188 µs | 499 µs | **−58%** | 1.28× slower | 0.52× (1.9× faster) | 🆕 now beats cqlengine |
| Multi-model lookup | 1,813 µs | 959 µs | **−47%** | 1.37× slower | 0.71× (1.4× faster) | 🆕 now beats cqlengine |
| Notification feed | 1,433 µs | 600 µs | **−58%** | 1.06× slower | 0.45× (2.2× faster) | 🆕 now beats cqlengine |
| List mutation + save | 1,647 µs | 997 µs | **−39%** | 2.17× slower | 1.35× slower | improved but still slower |
| Status update | 1,752 µs | 956 µs | **−45%** | 2.10× slower | 1.11× slower | improved |
| Argus model instantiation | 18.2 µs | 18.1 µs | ≈0% | 0.55× faster | 0.54× faster | maintained |

### 10.4 Success Criteria — Phase 1 Scorecard

| Metric | Target | Before | After | Status |
|--------|--------|--------|-------|--------|
| Single INSERT latency | ≤ 1.3× cqlengine | 1.74× | **0.76×** | ✅ **Exceeded** — now 1.3× faster |
| GET by PK latency | ≤ 1.5× cqlengine | 2.12× | **0.75×** | ✅ **Exceeded** — now 1.3× faster |
| Filter + LIMIT latency | ≤ 1.8× cqlengine | 2.73× | **0.52×** | ✅ **Exceeded** — now 1.9× faster |
| `sync_table` no-op | ≤ 1.5× cqlengine | 17.1× | **16.2×** | ❌ Not met — Phase 2 (table cache) needed |
| Partial UPDATE | ≤ 2× cqlengine | 4.34× | **1.72×** | ✅ **Met** |
| Model instantiation | ≤ 0.2× (maintain advantage) | 0.17× | **0.17×** | ✅ **Maintained** |
| Model serialization | ≤ 0.5× (maintain advantage) | 0.44× | **0.42×** | ✅ **Maintained** |

**6 out of 7 success criteria met or exceeded.** The only unmet target (`sync_table` no-op) requires
Phase 2's table metadata cache, which is a separate feature (not a code optimization).

### 10.5 Key Findings

1. **coodie now beats cqlengine on 24 out of 30 benchmarks.** Before Phase 1, coodie was
   slower than cqlengine on 16 out of 18 DB operations. After Phase 1, coodie is faster on
   all reads, all writes (except partial UPDATE and LWT), all deletes, and all batch operations.

2. **Read operations saw the biggest improvement (40–91% faster).** The combination of
   `_cached_type_hints()`, `_rows_to_dicts()` namedtuple fast-path, `_collection_fields()`
   cache, and `model_validate()` eliminated the per-row overhead that dominated read paths.

3. **Batch INSERT 100 improved by 92%** (28.6 ms → 2.3 ms), making coodie **23.8× faster**
   than cqlengine. The `@lru_cache` on discriminator functions eliminated 100× `get_type_hints()`
   calls per batch.

4. **Filter (secondary index) improved by 91%** (18.1 ms → 1.6 ms), going from 4× slower
   to 3× faster than cqlengine. This was the highest-severity bottleneck (🔴 Critical in §1.2).

5. **Argus real-world patterns flipped:** 7 out of 9 DB-backed patterns now beat cqlengine
   (was: 0 out of 9). Only list-mutation and status-update remain slower, both involving
   read-modify-write cycles where the write path still has overhead.

6. **`sync_table` remains the main gap.** Phase 2's table metadata cache (task 3.4) is needed
   to close the 16× overhead on `sync_table` no-op.

7. **Pydantic advantage maintained.** Model instantiation (5.9× faster) and serialization
   (2.4× faster) are unchanged — the Phase 1 changes only optimized the ORM ↔ driver interface.

### 10.6 Remaining Priorities After Phase 1

| Priority | Task | Expected Impact |
|----------|------|-----------------|
| **P0** | 3.4 Table metadata cache | Close 16× `sync_table` gap → ≤ 1.5× |
| P1 | 3.5 Skip column introspection on create | Faster first-run `sync_table` |
| P1 | 3.7 Skip intermediate dict on reads | Further read improvement (already partially done via `model_validate`) |
| P2 | 3.8 CQL query string cache | Eliminate CQL construction overhead |
| P2 | 3.10 Reduce `_clone()` overhead | Faster query chain construction |
| P2 | 7.4 Lazy parsing (LazyDocument) | Near-zero cost for PK-only reads |

---

## 11. Phase 2 Results

### 11.1 Phase 2 Changes Implemented

| Task | Description | Status |
|------|-------------|--------|
| 3.4 | `_known_tables` cache on both CassandraDriver and AcsyllaDriver — second `sync_table` call is a no-op | ✅ Done |
| 3.5 | Skip ALTER TABLE when existing columns already match model columns (new table) | ✅ Done |

### 11.2 Phase 2 Design

**Task 3.4 — Table metadata cache:**
- Added `_known_tables: set[str]` to `__slots__` on both `CassandraDriver` and `AcsyllaDriver`.
- On `sync_table()` / `sync_table_async()`, the driver first checks `f"{keyspace}.{table}"` in `_known_tables`.
- On cache hit: returns immediately (zero CQL queries).
- On cache miss: runs the full sync flow, then adds the key to `_known_tables`.
- The cache is per-driver-instance and lives for the session lifetime — no stale data across restarts.

**Task 3.5 — Skip column introspection on create:**
- After `CREATE TABLE IF NOT EXISTS`, the driver introspects `system_schema.columns` to get existing columns.
- If the existing column set matches the model's column set exactly, the table was just created with all columns — `ALTER TABLE ADD` is skipped entirely.
- For tables with extra DB-side columns (e.g., schema drift), the existing ALTER TABLE logic still runs.

### 11.3 Remaining Priorities After Phase 2

| Priority | Task | Expected Impact |
|----------|------|-----------------|
| P1 | 3.7 Skip intermediate dict on reads | Further read improvement |
| P2 | 3.8 CQL query string cache | Eliminate CQL construction overhead |
| P2 | 3.10 Reduce `_clone()` overhead | Faster query chain construction |
| P2 | 7.4 Lazy parsing (LazyDocument) | Near-zero cost for PK-only reads |

---

## 12. Notes

- coodie's Pydantic-based model system is **already 5.8× faster** than cqlengine for
  pure Python model construction. The overhead is in the ORM ↔ driver interface.
- **New finding**: coodie's batch INSERT for 100 rows is **1.9× faster** than cqlengine,
  likely because `build_batch()` constructs CQL more efficiently than cqlengine's
  per-statement batch approach.
- The biggest single improvement is task 3.4 (table cache) — it eliminates the
  **17× overhead** on `sync_table` with minimal code change.
- Tasks 3.1 and 3.7 together can significantly reduce read latency by eliminating
  unnecessary dict conversions.
- The filter-secondary-index benchmark (4.0× slower) likely includes Pydantic model
  construction overhead for multiple rows — task 3.7 directly addresses this.
- Tasks 7.1 (`__slots__`) and 7.5 (type hints cache) are low-risk, high-reward
  changes that can be done first as they require no API changes.
- Beanie's `lazy_parse` and `projection_model` patterns are powerful but require
  API additions — schedule for Phase 3 after core performance is optimized.
- **Argus patterns show coodie is close to parity**: 6 out of 9 DB-backed Argus
  benchmarks are within 1.4× of cqlengine. Only write-heavy patterns (list mutation,
  status update) show significant overhead, confirming the write-path optimization
  priorities in Phases 1 and 3.
