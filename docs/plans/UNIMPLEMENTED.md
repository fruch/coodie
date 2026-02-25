# Unimplemented Features — Ready Prompts

> **Auto-generated summary** of features planned in `/docs/plans/` that are
> **not yet implemented**. Each item is a self-contained prompt you can give
> to an AI coding agent (or a developer) to implement the feature.
>
> **Last reviewed:** 2026-02-25

---

## Table of Contents

1. [cqlengine Feature Parity](#1-cqlengine-feature-parity)
2. [User-Defined Types (UDT)](#2-user-defined-types-udt)
3. [Migration Framework](#3-migration-framework)
4. [Performance Improvements](#4-performance-improvements)
5. [GitHub Actions Workflow Testing](#5-github-actions-workflow-testing)
6. [Demo Suite Extension](#6-demo-suite-extension)
7. [Integration Test Coverage Gaps](#7-integration-test-coverage-gaps)

---

## 1. cqlengine Feature Parity

*Source: `cqlengine-feature-parity.md`, `cqlengine-missing-features.md`*

### 1.1 User-Defined Types (UDT) — Entirely Missing

> **Prompt:** Implement full User-Defined Type (UDT) support for coodie. Create a `coodie.usertype` module with a `UserType(BaseModel)` base class. Add a `Settings.__type_name__` override (default: snake_case of class name) and a `type_name()` classmethod. Add `build_create_type()`, `build_drop_type()`, and `build_alter_type_add()` to `cql_builder.py`. Add `sync_type()` classmethods (sync + async) to `UserType`. Update `python_type_to_cql_type_str()` to detect `UserType` subclasses and emit `frozen<type_name>`. Support UDTs inside collections (`list[MyUDT]` → `list<frozen<my_udt>>`), nested UDTs with recursive depth-first dependency resolution, serialization via `model_dump()`/`model_validate()`, and driver-level registration via `cluster.register_user_type()`. Add unit and integration tests. See `docs/plans/udt-support.md` and `docs/plans/cqlengine-feature-parity.md` Phase 6 for full design.

### 1.2 Lazy Connection (Connect on First Use)

> **Prompt:** Implement lazy connection support for coodie's driver system. Currently `init_coodie()` connects immediately. Add support for deferred connection that only establishes a Cassandra/ScyllaDB session on first query execution. This matches cqlengine's lazy connection behavior. Update the driver registry in `src/coodie/drivers/__init__.py` to support a `lazy=True` parameter on `init_coodie()`. See `docs/plans/cqlengine-feature-parity.md` §1.7 (row: "Lazy connection → ❌").

### 1.3 Column-Level Delete on Document

> **Prompt:** Expose column-level delete on the Document API. The CQL builder already has `build_delete(columns=[...])` support, but there is no public method on `Document` to delete individual columns (set them to null). Add a `Document.delete_columns(*column_names)` method (sync + async) that generates `DELETE col1, col2 FROM table WHERE pk = ?`. See `docs/plans/cqlengine-feature-parity.md` §1.8 (row: "Column-level delete → 🔧 not exposed on Document").

---

## 2. User-Defined Types (UDT) — Detailed

*Source: `udt-support.md`*

> *This is the most significant remaining feature gap. The full UDT plan has 7 phases. Below are the individual phases as separate prompts.*

### 2.1 UDT Phase 1 — Core UserType Module

> **Prompt:** Create `src/coodie/usertype.py` with a `UserType(BaseModel)` base class. Add a `Settings` inner class supporting `__type_name__` (override) and `keyspace`. Add a `type_name()` classmethod that returns `Settings.__type_name__` or snake_case of the class name. Export `UserType` from `coodie.__init__` and `coodie.fields`. Add unit tests in `tests/test_usertype.py`. See `docs/plans/udt-support.md` Phase 1.

### 2.2 UDT Phase 2 — CQL Builder

> **Prompt:** Add UDT DDL generation to `src/coodie/cql_builder.py`: implement `build_create_type(type_name, keyspace, fields)` → `CREATE TYPE IF NOT EXISTS ks.type_name (field1 type1, ...)`, `build_drop_type(type_name, keyspace)` → `DROP TYPE IF EXISTS ks.type_name`, and `build_alter_type_add(type_name, keyspace, new_fields)` → `ALTER TYPE ks.type_name ADD field type`. Add unit tests. See `docs/plans/udt-support.md` Phase 2.

### 2.3 UDT Phase 3 — Type System Integration

> **Prompt:** Update `python_type_to_cql_type_str()` in `src/coodie/types.py` to detect `UserType` subclasses and emit `frozen<type_name>`. Support UDTs inside collections: `list[MyUDT]` → `list<frozen<my_udt>>`, `set[MyUDT]` → `set<frozen<my_udt>>`, `dict[str, MyUDT]` → `map<text, frozen<my_udt>>`, `tuple[MyUDT, ...]` → `tuple<frozen<my_udt>, ...>`. Handle nested UDTs recursively. Add unit tests. See `docs/plans/udt-support.md` Phase 3.

### 2.4 UDT Phase 4 — Schema Sync

> **Prompt:** Add `sync_type()` classmethods to `UserType` (sync and async variants). Implement recursive dependency resolution: when syncing a UDT that references another UDT, sync the dependency first (topological sort). Integrate with `sync_table()`: when a Document has UDT fields, auto-sync the UDTs before creating the table. Add introspection of `system_schema.types` to detect existing types and only ALTER to add new fields. Add cycle detection that raises `InvalidQueryError`. See `docs/plans/udt-support.md` Phase 4.

### 2.5 UDT Phase 5 — Serialization

> **Prompt:** Implement UDT serialization and deserialization. On INSERT: convert `UserType` instances to dicts via `model_dump()`. On SELECT: reconstruct `UserType` instances from driver-returned dicts/named tuples via `model_validate()`. Handle nested UDTs recursively. Handle `None` for optional UDT fields. Handle UDTs inside collections (list/set/map of UDTs). See `docs/plans/udt-support.md` Phase 5.

### 2.6 UDT Phase 6 — Driver Registration

> **Prompt:** Add UDT driver registration. Add `register_user_type(keyspace, type_name, klass)` method to `AbstractDriver` and implement in `CassandraDriver` (calls `cluster.register_user_type()`) and `AcsyllaDriver`. Add a `register_for_keyspace()` classmethod on `UserType` that registers the type with the active driver. Ensure `sync_type()` auto-registers. See `docs/plans/udt-support.md` Phase 6.

### 2.7 UDT Phase 7 — Documentation & Polish

> **Prompt:** Add UDT documentation to coodie's Sphinx docs. Create `docs/source/guide/user-defined-types.md` covering: defining UDTs, using UDTs in models, UDTs in collections, nested UDTs, schema sync, and migration from cqlengine's `UserType`. Update `docs/source/llms.txt` and `docs/source/llms-full.txt`. Add UDT examples to the API reference. See `docs/plans/udt-support.md` Phase 7.

---

## 3. Migration Framework

*Source: `migration-strategy.md`*

> *Phase A (enhanced `sync_table`) is ✅ Done. Phases B, C, and D are not implemented — the `src/coodie/migrations/` module does not exist yet.*

### 3.0 Phase B — Migration Framework Core

> **Prompt:** Implement the core migration framework for coodie. Create `src/coodie/migrations/` package with: (1) `base.py` — `Migration` base class with `upgrade(ctx)` and `downgrade(ctx)` methods, `MigrationContext` with `execute()` for running CQL. (2) `runner.py` — `MigrationRunner` that discovers migration files matching `YYYYMMDD_NNN_description.py` pattern using `importlib.util.spec_from_file_location`, orders them by timestamp, and tracks applied state in a `_coodie_migrations` Cassandra table. (3) `cli.py` — `coodie migrate` CLI entry point supporting `--dry-run`, `--rollback --steps N`, `--status`, and `--target`. (4) Add LWT-based single-writer lock via `_coodie_migrations_lock` table to prevent concurrent migration execution. (5) Add schema agreement wait before DDL. Add the `coodie` CLI entry point to `pyproject.toml`. Add unit and integration tests. See `docs/plans/migration-strategy.md` Phase B (tasks B.1–B.6).

### 3.1 Phase C — Auto-Generation (`coodie makemigration`)

> **Prompt:** Implement migration auto-generation for coodie. Add a `coodie makemigration --name <description>` CLI command that: (1) introspects the live database schema via `system_schema.columns` and `system_schema.tables`, (2) diffs against the current `Document` class definitions, (3) generates a migration file with `upgrade()` containing the required CQL statements, (4) flags unsafe or unsupported operations (e.g., primary key changes) with TODO comments and warnings. The generated file should follow the `YYYYMMDD_NNN_description.py` naming convention and define a `ForwardMigration(Migration)` class. Also add a `coodie schema-diff` command that shows the diff without creating a file. See `docs/plans/migration-strategy.md` Phase C (tasks C.1–C.5).

### 3.2 Phase D — Data Migrations (Tier 3)

> **Prompt:** Implement data migration support for coodie's migration framework. Add `ctx.scan_table(keyspace, table)` to `MigrationContext` that uses token-range queries to iterate over all rows in batches without loading the entire table into memory. Add progress reporting (log percentage for long-running migrations). Add resume-from-token support so a failed migration can resume where it stopped. Add optional rate limiting / throttle support. See `docs/plans/migration-strategy.md` Phase D (tasks D.1–D.4).

---

## 4. Performance Improvements

*Source: `performance-improvement.md`*

> *Phases 1–4 are ✅ Done. Phase 5 is partially done. The following items from §14.5 remain.*

### 4.1 Custom `dict_factory` (P0)

> **Prompt:** Implement a custom `dict_factory` for the cassandra-driver session to eliminate the `_rows_to_dicts()` conversion overhead. Set `session.row_factory = dict_factory` so driver rows arrive as dicts directly, making `_rows_to_dicts()` a zero-copy passthrough. This is estimated to give −10–15% improvement on read operations. See `docs/plans/performance-improvement.md` §14.5.1.

### 4.2 Native Async for Paginated Queries (P1)

> **Prompt:** Replace `run_in_executor()` with proper `asyncio.Future` wrapping for paginated queries in `CassandraDriver`. The current async path for paginated queries falls back to `run_in_executor()`, adding thread-pool overhead. Implement a native async path using `loop.create_future()` + `future.add_callbacks()` pattern for all paginated query execution in `src/coodie/drivers/cassandra.py`. Non-paginated async is already using the callback bridge — extend this to paginated queries. Estimated −20–40% improvement on async operations. See `docs/plans/performance-improvement.md` §14.5.3.

### 4.3 `__slots__` on Remaining Hot-Path Classes (P2)

> **Prompt:** Add `__slots__` to the remaining hot-path classes that still use `__dict__`: `LWTResult` in `results.py`, `PagedResult` in `results.py`, and `BatchQuery` in `batch.py`. These are created frequently and `__slots__` saves ~40–60 bytes per instance and speeds up attribute access by ~10–20%. See `docs/plans/performance-improvement.md` §14.5.4.

### 4.4 Connection-Level Optimizations (P2)

> **Prompt:** Implement connection-level performance optimizations for coodie: (1) Prepared statement warming — pre-prepare common queries at `sync_table()` time instead of lazily on first execute, eliminating ~100–200 µs cold-start penalty. (2) Add support for enabling LZ4 protocol compression on the cassandra-driver connection for large result sets. (3) Add support for speculative execution policy to reduce tail latency. These are driver-configuration changes exposed via `init_coodie()` parameters. See `docs/plans/performance-improvement.md` §14.5.6.

---

## 5. GitHub Actions Workflow Testing

*Source: `github-actions-testing-plan.md`*

> *Phase 2 (Bats tests) is partially done — `tests/workflows/conftest.py` and `test_smoke.bats` exist. Phases 1, 3, and 4 are not implemented.*

### 5.1 Phase 1 — actionlint Static Analysis

> **Prompt:** Add actionlint static analysis for GitHub Actions workflows. (1) Add the `actionlint` hook to `.pre-commit-config.yaml` using the `rhysd/actionlint` pre-commit hook. (2) Run `actionlint` against all workflow files and fix any reported errors. (3) Add an `actionlint` step to `ci.yml` (or a new workflow) that runs on PRs touching `.github/workflows/`. (4) Document actionlint usage in `CONTRIBUTING.md`. See `docs/plans/github-actions-testing-plan.md` Phase 1 (tasks 1.1–1.5).

### 5.2 Phase 2 — Shell Script Extraction & Bats Tests (Complete Remaining Tasks)

> **Prompt:** Complete the shell script extraction and Bats testing for GitHub Actions workflows. The pytest-bats plugin (`tests/workflows/conftest.py`) and a smoke test (`test_smoke.bats`) already exist. Remaining work: (1) Create `.github/scripts/` directory. (2) Extract the "Parse slash command" step from `pr-rebase-squash.yml` into `.github/scripts/parse-command.sh`. (3) Extract the "Squash commits" commit-message logic into `.github/scripts/build-squash-message.sh`. (4) Extract the "Collect failed job logs" step from `self-healing-ci.yml` into `.github/scripts/collect-failed-logs.sh`. (5) Update workflow YAML files to source the extracted scripts. (6) Write comprehensive Bats tests for each script (command parsing, edge cases, fallback paths). (7) Add a CI job that installs `bats-core` and runs `pytest tests/workflows/`. See `docs/plans/github-actions-testing-plan.md` Phase 2 (tasks 2.1–2.12).

### 5.3 Phase 3 — Python Workflow Convention Checks

> **Prompt:** Create `tests/test_workflow_conventions.py` with pytest-based checks that enforce repository-specific workflow conventions: (1) all workflows use `actions/checkout@v4` or later (not unpinned), (2) all multi-job workflows define a `concurrency` group, (3) all workflows using `gh` CLI set `GH_TOKEN` env var, (4) no workflow uses `actions/checkout` with `fetch-depth: 1` when `git rebase` or `git log` is used later, (5) all `schedule` triggers have valid cron expressions. Parse workflow YAML files with `pyyaml` and assert on structure. See `docs/plans/github-actions-testing-plan.md` Phase 3 (tasks 3.1–3.8).

### 5.4 Phase 4 — workflow_dispatch Smoke Tests

> **Prompt:** Document and optionally automate live smoke tests for the PR workflows. (1) Document the manual smoke-test procedure in `CONTRIBUTING.md` for `pr-rebase-squash.yml`: how to trigger via Actions tab, expected results, cleanup steps. (2) Create a test PR template branch (`test/workflow-smoke`) with known state for reproducible testing. (3) Add `workflow_dispatch` triggers to `self-healing-ci.yml` for manual testing. (4) Optionally create `.github/workflows/test-workflows.yml` that runs nightly, creates a test PR, triggers `/rebase squash`, and validates the result. See `docs/plans/github-actions-testing-plan.md` Phase 4 (tasks 4.1–4.5).

---

## 6. Demo Suite Extension

*Source: `demos-extension-plan.md`*

> *Only 1 demo exists: `demos/fastapi-catalog/`. The plan calls for 12+ additional demos.*

### 6.1 Flask Blog Demo

> **Prompt:** Create `demos/flask-blog/` — a Flask integration demo showing coodie's sync API. Define `Post` and `Comment` models with clustering keys (newest-first), secondary indexes, and tags (list field). Build Jinja2 templates with a colorful dark-theme UI (cards, gradients, accent colors). Add `seed.py` with Faker blog posts and comments with `rich` progress bars. Include `Makefile` with standard targets (`db-up`, `db-down`, `seed`, `run`, `clean`) and a `README.md` with numbered quick-start. See `docs/plans/demos-extension-plan.md` Phase 2.

### 6.2 Django Task Board Demo

> **Prompt:** Create `demos/django-taskboard/` — a Django integration demo showing coodie alongside Django's ORM. Use Cassandra for high-write task events (`TaskEvent`, `TaskCounter` models via coodie) and SQLite for auth. Add a `manage.py sync_cassandra` management command. Build a colorful Kanban-style board UI with Django templates. Add `seed.py` with Faker data and `rich` progress bars. Include `Makefile` with standard targets and a `README.md` with numbered quick-start. See `docs/plans/demos-extension-plan.md` Phase 3.

### 6.3 TTL & Ephemeral Data Demo

> **Prompt:** Create `demos/ttl-sessions/` — an ephemeral session store demo showcasing coodie's TTL support. Demonstrate `ttl=` on save, `__default_ttl__` on the model's Settings, and show data auto-expiring. Include a web UI that displays session tokens and their remaining TTL. Add `seed.py`, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 4 (task 4.1).

### 6.4 Real-Time Counters Demo

> **Prompt:** Create `demos/realtime-counters/` — a page-view analytics demo showcasing coodie's `CounterDocument`, `increment()`, and `decrement()`. Build a live analytics dashboard showing counter updates in real-time. Add `seed.py` to generate synthetic traffic, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 4 (task 4.2).

### 6.5 Lightweight Transactions Demo

> **Prompt:** Create `demos/lwt-user-registry/` — a user registration demo showcasing coodie's Lightweight Transactions (`if_not_exists`, `if_exists`, `if_conditions`). Demonstrate uniqueness guarantees and optimistic locking patterns. Add `seed.py`, colorful UI, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 4 (task 4.3).

### 6.6 Batch Operations Demo

> **Prompt:** Create `demos/batch-importer/` — a CSV bulk import tool demo showcasing coodie's `BatchQuery` with logged and unlogged batches. Use `rich` for progress bars during import. Add `seed.py`, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 5 (task 5.1).

### 6.7 Collections & Tags Demo

> **Prompt:** Create `demos/collections-tags/` — an article tagging system demo showcasing coodie's collection types (`list`, `set`, `map` fields) and collection mutation operations (`add__`, `remove__`, `append__`, `prepend__`). Include frozen collection examples. Add `seed.py`, colorful UI, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 5 (task 5.2).

### 6.8 Materialized Views Demo

> **Prompt:** Create `demos/materialized-views/` — a product catalog demo with auto-maintained `MaterializedView` by category. Show `sync_view()`, read-only queries against the view, and how the view auto-updates when the base table changes. Add `seed.py`, UI, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 5 (task 5.3).

### 6.9 Vector Similarity Search (Library + Demo)

> **Prompt:** Add vector column support to coodie and create a vector search demo. **Library work:** (1) Add `Vector(dimensions=N)` field annotation to `coodie/fields.py` mapping to CQL `vector<float, N>`. (2) Update `coodie/schema.py` to emit `vector<float, N>` in DDL. (3) Add `VectorIndex(similarity_function="COSINE")` annotation for `CREATE INDEX ... USING 'vector_index'`. (4) Support ANN queries via a QuerySet method that emits `ORDER BY field ANN OF [...]` CQL. (5) Validate vector dimensions on save. (6) Add unit and integration tests. **Demo work:** Create `demos/vector-search/` — semantic product search using sentence-transformer embeddings with ANN queries. See `docs/plans/demos-extension-plan.md` Phase 6.

### 6.10 Time-Series IoT Demo

> **Prompt:** Create `demos/timeseries-iot/` — an IoT sensor data demo showcasing time-bucketed partitions, clustering keys with DESC order, `per_partition_limit()`, and `paged_all()` for pagination. Add `seed.py` generating synthetic sensor readings, colorful dashboard UI, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 7 (task 7.1).

### 6.11 Polymorphic CMS Demo

> **Prompt:** Create `demos/polymorphic-cms/` — a content management system demo showcasing coodie's single-table inheritance with `Discriminator` column. Define `Article`, `Video`, and `Podcast` subtypes sharing a single table. Add `seed.py`, colorful UI, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 7 (task 7.2).

### 6.12 Argus-Style Test Tracker Demo

> **Prompt:** Create `demos/argus-tracker/` — a scaled-down test tracker inspired by scylladb/argus. Define complex models: User, TestRun (composite PK + clustering), Event (compound partition), Notification (TimeUUID). Include batch event ingestion, prepared-statement caching patterns, and partition-scoped queries. Add `seed.py`, `Makefile`, and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 8 (task 8.1).

### 6.13 cqlengine → coodie Migration Guide Demo

> **Prompt:** Create `demos/migration-guide/` — a side-by-side migration walkthrough from cqlengine to coodie. Include `cqlengine_models.py` and `coodie_models.py` with equivalent models, a `migrate.py` script that syncs tables, and a `verify.py` that checks data round-trip. Reference argus model patterns. Add `README.md` with step-by-step walkthrough. See `docs/plans/demos-extension-plan.md` Phase 8 (task 8.3).

### 6.14 Schema Migrations Demo

> **Prompt:** Create `demos/schema-migrations/` — a demo showcasing coodie's Phase B migration framework CLI (`coodie migrate`). Demonstrate `apply`, `rollback`, `dry-run`, and state tracking with the `_coodie_migrations` table. Include sample migration files following the `YYYYMMDD_NNN_description.py` pattern. Add `Makefile` and `README.md`. See `docs/plans/demos-extension-plan.md` Phase 10 reference.

---

## 7. Integration Test Coverage Gaps

*Source: `integration-test-coverage.md`*

> *These are features that exist in the codebase but lack integration test coverage against a real ScyllaDB instance.*

### 7.1 Pagination Integration Tests

> **Prompt:** Add integration tests for coodie's pagination support (`QuerySet.fetch_size()`, `.page(paging_state)`, `.paged_all()`). Test: full-table scans of >fetch_size rows, page-token hand-off between pages, and async paged iteration. Use models with enough rows to span multiple pages. See `docs/plans/integration-test-coverage.md` §"Pagination".

### 7.2 UPDATE with IF Conditions (LWT) Integration Tests

> **Prompt:** Add integration tests for `Document.update(if_conditions={...})` — UPDATE with conditional `IF col = ?` clauses. Test: successful conditional update (condition met), failed conditional update (condition not met, returns `[applied]=false`), and the LWT result type. See `docs/plans/integration-test-coverage.md` §"UPDATE with IF conditions".

### 7.3 Counter Column Integration Tests

> **Prompt:** Add integration tests for `CounterDocument` with `increment()` and `decrement()` against a real ScyllaDB instance. Test: creating a counter table, incrementing a counter, decrementing a counter, reading counter values, and verifying that regular `save()`/`insert()` is rejected on counter tables. See `docs/plans/integration-test-coverage.md` §"Counter columns".

### 7.4 `build_update` / Partial UPDATE Integration Tests

> **Prompt:** Add integration tests for partial UPDATE operations via `Document.update(**kwargs)`. Test: updating individual fields without a full INSERT (upsert), UPDATE with TTL, UPDATE with IF conditions, and collection mutation operators (`column__add`, `column__remove`, `column__append`, `column__prepend`). See `docs/plans/integration-test-coverage.md` §"build_update".

### 7.5 `per_partition_limit` Integration Tests

> **Prompt:** Add integration tests for `QuerySet.per_partition_limit(n)`. Create a model with multiple partitions and multiple rows per partition, then verify that exactly N rows are returned per partition key. See `docs/plans/integration-test-coverage.md` §"build_select with per_partition_limit".

### 7.6 Custom Index Name Integration Tests

> **Prompt:** Add integration tests verifying that `Indexed(index_name="my_custom_idx")` creates a named secondary index and that the index is queryable. See `docs/plans/integration-test-coverage.md` §"Secondary index with custom index_name".

### 7.7 AcsyllaDriver Integration Tests

> **Prompt:** Add CI workflow support and integration tests for the `AcsyllaDriver` (async native driver at `src/coodie/drivers/acsylla.py`). Currently all async integration tests run through the `CassandraDriver` asyncio bridge. Add a separate CI workflow or matrix entry targeting the `acsylla` driver. See `docs/plans/integration-test-coverage.md` §"AcsyllaDriver".
