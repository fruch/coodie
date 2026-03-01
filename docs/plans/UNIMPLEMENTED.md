# Unimplemented Features — Ready Prompts

> **Auto-generated summary** of features planned in `/docs/plans/` that are
> **not yet implemented**. Each item is a self-contained prompt you can give
> to an AI coding agent (or a developer) to implement the feature.
>
> **Last reviewed:** 2026-03-01 (post-merge: lazy connection done,
> `delete_columns()` done, connection-level optimizations done,
> python-rs Phases 1–4 done, counter integration tests done,
> new plan: python-rs-feature-gaps)

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

> *Phase A (enhanced `sync_table`) is ✅ Done. Phase B (migration framework core) is ✅ Done — `src/coodie/migrations/` exists with `base.py`, `runner.py`, `cli.py`, and `coodie migrate` CLI. Phases C and D remain.*

### 1.1 Phase C — Auto-Generation (`coodie makemigration`)

> **Prompt:** Implement migration auto-generation for coodie. Add a `coodie makemigration --name <description>` CLI command that: (1) introspects the live database schema via `system_schema.columns` and `system_schema.tables`, (2) diffs against the current `Document` class definitions, (3) generates a migration file with `upgrade()` containing the required CQL statements, (4) flags unsafe or unsupported operations (e.g., primary key changes) with TODO comments and warnings. The generated file should follow the `YYYYMMDD_NNN_description.py` naming convention and define a `ForwardMigration(Migration)` class. Also add a `coodie schema-diff` command that shows the diff without creating a file. See `docs/plans/migration-strategy.md` Phase C (tasks C.1–C.5).

### 1.2 Phase D — Data Migrations (Tier 3)

> **Prompt:** Implement data migration support for coodie's migration framework. Add `ctx.scan_table(keyspace, table)` to `MigrationContext` that uses token-range queries to iterate over all rows in batches without loading the entire table into memory. Add progress reporting (log percentage for long-running migrations). Add resume-from-token support so a failed migration can resume where it stopped. Add optional rate limiting / throttle support. See `docs/plans/migration-strategy.md` Phase D (tasks D.1–D.4).

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

> *3 demos exist: `demos/fastapi-catalog/`, `demos/flask-blog/`, and `demos/django-taskboard/` (✅). Demo CI workflow `test-demos.yml` is ✅ Done. The plan calls for 11+ additional demos.*

### 4.1 TTL & Ephemeral Data Demo

> **Prompt:** Create `demos/ttl-sessions/` — an ephemeral session store demo showcasing coodie's TTL support. Demonstrate `ttl=` on save, `__default_ttl__` on the model's Settings, and show data auto-expiring. Include a web UI that displays session tokens and their remaining TTL. Add `seed.py`, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 4 (task 4.1).

### 4.2 Real-Time Counters Demo

> **Prompt:** Create `demos/realtime-counters/` — a page-view analytics demo showcasing coodie's `CounterDocument`, `increment()`, and `decrement()`. Build a live analytics dashboard showing counter updates in real-time. Add `seed.py` to generate synthetic traffic, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 4 (task 4.2).

### 4.3 Lightweight Transactions Demo

> **Prompt:** Create `demos/lwt-user-registry/` — a user registration demo showcasing coodie's Lightweight Transactions (`if_not_exists`, `if_exists`, `if_conditions`). Demonstrate uniqueness guarantees and optimistic locking patterns. Add `seed.py`, colorful UI, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 4 (task 4.3).

### 4.4 Batch Operations Demo

> **Prompt:** Create `demos/batch-importer/` — a CSV bulk import tool demo showcasing coodie's `BatchQuery` with logged and unlogged batches. Use `rich` for progress bars during import. Add `seed.py`, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 5 (task 5.1).

### 4.5 Collections & Tags Demo

> **Prompt:** Create `demos/collections-tags/` — an article tagging system demo showcasing coodie's collection types (`list`, `set`, `map` fields) and collection mutation operations (`add__`, `remove__`, `append__`, `prepend__`). Include frozen collection examples. Add `seed.py`, colorful UI, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 5 (task 5.2).

### 4.6 Materialized Views Demo

> **Prompt:** Create `demos/materialized-views/` — a product catalog demo with auto-maintained `MaterializedView` by category. Show `sync_view()`, read-only queries against the view, and how the view auto-updates when the base table changes. Add `seed.py`, UI, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 5 (task 5.3).

### 4.7 Vector Similarity Search (Library + Demo)

> **Prompt:** Add vector column support to coodie and create a vector search demo. **Library work:** (1) Add `Vector(dimensions=N)` field annotation to `coodie/fields.py` mapping to CQL `vector<float, N>`. (2) Update `coodie/schema.py` to emit `vector<float, N>` in DDL. (3) Add `VectorIndex(similarity_function="COSINE")` annotation for `CREATE INDEX ... USING 'vector_index'`. (4) Support ANN queries via a QuerySet method that emits `ORDER BY field ANN OF [...]` CQL. (5) Validate vector dimensions on save. (6) Add unit and integration tests. **Demo work:** Create `demos/vector-search/` — semantic product search using sentence-transformer embeddings with ANN queries. See `docs/plans/demos-extension-plan.md` Phase 6.

### 4.8 Time-Series IoT Demo

> **Prompt:** Create `demos/timeseries-iot/` — an IoT sensor data demo showcasing time-bucketed partitions, clustering keys with DESC order, `per_partition_limit()`, and `paged_all()` for pagination. Add `seed.py` generating synthetic sensor readings, colorful dashboard UI, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 7 (task 7.1).

### 4.9 Polymorphic CMS Demo

> **Prompt:** Create `demos/polymorphic-cms/` — a content management system demo showcasing coodie's single-table inheritance with `Discriminator` column. Define `Article`, `Video`, and `Podcast` subtypes sharing a single table. Add `seed.py`, colorful UI, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 7 (task 7.2).

### 4.10 Argus-Style Test Tracker Demo

> **Prompt:** Create `demos/argus-tracker/` — a scaled-down test tracker inspired by scylladb/argus. Define complex models: User, TestRun (composite PK + clustering), Event (compound partition), Notification (TimeUUID). Include batch event ingestion, prepared-statement caching patterns, and partition-scoped queries. Add `seed.py`, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 8 (task 8.1).

### 4.11 cqlengine → coodie Migration Guide Demo

> **Prompt:** Create `demos/migration-guide/` — a side-by-side migration walkthrough from cqlengine to coodie. Include `cqlengine_models.py` and `coodie_models.py` with equivalent models, a `migrate.py` script that syncs tables, and a `verify.py` that checks data round-trip. Reference argus model patterns. Add `README.md` with step-by-step walkthrough. See `docs/plans/demos-extension-plan.md` Phase 8 (task 8.3).

### 4.12 Schema Migrations Demo

> **Prompt:** Create `demos/schema-migrations/` — a demo showcasing coodie's Phase B migration framework CLI (`coodie migrate`). Demonstrate `apply`, `rollback`, `dry-run`, and state tracking with the `_coodie_migrations` table. Include sample migration files following the `YYYYMMDD_NNN_description.py` pattern. Add `Makefile` and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 10 reference.

---

## 5. cqlengine Test Coverage Gaps

*Source: `cqlengine-test-coverage-plan.md`*

> *Phase 1 (unit test completeness) is ✅ Done. `map__update` collection operator is ✅ Done in `cql_builder.py`. Counter integration tests are ✅ Done (`tests/integration/test_counter.py`). Phases 2–8 (remaining integration tests) still needed.*

### 5.1 Collection Mutation Integration Tests

> **Prompt:** Add integration tests for collection mutation operations against a real ScyllaDB instance. Currently only unit tests exist. Test: (1) `list__append` and `list__prepend` round-trip. (2) `set__add` and `set__remove` round-trip. (3) `map__update` and `map__remove` round-trip (`map__update` is now implemented in `cql_builder.py`). (4) Frozen collection round-trip. See `docs/plans/cqlengine-test-coverage-plan.md` Phase 2 (tasks 2.1–2.6).

### 5.2 Static Column Integration Tests

> **Prompt:** Add integration tests for static columns. Test: (1) Static column value shared across all clustering rows in a partition. (2) Updating a static column updates the value for all clustering rows. See `docs/plans/cqlengine-test-coverage-plan.md` §1.2.

### 5.3 LWT Conditional Write Integration Tests

> **Prompt:** Add integration tests for `Document.update(if_conditions={...})` — UPDATE with conditional `IF col = ?` clauses. Test: successful conditional update (condition met), failed conditional update (condition not met, returns `[applied]=false`), and the LWT result type. See `docs/plans/cqlengine-test-coverage-plan.md` §1.5.

### 5.4 TTL and Timestamp Modifier Integration Tests

> **Prompt:** Add integration tests for TTL and USING TIMESTAMP modifiers. Test: (1) `save(ttl=N)` causes row to expire. (2) `__default_ttl__` in Settings applies TTL to all saves. (3) `save(timestamp=...)` uses explicit write timestamp. (4) `QuerySet.ttl(N)` on bulk update. See `docs/plans/cqlengine-test-coverage-plan.md` §1.6.

### 5.5 UDT Integration Tests

> **Prompt:** Add integration tests for User-Defined Types. Test: (1) Define a model with a UDT column, `sync_type()` + `sync_table()`, INSERT, SELECT round-trip. (2) Nested UDTs. (3) UDTs inside collections (`list[MyUDT]`). (4) Optional UDT field with `None`. UDT is now implemented in `src/coodie/usertype.py`. See `docs/plans/cqlengine-test-coverage-plan.md` §1.7.

### 5.6 Schema Management Integration Tests

> **Prompt:** Add integration tests for schema management edge cases. Test: (1) `sync_table()` idempotency (multiple calls don't raise). (2) `sync_table()` with `drop_removed_indexes=True` drops stale indexes. (3) Table options (`compaction`, `gc_grace_seconds`) applied via `Settings.__options__`. See `docs/plans/cqlengine-test-coverage-plan.md` §1.8.

### 5.7 Batch Write Integration Tests

> **Prompt:** Add integration tests for batch writes against a real ScyllaDB instance. Test: (1) Logged batch with multiple models. (2) Unlogged batch. (3) Counter batch. (4) Batch context manager rollback (exception during batch). See `docs/plans/cqlengine-test-coverage-plan.md` §1.9.

### 5.8 Advanced Query Feature Integration Tests

> **Prompt:** Add integration tests for advanced query features. Test: (1) `per_partition_limit(N)` returns exactly N rows per partition. (2) Token-range queries with `__token__gt` / `__token__lt`. (3) `values_list()` returns tuples instead of Documents. (4) `only(*cols)` and `defer(*cols)` column projection. See `docs/plans/cqlengine-test-coverage-plan.md` §1.10.

---

## 6. Integration Test Coverage Gaps

*Source: `integration-test-coverage.md`*

> *These are features that exist in the codebase but lack integration test coverage. Note: pagination tests were added in `tests/integration/test_pagination.py` (✅ Done).*

### 6.1 Partial UPDATE Integration Tests

> **Prompt:** Add integration tests for partial UPDATE operations via `Document.update(**kwargs)`. Test: updating individual fields without a full INSERT (upsert), UPDATE with TTL, UPDATE with IF conditions, and collection mutation operators (`column__add`, `column__remove`, `column__append`, `column__prepend`). See `docs/plans/integration-test-coverage.md` §"build_update".

### 6.2 Custom Index Name Integration Tests

> **Prompt:** Add integration tests verifying that `Indexed(index_name="my_custom_idx")` creates a named secondary index and that the index is queryable. See `docs/plans/integration-test-coverage.md` §"Secondary index with custom index_name".

### 6.3 AcsyllaDriver Integration Tests

> **Prompt:** Add CI workflow support and integration tests for the `AcsyllaDriver` (async native driver at `src/coodie/drivers/acsylla.py`). Currently all async integration tests run through the `CassandraDriver` asyncio bridge. Add a separate CI workflow or matrix entry targeting the `acsylla` driver. See `docs/plans/integration-test-coverage.md` §"AcsyllaDriver".

---

## 7. Sync API Support

*Source: `sync-api-support.md`*

> *AcsyllaDriver's `connect()` classmethod supports sync, but `init_coodie_async()` and `init_coodie()` host-based paths do not. PythonRsDriver exists (`src/coodie/drivers/python_rs.py`) but uses `run_until_complete()` instead of the proper background-thread sync bridge. All 5 phases are pending.*

### 7.1 Fix AcsyllaDriver `init_coodie_async` Sync Path

> **Prompt:** Fix `init_coodie_async(driver_type="acsylla", hosts=...)` so the returned driver has `_bridge_to_bg_loop = True` and sync calls work. Currently, the session is created on the caller's event loop instead of the background loop that powers the sync bridge. Replace `acsylla.create_cluster(...).create_session()` with `AcsyllaDriver.connect(session_factory=lambda: ...)` in the acsylla path of `init_coodie_async()`. See `docs/plans/sync-api-support.md` Phase 1 (tasks 1.1–1.4).

### 7.2 Add sync-capable `init_coodie` for AcsyllaDriver

> **Prompt:** Allow `init_coodie(driver_type="acsylla", hosts=...)` to auto-create a sync-capable session instead of raising `ConfigurationError`. Add `AcsyllaDriver.connect_sync(hosts, keyspace, **kwargs)` — a blocking classmethod that bootstraps the background loop and creates the session on it. Add a `UserWarning` when `AcsyllaDriver(session=...)` is used directly (sync calls may not work). See `docs/plans/sync-api-support.md` Phase 2 (tasks 2.1–2.5).

### 7.3 Upgrade PythonRsDriver to Sync Bridge

> **Prompt:** Upgrade `src/coodie/drivers/python_rs.py` to use a proper background-thread sync bridge (same pattern as `AcsyllaDriver`) instead of `loop.run_until_complete()`. The file already exists with basic async+sync via `run_until_complete()`. Add: (1) `_bridge_to_bg_loop` flag and background event-loop thread. (2) `execute()` via `run_coroutine_threadsafe()`. (3) `PythonRsDriver.connect(session_factory, default_keyspace)` classmethod. (4) Update `init_coodie()` / `init_coodie_async()` to use `PythonRsDriver.connect()`. See `docs/plans/sync-api-support.md` Phase 3 (tasks 3.5, 3.6, 3.9, 3.10).

### 7.4 Sync API Integration Tests

> **Prompt:** Verify both AcsyllaDriver and PythonRsDriver pass the integration test suite in sync and async variants. Add `"python-rs"` to `--driver-type` choices, create `create_python_rs_session()` helper, update `coodie_driver` fixture, and add CI matrix entries for both drivers. See `docs/plans/sync-api-support.md` Phase 4 (tasks 4.1–4.5).

### 7.5 Sync API Documentation

> **Prompt:** Document the sync bridge pattern, supported init paths, and caveats for AcsyllaDriver and PythonRsDriver. Update class docstrings and `init_coodie()`/`init_coodie_async()` docstrings. See `docs/plans/sync-api-support.md` Phase 5 (tasks 5.1–5.3).

---

## 8. PR Conflict Detection & /solve Command

*Source: `pr-conflict-detection-solve.md`*

> *The `conflict` label exists in `.github/labels.toml` and `resolve-conflicts.sh` is reusable (✅). All 5 workflow phases are pending — no conflict detection or `/solve` command workflows exist yet.*

### 8.1 Conflict Detection & Labeling Workflow

> **Prompt:** Create `.github/workflows/pr-conflict-detect.yml` — a workflow that detects merge conflicts on PRs. Trigger on `push` to default branch and `pull_request` events (`opened`, `synchronize`, `reopened`). For each open PR, attempt `git merge --no-commit --no-ff` and add/remove the `conflict` label based on result. See `docs/plans/pr-conflict-detection-solve.md` Phase 1 (tasks 1.1–1.5).

### 8.2 `/solve` Slash-Command Workflow

> **Prompt:** Create `.github/workflows/pr-solve-command.yml` — a workflow triggered by `issue_comment` with `/solve` command. Checkout the PR branch, attempt `git merge origin/<base>`, and if conflicts exist, invoke Copilot CLI to resolve them (reusing logic from `resolve-conflicts.sh`). Push the merge commit. See `docs/plans/pr-conflict-detection-solve.md` Phase 2 (tasks 2.1–2.6).

### 8.3 Shared Conflict-Resolution Script

> **Prompt:** Extract and generalize the conflict-resolution logic from the existing `resolve-conflicts.sh` (rebase-focused) into a shared script that also supports merge-based resolution. Add a `--strategy` flag (`rebase` vs `merge`). Update both the existing `/rebase` workflow and the new `/solve` workflow to use the shared script. See `docs/plans/pr-conflict-detection-solve.md` Phase 3 (tasks 3.1–3.5).

### 8.4 Safety Gates & Edge Cases

> **Prompt:** Add safety gates to the conflict detection and `/solve` workflows: draft PR skip, max file limit, protected branch checks, binary file conflict handling, concurrent run prevention. See `docs/plans/pr-conflict-detection-solve.md` Phase 4 (tasks 4.1–4.6).

### 8.5 Testing & Documentation

> **Prompt:** Add Bats tests for the shared conflict-resolution script, Python workflow convention tests, and update `CONTRIBUTING.md` with `/solve` command documentation. See `docs/plans/pr-conflict-detection-solve.md` Phase 5 (tasks 5.1–5.4).
