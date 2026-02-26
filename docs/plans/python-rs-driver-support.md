# python-rs-driver Support Plan

> **Goal:** Add a fourth coodie driver backend — `PythonRsDriver` — wrapping
> the [python-rs-driver](https://github.com/scylladb-zpp-2025-python-rs-driver/python-rs-driver),
> a Rust-based Python client for ScyllaDB.  Because this driver is **not published
> on PyPI** and requires a Rust build toolchain (maturin + Cargo), it needs its
> own build/install phase.  The plan also establishes a **maturity comparison
> framework** to evaluate python-rs-driver against the existing CassandraDriver
> (scylla-driver) and AcsyllaDriver (acsylla) backends.

---

## Table of Contents

1. [Driver Landscape](#1-driver-landscape)
   - [1.1 Existing coodie Drivers](#11-existing-coodie-drivers)
   - [1.2 python-rs-driver Overview](#12-python-rs-driver-overview)
2. [API Gap Analysis](#2-api-gap-analysis)
   - [2.1 Session & Connection](#21-session--connection)
   - [2.2 Query Execution](#22-query-execution)
   - [2.3 Prepared Statements](#23-prepared-statements)
   - [2.4 Result Handling](#24-result-handling)
   - [2.5 Configuration & Policies](#25-configuration--policies)
   - [2.6 CQL Type Support](#26-cql-type-support)
3. [Maturity Comparison Matrix](#3-maturity-comparison-matrix)
4. [Implementation Phases](#4-implementation-phases)
5. [Test Plan](#5-test-plan)
6. [Performance Benchmarks](#6-performance-benchmarks)
7. [References](#7-references)

---

## 1. Driver Landscape

### 1.1 Existing coodie Drivers

| Driver | Package | Install | Sync | Async | PyPI |
|---|---|---|---|---|---|
| `CassandraDriver` | `scylla-driver` / `cassandra-driver` | `pip install scylla-driver` | ✅ native | ✅ asyncio bridge | ✅ |
| `AcsyllaDriver` | `acsylla` | `pip install acsylla` | ✅ event-loop bridge | ✅ native | ✅ |

Both drivers implement the `AbstractDriver` ABC defined in
`src/coodie/drivers/base.py`.  The interface requires six methods:
`execute`, `execute_async`, `sync_table`, `sync_table_async`, `close`,
and `close_async`.

### 1.2 python-rs-driver Overview

| Property | Value |
|---|---|
| Repository | [scylladb-zpp-2025-python-rs-driver/python-rs-driver](https://github.com/scylladb-zpp-2025-python-rs-driver/python-rs-driver) |
| Language | Rust (PyO3 / maturin) + Python stubs |
| Python package name | `scylla` |
| Underlying engine | [scylla-rust-driver](https://github.com/scylladb/scylla-rust-driver) |
| Build system | `maturin>=1.7` (requires Rust toolchain) |
| PyPI availability | ❌ Not published — must build from source |
| Maturity | Early development — "not ready for production usage" |
| License | Apache-2.0 / MIT dual license |
| Python support | `>=3.10` |
| Async model | Native async (tokio runtime under PyO3) |
| Sync support | ❌ No sync API — async-only |

**Key API surface** (from `.pyi` stubs):

```python
from scylla.session_builder import SessionBuilder
from scylla.session import Session
from scylla.statement import Statement, PreparedStatement
from scylla.results import RequestResult, RowsIterator
from scylla.enums import Consistency, SerialConsistency
from scylla.execution_profile import ExecutionProfile

# Connect
builder = SessionBuilder(contact_points=["127.0.0.1"], port=9042)
session: Session = await builder.connect()

# Execute
result: RequestResult = await session.execute("SELECT * FROM ks.t", None)
for row in result.iter_rows():
    print(row)  # dict[str, CqlValue]

# Prepared statements
prepared: PreparedStatement = await session.prepare("INSERT INTO ks.t (id, name) VALUES (?, ?)")
await session.execute(prepared, [uuid4(), "widget"])
```

---

## 2. API Gap Analysis

Legend:
- ✅ **Implemented** — working today in python-rs-driver
- 🔧 **Partial** — infrastructure exists but limited or untested
- ❌ **Missing** — not yet available

### 2.1 Session & Connection

| coodie AbstractDriver Need | python-rs-driver Equivalent | Status |
|---|---|---|
| Connect with host list | `SessionBuilder(contact_points, port).connect()` | ✅ |
| Keyspace selection at connect time | — | ❌ no `use_keyspace()` or builder option |
| Sync connection | — | ❌ async-only |
| Close / shutdown | — | ❌ no explicit `close()` on Session |

**Gap summary — session & connection:**
- Keyspace selection → execute `USE keyspace` after connect, or prefix all CQL with `keyspace.table`
- Sync connection → wrap with `asyncio.run()` or event-loop bridge (same pattern as AcsyllaDriver)
- Close → may need to rely on Python GC / destructor; investigate Rust drop behavior

### 2.2 Query Execution

| coodie AbstractDriver Need | python-rs-driver Equivalent | Status |
|---|---|---|
| Execute raw CQL string | `session.execute("CQL", values)` | ✅ |
| Execute with positional params | `session.execute(stmt, [val1, val2])` | ✅ |
| Execute prepared statement | `session.execute(prepared, values)` | ✅ |
| Per-query consistency | `Statement.with_consistency(c)` | ✅ |
| Per-query timeout | `Statement.with_request_timeout(t)` | ✅ |
| Per-query fetch size (paging) | `Statement.with_page_size(n)` | ✅ |
| Paging state (resume token) | — | ❌ no `set_page_state()` on results |
| Named parameters | — | ❌ positional only |
| Batch statements | — | ❌ no batch API visible |

**Gap summary — query execution:**
- Paging state → critical for coodie's paginated queries; may need upstream contribution
- Named parameters → coodie uses positional `?` params, so not a blocker
- Batch statements → needed for `build_batch` CQL builder; must be added upstream or worked around

### 2.3 Prepared Statements

| coodie AbstractDriver Need | python-rs-driver Equivalent | Status |
|---|---|---|
| `session.prepare(cql)` | `session.prepare(Statement \| str)` | ✅ |
| Bind values to prepared | `session.execute(prepared, values)` | ✅ |
| Prepared statement caching | — | ❌ must implement in driver wrapper |
| DDL detection (skip prepare) | — | ❌ must implement in driver wrapper |

**Gap summary — prepared statements:**
- Caching → implement in `PythonRsDriver` (same pattern as `CassandraDriver._prepared` dict)
- DDL detection → reuse `_is_ddl()` from `drivers/base.py`

### 2.4 Result Handling

| coodie AbstractDriver Need | python-rs-driver Equivalent | Status |
|---|---|---|
| Rows as `list[dict[str, Any]]` | `RequestResult.iter_rows()` yields dicts | ✅ |
| `RowFactory` custom deserialization | `RowFactory` class with `build()` | ✅ |
| Column metadata | `Column.column_name`, `Column.value` | ✅ |
| Paging state from result | — | ❌ no `paging_state` on `RequestResult` |
| Row count | — | 🔧 must consume iterator to count |

**Gap summary — result handling:**
- Row iteration returns dicts natively → eliminates the `_rows_to_dicts()` overhead in CassandraDriver
- Paging state → same gap as in query execution; blocks paginated query support

### 2.5 Configuration & Policies

| coodie AbstractDriver Need | python-rs-driver Equivalent | Status |
|---|---|---|
| Consistency level | `Consistency` enum (Any, One, Quorum, All, …) | ✅ |
| Serial consistency (LWT) | `SerialConsistency` enum | ✅ |
| Execution profiles | `ExecutionProfile(timeout, consistency, serial_consistency)` | ✅ |
| Load balancing policy | — | ❌ not exposed to Python |
| Retry policy | — | ❌ not exposed to Python |
| SSL/TLS | — | ❌ not exposed to Python |
| Authentication | — | ❌ not exposed to Python |
| Compression (LZ4/Snappy) | — | ❌ not exposed to Python |

**Gap summary — configuration & policies:**
- Missing policies are handled by the Rust driver internally with defaults
- SSL/auth gaps are blocking for production use but not for evaluation benchmarks

### 2.6 CQL Type Support

| CQL Type | Python Type | Status |
|---|---|---|
| `text` / `ascii` | `str` | ✅ |
| `int` / `bigint` / `smallint` / `tinyint` / `varint` / `counter` | `int` | ✅ |
| `float` / `double` | `float` | ✅ |
| `boolean` | `bool` | ✅ |
| `blob` | `bytes` | ✅ |
| `decimal` | `Decimal` | ✅ |
| `uuid` / `timeuuid` | `UUID` | ✅ |
| `inet` | `IPv4Address` / `IPv6Address` | ✅ |
| `date` | `date` | ✅ |
| `timestamp` | `datetime` | ✅ |
| `time` | `time` | ✅ |
| `duration` | `relativedelta` | ✅ |
| `list<T>` | `list` | ✅ |
| `set<T>` | `set` | ✅ |
| `map<K,V>` | `dict` | ✅ |
| `tuple<...>` | `tuple` | ✅ |
| `frozen<UDT>` | `dict` | 🔧 returned as dict, no named UDT class |

**Gap summary — CQL types:**
- Excellent scalar and collection coverage — matches or exceeds acsylla
- UDT support returns raw dicts → coodie's `UserType` Pydantic models handle the mapping layer

---

## 3. Maturity Comparison Matrix

| Dimension | scylla-driver (CassandraDriver) | acsylla (AcsyllaDriver) | python-rs-driver (proposed) |
|---|---|---|---|
| **PyPI package** | ✅ `scylla-driver` | ✅ `acsylla` | ❌ build from source |
| **Production ready** | ✅ mature, widely used | 🔧 usable, less battle-tested | ❌ early development |
| **Sync API** | ✅ native | 🔧 event-loop bridge | ❌ async-only |
| **Async API** | 🔧 callback bridge | ✅ native | ✅ native (tokio) |
| **Prepared statements** | ✅ | ✅ | ✅ |
| **Batch statements** | ✅ | ✅ | ❌ |
| **Paging** | ✅ paging_state | ✅ page_state() | 🔧 page_size only, no resume token |
| **LWT (IF)** | ✅ | ✅ | ✅ via serial consistency |
| **Consistency control** | ✅ | ✅ | ✅ |
| **SSL/TLS** | ✅ | ✅ | ❌ |
| **Authentication** | ✅ | ✅ | ❌ |
| **Shard awareness** | ✅ (scylla-driver) | ✅ | ✅ (from Rust driver) |
| **Connection pooling** | ✅ | ✅ | ✅ (from Rust driver) |
| **CQL type coverage** | ✅ full | ✅ full | ✅ good (see §2.6) |
| **UDT support** | ✅ named tuples | 🔧 dicts | 🔧 dicts |
| **Namespace conflicts** | ⚠️ `cassandra` ns | none | ⚠️ `scylla` ns (new, unique) |
| **Build requirements** | pip only | pip only | Rust toolchain + maturin |
| **CI complexity** | low | low | high (Rust compilation) |

---

## 4. Implementation Phases

### Phase 1: Build Infrastructure (Priority: High)

**Goal:** Establish a repeatable build and install process for python-rs-driver in coodie's CI and local development.

| Task | Description |
|---|---|
| 1.1 | Add a `Makefile` target or script to clone and build python-rs-driver from source using `maturin develop` |
| 1.2 | Add a CI workflow job that installs Rust toolchain, clones python-rs-driver, builds the wheel, and caches the artifact |
| 1.3 | Add a `python-rs` optional dependency group in `pyproject.toml` (empty, documentation-only — actual install is from source) |
| 1.4 | Document the local development setup in a `docs/guides/python-rs-driver-setup.md` or in this plan's references |
| 1.5 | Verify the build works on Linux (CI) and document macOS/Windows caveats |
| 1.6 | Test that the built `scylla` package imports correctly alongside coodie |

### Phase 2: Driver Implementation (Priority: High)

**Goal:** Implement `PythonRsDriver(AbstractDriver)` in `src/coodie/drivers/python_rs.py`.

| Task | Description |
|---|---|
| 2.1 | Create `src/coodie/drivers/python_rs.py` with `PythonRsDriver` class |
| 2.2 | Implement `execute_async()` — map coodie's params to `session.execute(prepared, values)` |
| 2.3 | Implement `_prepare()` with local cache (same pattern as CassandraDriver) |
| 2.4 | Implement DDL detection — reuse `_is_ddl()`, execute DDL as raw `Statement` strings |
| 2.5 | Implement `_rows_to_dicts()` — iterate `RequestResult.iter_rows()` and collect to list |
| 2.6 | Implement `execute()` sync wrapper via `asyncio.run()` or event-loop bridge (same pattern as AcsyllaDriver) |
| 2.7 | Implement `sync_table_async()` and `sync_table()` — reuse CQL builder, call execute for DDL |
| 2.8 | Implement `close_async()` and `close()` — handle graceful shutdown (or no-op if no close API) |
| 2.9 | Register `driver_type="python-rs"` in `init_coodie()` and `init_coodie_async()` |
| 2.10 | Unit tests for `PythonRsDriver` with mocked `scylla.Session` |

### Phase 3: Namespace Conflict Resolution (Priority: Medium)

**Goal:** Ensure python-rs-driver's `scylla` package does not conflict with other drivers or coodie internals.

| Task | Description |
|---|---|
| 3.1 | Verify that `scylla` (python-rs-driver) and `cassandra` (scylla-driver) namespaces do not collide |
| 3.2 | Add `[tool.uv]` conflict entries if python-rs-driver cannot coexist with scylla-driver |
| 3.3 | Document which driver combinations are supported in the same virtualenv |
| 3.4 | Test import isolation in CI (install python-rs-driver alone, verify no cassandra namespace leaks) |

### Phase 4: Integration Testing (Priority: Medium)

**Goal:** Run the existing coodie integration test suite against a real ScyllaDB instance using `PythonRsDriver`.

| Task | Description |
|---|---|
| 4.1 | Add a `python-rs` variant to the integration test matrix in CI |
| 4.2 | Parametrize `test_integration.py` fixtures to accept `driver_type="python-rs"` |
| 4.3 | Identify and document any test failures caused by python-rs-driver gaps (batch, paging state) |
| 4.4 | Skip or xfail tests that depend on features not yet available (batch, paging resume) |
| 4.5 | Validate all CQL type roundtrips from §2.6 pass |
| 4.6 | Integration test report comparing pass/fail counts across all three drivers |

### Phase 5: Maturity Evaluation & Benchmarks (Priority: Low)

**Goal:** Quantify python-rs-driver performance relative to scylla-driver and acsylla, and produce a maturity assessment.

| Task | Description |
|---|---|
| 5.1 | Add `PythonRsDriver` to the existing benchmark suite (`benchmarks/`) |
| 5.2 | Run INSERT, SELECT, UPDATE, DELETE benchmarks across all three drivers |
| 5.3 | Run the Argus-inspired real-world pattern benchmarks from the performance plan |
| 5.4 | Collect and compare latency (p50, p95, p99) and throughput metrics |
| 5.5 | Document the benchmark results in an amendment to this plan |
| 5.6 | Produce a maturity scorecard summarizing: API completeness, test pass rate, performance delta, production readiness |

---

## 5. Test Plan

### 5.1 Unit Tests

#### `tests/test_python_rs_driver.py`

| Test Case | Phase |
|---|---|
| `PythonRsDriver` instantiation with mocked session | 2 |
| `execute_async()` forwards CQL and params correctly | 2 |
| `_prepare()` caches prepared statements | 2 |
| DDL statements bypass prepare and execute as raw `Statement` | 2 |
| `_rows_to_dicts()` converts `RequestResult` iterator to `list[dict]` | 2 |
| `execute()` sync wrapper delegates to `execute_async()` | 2 |
| `sync_table_async()` generates correct DDL and introspects schema | 2 |
| `close_async()` is callable (no-op or real shutdown) | 2 |
| `init_coodie(driver_type="python-rs")` registers driver | 2 |
| Import guard raises `ImportError` when `scylla` package not installed | 2 |

#### `tests/test_driver_namespace.py`

| Test Case | Phase |
|---|---|
| `scylla` (python-rs-driver) and `cassandra` (scylla-driver) imports do not collide | 3 |
| `init_coodie()` error message is clear when python-rs-driver not installed | 3 |

### 5.2 Integration Tests

| Test Area | Test Cases | Phase |
|---|---|---|
| **DDL / sync_table** | CREATE TABLE, idempotency, ALTER ADD column | 4 |
| **CRUD** | save, find_one, get, delete, update | 4 |
| **Collections** | list, set, map roundtrips | 4 |
| **Scalar types** | All types from §2.6 | 4 |
| **LWT** | INSERT IF NOT EXISTS, UPDATE IF | 4 |
| **Batch** | xfail until upstream adds batch API | 4 |
| **Paging** | xfail until upstream adds paging state resume | 4 |

### 5.3 Benchmark Tests

| Benchmark | Phase |
|---|---|
| Single INSERT / SELECT / UPDATE / DELETE latency | 5 |
| Batch INSERT 10 / 100 rows | 5 |
| Model instantiation overhead | 5 |
| `sync_table` no-op and create | 5 |
| Argus-inspired patterns (notification feed, status update, etc.) | 5 |

---

## 6. Performance Benchmarks

Benchmarks will compare three driver backends side by side.  The existing
benchmark infrastructure in `benchmarks/` already supports scylla-driver and
acsylla; the python-rs-driver variant will be added as a third matrix axis.

| Benchmark | CassandraDriver op | AcsyllaDriver op | PythonRsDriver op | Phase |
|---|---|---|---|---|
| Single INSERT | `save()` | `save()` | `save()` | 5 |
| Single SELECT (by PK) | `get()` | `get()` | `get()` | 5 |
| Batch INSERT 100 | `build_batch` | `build_batch` | xfail (no batch) | 5 |
| Filter + LIMIT | `find().limit().all()` | `find().limit().all()` | `find().limit().all()` | 5 |
| Paginated query | `find().all()` w/ fetch_size | `find().all()` w/ fetch_size | xfail (no paging resume) | 5 |
| `sync_table` no-op | `sync_table()` | `sync_table()` | `sync_table()` | 5 |

Expected outcome: python-rs-driver may show **lower per-query latency** due to
the Rust execution engine, but **higher startup cost** due to Rust compilation.
The maturity scorecard (Task 5.6) will weigh these trade-offs.

---

## 7. References

- [python-rs-driver repository](https://github.com/scylladb-zpp-2025-python-rs-driver/python-rs-driver)
- [scylla-rust-driver](https://github.com/scylladb/scylla-rust-driver) — underlying Rust driver
- [maturin documentation](https://www.maturin.rs/) — Python/Rust build tool
- [coodie AbstractDriver](../../../src/coodie/drivers/base.py) — driver interface contract
- [coodie CassandraDriver](../../../src/coodie/drivers/cassandra.py) — reference implementation
- [coodie AcsyllaDriver](../../../src/coodie/drivers/acsylla.py) — async-native reference
- [coodie Rewrite Plan](rewrite-coodie-plan.md) — pluggable driver architecture design
- [coodie Performance Improvement Plan](performance-improvement.md) — existing benchmark framework
- [scylla-driver on PyPI](https://pypi.org/project/scylla-driver/) — mature Python driver for comparison
