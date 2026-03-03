# Unimplemented Features — Ready Prompts

> **Auto-generated summary** of features planned in `/docs/plans/` that are
> **not yet implemented**. Each item is a self-contained prompt you can give
> to an AI coding agent (or a developer) to implement the feature.
>
> **Last reviewed:** 2026-03-03 (post-merge: TTL/batch/materialized-views demos shipped,
> sync-api Phases 2–3 done, PR conflict Phase 4 done; vector search WIP in PR #150,
> collections-tags demo WIP in PR #147)

---

## Table of Contents

1. [Migration Framework](#1-migration-framework)
2. [python-rs Feature Gaps](#2-python-rs-feature-gaps)
3. [Demo Suite Extension](#3-demo-suite-extension)
4. [cqlengine Test Coverage Gaps](#4-cqlengine-test-coverage-gaps)
5. [Integration Test Coverage Gaps](#5-integration-test-coverage-gaps)
6. [Sync API Support](#6-sync-api-support)
7. [PR Conflict Detection & /solve Command](#7-pr-conflict-detection--solve-command)

---

## 1. Migration Framework

*Source: `migration-strategy.md`*

> *Phase A (enhanced `sync_table`) is ✅ Done. Phase B (migration framework core) is ✅ Done. Phase C (auto-generation) is ✅ Done. Phase D (data migrations) is ✅ Done — `ctx.scan_table()` with token-range iteration, progress logging, `resume_token`, `throttle_seconds`, 15 tests. All migration phases complete.*

*No remaining items — entire migration framework is implemented.*

---

## 2. python-rs Feature Gaps

*Source: `python-rs-feature-gaps.md`*

> *Continuation plan for PythonRsDriver feature gaps blocked by upstream python-rs-driver limitations. Each phase is gated on an upstream improvement. Phase 2 (background-thread sync bridge) is ✅ Done — PythonRsDriver uses `_bg_loop`, `_bg_thread`, `_bridge_to_bg_loop`, `connect()` classmethod, `run_coroutine_threadsafe()` (implemented via sync-api-support Phase 3). 5 phases remain.*

### 2.1 Per-Query Consistency & Timeout

> **Prompt:** Implement per-query consistency level and timeout support in `PythonRsDriver`. Currently these parameters are silently ignored in `execute_async()`. Wire `consistency` through `Statement.with_consistency()` and `timeout` through `Statement.with_request_timeout()`. Add unit tests with mocked session and update integration tests to un-skip consistency-dependent tests. See `docs/plans/python-rs-feature-gaps.md` Phase 1.

### 2.2 Pagination Support

> **Prompt:** Implement pagination in `PythonRsDriver` once upstream python-rs-driver adds `execute_paged()`. Wire `fetch_size` through `PreparedStatement.with_page_size()`, extract `paging_state` from `RequestResult`, and return it for `paged_all()` continuation. Un-skip 3 pagination integration tests. See `docs/plans/python-rs-feature-gaps.md` Phase 3.

### 2.3 Session Close / Shutdown

> **Prompt:** Implement proper `close_async()` and `close()` in `PythonRsDriver` once upstream python-rs-driver adds `Session.close()`. Currently these are no-ops. See `docs/plans/python-rs-feature-gaps.md` Phase 4.

### 2.4 Non-Row Result Handling

> **Prompt:** Improve non-row result handling in `PythonRsDriver._rows_to_dicts()`. Currently catches `RuntimeError("does not have rows")` — improve once upstream adds `has_rows()` or `ResultType` enum. See `docs/plans/python-rs-feature-gaps.md` Phase 5.

### 2.5 SSL/TLS & Authentication

> **Prompt:** Add SSL/TLS and authentication support to `PythonRsDriver` once upstream python-rs-driver adds `SessionBuilder` TLS and auth configuration. Wire `ssl_context`, `ssl_enabled`, and auth parameters from `init_coodie()` / `init_coodie_async()`. See `docs/plans/python-rs-feature-gaps.md` Phase 6.

---

## 3. Demo Suite Extension

*Source: `demos-extension-plan.md`*

> *7 demos exist: `demos/fastapi-catalog/`, `demos/flask-blog/`, `demos/django-taskboard/` (✅), `demos/lwt-user-registry/` (✅), `demos/ttl-sessions/` (✅), `demos/batch-importer/` (✅), and `demos/materialized-views/` (✅). Demo CI workflow `test-demos.yml` is ✅ Done. The plan calls for 10+ additional demos.*

### 3.1 Real-Time Counters Demo

> **Prompt:** Create `demos/realtime-counters/` — a page-view analytics demo showcasing coodie's `CounterDocument`, `increment()`, and `decrement()`. Build a live analytics dashboard showing counter updates in real-time. Add `seed.py` to generate synthetic traffic, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 4 (task 4.2).

### 3.2 Collections & Tags Demo

> **⚠️ IN PROGRESS — [PR #147](https://github.com/fruch/coodie/pull/147): Collections-tags demo (Phase 5.2).**

> **Prompt:** Create `demos/collections-tags/` — an article tagging system demo showcasing coodie's collection types (`list`, `set`, `map` fields) and collection mutation operations (`add__`, `remove__`, `append__`, `prepend__`). Include frozen collection examples. Add `seed.py`, colorful UI, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 5 (task 5.2).

### 3.3 Vector Similarity Search (Library + Demo)

> **⚠️ IN PROGRESS — [PR #150](https://github.com/fruch/coodie/pull/150) (WIP/draft): Vector column support + demo. Library work (Vector, VectorIndex annotations, CQL builder, ANN queries, unit tests) is done; demo creation in progress.**

> **Prompt:** Add vector column support to coodie and create a vector search demo. **Library work:** (1) Add `Vector(dimensions=N)` field annotation to `coodie/fields.py` mapping to CQL `vector<float, N>`. (2) Update `coodie/schema.py` to emit `vector<float, N>` in DDL. (3) Add `VectorIndex(similarity_function="COSINE")` annotation for `CREATE INDEX ... USING 'vector_index'`. (4) Support ANN queries via a QuerySet method that emits `ORDER BY field ANN OF [...]` CQL. (5) Validate vector dimensions on save. (6) Add unit and integration tests. **Demo work:** Create `demos/vector-search/` — semantic product search using sentence-transformer embeddings with ANN queries. See `docs/plans/demos-extension-plan.md` Phase 6.

### 3.4 Time-Series IoT Demo

> **Prompt:** Create `demos/timeseries-iot/` — an IoT sensor data demo showcasing time-bucketed partitions, clustering keys with DESC order, `per_partition_limit()`, and `paged_all()` for pagination. Add `seed.py` generating synthetic sensor readings, colorful dashboard UI, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 7 (task 7.1).

### 3.5 Polymorphic CMS Demo

> **Prompt:** Create `demos/polymorphic-cms/` — a content management system demo showcasing coodie's single-table inheritance with `Discriminator` column. Define `Article`, `Video`, and `Podcast` subtypes sharing a single table. Add `seed.py`, colorful UI, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 7 (task 7.2).

### 3.6 Argus-Style Test Tracker Demo

> **Prompt:** Create `demos/argus-tracker/` — a scaled-down test tracker inspired by scylladb/argus. Define complex models: User, TestRun (composite PK + clustering), Event (compound partition), Notification (TimeUUID). Include batch event ingestion, prepared-statement caching patterns, and partition-scoped queries. Add `seed.py`, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 8 (task 8.1).

### 3.7 cqlengine → coodie Migration Guide Demo

> **Prompt:** Create `demos/migration-guide/` — a side-by-side migration walkthrough from cqlengine to coodie. Include `cqlengine_models.py` and `coodie_models.py` with equivalent models, a `migrate.py` script that syncs tables, and a `verify.py` that checks data round-trip. Reference argus model patterns. Add `README.md` with step-by-step walkthrough. See `docs/plans/demos-extension-plan.md` Phase 8 (task 8.3).

### 3.8 Schema Migrations Demo

> **Prompt:** Create `demos/schema-migrations/` — a demo showcasing coodie's Phase B migration framework CLI (`coodie migrate`). Demonstrate `apply`, `rollback`, `dry-run`, and state tracking with the `_coodie_migrations` table. Include sample migration files following the `YYYYMMDD_NNN_description.py` pattern. Add `Makefile` and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 10 reference.

---

## 4. cqlengine Test Coverage Gaps

*Source: `cqlengine-test-coverage-plan.md`*

> *Phase 1 (unit test completeness) is ✅ Done. `map__update` collection operator is ✅ Done. Counter integration tests are ✅ Done. Phase 2 (container mutations) is ✅ Done — `test_extended.py` covers list/set/map mutations, frozen collections. Phase 3 (query operators) is ✅ Done — `__ne` operator in `cql_builder.py`, datetime range filters. Phase 4 (UDT) is ✅ Done — `test_udt.py` covers save/load, nested UDTs, optional UDT. Phase 5 (polymorphism + schema) is ✅ Done — `test_extended.py` covers discriminator hierarchy, drop_table, schema migration. Phases 6–8 remain (LWT conditionals, TTL/timestamp, advanced query features).*

### 4.1 LWT Conditional Write Integration Tests

> **Prompt:** Add integration tests for `Document.update(if_conditions={...})` — UPDATE with conditional `IF col = ?` clauses. Test: successful conditional update (condition met), failed conditional update (condition not met, returns `[applied]=false`), and the LWT result type. See `docs/plans/cqlengine-test-coverage-plan.md` §1.5.

### 4.2 TTL and Timestamp Modifier Integration Tests

> **Prompt:** Add integration tests for TTL and USING TIMESTAMP modifiers. Test: (1) `save(ttl=N)` causes row to expire. (2) `__default_ttl__` in Settings applies TTL to all saves. (3) `save(timestamp=...)` uses explicit write timestamp. (4) `QuerySet.ttl(N)` on bulk update. See `docs/plans/cqlengine-test-coverage-plan.md` §1.6.

### 4.3 Batch Write Integration Tests

> **Prompt:** Add integration tests for batch writes against a real ScyllaDB instance. Test: (1) Logged batch with multiple models. (2) Unlogged batch. (3) Counter batch. (4) Batch context manager rollback (exception during batch). See `docs/plans/cqlengine-test-coverage-plan.md` §1.9.

### 4.4 Advanced Query Feature Integration Tests

> **Prompt:** Add integration tests for advanced query features. Test: (1) `per_partition_limit(N)` returns exactly N rows per partition. (2) Token-range queries with `__token__gt` / `__token__lt`. (3) `values_list()` returns tuples instead of Documents. (4) `only(*cols)` and `defer(*cols)` column projection. See `docs/plans/cqlengine-test-coverage-plan.md` §1.10.

---

## 5. Integration Test Coverage Gaps

*Source: `integration-test-coverage.md`*

> *These are features that exist in the codebase but lack integration test coverage. Pagination tests are ✅ Done. Partial UPDATE tests are ✅ Done (`tests/integration/test_update.py` — 257 lines: partial field update, TTL, IF conditions, IF EXISTS, collection mutations).*

### 5.1 Custom Index Name Integration Tests

> **Prompt:** Add integration tests verifying that `Indexed(index_name="my_custom_idx")` creates a named secondary index and that the index is queryable. See `docs/plans/integration-test-coverage.md` §"Secondary index with custom index_name".

### 5.2 AcsyllaDriver Integration Tests

> **Prompt:** Add CI workflow support and integration tests for the `AcsyllaDriver` (async native driver at `src/coodie/drivers/acsylla.py`). Currently all async integration tests run through the `CassandraDriver` asyncio bridge. Add a separate CI workflow or matrix entry targeting the `acsylla` driver. See `docs/plans/integration-test-coverage.md` §"AcsyllaDriver".

---

## 6. Sync API Support

*Source: `sync-api-support.md`*

> *Phase 1 is ✅ Done — `init_coodie_async(driver_type="acsylla", hosts=...)` routes through `AcsyllaDriver.connect()` with `_bridge_to_bg_loop = True`. Phase 2 is ✅ Done — `AcsyllaDriver.connect_sync()` + `init_coodie(driver_type="acsylla", hosts=...)` auto-create sync session + `UserWarning`. Phase 3 is ✅ Done — `PythonRsDriver` uses bg-thread sync bridge with `_bg_loop`, `_bg_thread`, `_bridge_to_bg_loop`, `connect()` classmethod, `run_coroutine_threadsafe()`. Phases 4–5 remain.*

### 6.1 Sync API Integration Tests

> **Prompt:** Verify both AcsyllaDriver and PythonRsDriver pass the integration test suite in sync and async variants. Add `"python-rs"` to `--driver-type` choices, create `create_python_rs_session()` helper, update `coodie_driver` fixture, and add CI matrix entries for both drivers. See `docs/plans/sync-api-support.md` Phase 4 (tasks 4.1–4.5).

### 6.2 Sync API Documentation

> **Prompt:** Document the sync bridge pattern, supported init paths, and caveats for AcsyllaDriver and PythonRsDriver. Update class docstrings and `init_coodie()`/`init_coodie_async()` docstrings. See `docs/plans/sync-api-support.md` Phase 5 (tasks 5.1–5.3).

---

## 7. PR Conflict Detection & /solve Command

*Source: `pr-conflict-detection-solve.md`*

> *The `conflict` label exists in `.github/labels.toml` and `resolve-conflicts.sh` is reusable (✅). Phase 1 (conflict detection workflow) is ✅ Done — `.github/workflows/pr-conflict-detect.yml` shipped. Phase 2 (`/solve` slash-command) is ✅ Done — `.github/workflows/pr-solve-command.yml` shipped (207 lines). Phase 3 (shared conflict-resolution script) is ✅ Done — `resolve-conflicts.sh` supports `RESOLVE_MODE=merge|rebase`. Phase 4 (safety gates) is ✅ Done — fork skip, concurrency groups, closed/merged PR block, no-conflict no-op, COPILOT_PAT fallback, explicit label removal. Phase 5 remains.*

### 7.1 Testing & Documentation

> **Prompt:** Add Bats tests for the shared conflict-resolution script, Python workflow convention tests, and update `CONTRIBUTING.md` with `/solve` command documentation. See `docs/plans/pr-conflict-detection-solve.md` Phase 5 (tasks 5.1–5.4).
