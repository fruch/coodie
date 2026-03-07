# Unimplemented Features — Ready Prompts

> **Auto-generated summary** of features planned in `/docs/plans/` that are
> **not yet implemented**. Each item is a self-contained prompt you can give
> to an AI coding agent (or a developer) to implement the feature.
>
> **Last reviewed:** 2026-03-07 (post-merge: CQL Phase 1 DML gaps ✅ Done
> via PR #184 — TRUNCATE, DISTINCT, GROUP BY, aggregates, IS NOT NULL, CAST,
> TOKEN all implemented with unit + integration tests. LWT integration tests
> ✅ Done — `test_lwt.py` shipped covering §1.5. CQL Phase 2 data types
> WIP in PR #193 — duration + vector types. timeseries-iot demo WIP in
> PR #180, schema-migrations demo WIP in PR #183, realtime-counters demo
> WIP in PR #176, vector support WIP in PRs #150/#155, collections-tags
> demo WIP in PR #147)

---

## Table of Contents

1. [Migration Framework](#1-migration-framework)
2. [python-rs Feature Gaps](#2-python-rs-feature-gaps)
3. [Demo Suite Extension](#3-demo-suite-extension)
4. [cqlengine Test Coverage Gaps](#4-cqlengine-test-coverage-gaps)
5. [Integration Test Coverage Gaps](#5-integration-test-coverage-gaps)
6. [Sync API Support](#6-sync-api-support)
7. [CQL Gap Analysis](#7-cql-gap-analysis)
8. [Silent Exception Pass](#8-silent-exception-pass)

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

> **⚠️ IN PROGRESS — [PR #176](https://github.com/fruch/coodie/pull/176): Realtime counters demo (Phase 4.2).**

> **Prompt:** Create `demos/realtime-counters/` — a page-view analytics demo showcasing coodie's `CounterDocument`, `increment()`, and `decrement()`. Build a live analytics dashboard showing counter updates in real-time. Add `seed.py` to generate synthetic traffic, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 4 (task 4.2).

### 3.2 Collections & Tags Demo

> **⚠️ IN PROGRESS — [PR #147](https://github.com/fruch/coodie/pull/147): Collections-tags demo (Phase 5.2).**

> **Prompt:** Create `demos/collections-tags/` — an article tagging system demo showcasing coodie's collection types (`list`, `set`, `map` fields) and collection mutation operations (`add__`, `remove__`, `append__`, `prepend__`). Include frozen collection examples. Add `seed.py`, colorful UI, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 5 (task 5.2).

### 3.3 Vector Similarity Search (Library + Demo)

> **⚠️ IN PROGRESS — [PR #150](https://github.com/fruch/coodie/pull/150) (WIP/draft): Vector column support + demo. [PR #155](https://github.com/fruch/coodie/pull/155): Extracted library-only vector support (Vector, VectorIndex, CQL builder, ANN queries, unit tests, integration tests, benchmarks).**

> **Prompt:** Add vector column support to coodie and create a vector search demo. **Library work:** (1) Add `Vector(dimensions=N)` field annotation to `coodie/fields.py` mapping to CQL `vector<float, N>`. (2) Update `coodie/schema.py` to emit `vector<float, N>` in DDL. (3) Add `VectorIndex(similarity_function="COSINE")` annotation for `CREATE INDEX ... USING 'vector_index'`. (4) Support ANN queries via a QuerySet method that emits `ORDER BY field ANN OF [...]` CQL. (5) Validate vector dimensions on save. (6) Add unit and integration tests. **Demo work:** Create `demos/vector-search/` — semantic product search using sentence-transformer embeddings with ANN queries. See `docs/plans/demos-extension-plan.md` Phase 6.

### 3.4 Time-Series IoT Demo

> **⚠️ IN PROGRESS — [PR #180](https://github.com/fruch/coodie/pull/180): Timeseries-IoT demo (Phase 7, task 7.1).**

> **Prompt:** Create `demos/timeseries-iot/` — an IoT sensor data demo showcasing time-bucketed partitions, clustering keys with DESC order, `per_partition_limit()`, and `paged_all()` for pagination. Add `seed.py` generating synthetic sensor readings, colorful dashboard UI, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 7 (task 7.1).

### 3.5 Polymorphic CMS Demo

> **Prompt:** Create `demos/polymorphic-cms/` — a content management system demo showcasing coodie's single-table inheritance with `Discriminator` column. Define `Article`, `Video`, and `Podcast` subtypes sharing a single table. Add `seed.py`, colorful UI, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 7 (task 7.2).

### 3.6 Argus-Style Test Tracker Demo

> **Prompt:** Create `demos/argus-tracker/` — a scaled-down test tracker inspired by scylladb/argus. Define complex models: User, TestRun (composite PK + clustering), Event (compound partition), Notification (TimeUUID). Include batch event ingestion, prepared-statement caching patterns, and partition-scoped queries. Add `seed.py`, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 8 (task 8.1).

### 3.7 cqlengine → coodie Migration Guide Demo

> **Prompt:** Create `demos/migration-guide/` — a side-by-side migration walkthrough from cqlengine to coodie. Include `cqlengine_models.py` and `coodie_models.py` with equivalent models, a `migrate.py` script that syncs tables, and a `verify.py` that checks data round-trip. Reference argus model patterns. Add `README.md` with step-by-step walkthrough. See `docs/plans/demos-extension-plan.md` Phase 8 (task 8.3).

### 3.8 Schema Migrations Demo

> **⚠️ IN PROGRESS — [PR #183](https://github.com/fruch/coodie/pull/183) (draft): Schema migrations demo (Phase 10).**

> **Prompt:** Create `demos/schema-migrations/` — a demo showcasing coodie's Phase B migration framework CLI (`coodie migrate`). Demonstrate `apply`, `rollback`, `dry-run`, and state tracking with the `_coodie_migrations` table. Include sample migration files following the `YYYYMMDD_NNN_description.py` pattern. Add `Makefile` and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 10 reference.

---

## 4. cqlengine Test Coverage Gaps

*Source: `cqlengine-test-coverage-plan.md`*

> *Phase 1 (unit test completeness) is ✅ Done. `map__update` collection operator is ✅ Done. Counter integration tests are ✅ Done. Phase 2 (container mutations) is ✅ Done — `test_extended.py` covers list/set/map mutations, frozen collections. Phase 3 (query operators) is ✅ Done — `__ne` operator in `cql_builder.py`, datetime range filters. Phase 4 (UDT) is ✅ Done — `test_udt.py` covers save/load, nested UDTs, optional UDT. Phase 5 (polymorphism + schema) is ✅ Done — `test_extended.py` covers discriminator hierarchy, drop_table, schema migration. §1.5 LWT conditionals is ✅ Done — `test_lwt.py` covers if_conditions, if_not_exists, if_exists, conditional delete. Phases 7–8 remain (TTL/timestamp, batch writes, advanced query features).*

### 4.1 TTL and Timestamp Modifier Integration Tests

> **Prompt:** Add integration tests for TTL and USING TIMESTAMP modifiers. Test: (1) `save(ttl=N)` causes row to expire. (2) `__default_ttl__` in Settings applies TTL to all saves. (3) `save(timestamp=...)` uses explicit write timestamp. (4) `QuerySet.ttl(N)` on bulk update. See `docs/plans/cqlengine-test-coverage-plan.md` §1.6.

### 4.2 Batch Write Integration Tests

> **Prompt:** Add integration tests for batch writes against a real ScyllaDB instance. Test: (1) Logged batch with multiple models. (2) Unlogged batch. (3) Counter batch. (4) Batch context manager rollback (exception during batch). See `docs/plans/cqlengine-test-coverage-plan.md` §1.9.

### 4.3 Advanced Query Feature Integration Tests

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

> *Phase 1 is ✅ Done — `init_coodie_async(driver_type="acsylla", hosts=...)` routes through `AcsyllaDriver.connect()` with `_bridge_to_bg_loop = True`. Phase 2 is ✅ Done — `AcsyllaDriver.connect_sync()` + `init_coodie(driver_type="acsylla", hosts=...)` auto-create sync session + `UserWarning`. Phase 3 is ✅ Done — `PythonRsDriver` uses bg-thread sync bridge with `_bg_loop`, `_bg_thread`, `_bridge_to_bg_loop`, `connect()` classmethod, `run_coroutine_threadsafe()`. Phase 4 is ✅ Done — python-rs integration fixtures, CI matrix, variant fixture (tasks 4.1–4.5 all ✅). Phase 5 remains.*

### 6.1 Sync API Documentation

> **Prompt:** Document the sync bridge pattern, supported init paths, and caveats for AcsyllaDriver and PythonRsDriver. Update class docstrings and `init_coodie()`/`init_coodie_async()` docstrings. See `docs/plans/sync-api-support.md` Phase 5 (tasks 5.1–5.3).

---

## 7. CQL Gap Analysis

*Source: `cql-gap-analysis.md`*

> *New plan comparing coodie against the ScyllaDB CQL Reference. Identifies 41 missing CQL features across data types, DDL, DML, LWT, and ScyllaDB extensions. Phase 1 (core DML gaps) is ✅ Done — TRUNCATE, DISTINCT, GROUP BY, aggregates, IS NOT NULL, CAST, TOKEN all implemented with unit + integration tests (PR #184 merged). 5 phases remain.*

### 7.1 Data Type Gaps (Phase 2)

> **⚠️ IN PROGRESS — [PR #193](https://github.com/fruch/coodie/pull/193) (draft): CQL Phase 2 data types — duration + vector types.**

> **Prompt:** Add missing CQL data types to coodie: (1) `duration` type with a `CqlDuration(months, days, nanoseconds)` dataclass and `Duration()` field marker. (2) `vector<float, N>` type with `Vector(dimensions=N)` field marker, `VectorIndex(similarity_function)`, and `order_by_ann()` QuerySet method. Add type mapping in `types.py`, CQL builder support, DDL generation, and unit tests. See `docs/plans/cql-gap-analysis.md` Phase 2.

### 7.2 DDL & Keyspace Gaps (Phase 3)

> **Prompt:** Implement DDL gaps: (1) `ALTER TABLE DROP column`, `ALTER TABLE RENAME`. (2) Custom SAI index class support. (3) Index options (`WITH OPTIONS`). (4) Collection element indexes (`KEYS`, `VALUES`, `ENTRIES`, `FULL`). (5) `ALTER MATERIALIZED VIEW`. (6) `ALTER TYPE RENAME field`. (7) `ALTER KEYSPACE` with `durable_writes` and `tablets` options. Add unit + integration tests. See `docs/plans/cql-gap-analysis.md` Phase 3.

### 7.3 LWT & Collection Operations (Phase 4)

> **Prompt:** Implement LWT and collection DML gaps: (1) `DELETE ... IF col = ?` conditional deletes. (2) Extended IF operators: `!=`, `IN`, `>`, `<`. (3) Map put `col[key] = val` and list set-by-index `col[idx] = val`. (4) `DELETE col[key] FROM ...` and `DELETE col[idx] FROM ...`. (5) `USING TIMESTAMP` on batches. Add unit + integration tests. See `docs/plans/cql-gap-analysis.md` Phase 4.

### 7.4 JSON & Metadata Features (Phase 5)

> **Prompt:** Implement JSON and metadata features: (1) `INSERT INTO ... JSON '{...}'` via `Document.save_json()`. (2) `SELECT JSON` via `QuerySet.json()`. (3) `WRITETIME(col)` via `QuerySet.writetime()`. (4) `TTL(col)` via `QuerySet.column_ttl()`. Add unit + integration tests. See `docs/plans/cql-gap-analysis.md` Phase 5.

### 7.5 ScyllaDB Extensions & Low-Priority Gaps (Phase 6)

> **Prompt:** Implement ScyllaDB-specific extensions and low-priority gaps: (1) `BYPASS CACHE` hint. (2) `USING TIMEOUT` in CQL statements. (3) Tablets-enabled keyspace creation. (4) Role/user management DDL (`CREATE ROLE`, `GRANT`, `REVOKE`, etc.) — evaluate if appropriate for an ORM. Add unit + integration tests. See `docs/plans/cql-gap-analysis.md` Phase 6.

---

## 8. Silent Exception Pass

*Source: `silent-exception-pass.md`*

> *Audit of `except … pass` and overly broad exception handlers. Phase 1 is ✅ Done — narrowed `_cached_type_hints` to `(NameError, AttributeError, TypeError)` and added `logging.warning()` for CassandraDriver `dict_factory` import failure. All identified problematic cases are fixed.*

*No remaining items — the single implementation phase is complete.*
