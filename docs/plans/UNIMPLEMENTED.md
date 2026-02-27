# Unimplemented Features — Ready Prompts

> **Auto-generated summary** of features planned in `/docs/plans/` that are
> **not yet implemented**. Each item is a self-contained prompt you can give
> to an AI coding agent (or a developer) to implement the feature.
>
> **Last reviewed:** 2026-02-27

---

## Table of Contents

1. [cqlengine Feature Parity](#1-cqlengine-feature-parity)
2. [User-Defined Types (UDT)](#2-user-defined-types-udt)
3. [Migration Framework](#3-migration-framework)
4. [Performance Improvements](#4-performance-improvements)
5. [Client Encryption (SSL/TLS)](#5-client-encryption-ssltls)
6. [python-rs Driver Support](#6-python-rs-driver-support)
7. [GitHub Actions Workflow Testing](#7-github-actions-workflow-testing)
8. [Demo Suite Extension](#8-demo-suite-extension)
9. [cqlengine Test Coverage Gaps](#9-cqlengine-test-coverage-gaps)
10. [Integration Test Coverage Gaps](#10-integration-test-coverage-gaps)

---

## 1. cqlengine Feature Parity

*Source: `cqlengine-feature-parity.md`, `cqlengine-missing-features.md`*

### 1.1 User-Defined Types (UDT) — Partially Implemented

> **Prompt:** Complete full User-Defined Type (UDT) support for coodie. The type system already resolves `BaseModel` subclasses as `frozen<type_name>` in `types.py`, but there is no `UserType` base class, no `sync_type()` DDL, no driver registration, and no serialization in save/load paths. Create `src/coodie/usertype.py` with a `UserType(BaseModel)` base class. Add `build_create_type()`/`build_drop_type()`/`build_alter_type_add()` to `cql_builder.py`. Add `sync_type()` classmethods (sync + async) with recursive dependency resolution. Add driver-level registration via `cluster.register_user_type()`. Add UDT serialization in save/load paths. Add unit and integration tests. See `docs/plans/udt-support.md` and `docs/plans/cqlengine-feature-parity.md` Phase 6 for full design.

### 1.2 Lazy Connection (Connect on First Use)

> **Prompt:** Implement lazy connection support for coodie's driver system. Currently `init_coodie()` connects immediately. Add support for deferred connection that only establishes a Cassandra/ScyllaDB session on first query execution. This matches cqlengine's lazy connection behavior. Update the driver registry in `src/coodie/drivers/__init__.py` to support a `lazy=True` parameter on `init_coodie()`. See `docs/plans/cqlengine-feature-parity.md` §1.7 (row: "Lazy connection → ❌").

### 1.3 Column-Level Delete on Document

> **Prompt:** Expose column-level delete on the Document API. The CQL builder already has `build_delete(columns=[...])` support, but there is no public method on `Document` to delete individual columns (set them to null). Add a `Document.delete_columns(*column_names)` method (sync + async) that generates `DELETE col1, col2 FROM table WHERE pk = ?`. See `docs/plans/cqlengine-feature-parity.md` §1.8 (row: "Column-level delete → 🔧 not exposed on Document").

---

## 2. User-Defined Types (UDT) — Detailed

*Source: `udt-support.md`*

> *The type system resolves `BaseModel` subclasses as `frozen<type_name>` (✅ Done in `types.py`). The following phases remain.*

### 2.1 UDT — Core UserType Module

> **Prompt:** Create `src/coodie/usertype.py` with a `UserType(BaseModel)` base class. Add a `Settings` inner class supporting `__type_name__` (override) and `keyspace`. Add a `type_name()` classmethod that returns `Settings.__type_name__` or snake_case of the class name. Export `UserType` from `coodie.__init__` and `coodie.fields`. Add unit tests in `tests/test_usertype.py`. See `docs/plans/udt-support.md` Phase 1.

### 2.2 UDT — CQL Builder

> **Prompt:** Add UDT DDL generation to `src/coodie/cql_builder.py`: implement `build_create_type(type_name, keyspace, fields)` → `CREATE TYPE IF NOT EXISTS ks.type_name (field1 type1, ...)`, `build_drop_type(type_name, keyspace)` → `DROP TYPE IF EXISTS ks.type_name`, and `build_alter_type_add(type_name, keyspace, new_fields)` → `ALTER TYPE ks.type_name ADD field type`. Add unit tests. See `docs/plans/udt-support.md` Phase 2.

### 2.3 UDT — Schema Sync

> **Prompt:** Add `sync_type()` classmethods to `UserType` (sync and async variants). Implement recursive dependency resolution: when syncing a UDT that references another UDT, sync the dependency first (topological sort). Integrate with `sync_table()`: when a Document has UDT fields, auto-sync the UDTs before creating the table. Add introspection of `system_schema.types` to detect existing types and only ALTER to add new fields. Add cycle detection that raises `InvalidQueryError`. See `docs/plans/udt-support.md` Phase 4.

### 2.4 UDT — Serialization

> **Prompt:** Implement UDT serialization and deserialization in coodie's save/load paths. On INSERT: convert `UserType` instances to dicts via `model_dump()`. On SELECT: reconstruct `UserType` instances from driver-returned dicts/named tuples via `model_validate()`. Handle nested UDTs recursively. Handle `None` for optional UDT fields. Handle UDTs inside collections (list/set/map of UDTs). See `docs/plans/udt-support.md` Phase 5.

### 2.5 UDT — Driver Registration

> **Prompt:** Add UDT driver registration. Add `register_user_type(keyspace, type_name, klass)` method to `AbstractDriver` and implement in `CassandraDriver` (calls `cluster.register_user_type()`) and `AcsyllaDriver`. Add a `register_for_keyspace()` classmethod on `UserType` that registers the type with the active driver. Ensure `sync_type()` auto-registers. See `docs/plans/udt-support.md` Phase 6.

### 2.6 UDT — Documentation & Polish

> **Prompt:** Add UDT documentation to coodie's Sphinx docs. Create `docs/source/guide/user-defined-types.md` covering: defining UDTs, using UDTs in models, UDTs in collections, nested UDTs, schema sync, and migration from cqlengine's `UserType`. Update `docs/source/llms.txt` and `docs/source/llms-full.txt`. Add UDT examples to the API reference. See `docs/plans/udt-support.md` Phase 7.

---

## 3. Migration Framework

*Source: `migration-strategy.md`*

> *Phase A (enhanced `sync_table`) is ✅ Done. Phases B, C, and D are not implemented — the `src/coodie/migrations/` module does not exist yet.*

### 3.1 Phase B — Migration Framework Core

> **Prompt:** Implement the core migration framework for coodie. Create `src/coodie/migrations/` package with: (1) `base.py` — `Migration` base class with `upgrade(ctx)` and `downgrade(ctx)` methods, `MigrationContext` with `execute()` for running CQL. (2) `runner.py` — `MigrationRunner` that discovers migration files matching `YYYYMMDD_NNN_description.py` pattern using `importlib.util.spec_from_file_location`, orders them by timestamp, and tracks applied state in a `_coodie_migrations` Cassandra table. (3) `cli.py` — `coodie migrate` CLI entry point supporting `--dry-run`, `--rollback --steps N`, `--status`, and `--target`. (4) Add LWT-based single-writer lock via `_coodie_migrations_lock` table to prevent concurrent migration execution. (5) Add schema agreement wait before DDL. Add the `coodie` CLI entry point to `pyproject.toml`. Add unit and integration tests. See `docs/plans/migration-strategy.md` Phase B (tasks B.1–B.6).

### 3.2 Phase C — Auto-Generation (`coodie makemigration`)

> **Prompt:** Implement migration auto-generation for coodie. Add a `coodie makemigration --name <description>` CLI command that: (1) introspects the live database schema via `system_schema.columns` and `system_schema.tables`, (2) diffs against the current `Document` class definitions, (3) generates a migration file with `upgrade()` containing the required CQL statements, (4) flags unsafe or unsupported operations (e.g., primary key changes) with TODO comments and warnings. The generated file should follow the `YYYYMMDD_NNN_description.py` naming convention and define a `ForwardMigration(Migration)` class. Also add a `coodie schema-diff` command that shows the diff without creating a file. See `docs/plans/migration-strategy.md` Phase C (tasks C.1–C.5).

### 3.3 Phase D — Data Migrations (Tier 3)

> **Prompt:** Implement data migration support for coodie's migration framework. Add `ctx.scan_table(keyspace, table)` to `MigrationContext` that uses token-range queries to iterate over all rows in batches without loading the entire table into memory. Add progress reporting (log percentage for long-running migrations). Add resume-from-token support so a failed migration can resume where it stopped. Add optional rate limiting / throttle support. See `docs/plans/migration-strategy.md` Phase D (tasks D.1–D.4).

---

## 4. Performance Improvements

*Source: `performance-improvement.md`*

> *Phases 1–5 are ✅ Done (Phase 5 added `_pk_columns()` cache and native async for CassandraDriver). Paginated async queries still use `run_in_executor` due to cassandra-driver callback limitations. The following items from §14.5 remain.*

### 4.1 Custom `dict_factory` (P0)

> **Prompt:** Implement a custom `dict_factory` for the cassandra-driver session to eliminate the `_rows_to_dicts()` conversion overhead. Set `session.row_factory = dict_factory` so driver rows arrive as dicts directly, making `_rows_to_dicts()` a zero-copy passthrough. This is estimated to give −10–15% improvement on read operations. See `docs/plans/performance-improvement.md` §14.5.1.

### 4.2 `__slots__` on Remaining Hot-Path Classes (P2)

> **Prompt:** Add `__slots__` to the remaining hot-path classes that still use `__dict__`: `LWTResult` in `results.py`, `PagedResult` in `results.py`, and `BatchQuery` in `batch.py`. These are created frequently and `__slots__` saves ~40–60 bytes per instance and speeds up attribute access by ~10–20%. See `docs/plans/performance-improvement.md` §14.5.4.

### 4.3 Connection-Level Optimizations (P2)

> **Prompt:** Implement connection-level performance optimizations for coodie: (1) Prepared statement warming — pre-prepare common queries at `sync_table()` time instead of lazily on first execute, eliminating ~100–200 µs cold-start penalty. (2) Add support for enabling LZ4 protocol compression on the cassandra-driver connection for large result sets. (3) Add support for speculative execution policy to reduce tail latency. These are driver-configuration changes exposed via `init_coodie()` parameters. See `docs/plans/performance-improvement.md` §14.5.6.

---

## 5. Client Encryption (SSL/TLS)

*Source: `client-encryption.md`*

> *SSL/TLS works today via `**kwargs` passthrough to driver constructors (✅). Missing: documentation, integration tests, and explicit `ssl_context` parameter.*

### 5.1 SSL/TLS Documentation

> **Prompt:** Write user-facing documentation for coodie's SSL/TLS support. Create or complete `docs/source/guide/encryption.md` with: (1) CassandraDriver recipes — `ssl_context`, `ssl_options`, mutual TLS with `load_cert_chain()`. (2) AcsyllaDriver recipes — `ssl_enabled=True`, `ssl_trusted_cert` PEM string, `ssl_verify_flags`. (3) Bring-your-own session (pre-configured SSL session passed to `init_coodie(session=...)`). (4) Troubleshooting common SSL errors. See `docs/plans/client-encryption.md` Phase 1.

### 5.2 SSL/TLS Integration Tests

> **Prompt:** Add integration tests for SSL/TLS connections against a real ScyllaDB instance with server certificates enabled. Test: (1) CassandraDriver with `ssl_context` connecting to SSL-enabled ScyllaDB. (2) AcsyllaDriver with `ssl_enabled=True` and `ssl_trusted_cert`. (3) Connection failure with wrong/expired certs. (4) Mutual TLS with client certificates. Use a Docker Compose setup with self-signed certs. See `docs/plans/client-encryption.md` Phase 2.

### 5.3 Explicit `ssl_context` Parameter (Low Priority)

> **Prompt:** Add an explicit `ssl_context` parameter to `init_coodie()` and `init_coodie_async()` signatures (instead of relying solely on `**kwargs` passthrough). Add validation: if `ssl_context` is provided along with conflicting `**kwargs`, raise `ConfigurationError` with a helpful message. See `docs/plans/client-encryption.md` Phase 3.

---

## 6. python-rs Driver Support

*Source: `python-rs-driver-support.md`*

> *The python-rs-driver (`scylla` package — Rust-based async driver) is not yet integrated into coodie. All 5 phases are pending. `src/coodie/drivers/python_rs.py` does not exist.*

### 6.1 Build Infrastructure

> **Prompt:** Set up build infrastructure for python-rs-driver integration. (1) Add a CI workflow job that installs Rust toolchain, clones python-rs-driver, builds the wheel via `maturin`, and caches the artifact. (2) Add a `python-rs` optional dependency group in `pyproject.toml` (documentation-only — actual install is from source). (3) Document the local development setup. (4) Verify the build works on Linux CI and document macOS/Windows caveats. See `docs/plans/python-rs-driver-support.md` Phase 1 (tasks 1.1–1.6).

### 6.2 PythonRsDriver Implementation

> **Prompt:** Implement `PythonRsDriver(AbstractDriver)` in `src/coodie/drivers/python_rs.py`. The driver wraps the `scylla` Python package (Rust-based async native). Key tasks: (1) `execute_async()` mapping coodie params to `session.execute(prepared, values)`. (2) `_prepare()` with local cache. (3) DDL detection via `_is_ddl()` — execute DDL as raw Statement strings (can't prepare DDL). (4) `_rows_to_dicts()` via `RequestResult.iter_rows()`. (5) Sync wrapper via event-loop bridge (same pattern as AcsyllaDriver). (6) `sync_table_async()` and `sync_table()`. (7) Register `driver_type="python-rs"` in `init_coodie()` / `init_coodie_async()`. (8) Unit tests with mocked `scylla.Session`. See `docs/plans/python-rs-driver-support.md` Phase 2 (tasks 2.1–2.10).

### 6.3 Namespace Conflict Resolution

> **Prompt:** Verify that python-rs-driver's `scylla` package does not conflict with other driver packages. (1) Verify `scylla` and `cassandra` namespaces don't collide. (2) Add `[tool.uv]` conflict entries if needed. (3) Document supported driver combinations. (4) Test import isolation in CI. See `docs/plans/python-rs-driver-support.md` Phase 3 (tasks 3.1–3.4).

### 6.4 Integration Testing

> **Prompt:** Add python-rs-driver to coodie's integration test suite. (1) Add a `python-rs` variant to the integration test matrix in CI. (2) Parametrize integration test fixtures to accept `driver_type="python-rs"`. (3) Identify and xfail tests for unsupported features (batch, paging resume). (4) Validate all CQL type roundtrips pass. See `docs/plans/python-rs-driver-support.md` Phase 4 (tasks 4.1–4.6).

### 6.5 Benchmarks & Maturity Evaluation

> **Prompt:** Add python-rs-driver to coodie's benchmark suite. (1) Add `PythonRsDriver` to `benchmarks/`. (2) Run INSERT, SELECT, UPDATE, DELETE benchmarks across all three drivers. (3) Run Argus-inspired real-world pattern benchmarks. (4) Document results and produce a maturity scorecard. See `docs/plans/python-rs-driver-support.md` Phase 5 (tasks 5.1–5.6).

---

## 7. GitHub Actions Workflow Testing

*Source: `github-actions-testing-plan.md`*

> *Phase 2 (Bats tests) is partially done — `tests/workflows/conftest.py` and `test_smoke.bats` exist. Phases 1, 3, and 4 are not implemented.*

### 7.1 Phase 1 — actionlint Static Analysis

> **Prompt:** Add actionlint static analysis for GitHub Actions workflows. (1) Add the `actionlint` hook to `.pre-commit-config.yaml` using the `rhysd/actionlint` pre-commit hook. (2) Run `actionlint` against all workflow files and fix any reported errors. (3) Add an `actionlint` step to `ci.yml` (or a new workflow) that runs on PRs touching `.github/workflows/`. (4) Document actionlint usage in `CONTRIBUTING.md`. See `docs/plans/github-actions-testing-plan.md` Phase 1 (tasks 1.1–1.5).

### 7.2 Phase 2 — Shell Script Extraction & Bats Tests (Complete Remaining Tasks)

> **Prompt:** Complete the shell script extraction and Bats testing for GitHub Actions workflows. The pytest-bats plugin (`tests/workflows/conftest.py`) and a smoke test (`test_smoke.bats`) already exist. Remaining work: (1) Create `.github/scripts/` directory. (2) Extract the "Parse slash command" step from `pr-rebase-squash.yml` into `.github/scripts/parse-command.sh`. (3) Extract the "Squash commits" commit-message logic into `.github/scripts/build-squash-message.sh`. (4) Extract the "Collect failed job logs" step from `self-healing-ci.yml` into `.github/scripts/collect-failed-logs.sh`. (5) Update workflow YAML files to source the extracted scripts. (6) Write comprehensive Bats tests for each script (command parsing, edge cases, fallback paths). (7) Add a CI job that installs `bats-core` and runs `pytest tests/workflows/`. See `docs/plans/github-actions-testing-plan.md` Phase 2 (tasks 2.1–2.12).

### 7.3 Phase 3 — Python Workflow Convention Checks

> **Prompt:** Create `tests/test_workflow_conventions.py` with pytest-based checks that enforce repository-specific workflow conventions: (1) all workflows use `actions/checkout@v4` or later (not unpinned), (2) all multi-job workflows define a `concurrency` group, (3) all workflows using `gh` CLI set `GH_TOKEN` env var, (4) no workflow uses `actions/checkout` with `fetch-depth: 1` when `git rebase` or `git log` is used later, (5) all `schedule` triggers have valid cron expressions. Parse workflow YAML files with `pyyaml` and assert on structure. See `docs/plans/github-actions-testing-plan.md` Phase 3 (tasks 3.1–3.8).

### 7.4 Phase 4 — workflow_dispatch Smoke Tests

> **Prompt:** Document and optionally automate live smoke tests for the PR workflows. (1) Document the manual smoke-test procedure in `CONTRIBUTING.md` for `pr-rebase-squash.yml`: how to trigger via Actions tab, expected results, cleanup steps. (2) Create a test PR template branch (`test/workflow-smoke`) with known state for reproducible testing. (3) Add `workflow_dispatch` triggers to `self-healing-ci.yml` for manual testing. (4) Optionally create `.github/workflows/test-workflows.yml` that runs nightly, creates a test PR, triggers `/rebase squash`, and validates the result. See `docs/plans/github-actions-testing-plan.md` Phase 4 (tasks 4.1–4.5).

---

## 8. Demo Suite Extension

*Source: `demos-extension-plan.md`*

> *2 demos exist: `demos/fastapi-catalog/` and `demos/flask-blog/` (✅). The plan calls for 12+ additional demos.*

### 8.1 Django Task Board Demo

> **Prompt:** Create `demos/django-taskboard/` — a Django integration demo showing coodie alongside Django's ORM. Use Cassandra for high-write task events (`TaskEvent`, `TaskCounter` models via coodie) and SQLite for auth. Add a `manage.py sync_cassandra` management command. Build a colorful Kanban-style board UI with Django templates. Add `seed.py` with Faker data and `rich` progress bars. Include `Makefile` with standard targets and a `README.md` with numbered quick-start. See `docs/plans/demos-extension-plan.md` Phase 3.

### 8.2 TTL & Ephemeral Data Demo

> **Prompt:** Create `demos/ttl-sessions/` — an ephemeral session store demo showcasing coodie's TTL support. Demonstrate `ttl=` on save, `__default_ttl__` on the model's Settings, and show data auto-expiring. Include a web UI that displays session tokens and their remaining TTL. Add `seed.py`, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 4 (task 4.1).

### 8.3 Real-Time Counters Demo

> **Prompt:** Create `demos/realtime-counters/` — a page-view analytics demo showcasing coodie's `CounterDocument`, `increment()`, and `decrement()`. Build a live analytics dashboard showing counter updates in real-time. Add `seed.py` to generate synthetic traffic, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 4 (task 4.2).

### 8.4 Lightweight Transactions Demo

> **Prompt:** Create `demos/lwt-user-registry/` — a user registration demo showcasing coodie's Lightweight Transactions (`if_not_exists`, `if_exists`, `if_conditions`). Demonstrate uniqueness guarantees and optimistic locking patterns. Add `seed.py`, colorful UI, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 4 (task 4.3).

### 8.5 Batch Operations Demo

> **Prompt:** Create `demos/batch-importer/` — a CSV bulk import tool demo showcasing coodie's `BatchQuery` with logged and unlogged batches. Use `rich` for progress bars during import. Add `seed.py`, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 5 (task 5.1).

### 8.6 Collections & Tags Demo

> **Prompt:** Create `demos/collections-tags/` — an article tagging system demo showcasing coodie's collection types (`list`, `set`, `map` fields) and collection mutation operations (`add__`, `remove__`, `append__`, `prepend__`). Include frozen collection examples. Add `seed.py`, colorful UI, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 5 (task 5.2).

### 8.7 Materialized Views Demo

> **Prompt:** Create `demos/materialized-views/` — a product catalog demo with auto-maintained `MaterializedView` by category. Show `sync_view()`, read-only queries against the view, and how the view auto-updates when the base table changes. Add `seed.py`, UI, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 5 (task 5.3).

### 8.8 Vector Similarity Search (Library + Demo)

> **Prompt:** Add vector column support to coodie and create a vector search demo. **Library work:** (1) Add `Vector(dimensions=N)` field annotation to `coodie/fields.py` mapping to CQL `vector<float, N>`. (2) Update `coodie/schema.py` to emit `vector<float, N>` in DDL. (3) Add `VectorIndex(similarity_function="COSINE")` annotation for `CREATE INDEX ... USING 'vector_index'`. (4) Support ANN queries via a QuerySet method that emits `ORDER BY field ANN OF [...]` CQL. (5) Validate vector dimensions on save. (6) Add unit and integration tests. **Demo work:** Create `demos/vector-search/` — semantic product search using sentence-transformer embeddings with ANN queries. See `docs/plans/demos-extension-plan.md` Phase 6.

### 8.9 Time-Series IoT Demo

> **Prompt:** Create `demos/timeseries-iot/` — an IoT sensor data demo showcasing time-bucketed partitions, clustering keys with DESC order, `per_partition_limit()`, and `paged_all()` for pagination. Add `seed.py` generating synthetic sensor readings, colorful dashboard UI, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 7 (task 7.1).

### 8.10 Polymorphic CMS Demo

> **Prompt:** Create `demos/polymorphic-cms/` — a content management system demo showcasing coodie's single-table inheritance with `Discriminator` column. Define `Article`, `Video`, and `Podcast` subtypes sharing a single table. Add `seed.py`, colorful UI, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 7 (task 7.2).

### 8.11 Argus-Style Test Tracker Demo

> **Prompt:** Create `demos/argus-tracker/` — a scaled-down test tracker inspired by scylladb/argus. Define complex models: User, TestRun (composite PK + clustering), Event (compound partition), Notification (TimeUUID). Include batch event ingestion, prepared-statement caching patterns, and partition-scoped queries. Add `seed.py`, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 8 (task 8.1).

### 8.12 cqlengine → coodie Migration Guide Demo

> **Prompt:** Create `demos/migration-guide/` — a side-by-side migration walkthrough from cqlengine to coodie. Include `cqlengine_models.py` and `coodie_models.py` with equivalent models, a `migrate.py` script that syncs tables, and a `verify.py` that checks data round-trip. Reference argus model patterns. Add `README.md` with step-by-step walkthrough. See `docs/plans/demos-extension-plan.md` Phase 8 (task 8.3).

### 8.13 Schema Migrations Demo

> **Prompt:** Create `demos/schema-migrations/` — a demo showcasing coodie's Phase B migration framework CLI (`coodie migrate`). Demonstrate `apply`, `rollback`, `dry-run`, and state tracking with the `_coodie_migrations` table. Include sample migration files following the `YYYYMMDD_NNN_description.py` pattern. Add `Makefile` and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 10 reference.

### 8.14 Demo CI Smoke Tests

> **Prompt:** Add a CI workflow (`test-demos.yml`) that smoke-tests each demo. For FastAPI demos: start `uvicorn` subprocess, hit endpoints with `httpx`, assert 200. For Flask demos: use Flask test client. For CLI demos: run `seed.py --count 10`, assert exit code. Add a `test` target to each demo's `Makefile` and a per-demo `smoke_test.py`. See `docs/plans/demos-extension-plan.md` §11.5.

---

## 9. cqlengine Test Coverage Gaps

*Source: `cqlengine-test-coverage-plan.md`*

> *This plan identifies cqlengine behaviours covered by the scylladb/python-driver test suite that coodie does NOT yet test. Many require small API additions before tests can be written.*

### 9.1 Collection Mutation Integration Tests

> **Prompt:** Add integration tests for collection mutation operations against a real ScyllaDB instance. Currently only unit tests exist. Test: (1) `list__append` and `list__prepend` round-trip. (2) `set__add` and `set__remove` round-trip. (3) `map__update` and `map__remove` round-trip (requires implementing `map__update` and `map__remove` in QuerySet). (4) Frozen collection round-trip. See `docs/plans/cqlengine-test-coverage-plan.md` §1.2.

### 9.2 Counter Column Integration Tests

> **Prompt:** Add integration tests for `CounterDocument` with `increment()` and `decrement()` against a real ScyllaDB instance. Test: creating a counter table, incrementing a counter, decrementing a counter, reading counter values, multiple increments accumulating, and verifying that regular `save()`/`insert()` is rejected on counter tables. See `docs/plans/cqlengine-test-coverage-plan.md` §1.2.

### 9.3 Static Column Integration Tests

> **Prompt:** Add integration tests for static columns. Test: (1) Static column value shared across all clustering rows in a partition. (2) Updating a static column updates the value for all clustering rows. See `docs/plans/cqlengine-test-coverage-plan.md` §1.2.

### 9.4 LWT Conditional Write Integration Tests

> **Prompt:** Add integration tests for `Document.update(if_conditions={...})` — UPDATE with conditional `IF col = ?` clauses. Test: successful conditional update (condition met), failed conditional update (condition not met, returns `[applied]=false`), and the LWT result type. See `docs/plans/cqlengine-test-coverage-plan.md` §1.5.

### 9.5 TTL and Timestamp Modifier Integration Tests

> **Prompt:** Add integration tests for TTL and USING TIMESTAMP modifiers. Test: (1) `save(ttl=N)` causes row to expire. (2) `__default_ttl__` in Settings applies TTL to all saves. (3) `save(timestamp=...)` uses explicit write timestamp. (4) `QuerySet.ttl(N)` on bulk update. See `docs/plans/cqlengine-test-coverage-plan.md` §1.6.

### 9.6 UDT Integration Tests

> **Prompt:** Add integration tests for User-Defined Types. Test: (1) Define a model with a UDT column, `sync_type()` + `sync_table()`, INSERT, SELECT round-trip. (2) Nested UDTs. (3) UDTs inside collections (`list[MyUDT]`). (4) Optional UDT field with `None`. Requires UDT implementation (§2) first. See `docs/plans/cqlengine-test-coverage-plan.md` §1.7.

### 9.7 Schema Management Integration Tests

> **Prompt:** Add integration tests for schema management edge cases. Test: (1) `sync_table()` idempotency (multiple calls don't raise). (2) `sync_table()` with `drop_removed_indexes=True` drops stale indexes. (3) Table options (`compaction`, `gc_grace_seconds`) applied via `Settings.__options__`. See `docs/plans/cqlengine-test-coverage-plan.md` §1.8.

### 9.8 Batch Write Integration Tests

> **Prompt:** Add integration tests for batch writes against a real ScyllaDB instance. Test: (1) Logged batch with multiple models. (2) Unlogged batch. (3) Counter batch. (4) Batch context manager rollback (exception during batch). See `docs/plans/cqlengine-test-coverage-plan.md` §1.9.

### 9.9 Advanced Query Feature Integration Tests

> **Prompt:** Add integration tests for advanced query features. Test: (1) `per_partition_limit(N)` returns exactly N rows per partition. (2) Token-range queries with `__token__gt` / `__token__lt`. (3) `values_list()` returns tuples instead of Documents. (4) `only(*cols)` and `defer(*cols)` column projection. See `docs/plans/cqlengine-test-coverage-plan.md` §1.10.

---

## 10. Integration Test Coverage Gaps

*Source: `integration-test-coverage.md`*

> *These are features that exist in the codebase but lack integration test coverage. Note: pagination tests were added in `tests/integration/test_pagination.py` (✅ Done).*

### 10.1 Partial UPDATE Integration Tests

> **Prompt:** Add integration tests for partial UPDATE operations via `Document.update(**kwargs)`. Test: updating individual fields without a full INSERT (upsert), UPDATE with TTL, UPDATE with IF conditions, and collection mutation operators (`column__add`, `column__remove`, `column__append`, `column__prepend`). See `docs/plans/integration-test-coverage.md` §"build_update".

### 10.2 Custom Index Name Integration Tests

> **Prompt:** Add integration tests verifying that `Indexed(index_name="my_custom_idx")` creates a named secondary index and that the index is queryable. See `docs/plans/integration-test-coverage.md` §"Secondary index with custom index_name".

### 10.3 AcsyllaDriver Integration Tests

> **Prompt:** Add CI workflow support and integration tests for the `AcsyllaDriver` (async native driver at `src/coodie/drivers/acsylla.py`). Currently all async integration tests run through the `CassandraDriver` asyncio bridge. Add a separate CI workflow or matrix entry targeting the `acsylla` driver. See `docs/plans/integration-test-coverage.md` §"AcsyllaDriver".
