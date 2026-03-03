# Sync API Support Plan: AcsyllaDriver and PythonRsDriver

> **Goal:** Make the synchronous `execute()`, `sync_table()`, and `close()` APIs
> fully functional when using `AcsyllaDriver` or `PythonRsDriver` as the coodie
> backend.  This means fixing the `init_coodie_async()` and `init_coodie()`
> session-creation paths for acsylla (which currently create the session on the
> caller's event loop rather than the background loop that powers the sync
> bridge), and designing and implementing an equivalent background-loop sync
> bridge in the forthcoming `PythonRsDriver`.  Users should be able to call all
> `coodie.sync` Document APIs — `save()`, `get()`, `find().all()`, `delete()` —
> transparently with either driver without hitting event-loop errors or silent
> hangs.

---

## Table of Contents

1. [Background](#1-background)
   - [1.1 How the Sync Bridge Works](#11-how-the-sync-bridge-works)
   - [1.2 Why Session-Loop Binding Matters](#12-why-session-loop-binding-matters)
2. [Feature Gap Analysis](#2-feature-gap-analysis)
   - [2.1 AcsyllaDriver Sync API](#21-acsylladriver-sync-api)
   - [2.2 PythonRsDriver Sync API](#22-pythonrsdriver-sync-api)
3. [Implementation Phases](#3-implementation-phases)
4. [Test Plan](#4-test-plan)
   - [4.1 Unit Tests](#41-unit-tests)
   - [4.2 Integration Tests](#42-integration-tests)
5. [References](#5-references)

---

## 1. Background

### 1.1 How the Sync Bridge Works

Both `acsylla` and `python-rs-driver` are **async-native** libraries — they have
no blocking synchronous session API.  coodie bridges them to the synchronous
`AbstractDriver` interface using a **background-thread event loop**:

1. At construction time, spin up a daemon thread running a dedicated
   `asyncio.EventLoop` called `_bg_loop`.
2. In each sync method (`execute`, `sync_table`, `close`), submit the async
   implementation to `_bg_loop` via
   `asyncio.run_coroutine_threadsafe(coro, _bg_loop).result()` and block
   until it completes.
3. The calling thread can be inside or outside an already-running event loop;
   `run_coroutine_threadsafe` always submits to the *other* loop, avoiding
   `RuntimeError: This event loop is already running`.

`AcsyllaDriver` already implements this pattern correctly when the session is
created via `AcsyllaDriver.connect()`.

### 1.2 Why Session-Loop Binding Matters

Both `acsylla` and `python-rs-driver` create sessions that are **bound to the
event loop running at session-creation time**:

- `acsylla`'s C extension registers its libuv I/O callbacks with the loop that
  was running when `await cluster.create_session()` completed.
- `python-rs-driver` wraps the Rust tokio session in asyncio `Future` objects
  that are scheduled on the loop running at `await SessionBuilder.connect()`.

If the session is created on **loop A** but async operations are submitted to
**loop B** (`_bg_loop`), the session's internal futures are never resolved and
the coroutine hangs indefinitely.

**Correct pattern:** create the session *inside* `_bg_loop` using
`asyncio.run_coroutine_threadsafe(session_factory(), _bg_loop).result()` before
returning from the constructor.  This is exactly what `AcsyllaDriver.connect()`
does.

**Current behaviour — where it goes wrong:**

| Init path | Session created on | `_bridge_to_bg_loop` | Sync safe? |
|---|---|---|---|
| `AcsyllaDriver.connect(session_factory)` | `_bg_loop` ✅ | `True` | ✅ |
| `AcsyllaDriver(session=<external>)` | caller's loop ❌ | `False` | ❌ |
| `init_coodie_async(driver_type="acsylla", hosts=...)` | caller's loop ❌ | `False` | ❌ |
| `init_coodie(driver_type="acsylla", session=<external>)` | unknown ❌ | `False` | ❌ |
| `init_coodie(driver_type="acsylla", hosts=...)` | — | — | ❌ (raises `ConfigurationError`) |

---

## 2. Feature Gap Analysis

Legend:
- ✅ **Implemented** — working today
- 🔧 **Partial** — infrastructure exists but not fully exposed via public API
- ❌ **Missing** — not yet implemented

### 2.1 AcsyllaDriver Sync API

| Feature | Implementation | Status |
|---|---|---|
| `execute()` sync bridge when session is on `_bg_loop` | `run_coroutine_threadsafe` on `_bg_loop` | ✅ |
| `sync_table()` sync bridge when session is on `_bg_loop` | `run_coroutine_threadsafe` on `_bg_loop` | ✅ |
| `close()` sync bridge when session is on `_bg_loop` | `run_coroutine_threadsafe` on `_bg_loop` | ✅ |
| `AcsyllaDriver.connect(session_factory)` classmethod | Creates session on `_bg_loop`; `_bridge_to_bg_loop = True` | ✅ |
| `init_coodie_async(driver_type="acsylla", hosts=...)` → sync-capable | Session created on caller's loop; `_bridge_to_bg_loop = False` | ❌ |
| `init_coodie(driver_type="acsylla", hosts=...)` → auto-create session | Calls `AcsyllaDriver.connect_sync(hosts, ...)` — sync-capable | ✅ |
| `init_coodie(driver_type="acsylla", session=<external>)` → sync-capable | `_bridge_to_bg_loop = False`; emits `UserWarning` | ✅ |
| Warning when `AcsyllaDriver(session=...)` is used with sync calls | `UserWarning` emitted at construction | ✅ |
| Documentation — which `init_coodie` path enables sync | Implicit in `connect()` docstring only | ❌ |

**Gap summary — AcsyllaDriver sync API:**
- `init_coodie_async(hosts=...)` → route internally through `AcsyllaDriver.connect()` so session is created on `_bg_loop`
- `init_coodie(hosts=...)` → add a `connect_sync()` blocking classmethod that creates the session on `_bg_loop` without requiring an async caller; call it from `init_coodie`
- `init_coodie(session=...)` → emit a `UserWarning` that the externally-created session may not be on `_bg_loop`, disabling the sync bridge; set `_bridge_to_bg_loop = False` (unchanged) and document this as the "async-only" path
- Documentation → add a clear table showing which init paths enable sync

### 2.2 PythonRsDriver Sync API

| Feature | Implementation | Status |
|---|---|---|
| `PythonRsDriver` class in `src/coodie/drivers/python_rs.py` | — | ❌ |
| `execute_async()` / `_execute_async_impl()` | — | ❌ |
| `execute()` sync bridge via `run_coroutine_threadsafe` | — | ❌ |
| `sync_table_async()` / `_sync_table_async_impl()` | — | ❌ |
| `sync_table()` sync bridge | — | ❌ |
| `close_async()` / `_close_async_impl()` | — | ❌ |
| `close()` sync bridge | — | ❌ |
| `PythonRsDriver.connect(session_factory)` classmethod | — | ❌ |
| `_prepare()` with local cache and DDL detection | — | ❌ |
| `_rows_to_dicts()` consuming `RequestResult.iter_rows()` | — | ❌ |
| `init_coodie(driver_type="python-rs", hosts=...)` | `driver_type` not registered | ❌ |
| `init_coodie_async(driver_type="python-rs", hosts=...)` | `driver_type` not registered | ❌ |
| `--driver-type=python-rs` integration test support | Not in `pytest_addoption` | ❌ |

**Gap summary — PythonRsDriver sync API:**
- Implement `PythonRsDriver` following the same background-loop pattern as `AcsyllaDriver`; `execute_async()` → `session.execute(prepared, values)` collecting `RequestResult.iter_rows()`; `execute()` → `run_coroutine_threadsafe` on `_bg_loop`
- `PythonRsDriver.connect(session_factory)` → bootstrap `_bg_loop`, run `SessionBuilder.connect()` on it, set `_bridge_to_bg_loop = True`
- `init_coodie(driver_type="python-rs", hosts=...)` → call `PythonRsDriver.connect(lambda: SessionBuilder(hosts).connect())`
- `init_coodie_async(driver_type="python-rs", hosts=...)` → same `connect()` factory so async callers get a sync-capable driver too

---

## 3. Implementation Phases

### Phase 1: Fix AcsyllaDriver init_coodie_async (Priority: High)

**Goal:** Make `init_coodie_async(driver_type="acsylla", hosts=...)` return a driver with `_bridge_to_bg_loop = True` so that sync calls work correctly.

| Task | Description |
|---|---|
| 1.1 | In `init_coodie_async()`, replace `acsylla.create_cluster(...).create_session()` with `AcsyllaDriver.connect(session_factory=lambda: ...)`, forwarding all SSL kwargs into the lambda |
| 1.2 | Keep the `session=<external>` path unchanged — it returns a driver with `_bridge_to_bg_loop = False` (async-only use case) |
| 1.3 | Update `test_init_coodie_async_acsylla_with_hosts` in `test_drivers.py` to assert `driver._bridge_to_bg_loop is True` |
| 1.4 | Add unit test: calling `execute()` on the driver returned by `init_coodie_async()` succeeds (mock session on `_bg_loop`) |

### Phase 2: Add sync-capable hosts path to init_coodie for acsylla (Priority: High) ✅ Done

**Goal:** Allow `init_coodie(driver_type="acsylla", hosts=...)` to auto-create a session and return a sync-capable driver, removing the `ConfigurationError`.

| Task | Description | Status |
|---|---|---|
| 2.1 | Add `AcsyllaDriver.connect_sync(hosts, keyspace, **kwargs) -> AcsyllaDriver` — a blocking classmethod that bootstraps `_bg_loop`, then calls `asyncio.run_coroutine_threadsafe(cluster.create_session(...), _bg_loop).result()` | ✅ Done |
| 2.2 | In `init_coodie(driver_type="acsylla")`, call `AcsyllaDriver.connect_sync(hosts, keyspace, **kwargs)` when `session is None` | ✅ Done |
| 2.3 | Add `UserWarning` in `AcsyllaDriver.__init__(session=...)` noting that the session was not created on `_bg_loop` and sync calls may not work | ✅ Done |
| 2.4 | Update the `ConfigurationError` unit test for `init_coodie(driver_type="acsylla")` — should no longer raise when `hosts` is provided | ✅ Done |
| 2.5 | Add unit test: `init_coodie(driver_type="acsylla", hosts=...)` returns a driver with `_bridge_to_bg_loop = True` | ✅ Done |

### Phase 3: Implement PythonRsDriver with sync bridge (Priority: High)

**Goal:** Create `src/coodie/drivers/python_rs.py` with a fully functional sync bridge mirroring the `AcsyllaDriver` pattern.

| Task | Description | Status |
|---|---|---|
| 3.1 | Create `src/coodie/drivers/python_rs.py` with `PythonRsDriver(AbstractDriver)` and `__slots__` matching `AcsyllaDriver` | ✅ Done |
| 3.2 | Implement `_prepare()` with local cache; skip prepare for DDL (reuse `_is_ddl()` helper pattern from `CassandraDriver`) | ✅ Done |
| 3.3 | Implement `_rows_to_dicts()` — iterate `RequestResult.iter_rows()` to `list[dict]`; return `[]` on `RuntimeError("does not have rows")` for non-SELECT results | ✅ Done |
| 3.4 | Implement `_execute_async_impl()` — prepare statement, call `session.execute(prepared, values)`, collect rows | ✅ Done |
| 3.5 | Implement `execute_async()` — route through `_run_on_bg_loop()` when `_bridge_to_bg_loop` is `True` | ✅ Done |
| 3.6 | Implement `execute()` — `run_coroutine_threadsafe(_execute_async_impl(...), _bg_loop).result()` | ✅ Done |
| 3.7 | Implement `_sync_table_async_impl()`, `sync_table_async()`, and `sync_table()` — reuse CQL builder; DDL statements executed as raw `Statement` (no prepare) | ✅ Done |
| 3.8 | Implement `_close_async_impl()`, `close_async()`, and `close()` | ✅ Done |
| 3.9 | Add `PythonRsDriver.connect(session_factory, default_keyspace)` classmethod — same structure as `AcsyllaDriver.connect()` | ✅ Done |
| 3.10 | Register `driver_type="python-rs"` in `init_coodie()` and `init_coodie_async()` using `PythonRsDriver.connect()` | ✅ Done |
| 3.11 | Unit tests for `PythonRsDriver` with mocked `scylla` session | ✅ Done |

### Phase 4: Integration Tests (Priority: Medium)

**Goal:** Verify both drivers pass the integration test suite in both sync and async variants.

| Task | Description |
|---|---|
| 4.1 | Add `"python-rs"` to `--driver-type` choices in `tests/conftest.py` |
| 4.2 | Add `create_python_rs_session(scylla_container, keyspace)` async helper to `tests/conftest_scylla.py` using `SessionBuilder` with the container IP |
| 4.3 | Update `coodie_driver` fixture in `tests/integration/conftest.py` to handle `driver_type="python-rs"` via `PythonRsDriver.connect()` |
| 4.4 | Run full integration suite with `--driver-type=python-rs`; mark failing tests with `@pytest.mark.xfail` and a reason (batch, paging state resume) |
| 4.5 | Add `python-rs` matrix entry to the integration CI workflow |

### Phase 5: Documentation (Priority: Low)

**Goal:** Document the sync bridge pattern, supported init paths, and caveats for both drivers.

| Task | Description |
|---|---|
| 5.1 | Update `AcsyllaDriver` class docstring — add a table showing which init path enables sync, matching the table in §1.2 |
| 5.2 | Update `init_coodie()` and `init_coodie_async()` docstrings — add `driver_type="acsylla"` notes; document `hosts=` auto-creates a sync-capable driver from Phase 2 |
| 5.3 | Add `PythonRsDriver` class docstring with the same sync-bridge explanation |
| 5.4 | Add or update `docs/source/guide/drivers.md` with a "Sync Bridge" section explaining the background-loop pattern for async-native drivers |

---

## 4. Test Plan

### 4.1 Unit Tests

#### `tests/test_drivers.py`

| Test Case | Phase |
|---|---|
| `init_coodie_async(driver_type="acsylla", hosts=...)` returns driver with `_bridge_to_bg_loop = True` | 1 |
| SSL kwargs still forwarded when `init_coodie_async` uses `AcsyllaDriver.connect()` internally | 1 |
| `execute()` on `init_coodie_async`-created acsylla driver calls `run_coroutine_threadsafe` | 1 |
| `init_coodie(driver_type="acsylla", hosts=...)` returns driver with `_bridge_to_bg_loop = True` | 2 |
| `init_coodie(driver_type="acsylla", session=<external>)` emits `UserWarning` about sync limitations | 2 |
| `init_coodie(driver_type="python-rs", hosts=...)` registers a `PythonRsDriver` | 3 |
| `init_coodie(driver_type="python-rs")` raises `ImportError` when `scylla` not installed | 3 |

#### `tests/test_python_rs_driver.py` (new file)

| Test Case | Phase |
|---|---|
| `PythonRsDriver` instantiation with mocked `scylla.Session` | 3 |
| `execute_async()` forwards CQL and params; calls `session.execute` | 3 |
| `_prepare()` caches prepared statements; second call does not re-prepare | 3 |
| `_rows_to_dicts()` collects `iter_rows()` iterator into `list[dict]` | 3 |
| `_rows_to_dicts()` returns `[]` when `RuntimeError("does not have rows")` is raised | 3 |
| `execute()` sync wrapper dispatches to `_bg_loop` via `run_coroutine_threadsafe` | 3 |
| `PythonRsDriver.connect()` creates session on `_bg_loop`; sets `_bridge_to_bg_loop = True` | 3 |
| `close()` stops `_bg_loop` and joins `_bg_thread` | 3 |
| `ImportError` raised with helpful message when `scylla` package not installed | 3 |

### 4.2 Integration Tests

| Test Area | Test Cases | Phase |
|---|---|---|
| **AcsyllaDriver sync via `init_coodie_async`** | `save()`, `get()`, `find().all()`, `delete()` work synchronously after `init_coodie_async` | 1 |
| **AcsyllaDriver sync via `init_coodie(hosts=...)`** | Same CRUD tests using the new `connect_sync` path | 2 |
| **PythonRsDriver async CRUD** | INSERT, SELECT, UPDATE, DELETE via async Document API | 4 |
| **PythonRsDriver sync CRUD** | Same tests via sync Document API | 4 |
| **PythonRsDriver type roundtrips** | All scalar types from §2.6 of the python-rs-driver-support plan | 4 |
| **PythonRsDriver batch** | `xfail` — batch API not yet in python-rs-driver | 4 |
| **PythonRsDriver paging resume** | `xfail` — `paging_state` not yet in `RequestResult` | 4 |

---

## 5. References

- [AcsyllaDriver source](../../src/coodie/drivers/acsylla.py) — reference sync bridge implementation
- [AbstractDriver interface](../../src/coodie/drivers/base.py) — driver contract
- [coodie driver registry](../../src/coodie/drivers/__init__.py) — `init_coodie` / `init_coodie_async`
- [python-rs-driver-support plan](./python-rs-driver-support.md) — full python-rs driver implementation plan (includes API gap analysis and maturity comparison)
- [acsylla GitHub](https://github.com/acsylla/acsylla) — async-native ScyllaDB Python client
- [python-rs-driver GitHub](https://github.com/scylladb-zpp-2025-python-rs-driver/python-rs-driver) — Rust-based Python client for ScyllaDB
- [asyncio.run_coroutine_threadsafe docs](https://docs.python.org/3/library/asyncio-task.html#asyncio.run_coroutine_threadsafe) — the threading bridge API used by the sync bridge
