# Unimplemented Features — Ready Prompts

> **Auto-generated summary** of features planned in `/docs/plans/` that are
> **not yet implemented**. Each item is a self-contained prompt you can give
> to an AI coding agent (or a developer) to implement the feature.
>
> **Last reviewed:** 2026-02-28 (post-merge: UDT fully implemented,
> dict_factory done, client-encryption all phases done, plan-continuation
> action all phases done, demo CI workflow added)

---

## Table of Contents

1. [cqlengine Feature Parity](#1-cqlengine-feature-parity)
2. [Migration Framework](#2-migration-framework)
3. [Performance Improvements](#3-performance-improvements)
4. [python-rs Driver Support](#4-python-rs-driver-support)
5. [Demo Suite Extension](#5-demo-suite-extension)
6. [cqlengine Test Coverage Gaps](#6-cqlengine-test-coverage-gaps)
7. [Integration Test Coverage Gaps](#7-integration-test-coverage-gaps)

---

## 1. cqlengine Feature Parity

*Source: `cqlengine-feature-parity.md`, `cqlengine-missing-features.md`*

> *UDT support is ✅ Complete (`src/coodie/usertype.py`). Two remaining gaps below.*

### 1.1 Lazy Connection (Connect on First Use)

> **Prompt:** Implement lazy connection support for coodie's driver system. Currently `init_coodie()` connects immediately. Add support for deferred connection that only establishes a Cassandra/ScyllaDB session on first query execution. This matches cqlengine's lazy connection behavior. Update the driver registry in `src/coodie/drivers/__init__.py` to support a `lazy=True` parameter on `init_coodie()`. See `docs/plans/cqlengine-feature-parity.md` §1.7 (row: "Lazy connection → ❌").

### 1.2 Column-Level Delete on Document

> **Prompt:** Expose column-level delete on the Document API. The CQL builder already has `build_delete(columns=[...])` support, but there is no public method on `Document` to delete individual columns (set them to null). Add a `Document.delete_columns(*column_names)` method (sync + async) that generates `DELETE col1, col2 FROM table WHERE pk = ?`. See `docs/plans/cqlengine-feature-parity.md` §1.8 (row: "Column-level delete → 🔧 not exposed on Document").

---

## 2. Migration Framework

*Source: `migration-strategy.md`*

> *Phase A (enhanced `sync_table`) is ✅ Done. Phases B, C, and D are not implemented — the `src/coodie/migrations/` module does not exist yet.*

### 2.1 Phase B — Migration Framework Core

> **Prompt:** Implement the core migration framework for coodie. Create `src/coodie/migrations/` package with: (1) `base.py` — `Migration` base class with `upgrade(ctx)` and `downgrade(ctx)` methods, `MigrationContext` with `execute()` for running CQL. (2) `runner.py` — `MigrationRunner` that discovers migration files matching `YYYYMMDD_NNN_description.py` pattern using `importlib.util.spec_from_file_location`, orders them by timestamp, and tracks applied state in a `_coodie_migrations` Cassandra table. (3) `cli.py` — `coodie migrate` CLI entry point supporting `--dry-run`, `--rollback --steps N`, `--status`, and `--target`. (4) Add LWT-based single-writer lock via `_coodie_migrations_lock` table to prevent concurrent migration execution. (5) Add schema agreement wait before DDL. Add the `coodie` CLI entry point to `pyproject.toml`. Add unit and integration tests. See `docs/plans/migration-strategy.md` Phase B (tasks B.1–B.6).

### 2.2 Phase C — Auto-Generation (`coodie makemigration`)

> **Prompt:** Implement migration auto-generation for coodie. Add a `coodie makemigration --name <description>` CLI command that: (1) introspects the live database schema via `system_schema.columns` and `system_schema.tables`, (2) diffs against the current `Document` class definitions, (3) generates a migration file with `upgrade()` containing the required CQL statements, (4) flags unsafe or unsupported operations (e.g., primary key changes) with TODO comments and warnings. The generated file should follow the `YYYYMMDD_NNN_description.py` naming convention and define a `ForwardMigration(Migration)` class. Also add a `coodie schema-diff` command that shows the diff without creating a file. See `docs/plans/migration-strategy.md` Phase C (tasks C.1–C.5).

### 2.3 Phase D — Data Migrations (Tier 3)

> **Prompt:** Implement data migration support for coodie's migration framework. Add `ctx.scan_table(keyspace, table)` to `MigrationContext` that uses token-range queries to iterate over all rows in batches without loading the entire table into memory. Add progress reporting (log percentage for long-running migrations). Add resume-from-token support so a failed migration can resume where it stopped. Add optional rate limiting / throttle support. See `docs/plans/migration-strategy.md` Phase D (tasks D.1–D.4).

---

## 3. Performance Improvements

*Source: `performance-improvement.md`*

> *Phases 1–6 are ✅ Done (Phase 5: PK cache + native async; Phase 6: `dict_factory` on CassandraDriver session). The following lower-priority items from §14.5 remain.*

### 3.1 `__slots__` on Remaining Hot-Path Classes (P2)

> **Prompt:** Add `__slots__` to the remaining hot-path classes that still use `__dict__`: `LWTResult` in `results.py`, `PagedResult` in `results.py`, and `BatchQuery` in `batch.py`. These are created frequently and `__slots__` saves ~40–60 bytes per instance and speeds up attribute access by ~10–20%. See `docs/plans/performance-improvement.md` §14.5.4.

### 3.2 Connection-Level Optimizations (P2)

> **Prompt:** Implement connection-level performance optimizations for coodie: (1) Prepared statement warming — pre-prepare common queries at `sync_table()` time instead of lazily on first execute, eliminating ~100–200 µs cold-start penalty. (2) Add support for enabling LZ4 protocol compression on the cassandra-driver connection for large result sets. (3) Add support for speculative execution policy to reduce tail latency. These are driver-configuration changes exposed via `init_coodie()` parameters. See `docs/plans/performance-improvement.md` §14.5.6.

---

## 4. python-rs Driver Support

*Source: `python-rs-driver-support.md`*

> *The python-rs-driver (`scylla` package — Rust-based async driver) is not yet integrated into coodie. All 5 phases are pending. `src/coodie/drivers/python_rs.py` does not exist.*

### 4.1 Build Infrastructure

> **Prompt:** Set up build infrastructure for python-rs-driver integration. (1) Add a CI workflow job that installs Rust toolchain, clones python-rs-driver, builds the wheel via `maturin`, and caches the artifact. (2) Add a `python-rs` optional dependency group in `pyproject.toml` (documentation-only — actual install is from source). (3) Document the local development setup. (4) Verify the build works on Linux CI and document macOS/Windows caveats. See `docs/plans/python-rs-driver-support.md` Phase 1 (tasks 1.1–1.6).

### 4.2 PythonRsDriver Implementation

> **Prompt:** Implement `PythonRsDriver(AbstractDriver)` in `src/coodie/drivers/python_rs.py`. The driver wraps the `scylla` Python package (Rust-based async native). Key tasks: (1) `execute_async()` mapping coodie params to `session.execute(prepared, values)`. (2) `_prepare()` with local cache. (3) DDL detection via `_is_ddl()` — execute DDL as raw Statement strings (can't prepare DDL). (4) `_rows_to_dicts()` via `RequestResult.iter_rows()`. (5) Sync wrapper via event-loop bridge (same pattern as AcsyllaDriver). (6) `sync_table_async()` and `sync_table()`. (7) Register `driver_type="python-rs"` in `init_coodie()` / `init_coodie_async()`. (8) Unit tests with mocked `scylla.Session`. See `docs/plans/python-rs-driver-support.md` Phase 2 (tasks 2.1–2.10).

### 4.3 Namespace Conflict Resolution

> **Prompt:** Verify that python-rs-driver's `scylla` package does not conflict with other driver packages. (1) Verify `scylla` and `cassandra` namespaces don't collide. (2) Add `[tool.uv]` conflict entries if needed. (3) Document supported driver combinations. (4) Test import isolation in CI. See `docs/plans/python-rs-driver-support.md` Phase 3 (tasks 3.1–3.4).

### 4.4 Integration Testing

> **Prompt:** Add python-rs-driver to coodie's integration test suite. (1) Add a `python-rs` variant to the integration test matrix in CI. (2) Parametrize integration test fixtures to accept `driver_type="python-rs"`. (3) Identify and xfail tests for unsupported features (batch, paging resume). (4) Validate all CQL type roundtrips pass. See `docs/plans/python-rs-driver-support.md` Phase 4 (tasks 4.1–4.6).

### 4.5 Benchmarks & Maturity Evaluation

> **Prompt:** Add python-rs-driver to coodie's benchmark suite. (1) Add `PythonRsDriver` to `benchmarks/`. (2) Run INSERT, SELECT, UPDATE, DELETE benchmarks across all three drivers. (3) Run Argus-inspired real-world pattern benchmarks. (4) Document results and produce a maturity scorecard. See `docs/plans/python-rs-driver-support.md` Phase 5 (tasks 5.1–5.6).

---

## 5. Demo Suite Extension

*Source: `demos-extension-plan.md`*

> *2 demos exist: `demos/fastapi-catalog/` and `demos/flask-blog/` (✅). Demo CI workflow `test-demos.yml` is ✅ Done. The plan calls for 12+ additional demos.*

### 5.1 Django Task Board Demo

> **Prompt:** Create `demos/django-taskboard/` — a Django integration demo showing coodie alongside Django's ORM. Use Cassandra for high-write task events (`TaskEvent`, `TaskCounter` models via coodie) and SQLite for auth. Add a `manage.py sync_cassandra` management command. Build a colorful Kanban-style board UI with Django templates. Add `seed.py` with Faker data and `rich` progress bars. Include `Makefile` with standard targets and a `README.md` with numbered quick-start. See `docs/plans/demos-extension-plan.md` Phase 3.

### 5.2 TTL & Ephemeral Data Demo

> **Prompt:** Create `demos/ttl-sessions/` — an ephemeral session store demo showcasing coodie's TTL support. Demonstrate `ttl=` on save, `__default_ttl__` on the model's Settings, and show data auto-expiring. Include a web UI that displays session tokens and their remaining TTL. Add `seed.py`, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 4 (task 4.1).

### 5.3 Real-Time Counters Demo

> **Prompt:** Create `demos/realtime-counters/` — a page-view analytics demo showcasing coodie's `CounterDocument`, `increment()`, and `decrement()`. Build a live analytics dashboard showing counter updates in real-time. Add `seed.py` to generate synthetic traffic, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 4 (task 4.2).

### 5.4 Lightweight Transactions Demo

> **Prompt:** Create `demos/lwt-user-registry/` — a user registration demo showcasing coodie's Lightweight Transactions (`if_not_exists`, `if_exists`, `if_conditions`). Demonstrate uniqueness guarantees and optimistic locking patterns. Add `seed.py`, colorful UI, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 4 (task 4.3).

### 5.5 Batch Operations Demo

> **Prompt:** Create `demos/batch-importer/` — a CSV bulk import tool demo showcasing coodie's `BatchQuery` with logged and unlogged batches. Use `rich` for progress bars during import. Add `seed.py`, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 5 (task 5.1).

### 5.6 Collections & Tags Demo

> **Prompt:** Create `demos/collections-tags/` — an article tagging system demo showcasing coodie's collection types (`list`, `set`, `map` fields) and collection mutation operations (`add__`, `remove__`, `append__`, `prepend__`). Include frozen collection examples. Add `seed.py`, colorful UI, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 5 (task 5.2).

### 5.7 Materialized Views Demo

> **Prompt:** Create `demos/materialized-views/` — a product catalog demo with auto-maintained `MaterializedView` by category. Show `sync_view()`, read-only queries against the view, and how the view auto-updates when the base table changes. Add `seed.py`, UI, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 5 (task 5.3).

### 5.8 Vector Similarity Search (Library + Demo)

> **Prompt:** Add vector column support to coodie and create a vector search demo. **Library work:** (1) Add `Vector(dimensions=N)` field annotation to `coodie/fields.py` mapping to CQL `vector<float, N>`. (2) Update `coodie/schema.py` to emit `vector<float, N>` in DDL. (3) Add `VectorIndex(similarity_function="COSINE")` annotation for `CREATE INDEX ... USING 'vector_index'`. (4) Support ANN queries via a QuerySet method that emits `ORDER BY field ANN OF [...]` CQL. (5) Validate vector dimensions on save. (6) Add unit and integration tests. **Demo work:** Create `demos/vector-search/` — semantic product search using sentence-transformer embeddings with ANN queries. See `docs/plans/demos-extension-plan.md` Phase 6.

### 5.9 Time-Series IoT Demo

> **Prompt:** Create `demos/timeseries-iot/` — an IoT sensor data demo showcasing time-bucketed partitions, clustering keys with DESC order, `per_partition_limit()`, and `paged_all()` for pagination. Add `seed.py` generating synthetic sensor readings, colorful dashboard UI, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 7 (task 7.1).

### 5.10 Polymorphic CMS Demo

> **Prompt:** Create `demos/polymorphic-cms/` — a content management system demo showcasing coodie's single-table inheritance with `Discriminator` column. Define `Article`, `Video`, and `Podcast` subtypes sharing a single table. Add `seed.py`, colorful UI, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 7 (task 7.2).

### 5.11 Argus-Style Test Tracker Demo

> **Prompt:** Create `demos/argus-tracker/` — a scaled-down test tracker inspired by scylladb/argus. Define complex models: User, TestRun (composite PK + clustering), Event (compound partition), Notification (TimeUUID). Include batch event ingestion, prepared-statement caching patterns, and partition-scoped queries. Add `seed.py`, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 8 (task 8.1).

### 5.12 cqlengine → coodie Migration Guide Demo

> **Prompt:** Create `demos/migration-guide/` — a side-by-side migration walkthrough from cqlengine to coodie. Include `cqlengine_models.py` and `coodie_models.py` with equivalent models, a `migrate.py` script that syncs tables, and a `verify.py` that checks data round-trip. Reference argus model patterns. Add `README.md` with step-by-step walkthrough. See `docs/plans/demos-extension-plan.md` Phase 8 (task 8.3).

### 5.13 Schema Migrations Demo

> **Prompt:** Create `demos/schema-migrations/` — a demo showcasing coodie's Phase B migration framework CLI (`coodie migrate`). Demonstrate `apply`, `rollback`, `dry-run`, and state tracking with the `_coodie_migrations` table. Include sample migration files following the `YYYYMMDD_NNN_description.py` pattern. Add `Makefile` and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 10 reference.

---

## 6. cqlengine Test Coverage Gaps

*Source: `cqlengine-test-coverage-plan.md`*

> *This plan identifies cqlengine behaviours covered by the scylladb/python-driver test suite that coodie does NOT yet test. Many require small API additions before tests can be written.*

### 6.1 Collection Mutation Integration Tests

> **Prompt:** Add integration tests for collection mutation operations against a real ScyllaDB instance. Currently only unit tests exist. Test: (1) `list__append` and `list__prepend` round-trip. (2) `set__add` and `set__remove` round-trip. (3) `map__update` and `map__remove` round-trip (requires implementing `map__update` and `map__remove` in QuerySet). (4) Frozen collection round-trip. See `docs/plans/cqlengine-test-coverage-plan.md` §1.2.

### 6.2 Counter Column Integration Tests

> **Prompt:** Add integration tests for `CounterDocument` with `increment()` and `decrement()` against a real ScyllaDB instance. Test: creating a counter table, incrementing a counter, decrementing a counter, reading counter values, multiple increments accumulating, and verifying that regular `save()`/`insert()` is rejected on counter tables. See `docs/plans/cqlengine-test-coverage-plan.md` §1.2.

### 6.3 Static Column Integration Tests

> **Prompt:** Add integration tests for static columns. Test: (1) Static column value shared across all clustering rows in a partition. (2) Updating a static column updates the value for all clustering rows. See `docs/plans/cqlengine-test-coverage-plan.md` §1.2.

### 6.4 LWT Conditional Write Integration Tests

> **Prompt:** Add integration tests for `Document.update(if_conditions={...})` — UPDATE with conditional `IF col = ?` clauses. Test: successful conditional update (condition met), failed conditional update (condition not met, returns `[applied]=false`), and the LWT result type. See `docs/plans/cqlengine-test-coverage-plan.md` §1.5.

### 6.5 TTL and Timestamp Modifier Integration Tests

> **Prompt:** Add integration tests for TTL and USING TIMESTAMP modifiers. Test: (1) `save(ttl=N)` causes row to expire. (2) `__default_ttl__` in Settings applies TTL to all saves. (3) `save(timestamp=...)` uses explicit write timestamp. (4) `QuerySet.ttl(N)` on bulk update. See `docs/plans/cqlengine-test-coverage-plan.md` §1.6.

### 6.6 UDT Integration Tests

> **Prompt:** Add integration tests for User-Defined Types. Test: (1) Define a model with a UDT column, `sync_type()` + `sync_table()`, INSERT, SELECT round-trip. (2) Nested UDTs. (3) UDTs inside collections (`list[MyUDT]`). (4) Optional UDT field with `None`. UDT is now implemented in `src/coodie/usertype.py`. See `docs/plans/cqlengine-test-coverage-plan.md` §1.7.

### 6.7 Schema Management Integration Tests

> **Prompt:** Add integration tests for schema management edge cases. Test: (1) `sync_table()` idempotency (multiple calls don't raise). (2) `sync_table()` with `drop_removed_indexes=True` drops stale indexes. (3) Table options (`compaction`, `gc_grace_seconds`) applied via `Settings.__options__`. See `docs/plans/cqlengine-test-coverage-plan.md` §1.8.

### 6.8 Batch Write Integration Tests

> **Prompt:** Add integration tests for batch writes against a real ScyllaDB instance. Test: (1) Logged batch with multiple models. (2) Unlogged batch. (3) Counter batch. (4) Batch context manager rollback (exception during batch). See `docs/plans/cqlengine-test-coverage-plan.md` §1.9.

### 6.9 Advanced Query Feature Integration Tests

> **Prompt:** Add integration tests for advanced query features. Test: (1) `per_partition_limit(N)` returns exactly N rows per partition. (2) Token-range queries with `__token__gt` / `__token__lt`. (3) `values_list()` returns tuples instead of Documents. (4) `only(*cols)` and `defer(*cols)` column projection. See `docs/plans/cqlengine-test-coverage-plan.md` §1.10.

---

## 7. Integration Test Coverage Gaps

*Source: `integration-test-coverage.md`*

> *These are features that exist in the codebase but lack integration test coverage. Note: pagination tests were added in `tests/integration/test_pagination.py` (✅ Done).*

### 7.1 Partial UPDATE Integration Tests

> **Prompt:** Add integration tests for partial UPDATE operations via `Document.update(**kwargs)`. Test: updating individual fields without a full INSERT (upsert), UPDATE with TTL, UPDATE with IF conditions, and collection mutation operators (`column__add`, `column__remove`, `column__append`, `column__prepend`). See `docs/plans/integration-test-coverage.md` §"build_update".

### 7.2 Custom Index Name Integration Tests

> **Prompt:** Add integration tests verifying that `Indexed(index_name="my_custom_idx")` creates a named secondary index and that the index is queryable. See `docs/plans/integration-test-coverage.md` §"Secondary index with custom index_name".

### 7.3 AcsyllaDriver Integration Tests

> **Prompt:** Add CI workflow support and integration tests for the `AcsyllaDriver` (async native driver at `src/coodie/drivers/acsylla.py`). Currently all async integration tests run through the `CassandraDriver` asyncio bridge. Add a separate CI workflow or matrix entry targeting the `acsylla` driver. See `docs/plans/integration-test-coverage.md` §"AcsyllaDriver".
