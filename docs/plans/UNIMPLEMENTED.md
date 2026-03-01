# Unimplemented Features — Ready Prompts

> **Auto-generated summary** of features planned in `/docs/plans/` that are
> **not yet implemented**. Each item is a self-contained prompt you can give
> to an AI coding agent (or a developer) to implement the feature.
>
> **Last reviewed:** 2026-03-01 (post-merge: Phase D data migrations done,
> /solve command workflow shipped, resolve-conflicts.sh merge mode done,
> sync-api Phase 1 done, partial UPDATE integration tests done,
> cqlengine test Phases 2–5 done, vector search WIP in PR #150)

---

## Table of Contents

1. [Migration Framework](#1-migration-framework)
2. [python-rs Driver Support](#2-python-rs-driver-support)
3. [python-rs Feature Gaps](#3-python-rs-feature-gaps)
4. [Demo Suite Extension](#4-demo-suite-extension)
5. [cqlengine Test Coverage Gaps](#5-cqlengine-test-coverage-gaps)
6. [Integration Test Coverage Gaps](#6-integration-test-coverage-gaps)
7. [Sync API Support](#7-sync-api-support)
8. [PR Conflict Detection & /solve Command](#8-pr-conflict-detection--solve-command)

---

## 1. Migration Framework

*Source: `migration-strategy.md`*

> *Phase A (enhanced `sync_table`) is ✅ Done. Phase B (migration framework core) is ✅ Done. Phase C (auto-generation) is ✅ Done. Phase D (data migrations) is ✅ Done — `ctx.scan_table()` with token-range iteration, progress logging, `resume_token`, `throttle_seconds`, 15 tests. All migration phases complete.*

*No remaining items — entire migration framework is implemented.*

---

## 2. python-rs Driver Support

*Source: `python-rs-driver-support.md`*

> *Phases 1–4 are ✅ Done: `src/coodie/drivers/python_rs.py` (294 lines), `pyproject.toml` dependency group, CI matrix entry, unit tests (380 lines), integration fixtures with skip/xfail patterns. Only Phase 5 (benchmarks & maturity evaluation) remains.*

### 2.1 Benchmarks & Maturity Evaluation

> **Prompt:** Add python-rs-driver to coodie's benchmark suite. (1) Add `PythonRsDriver` to `benchmarks/`. (2) Run INSERT, SELECT, UPDATE, DELETE benchmarks across all three drivers. (3) Run Argus-inspired real-world pattern benchmarks. (4) Document results and produce a maturity scorecard. See `docs/plans/python-rs-driver-support.md` Phase 5 (tasks 5.1–5.6).

---

## 3. python-rs Feature Gaps

*Source: `python-rs-feature-gaps.md`*

> *Continuation plan for PythonRsDriver feature gaps blocked by upstream python-rs-driver limitations. Each phase is gated on an upstream improvement. All 6 phases are pending.*

### 3.1 Per-Query Consistency & Timeout

> **Prompt:** Implement per-query consistency level and timeout support in `PythonRsDriver`. Currently these parameters are silently ignored in `execute_async()`. Wire `consistency` through `Statement.with_consistency()` and `timeout` through `Statement.with_request_timeout()`. Add unit tests with mocked session and update integration tests to un-skip consistency-dependent tests. See `docs/plans/python-rs-feature-gaps.md` Phase 1.

### 3.2 Background-Thread Sync Bridge

> **Prompt:** Replace `PythonRsDriver.execute()` / `sync_table()` / `close()` using `loop.run_until_complete()` with a proper background-thread sync bridge (same pattern as `AcsyllaDriver`). Spawn a background thread running `asyncio.run_forever()`, set `_bridge_to_bg_loop = True`, route sync calls through `run_coroutine_threadsafe()`. This un-blocks 68 skipped sync variant integration tests. See `docs/plans/python-rs-feature-gaps.md` Phase 2.

### 3.3 Pagination Support

> **Prompt:** Implement pagination in `PythonRsDriver` once upstream python-rs-driver adds `execute_paged()`. Wire `fetch_size` through `PreparedStatement.with_page_size()`, extract `paging_state` from `RequestResult`, and return it for `paged_all()` continuation. Un-skip 3 pagination integration tests. See `docs/plans/python-rs-feature-gaps.md` Phase 3.

### 3.4 Session Close / Shutdown

> **Prompt:** Implement proper `close_async()` and `close()` in `PythonRsDriver` once upstream python-rs-driver adds `Session.close()`. Currently these are no-ops. See `docs/plans/python-rs-feature-gaps.md` Phase 4.

### 3.5 Non-Row Result Handling

> **Prompt:** Improve non-row result handling in `PythonRsDriver._rows_to_dicts()`. Currently catches `RuntimeError("does not have rows")` — improve once upstream adds `has_rows()` or `ResultType` enum. See `docs/plans/python-rs-feature-gaps.md` Phase 5.

### 3.6 SSL/TLS & Authentication

> **Prompt:** Add SSL/TLS and authentication support to `PythonRsDriver` once upstream python-rs-driver adds `SessionBuilder` TLS and auth configuration. Wire `ssl_context`, `ssl_enabled`, and auth parameters from `init_coodie()` / `init_coodie_async()`. See `docs/plans/python-rs-feature-gaps.md` Phase 6.

---

## 4. Demo Suite Extension

*Source: `demos-extension-plan.md`*

> *4 demos exist: `demos/fastapi-catalog/`, `demos/flask-blog/`, `demos/django-taskboard/` (✅), and `demos/lwt-user-registry/` (✅). Demo CI workflow `test-demos.yml` is ✅ Done. The plan calls for 10+ additional demos.*

### 4.1 TTL & Ephemeral Data Demo

> **Prompt:** Create `demos/ttl-sessions/` — an ephemeral session store demo showcasing coodie's TTL support. Demonstrate `ttl=` on save, `__default_ttl__` on the model's Settings, and show data auto-expiring. Include a web UI that displays session tokens and their remaining TTL. Add `seed.py`, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 4 (task 4.1).

### 4.2 Real-Time Counters Demo

> **Prompt:** Create `demos/realtime-counters/` — a page-view analytics demo showcasing coodie's `CounterDocument`, `increment()`, and `decrement()`. Build a live analytics dashboard showing counter updates in real-time. Add `seed.py` to generate synthetic traffic, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 4 (task 4.2).

### 4.3 Batch Operations Demo

> **Prompt:** Create `demos/batch-importer/` — a CSV bulk import tool demo showcasing coodie's `BatchQuery` with logged and unlogged batches. Use `rich` for progress bars during import. Add `seed.py`, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 5 (task 5.1).

### 4.4 Collections & Tags Demo

> **Prompt:** Create `demos/collections-tags/` — an article tagging system demo showcasing coodie's collection types (`list`, `set`, `map` fields) and collection mutation operations (`add__`, `remove__`, `append__`, `prepend__`). Include frozen collection examples. Add `seed.py`, colorful UI, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 5 (task 5.2).

### 4.5 Materialized Views Demo

> **Prompt:** Create `demos/materialized-views/` — a product catalog demo with auto-maintained `MaterializedView` by category. Show `sync_view()`, read-only queries against the view, and how the view auto-updates when the base table changes. Add `seed.py`, UI, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 5 (task 5.3).

### 4.6 Vector Similarity Search (Library + Demo)

> **⚠️ IN PROGRESS — [PR #150](https://github.com/fruch/coodie/pull/150) (WIP/draft): Vector column support + demo. Library work (Vector, VectorIndex annotations, CQL builder, ANN queries, unit tests) is done; demo creation in progress.**

> **Prompt:** Add vector column support to coodie and create a vector search demo. **Library work:** (1) Add `Vector(dimensions=N)` field annotation to `coodie/fields.py` mapping to CQL `vector<float, N>`. (2) Update `coodie/schema.py` to emit `vector<float, N>` in DDL. (3) Add `VectorIndex(similarity_function="COSINE")` annotation for `CREATE INDEX ... USING 'vector_index'`. (4) Support ANN queries via a QuerySet method that emits `ORDER BY field ANN OF [...]` CQL. (5) Validate vector dimensions on save. (6) Add unit and integration tests. **Demo work:** Create `demos/vector-search/` — semantic product search using sentence-transformer embeddings with ANN queries. See `docs/plans/demos-extension-plan.md` Phase 6.

### 4.7 Time-Series IoT Demo

> **Prompt:** Create `demos/timeseries-iot/` — an IoT sensor data demo showcasing time-bucketed partitions, clustering keys with DESC order, `per_partition_limit()`, and `paged_all()` for pagination. Add `seed.py` generating synthetic sensor readings, colorful dashboard UI, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 7 (task 7.1).

### 4.8 Polymorphic CMS Demo

> **Prompt:** Create `demos/polymorphic-cms/` — a content management system demo showcasing coodie's single-table inheritance with `Discriminator` column. Define `Article`, `Video`, and `Podcast` subtypes sharing a single table. Add `seed.py`, colorful UI, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 7 (task 7.2).

### 4.9 Argus-Style Test Tracker Demo

> **Prompt:** Create `demos/argus-tracker/` — a scaled-down test tracker inspired by scylladb/argus. Define complex models: User, TestRun (composite PK + clustering), Event (compound partition), Notification (TimeUUID). Include batch event ingestion, prepared-statement caching patterns, and partition-scoped queries. Add `seed.py`, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 8 (task 8.1).

### 4.10 cqlengine → coodie Migration Guide Demo

> **Prompt:** Create `demos/migration-guide/` — a side-by-side migration walkthrough from cqlengine to coodie. Include `cqlengine_models.py` and `coodie_models.py` with equivalent models, a `migrate.py` script that syncs tables, and a `verify.py` that checks data round-trip. Reference argus model patterns. Add `README.md` with step-by-step walkthrough. See `docs/plans/demos-extension-plan.md` Phase 8 (task 8.3).

### 4.11 Schema Migrations Demo

> **Prompt:** Create `demos/schema-migrations/` — a demo showcasing coodie's Phase B migration framework CLI (`coodie migrate`). Demonstrate `apply`, `rollback`, `dry-run`, and state tracking with the `_coodie_migrations` table. Include sample migration files following the `YYYYMMDD_NNN_description.py` pattern. Add `Makefile` and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 10 reference.

---

## 5. cqlengine Test Coverage Gaps

*Source: `cqlengine-test-coverage-plan.md`*

> *Phase 1 (unit test completeness) is ✅ Done. `map__update` collection operator is ✅ Done. Counter integration tests are ✅ Done. Phase 2 (container mutations) is ✅ Done — `test_extended.py` covers list/set/map mutations, frozen collections. Phase 3 (query operators) is ✅ Done — `__ne` operator in `cql_builder.py`, datetime range filters. Phase 4 (UDT) is ✅ Done — `test_udt.py` covers save/load, nested UDTs, optional UDT. Phase 5 (polymorphism + schema) is ✅ Done — `test_extended.py` covers discriminator hierarchy, drop_table, schema migration. Phases 6–8 remain (LWT conditionals, TTL/timestamp, advanced query features).*

### 5.1 LWT Conditional Write Integration Tests

> **Prompt:** Add integration tests for `Document.update(if_conditions={...})` — UPDATE with conditional `IF col = ?` clauses. Test: successful conditional update (condition met), failed conditional update (condition not met, returns `[applied]=false`), and the LWT result type. See `docs/plans/cqlengine-test-coverage-plan.md` §1.5.

### 5.2 TTL and Timestamp Modifier Integration Tests

> **Prompt:** Add integration tests for TTL and USING TIMESTAMP modifiers. Test: (1) `save(ttl=N)` causes row to expire. (2) `__default_ttl__` in Settings applies TTL to all saves. (3) `save(timestamp=...)` uses explicit write timestamp. (4) `QuerySet.ttl(N)` on bulk update. See `docs/plans/cqlengine-test-coverage-plan.md` §1.6.

### 5.3 Batch Write Integration Tests

> **Prompt:** Add integration tests for batch writes against a real ScyllaDB instance. Test: (1) Logged batch with multiple models. (2) Unlogged batch. (3) Counter batch. (4) Batch context manager rollback (exception during batch). See `docs/plans/cqlengine-test-coverage-plan.md` §1.9.

### 5.4 Advanced Query Feature Integration Tests

> **Prompt:** Add integration tests for advanced query features. Test: (1) `per_partition_limit(N)` returns exactly N rows per partition. (2) Token-range queries with `__token__gt` / `__token__lt`. (3) `values_list()` returns tuples instead of Documents. (4) `only(*cols)` and `defer(*cols)` column projection. See `docs/plans/cqlengine-test-coverage-plan.md` §1.10.

---

## 6. Integration Test Coverage Gaps

*Source: `integration-test-coverage.md`*

> *These are features that exist in the codebase but lack integration test coverage. Pagination tests are ✅ Done. Partial UPDATE tests are ✅ Done (`tests/integration/test_update.py` — 257 lines: partial field update, TTL, IF conditions, IF EXISTS, collection mutations).*

### 6.1 Custom Index Name Integration Tests

> **Prompt:** Add integration tests verifying that `Indexed(index_name="my_custom_idx")` creates a named secondary index and that the index is queryable. See `docs/plans/integration-test-coverage.md` §"Secondary index with custom index_name".

### 6.2 AcsyllaDriver Integration Tests

> **Prompt:** Add CI workflow support and integration tests for the `AcsyllaDriver` (async native driver at `src/coodie/drivers/acsylla.py`). Currently all async integration tests run through the `CassandraDriver` asyncio bridge. Add a separate CI workflow or matrix entry targeting the `acsylla` driver. See `docs/plans/integration-test-coverage.md` §"AcsyllaDriver".

---

## 7. Sync API Support

*Source: `sync-api-support.md`*

> *Phase 1 is ✅ Done — `init_coodie_async(driver_type="acsylla", hosts=...)` now routes through `AcsyllaDriver.connect()` with `_bridge_to_bg_loop = True`. PythonRsDriver exists (`src/coodie/drivers/python_rs.py`) but uses `run_until_complete()` instead of the proper background-thread sync bridge. Phases 2–5 remain.*

### 7.1 Add sync-capable `init_coodie` for AcsyllaDriver

> **Prompt:** Allow `init_coodie(driver_type="acsylla", hosts=...)` to auto-create a sync-capable session instead of raising `ConfigurationError`. Add `AcsyllaDriver.connect_sync(hosts, keyspace, **kwargs)` — a blocking classmethod that bootstraps the background loop and creates the session on it. Add a `UserWarning` when `AcsyllaDriver(session=...)` is used directly (sync calls may not work). See `docs/plans/sync-api-support.md` Phase 2 (tasks 2.1–2.5).

### 7.2 Upgrade PythonRsDriver to Sync Bridge

> **Prompt:** Upgrade `src/coodie/drivers/python_rs.py` to use a proper background-thread sync bridge (same pattern as `AcsyllaDriver`) instead of `loop.run_until_complete()`. The file already exists with basic async+sync via `run_until_complete()`. Add: (1) `_bridge_to_bg_loop` flag and background event-loop thread. (2) `execute()` via `run_coroutine_threadsafe()`. (3) `PythonRsDriver.connect(session_factory, default_keyspace)` classmethod. (4) Update `init_coodie()` / `init_coodie_async()` to use `PythonRsDriver.connect()`. See `docs/plans/sync-api-support.md` Phase 3 (tasks 3.5, 3.6, 3.9, 3.10).

### 7.3 Sync API Integration Tests

> **Prompt:** Verify both AcsyllaDriver and PythonRsDriver pass the integration test suite in sync and async variants. Add `"python-rs"` to `--driver-type` choices, create `create_python_rs_session()` helper, update `coodie_driver` fixture, and add CI matrix entries for both drivers. See `docs/plans/sync-api-support.md` Phase 4 (tasks 4.1–4.5).

### 7.4 Sync API Documentation

> **Prompt:** Document the sync bridge pattern, supported init paths, and caveats for AcsyllaDriver and PythonRsDriver. Update class docstrings and `init_coodie()`/`init_coodie_async()` docstrings. See `docs/plans/sync-api-support.md` Phase 5 (tasks 5.1–5.3).

---

## 8. PR Conflict Detection & /solve Command

*Source: `pr-conflict-detection-solve.md`*

> *The `conflict` label exists in `.github/labels.toml` and `resolve-conflicts.sh` is reusable (✅). Phase 1 (conflict detection workflow) is ✅ Done — `.github/workflows/pr-conflict-detect.yml` shipped. Phase 2 (`/solve` slash-command) is ✅ Done — `.github/workflows/pr-solve-command.yml` shipped (207 lines). Phase 3 (shared conflict-resolution script) is ✅ Done — `resolve-conflicts.sh` supports `RESOLVE_MODE=merge|rebase`. Phases 4–5 remain.*

### 8.1 Safety Gates & Edge Cases

> **Prompt:** Add safety gates to the conflict detection and `/solve` workflows: draft PR skip, max file limit, protected branch checks, binary file conflict handling, concurrent run prevention. See `docs/plans/pr-conflict-detection-solve.md` Phase 4 (tasks 4.1–4.6).

### 8.2 Testing & Documentation

> **Prompt:** Add Bats tests for the shared conflict-resolution script, Python workflow convention tests, and update `CONTRIBUTING.md` with `/solve` command documentation. See `docs/plans/pr-conflict-detection-solve.md` Phase 5 (tasks 5.1–5.4).
