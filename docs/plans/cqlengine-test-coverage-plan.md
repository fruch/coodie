● Read docs/plans/cqlengine-test-coverage-plan.md lines 220-235
  └ 16 lines read

✗ Edit docs/plans/cqlengine-test-coverage-plan.md
  Permission denied and could not request permission from user

The file content has the conflict markers. Since I need to output the complete resolved file content, here it is:

# cqlengine Test Coverage Gap Analysis Plan

> **Goal:** Close the test-coverage gap between coodie and the reference
> `cassandra.cqlengine` test suite maintained in
> [scylladb/python-driver](https://github.com/scylladb/python-driver/tree/master/tests).
> Every behaviour that cqlengine's unit and integration tests exercise — and
> that coodie's API already supports or should support — must be covered by a
> coodie unit or integration test.  Some phases require small API additions
> before the tests can be written; those additions are called out explicitly.

---

## Table of Contents

1. [Gap Analysis](#1-gap-analysis)
   - [1.1 Unit Tests](#11-unit-tests)
   - [1.2 Integration — Column Behaviour](#12-integration--column-behaviour)
   - [1.3 Integration — Model I/O and Updates](#13-integration--model-io-and-updates)
   - [1.4 Integration — QuerySet / Query Operators](#14-integration--queryset--query-operators)
   - [1.5 Integration — LWT and Conditional Writes](#15-integration--lwt-and-conditional-writes)
   - [1.6 Integration — TTL and Timestamp Modifiers](#16-integration--ttl-and-timestamp-modifiers)
   - [1.7 Integration — User-Defined Types](#17-integration--user-defined-types)
   - [1.8 Integration — Schema Management](#18-integration--schema-management)
   - [1.9 Integration — Batch Writes](#19-integration--batch-writes)
   - [1.10 Integration — Advanced Query Features](#110-integration--advanced-query-features)
2. [Implementation Phases](#2-implementation-phases)
3. [Test Plan](#3-test-plan)
4. [References](#4-references)

---

## 1. Gap Analysis

Legend:
- ✅ **Covered** — coodie has a test exercising this behaviour today
- 🔧 **Partial** — a unit test exists but no integration test (or vice-versa), or only one of sync/async is covered
- ❌ **Missing** — no test exists in coodie; behaviour is untested

### 1.1 Unit Tests

cqlengine unit tests live in
[`tests/unit/cqlengine/`](https://github.com/scylladb/python-driver/tree/master/tests/unit/cqlengine).

#### `test_columns.py` — Column primitives

| cqlengine behaviour | coodie equivalent | Status |
|---|---|---|
| Frozen `List(Text, frozen=True)` → `frozen<list<text>>` CQL string | `Annotated[list[str], Frozen()]` → `frozen<list<text>>` | ✅ `test_types.py` |
| Frozen `Set(Text, frozen=True)` → `frozen<set<text>>` | same pattern | ✅ `test_types.py` |
| Frozen `Map(Text, Integer, frozen=True)` → `frozen<map<text, int>>` | same pattern | ✅ `test_types.py` |
| Frozen collection combined with `index=True` | `Annotated[list[str], Frozen(), Indexed()]` in schema | 🔧 builder-level only |
| Column ordering / `__lt__` / `__le__` / `__gt__` / `__ge__` | Not applicable — coodie uses annotation ordering | ✅ N/A |

**Gap summary — unit / columns:**
- Frozen collection + `Indexed` combination → add a `test_types.py` case asserting CQL type string and a `test_schema.py` case verifying `Indexed` metadata survives on a frozen column.

#### `test_udt.py` — UDT without connection

| cqlengine behaviour | coodie equivalent | Status |
|---|---|---|
| Define a model with a UDT column without opening a connection | `class M(Document): udt: MyUDT` defined before `init_coodie()` | ❌ |

**Gap summary — unit / udt:**
- Add a `test_types.py` (or dedicated `test_usertype.py`) case that defines a `UserType` subclass and a `Document` that references it, asserts no exception is raised, and verifies `python_type_to_cql_type_str` resolves the frozen UDT string.

#### `test_connection.py` — Connection registry

| cqlengine behaviour | coodie equivalent | Status |
|---|---|---|
| `get_session()` raises when no driver registered | `get_driver()` raises `ConfigurationError` | ✅ `test_drivers.py` |
| `set_session()` succeeds without prior registration | `register_driver(…)` idempotency | 🔧 only error path tested |

**Gap summary — unit / connection:**
- Add a `test_drivers.py` case asserting `register_driver` can be called on an empty registry without raising.

---

### 1.2 Integration — Column Behaviour

Reference:
[`tests/integration/cqlengine/columns/`](https://github.com/scylladb/python-driver/tree/master/tests/integration/cqlengine/columns)

#### Container column mutations (`test_container_columns.py`)

| cqlengine behaviour | coodie equivalent | Status |
|---|---|---|
| `list__append=['x']` appends element | `QuerySet.update(tags__append=['x'])` | ✅ `test_extended.py` |
| `list__prepend=['x']` prepends element | `QuerySet.update(tags__prepend=['x'])` | ✅ `test_extended.py` |
| `list__remove=['x']` removes element | `QuerySet.update(tags__remove=['x'])` | ✅ `test_extended.py` |
| `set__add={'x'}` adds element | `QuerySet.update(tags__add={'x'})` | ✅ `test_extended.py` |
| `set__remove={'x'}` removes element | `QuerySet.update(tags__remove={'x'})` | ✅ `test_extended.py` |
| `map__update={'k': 'v'}` upserts key | `QuerySet.update(meta__update={'k': 'v'})` | ✅ `test_extended.py` |
| `map__remove={'k'}` removes key | `QuerySet.update(meta__remove={'k'})` | ✅ `test_extended.py` |
| Frozen collection column round-trip | `Annotated[list[str], Frozen()]` save/load | ✅ `test_extended.py` |

**Gap summary — integration / container columns:**
- Add `TestExtended.test_list_append_integration`, `test_list_remove_integration`, `test_set_add_remove_integration`, `test_map_update_remove_integration` to `tests/integration/test_extended.py`.
- Add `test_frozen_collection_roundtrip` to verify `frozen<list<text>>` survives save/load.
- Implement `tags__remove` / `meta__update` / `meta__remove` mutation keywords in `cql_builder.parse_update_kwargs` if not already present (check `build_update`).

#### Counter column (`test_counter_column.py`)

| cqlengine behaviour | coodie equivalent | Status |
|---|---|---|
| `CounterDocument.increment(count=1)` issues `UPDATE … SET count = count + ?` | `CounterDocument.increment()` | ✅ `test_counter.py` |
| `CounterDocument.decrement(count=1)` issues `UPDATE … SET count = count - ?` | `CounterDocument.decrement()` | ✅ `test_counter.py` |
| Increment multiple times accumulates | multi-increment round-trip | ✅ `test_counter.py` |
| `CounterDocument.save()` raises `InvalidQueryError` | same | ✅ `test_counter.py` |

#### Static column (`test_static_column.py`)

| cqlengine behaviour | coodie equivalent | Status |
|---|---|---|
| Static column emitted as `STATIC` in DDL | `Annotated[str, Static()]` in `build_create_table` | ✅ schema unit |
| Static column value shared across clustering rows | save two clustering rows, assert same static value | ✅ `test_extended.py` |
| Updating static column updates all clustering rows | `save()` with new static value | ✅ `test_extended.py` |

---

### 1.3 Integration — Model I/O and Updates

Reference:
[`tests/integration/cqlengine/model/`](https://github.com/scylladb/python-driver/tree/master/tests/integration/cqlengine/model)

#### Model I/O (`test_model_io.py`)

| cqlengine behaviour | coodie equivalent | Status |
|---|---|---|
| All scalar column types insert + retrieve | `AllTypes` round-trip | ✅ `test_extended.py` |
| Setting a field to `None` deletes that column | `save()` with `field=None` | 🔧 optional field unit only |
| Multiple `sync_table()` calls do not raise | idempotency test | ✅ `test_basic.py` |
| `Duration` column round-trip | `Duration` type not implemented | ❌ out-of-scope |
| Model dict interface: `model[field]` get/set | Not in coodie API | ❌ |
| `model.keys()`, `model.values()`, `model.items()` | Not in coodie API | ❌ |
| `len(model)` returns field count | Not in coodie API | ❌ |

**Gap summary — integration / model I/O:**
- Add a `test_set_field_to_none_deletes_column` integration test.
- Decide whether to expose a dict-like interface on `Document` (Pydantic already provides `.model_dump()`); if yes, add `Document.__getitem__`, `Document.__setitem__`, `keys()`, `values()`, `items()`, `__len__` delegates to `model_dump()`.  Add unit tests if API is added.

#### Model equality (`test_equality_operations.py`)

| cqlengine behaviour | coodie equivalent | Status |
|---|---|---|
| Two instances with the same PK values are equal | `doc1 == doc2` | ❌ |
| Instance is not equal to non-model object | `doc == "string"` | ❌ |

**Gap summary — integration / equality:**
- Add `test_model_equality` and `test_model_inequality_non_model` unit tests to `test_document.py`.  Pydantic `BaseModel.__eq__` compares all fields, so these tests only need to confirm expected semantics; no API change required.

#### Noop saves (`test_updates.py` / `test_model_io.py`)

| cqlengine behaviour | coodie equivalent | Status |
|---|---|---|
| `doc.save()` after load with no changes executes no query | no-op save | ❌ |
| `doc.update()` with same values executes no query | no-op update | ❌ |
| `doc.update(pk=same_pk)` is allowed | PK same value OK | ❌ |
| `doc.update(pk=different_pk)` raises `InvalidQueryError` | PK change blocked | 🔧 |

**Gap summary — integration / noop:**
- Add `test_noop_save_executes_no_query` and `test_noop_update_executes_no_query` unit tests to `test_document.py`.  Implementation in `Document.save()` and `Document.update()` must track "changed fields" and skip execution when the set is empty.

#### Polymorphism integration (`test_polymorphism.py`)

| cqlengine behaviour | coodie equivalent | Status |
|---|---|---|
| Polymorphic models saved to real DB | discriminator field written | ✅ `test_extended.py` |
| `find()` on base class returns concrete subclass instances | routing on load | ✅ `test_extended.py` |
| `find()` on subclass filters by discriminator | filtered query | ✅ `test_extended.py` |

---

### 1.4 Integration — QuerySet / Query Operators

Reference:
[`tests/integration/cqlengine/query/`](https://github.com/scylladb/python-driver/tree/master/tests/integration/cqlengine/query),
[`tests/integration/cqlengine/operators/`](https://github.com/scylladb/python-driver/tree/master/tests/integration/cqlengine/operators)

#### Comparison operators (`test_queryset.py`, `test_where_operators.py`)

| cqlengine filter | coodie filter kwarg | Status |
|---|---|---|
| `field__gte=v` | `filter(field__gte=v)` | ✅ `test_extended.py` (datetime range) |
| `field__lte=v` | `filter(field__lte=v)` | ✅ `test_extended.py` (datetime range) |
| `field__gt=v` | `filter(field__gt=v)` | 🔧 unit only |
| `field__lt=v` | `filter(field__lt=v)` | 🔧 unit only |
| `field__in=[…]` | `filter(field__in=[…])` | ✅ `test_extended.py` |
| `field__contains='x'` | `filter(field__contains='x')` | 🔧 unit only (requires collection index) |
| `field__contains_key='k'` | `filter(field__contains_key='k')` | 🔧 unit only (requires collection index) |
| `field__ne=v` | `filter(field__ne=v)` | 🔧 unit only (CQL `!=` not valid in WHERE) |

#### Datetime range queries (`test_datetime_queries.py`)

| cqlengine behaviour | coodie equivalent | Status |
|---|---|---|
| Filter by `timestamp` column with `__gte` / `__lte` | `filter(created_at__gte=dt)` | ✅ `test_extended.py` |
| Timezone-aware `datetime` stored as UTC | UTC round-trip | ✅ `test_extended.py` scalar round-trip |

#### Distinct queries (`test_queryset.py`)

| cqlengine behaviour | coodie equivalent | Status |
|---|---|---|
| `QuerySet.distinct()` emits `SELECT DISTINCT …` | Not in coodie API | ❌ |
| `QuerySet.distinct(['pk_col'])` lists specific PK columns | — | ❌ |

**Gap summary — integration / distinct:**
- Add `QuerySet.distinct(*fields)` method to `coodie/sync/query.py` and `coodie/aio/query.py`; emit `SELECT DISTINCT <fields>` CQL.
- Add unit tests to `test_query.py` and integration tests to `test_extended.py`.

#### Field selection: `only()` / `defer()` (`test_queryset.py`)

| cqlengine behaviour | coodie equivalent | Status |
|---|---|---|
| `QuerySet.only(['col1', 'col2'])` selects specific columns | Not in coodie API | ❌ |
| `QuerySet.defer(['col1'])` deselects specific columns | Not in coodie API | ❌ |

**Gap summary — integration / field selection:**
- Add `QuerySet.only(*fields)` and `QuerySet.defer(*fields)` methods; influence the column list passed to `build_select`.
- Add unit and integration tests.

---

### 1.5 Integration — LWT and Conditional Writes

Reference:
[`tests/integration/cqlengine/test_lwt_conditional.py`](https://github.com/scylladb/python-driver/blob/master/tests/integration/cqlengine/test_lwt_conditional.py),
[`tests/integration/cqlengine/test_ifexists.py`](https://github.com/scylladb/python-driver/blob/master/tests/integration/cqlengine/test_ifexists.py)

| cqlengine behaviour | coodie equivalent | Status |
|---|---|---|
| `doc.iff(col=val).save()` emits `UPDATE … IF col = ?` | `iff()` not in API | ❌ |
| `QuerySet.iff(col=val).update(…)` blind conditional update | same | ❌ |
| `LWTException` raised when condition fails | exception class | ❌ |
| `doc.iff(col=val).delete()` conditional delete | same | ❌ |
| `batch.add(doc.iff(…).update(…))` LWT in batch | same | ❌ |
| `delete()` with `IF EXISTS` guard | `Document.delete(if_exists=True)` | ✅ `test_lwt.py` |
| Conditional update in batch raises `LWTException` | same | ❌ |
| `doc.update(if_conditions={"col": val})` conditional update | `Document.update(if_conditions={…})` | ✅ `test_update.py`, `test_lwt.py` |
| `doc.update(if_exists=True)` conditional update | `Document.update(if_exists=True)` | ✅ `test_update.py` |

**Gap summary — LWT:**
- Add `Document.iff(**conditions)` returning a conditional write context.
- Add `QuerySet.iff(**conditions)` for blind updates.
- Add `LWTException` to `coodie.exceptions`.
- Add `Document.delete(if_exists=True)` option.
- Add unit tests to `test_document.py` and `test_query.py`.
- Add integration tests to a new `tests/integration/test_lwt.py`.

---

### 1.6 Integration — TTL and Timestamp Modifiers

Reference:
[`tests/integration/cqlengine/test_ttl.py`](https://github.com/scylladb/python-driver/blob/master/tests/integration/cqlengine/test_ttl.py),
[`tests/integration/cqlengine/test_timestamp.py`](https://github.com/scylladb/python-driver/blob/master/tests/integration/cqlengine/test_timestamp.py)

#### TTL

| cqlengine behaviour | coodie equivalent | Status |
|---|---|---|
| `Model.ttl(N).create(**kw)` emits `USING TTL N` | class-level chaining | ❌ |
| `instance.ttl(N).save()` emits `USING TTL N` | instance-level chaining | ❌ |
| `instance.ttl(N).update(field=v)` emits `USING TTL N` | same | ❌ |
| `QuerySet.ttl(N).update(field=v)` emits `USING TTL N` | `QuerySet.update(ttl=N, …)` | ✅ unit |
| Row expires after TTL elapses | `save(ttl=1)` + sleep + not found | 🔧 integration only via `test_basic.py` `test_ttl_row_expires` |
| `__options__ = {'default_time_to_live': N}` applies default TTL | `Settings.__options__` | 🔧 schema unit only |

**Gap summary — TTL:**
- Add `Document.ttl(n)` instance method returning a `_TTLContext` object that delegates to `save()` / `update()` with `ttl=n`.
- Add `Document.ttl(n)` class method (via `__init_subclass__`) to mirror `Model.ttl(N).create(…)` behaviour.
- Add unit and integration tests.

#### USING TIMESTAMP

| cqlengine behaviour | coodie equivalent | Status |
|---|---|---|
| `Model.timestamp(delta).create(**kw)` emits `USING TIMESTAMP` | not in API | ❌ |
| `instance.timestamp(delta).update(field=v)` | not in API | ❌ |
| `instance.timestamp(delta).delete()` | not in API | ❌ |
| `BatchQuery(timestamp=delta)` applies batch-level timestamp | not in API | ❌ |

**Gap summary — TIMESTAMP:**
- Add `USING TIMESTAMP <micros>` support to `build_insert`, `build_update`, `build_delete` in `cql_builder.py`.
- Add `Document.timestamp(delta)` / `QuerySet.timestamp(delta)` chaining method.
- Add `BatchQuery(timestamp=delta)` parameter.
- Add unit and integration tests.

---

### 1.7 Integration — User-Defined Types

Reference:
[`tests/integration/cqlengine/model/test_udts.py`](https://github.com/scylladb/python-driver/blob/master/tests/integration/cqlengine/model/test_udts.py)

| cqlengine behaviour | coodie equivalent | Status |
|---|---|---|
| `sync_type(MyUDT)` creates the type in the keyspace | `sync_type()` / `sync_type_async()` | ✅ `test_udt.py` |
| UDT field round-trip: save + load | `Document` with `udt: MyUDT` | ✅ `test_udt.py` |
| Nested UDT field round-trip | `udt: Outer` where `Outer` has `inner: Inner` | ✅ `test_udt.py` |
| UDT inside collection: `list[MyUDT]` | `list[Annotated[MyUDT, Frozen()]]` | ❌ integration (skipped for acsylla) |
| Define model with UDT without connection | class-level definition only | ✅ `test_types.py` |
| `sync_type` resolves nested dependencies in order | `sync_type` with nested UDT | ✅ `test_udt.py` |

---

### 1.8 Integration — Schema Management

Reference:
[`tests/integration/cqlengine/management/`](https://github.com/scylladb/python-driver/tree/master/tests/integration/cqlengine/management)

#### Table management (`test_management.py`)

| cqlengine behaviour | coodie equivalent | Status |
|---|---|---|
| `drop_table()` multiple times does not raise | `sync_table` + `drop_table` × 2 | ✅ `test_extended.py` |
| `sync_table()` with added column alters existing table | schema migration | ✅ `test_migration.py` |
| `sync_table()` with changed PK raises / logs warning | detection of incompatible change | ❌ |
| `create_keyspace_network_topology()` | `create_keyspace(dc_replication_map=…)` | ✅ unit |
| `drop_keyspace()` | `drop_keyspace()` | ✅ unit |

#### Compaction settings (`test_compaction_settings.py`)

| cqlengine behaviour | coodie equivalent | Status |
|---|---|---|
| `__options__ = {'compaction': {'class': 'LeveledCompactionStrategy'}}` reflected in DB | `Settings.__options__` → `WITH compaction = {…}` | ✅ `test_extended.py` |
| Compaction strategy change via `sync_table` | alter table compaction | ✅ `test_extended.py` |

---

### 1.9 Integration — Batch Writes

Reference:
[`tests/integration/cqlengine/query/test_batch_query.py`](https://github.com/scylladb/python-driver/blob/master/tests/integration/cqlengine/query/test_batch_query.py),
[`tests/integration/cqlengine/test_timestamp.py`](https://github.com/scylladb/python-driver/blob/master/tests/integration/cqlengine/test_timestamp.py)

| cqlengine behaviour | coodie equivalent | Status |
|---|---|---|
| LOGGED batch atomicity | `BatchQuery` with multiple inserts | ✅ `test_extended.py` |
| UNLOGGED batch | `BatchQuery(logged=False)` | 🔧 unit only |
| COUNTER batch | `BatchQuery(batch_type="COUNTER")` | 🔧 unit only |
| Batch with `USING TIMESTAMP` | `BatchQuery(timestamp=delta)` | ❌ |
| Batch with `USING TTL` | statements carrying TTL in a batch | ❌ integration |
| Empty batch executes no query | `BatchQuery` with no statements | ❌ |

**Gap summary — integration / batch:**
- Add `test_unlogged_batch_integration`, `test_counter_batch_integration`, `test_empty_batch_no_execute` to `tests/integration/test_extended.py` (or `test_batch.py`).
- Batch TIMESTAMP tests depend on Phase 7 (timestamp API).

---

### 1.10 Integration — Advanced Query Features

Reference:
[`tests/integration/cqlengine/query/test_queryset.py`](https://github.com/scylladb/python-driver/blob/master/tests/integration/cqlengine/query/test_queryset.py),
[`tests/integration/cqlengine/test_context_query.py`](https://github.com/scylladb/python-driver/blob/master/tests/integration/cqlengine/test_context_query.py)

| cqlengine behaviour | coodie equivalent | Status |
|---|---|---|
| Token range queries (`token(pk) > token(val)`) | `QuerySet.filter(token__gt=…)` | ❌ |
| Per-query consistency level override | `QuerySet.consistency(cl)` | ❌ |
| Context-manager keyspace override | Not in coodie API | ❌ (out-of-scope) |
| `LIKE` operator (SASI index) | `filter(field__like='pattern')` | ❌ |

**Gap summary — advanced query:**
- Token queries and `LIKE` are low-priority; flag as future work.
- Per-query consistency: add `QuerySet.consistency(level)` (driver-level pass-through) and a unit test.

---

## 2. Implementation Phases

### Phase 1: Unit Test Completeness ✅ Done

**Goal:** Fill the small but concrete unit-test holes identified in Section 1.1.

| Task | Status | Description |
|---|---|---|
| 1.1 | ✅ | Add `test_frozen_collection_with_index` to `tests/test_types.py` verifying the CQL type string and `test_schema.py` verifying `Indexed` metadata is preserved |
| 1.2 | ✅ | Add `test_usertype_definition_without_connection` to `tests/test_document.py` (or `tests/test_usertype.py`) — define `UserType` subclass and a `Document` referencing it before any driver is registered; assert no exception |
| 1.3 | ✅ | Add `test_register_driver_on_empty_registry` to `tests/test_drivers.py` |
| 1.4 | ✅ | Add `test_model_equality` and `test_model_inequality_non_model` to `tests/test_document.py` |
| 1.5 | ✅ | Unit tests for all new code in Phases 1–8 |

### Phase 2: Collection Mutation Integration Tests ✅ Done

**Goal:** Prove that list, set, map, and counter mutations issued via `QuerySet.update` reach the database correctly.

| Task | Status | Description |
|---|---|---|
| 2.1 | ✅ | Verify / add `list__remove`, `map__update`, `map__remove` keywords in `parse_update_kwargs` in `cql_builder.py` |
| 2.2 | ✅ | Add `TestContainerMutations` class to `tests/integration/test_extended.py`: `test_list_append`, `test_list_prepend`, `test_list_remove`, `test_set_add`, `test_set_remove`, `test_map_update`, `test_map_remove` |
| 2.3 | ✅ | `TestFrozenCollectionRoundTrip` already in `TestExtended` |
| 2.4 | ✅ | Add `TestCounterColumn` integration test class in new `tests/integration/test_counter.py` |
| 2.5 | ✅ | Add `TestStaticColumn` integration test class to `test_extended.py` |

### Phase 3: Query Operator Integration Tests ✅ Done

**Goal:** Validate that all comparison and membership operators produce correct CQL and work against ScyllaDB.

| Task | Status | Description |
|---|---|---|
| 3.1 | ✅ | Add `__ne` operator keyword to `parse_filter_kwargs` in `cql_builder.py`; `__contains` and `__contains_key` were already present |
| 3.2 | ✅ | Add `TestQueryOperators` integration test class to `tests/integration/test_extended.py` |
| 3.3 | ✅ | Add `test_datetime_range_filter` to `tests/integration/test_extended.py` |
| 3.4 | ✅ | Unit tests for `ne`, `contains`, `contains_key` in `test_cql_builder.py` |

### Phase 4: UDT Integration Tests ✅ Done

**Goal:** Verify `UserType` (already implemented in `src/coodie/usertype.py`) works end-to-end against a real keyspace.

| Task | Status | Description |
|---|---|---|
| 4.1 | ✅ | Add `tests/integration/test_udt.py` with `TestUDTIntegration` class |
| 4.2 | ✅ | `test_sync_type_creates_udt` — calls `sync_type()` and asserts no error |
| 4.3 | ✅ | `test_udt_field_roundtrip` — save and reload a model containing a UDT field |
| 4.4 | ✅ | `test_nested_udt_roundtrip` — UDT containing another UDT |
| 4.5 | ❌ | `test_udt_in_list_roundtrip` — skipped for acsylla driver; needs more infra |
| 4.6 | ✅ | `test_sync_type_nested_dependency_order` — nested UDT synced inner-first |
| 4.7 | ✅ | Unit test: `UserType` subclass definition before driver is registered (`tests/test_types.py`) |

### Phase 5: Polymorphism and Schema Management Integration Tests ✅ Done

**Goal:** Exercise discriminator-based polymorphism and DDL edge cases against a real database.

| Task | Status | Description |
|---|---|---|
| 5.1 | ✅ | Add `TestPolymorphismIntegration` to `tests/integration/test_extended.py`: save concrete subclass, fetch via base — assert returned type is the correct subclass |
| 5.2 | ✅ | `test_find_subclass_adds_discriminator_filter` — `SubClass.find()` appends `WHERE discriminator = ?` |
| 5.3 | ✅ | `test_drop_table_idempotent` — call `sync_table` once, call `drop_table` twice; assert no error |
| 5.4 | ✅ | `test_compaction_settings_applied` — create table with compaction options, query system table to verify strategy |

### Phase 6: LWT and Conditional Writes (Priority: Medium)

**Goal:** Implement and test LWT conditional writes: `iff()`, `IF EXISTS`, and `LWTException`.

| Task | Description |
|---|---|
| 6.1 | Add `LWTException` to `coodie/exceptions.py` with `existing` attribute carrying the server's current-value response |
| 6.2 | Add `Document.iff(**conditions)` returning an `_IffContext` that wraps `save()`,
