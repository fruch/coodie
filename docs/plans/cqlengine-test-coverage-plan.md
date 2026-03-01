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
| `list__append=['x']` appends element | `QuerySet.update(tags__append=['x'])` | 🔧 unit only |
| `list__prepend=['x']` prepends element | `QuerySet.update(tags__prepend=['x'])` | 🔧 unit only |
| `list__remove=['x']` removes element | `QuerySet.update(tags__remove=['x'])` | ❌ |
| `set__add={'x'}` adds element | `QuerySet.update(tags__add={'x'})` | 🔧 unit only |
| `set__remove={'x'}` removes element | `QuerySet.update(tags__remove={'x'})` | ❌ |
| `map__update={'k': 'v'}` upserts key | `QuerySet.update(meta__update={'k': 'v'})` | ❌ |
| `map__remove={'k'}` removes key | `QuerySet.update(meta__remove={'k'})` | ❌ |
| Frozen collection column round-trip | `Annotated[list[str], Frozen()]` save/load | 🔧 unit only |

**Gap summary — integration / container columns:**
- Add `TestExtended.test_list_append_integration`, `test_list_remove_integration`, `test_set_add_remove_integration`, `test_map_update_remove_integration` to `tests/integration/test_extended.py`.
- Add `test_frozen_collection_roundtrip` to verify `frozen<list<text>>` survives save/load.
- Implement `tags__remove` / `meta__update` / `meta__remove` mutation keywords in `cql_builder.parse_update_kwargs` if not already present (check `build_update`).

#### Counter column (`test_counter_column.py`)

| cqlengine behaviour | coodie equivalent | Status |
|---|---|---|
| `CounterDocument.increment(count=1)` issues `UPDATE … SET count = count + ?` | `CounterDocument.increment()` | 🔧 unit only |
| `CounterDocument.decrement(count=1)` issues `UPDATE … SET count = count - ?` | `CounterDocument.decrement()` | 🔧 unit only |
| Increment multiple times accumulates | multi-increment round-trip | ❌ |
| `CounterDocument.save()` raises `InvalidQueryError` | same | 🔧 unit only |

**Gap summary — integration / counter:**
- Add `TestCounterColumn` integration test class to `tests/integration/test_extended.py` (or a new `test_counter.py`).

#### Static column (`test_static_column.py`)

| cqlengine behaviour | coodie equivalent | Status |
|---|---|---|
| Static column emitted as `STATIC` in DDL | `Annotated[str, Static()]` in `build_create_table` | ✅ schema unit |
| Static column value shared across clustering rows | save two clustering rows, assert same static value | ❌ |
| Updating static column updates all clustering rows | `save()` with new static value | ❌ |

**Gap summary — integration / static:**
- Add `TestStaticColumn` integration test class to `tests/integration/test_extended.py`.

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
| Polymorphic models saved to real DB | discriminator field written | 🔧 unit only |
| `find()` on base class returns concrete subclass instances | routing on load | 🔧 unit only |
| `find()` on subclass filters by discriminator | filtered query | 🔧 unit only |

**Gap summary — integration / polymorphism:**
- Add `TestPolymorphism` integration test class to `tests/integration/test_extended.py` (or new `test_polymorphism.py`).

---

### 1.4 Integration — QuerySet / Query Operators

Reference:
[`tests/integration/cqlengine/query/`](https://github.com/scylladb/python-driver/tree/master/tests/integration/cqlengine/query),
[`tests/integration/cqlengine/operators/`](https://github.com/scylladb/python-driver/tree/master/tests/integration/cqlengine/operators)

#### Comparison operators (`test_queryset.py`, `test_where_operators.py`)

| cqlengine filter | coodie filter kwarg | Status |
|---|---|---|
| `field__gte=v` | `filter(field__gte=v)` | 🔧 unit only |
| `field__lte=v` | `filter(field__lte=v)` | 🔧 unit only |
| `field__gt=v` | `filter(field__gt=v)` | 🔧 unit only |
| `field__lt=v` | `filter(field__lt=v)` | 🔧 unit only |
| `field__in=[…]` | `filter(field__in=[…])` | 🔧 unit only |
| `field__contains='x'` | `filter(field__contains='x')` | ❌ |
| `field__contains_key='k'` | `filter(field__contains_key='k')` | ❌ |
| `field__ne=v` | `filter(field__ne=v)` | ❌ |

**Gap summary — integration / query operators:**
- Add `test_filter_gte_lte_integration`, `test_filter_in_integration`, `test_filter_contains_integration`, `test_filter_contains_key_integration` to `tests/integration/test_extended.py`.
- Add `__contains`, `__contains_key`, `__ne` operator keywords to `parse_filter_kwargs` in `cql_builder.py` if not already present.

#### Datetime range queries (`test_datetime_queries.py`)

| cqlengine behaviour | coodie equivalent | Status |
|---|---|---|
| Filter by `timestamp` column with `__gte` / `__lte` | `filter(created_at__gte=dt)` | ❌ integration |
| Timezone-aware `datetime` stored as UTC | UTC round-trip | ✅ `test_extended.py` scalar round-trip |

**Gap summary — integration / datetime:**
- Add `test_datetime_range_filter_integration` to `tests/integration/test_extended.py`.

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
| `delete()` with `IF EXISTS` guard | `Document.delete(if_exists=True)` | ❌ |
| Conditional update in batch raises `LWTException` | same | ❌ |

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
| `sync_type(MyUDT)` creates the type in the keyspace | `sync_type()` / `sync_type_async()` | 🔧 unit only |
| UDT field round-trip: save + load | `Document` with `udt: MyUDT` | ❌ integration |
| Nested UDT field round-trip | `udt: Outer` where `Outer` has `inner: Inner` | ❌ integration |
| UDT inside collection: `list[MyUDT]` | `list[Annotated[MyUDT, Frozen()]]` | ❌ integration |
| Define model with UDT without connection | class-level definition only | ❌ unit |
| `sync_type` resolves nested dependencies in order | `sync_type` with nested UDT | ❌ integration |

**Gap summary — UDT:**
- Add `TestUDTIntegration` class to a new `tests/integration/test_udt.py`.
- Cover: `sync_type()` call, basic UDT round-trip, nested UDT, UDT-in-list.
- Add a unit test for UDT class definition without a registered driver.

---

### 1.8 Integration — Schema Management

Reference:
[`tests/integration/cqlengine/management/`](https://github.com/scylladb/python-driver/tree/master/tests/integration/cqlengine/management)

#### Table management (`test_management.py`)

| cqlengine behaviour | coodie equivalent | Status |
|---|---|---|
| `drop_table()` multiple times does not raise | `sync_table` + `drop_table` × 2 | ❌ |
| `sync_table()` with added column alters existing table | schema migration | ✅ `test_migration.py` |
| `sync_table()` with changed PK raises / logs warning | detection of incompatible change | ❌ |
| `create_keyspace_network_topology()` | `create_keyspace(dc_replication_map=…)` | ✅ unit |
| `drop_keyspace()` | `drop_keyspace()` | ✅ unit |

**Gap summary — integration / table management:**
- Add `test_drop_table_idempotent` to `tests/integration/test_basic.py` or `test_migration.py`.

#### Compaction settings (`test_compaction_settings.py`)

| cqlengine behaviour | coodie equivalent | Status |
|---|---|---|
| `__options__ = {'compaction': {'class': 'LeveledCompactionStrategy'}}` reflected in DB | `Settings.__options__` → `WITH compaction = {…}` | 🔧 builder unit only |
| Compaction strategy change via `sync_table` | alter table compaction | ❌ integration |

**Gap summary — integration / compaction:**
- Add `test_compaction_settings_applied_to_table` to `tests/integration/test_migration.py`.

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

### Phase 1: Unit Test Completeness (Priority: High) ✅

**Goal:** Fill the small but concrete unit-test holes identified in Section 1.1.

| Task | Description |
|---|---|
| 1.1 | Add `test_frozen_collection_with_index` to `tests/test_types.py` verifying the CQL type string and `test_schema.py` verifying `Indexed` metadata is preserved |
| 1.2 | Add `test_usertype_definition_without_connection` to `tests/test_document.py` (or `tests/test_usertype.py`) — define `UserType` subclass and a `Document` referencing it before any driver is registered; assert no exception |
| 1.3 | Add `test_register_driver_on_empty_registry` to `tests/test_drivers.py` |
| 1.4 | Add `test_model_equality` and `test_model_inequality_non_model` to `tests/test_document.py` |
| 1.5 | Unit tests for all new code in Phases 1–8 |

### Phase 2: Collection Mutation Integration Tests (Priority: High)

**Goal:** Prove that list, set, map, and counter mutations issued via `QuerySet.update` reach the database correctly.

| Task | Description |
|---|---|
| 2.1 | Verify / add `list__remove`, `map__update`, `map__remove` keywords in `parse_update_kwargs` in `cql_builder.py` |
| 2.2 | Add `TestContainerMutations` class to `tests/integration/test_extended.py`: `test_list_append`, `test_list_prepend`, `test_list_remove`, `test_set_add`, `test_set_remove`, `test_map_update`, `test_map_remove` |
| 2.3 | Add `TestFrozenCollectionRoundTrip` integration test to `tests/integration/test_extended.py` |
| 2.4 | Add `TestCounterColumn` integration test class: increment accumulates, decrement reduces, `save()` raises |
| 2.5 | Add `TestStaticColumn` integration test class: static value shared across clustering rows |
| 2.6 | Unit + integration tests |

### Phase 3: Query Operator Integration Tests (Priority: High)

**Goal:** Validate that all comparison and membership operators produce correct CQL and work against ScyllaDB.

| Task | Description |
|---|---|
| 3.1 | Add `__contains`, `__contains_key`, `__ne` operator keywords to `parse_filter_kwargs` in `cql_builder.py` if missing |
| 3.2 | Add `TestQueryOperators` integration test class to `tests/integration/test_extended.py`: `test_filter_gte_lte`, `test_filter_gt_lt`, `test_filter_in`, `test_filter_contains` (requires collection index), `test_filter_ne` |
| 3.3 | Add `test_datetime_range_filter_integration` to `tests/integration/test_extended.py` |
| 3.4 | Unit + integration tests |

### Phase 4: UDT Integration Tests (Priority: High)

**Goal:** Verify `UserType` (already implemented in `src/coodie/usertype.py`) works end-to-end against a real keyspace.

| Task | Description |
|---|---|
| 4.1 | Add `tests/integration/test_udt.py` with `TestUDTIntegration` class |
| 4.2 | `test_sync_type_creates_udt` — calls `sync_type()` and asserts no error |
| 4.3 | `test_udt_field_roundtrip` — save and reload a model containing a UDT field |
| 4.4 | `test_nested_udt_roundtrip` — UDT containing another UDT |
| 4.5 | `test_udt_in_list_roundtrip` — `list[Annotated[MyUDT, Frozen()]]` column |
| 4.6 | `test_sync_type_resolves_dependency_order` — nested UDT synced inner-first |
| 4.7 | Unit test: `UserType` subclass definition before driver is registered |

### Phase 5: Polymorphism and Schema Management Integration Tests (Priority: Medium)

**Goal:** Exercise discriminator-based polymorphism and DDL edge cases against a real database.

| Task | Description |
|---|---|
| 5.1 | Add `TestPolymorphismIntegration` to `tests/integration/test_extended.py`: save concrete subclass, fetch via base — assert returned type is the correct subclass |
| 5.2 | `test_find_via_subclass_filters_discriminator` — `SubClass.find()` appends `WHERE discriminator = ?` |
| 5.3 | `test_drop_table_idempotent` — call `sync_table` once, call `drop_table` twice; assert no error |
| 5.4 | `test_compaction_settings_applied` — create model with `__options__` compaction, call `sync_table`, query system table to verify strategy |
| 5.5 | Unit + integration tests |

### Phase 6: LWT and Conditional Writes (Priority: Medium)

**Goal:** Implement and test LWT conditional writes: `iff()`, `IF EXISTS`, and `LWTException`.

| Task | Description |
|---|---|
| 6.1 | Add `LWTException` to `coodie/exceptions.py` with `existing` attribute carrying the server's current-value response |
| 6.2 | Add `Document.iff(**conditions)` returning an `_IffContext` that wraps `save()`, `update()`, `delete()` with `IF col = ?` clauses |
| 6.3 | Add `QuerySet.iff(**conditions)` for blind conditional updates |
| 6.4 | Add `Document.delete(if_exists=True)` option |
| 6.5 | Plumb LWT response parsing into both `CassandraDriver` and `AcsyllaDriver` — raise `LWTException` on `[applied] = False` |
| 6.6 | Add `tests/integration/test_lwt.py` with: `test_iff_update_success`, `test_iff_update_failure_raises_lwt_exception`, `test_iff_delete_success`, `test_iff_delete_failure`, `test_batch_with_lwt`, `test_delete_if_exists` |
| 6.7 | Unit + integration tests |

### Phase 7: TTL and Timestamp Modifiers (Priority: Medium)

**Goal:** Implement and test `instance.ttl(n)` chaining and `USING TIMESTAMP` support.

| Task | Description |
|---|---|
| 7.1 | Add `instance.ttl(n)` method to `Document` returning a `_TTLContext` that calls `save(ttl=n)` or `update(ttl=n)` |
| 7.2 | Add `Document.ttl(n)` class-level chaining so `MyDoc.ttl(60).create(…)` works |
| 7.3 | Add `USING TIMESTAMP <micros>` support to `build_insert`, `build_update`, `build_delete` in `cql_builder.py` |
| 7.4 | Add `Document.timestamp(delta)` / `QuerySet.timestamp(delta)` chaining method |
| 7.5 | Add `BatchQuery(timestamp=delta)` parameter |
| 7.6 | Add `tests/integration/test_ttl_timestamp.py`: `test_instance_ttl_save`, `test_class_ttl_create`, `test_update_with_ttl`, `test_timestamp_create`, `test_batch_with_timestamp` |
| 7.7 | Unit + integration tests |

### Phase 8: Advanced Query Features (Priority: Low)

**Goal:** Close remaining QuerySet gaps: `distinct`, `only`/`defer`, noop saves, per-query consistency.

| Task | Description |
|---|---|
| 8.1 | Add `QuerySet.distinct(*fields)` to sync and async QuerySet; emit `SELECT DISTINCT` |
| 8.2 | Add `QuerySet.only(*fields)` and `QuerySet.defer(*fields)`; influence `build_select` column list |
| 8.3 | Implement "changed fields" tracking in `Document.save()` and `Document.update()` to skip execution when nothing has changed (noop save) |
| 8.4 | Add `QuerySet.consistency(level)` driver-level pass-through |
| 8.5 | Add unit tests for `distinct`, `only`, `defer`, noop save, `consistency` |
| 8.6 | Add integration tests: `test_distinct_query`, `test_only_fields`, `test_noop_save_no_execute`, `test_per_query_consistency` |

---

## 3. Test Plan

### 3.1 Unit Tests

#### `tests/test_types.py`

| Test Case | Phase |
|---|---|
| `Annotated[list[str], Frozen(), Indexed()]` CQL type string and index metadata preserved | 1 |
| `UserType` subclass defined before driver registered does not raise | 4 |

#### `tests/test_document.py`

| Test Case | Phase |
|---|---|
| `doc1 == doc2` when both have the same PK values | 1 |
| `doc != "string"` and `doc != None` | 1 |
| `Document.iff(field=v).save()` SQL includes `IF field = ?` | 6 |
| `Document.delete(if_exists=True)` SQL includes `IF EXISTS` | 6 |
| `doc.ttl(60).save()` calls underlying save with `ttl=60` | 7 |
| `doc.update()` with same values issues no query | 8 |
| `doc.save()` after round-trip load with no changes issues no query | 8 |

#### `tests/test_query.py`

| Test Case | Phase |
|---|---|
| `filter(field__contains='x')` CQL has `CONTAINS ?` | 3 |
| `filter(field__contains_key='k')` CQL has `CONTAINS KEY ?` | 3 |
| `filter(field__ne=v)` CQL has `!= ?` | 3 |
| `QuerySet.iff(field=v).update(…)` CQL has `IF field = ?` | 6 |
| `QuerySet.timestamp(delta).update(…)` CQL has `USING TIMESTAMP` | 7 |
| `QuerySet.distinct()` CQL has `SELECT DISTINCT` | 8 |
| `QuerySet.only('col1')` CQL selects only `col1` | 8 |
| `QuerySet.defer('col2')` CQL excludes `col2` | 8 |
| `QuerySet.consistency('quorum')` passes level to driver | 8 |

#### `tests/test_drivers.py`

| Test Case | Phase |
|---|---|
| `register_driver(…)` on empty registry does not raise | 1 |

#### `tests/test_cql_builder.py`

| Test Case | Phase |
|---|---|
| `parse_update_kwargs` with `tags__remove=[…]` emits `"tags" = "tags" - ?` | 2 |
| `parse_update_kwargs` with `meta__update={…}` emits `"meta" = "meta" + ?` | 2 |
| `parse_update_kwargs` with `meta__remove={…}` emits `"meta" = "meta" - ?` | 2 |
| `build_insert` with `timestamp=delta` emits `USING TIMESTAMP` | 7 |
| `build_update` with `timestamp=delta` emits `USING TIMESTAMP` | 7 |
| `build_delete` with `timestamp=delta` emits `USING TIMESTAMP` | 7 |
| `build_select` with `distinct=True` emits `SELECT DISTINCT` | 8 |
| `build_select` with `columns=[…]` emits only those columns | 8 |

### 3.2 Integration Tests

#### `tests/integration/test_extended.py`

| Test Area | Test Cases | Phase |
|---|---|---|
| **Container mutations** | `test_list_append`, `test_list_prepend`, `test_list_remove`, `test_set_add`, `test_set_remove`, `test_map_update`, `test_map_remove` | 2 |
| **Frozen collection round-trip** | `test_frozen_list_roundtrip` | 2 |
| **Static column** | `test_static_shared_across_clustering`, `test_static_update` | 2 |
| **Query operators** | `test_filter_gte_lte`, `test_filter_gt_lt`, `test_filter_in`, `test_filter_contains`, `test_filter_ne` | 3 |
| **Datetime range** | `test_datetime_range_filter` | 3 |
| **Polymorphism** | `test_save_subclass_fetch_via_base`, `test_find_subclass_adds_discriminator_filter` | 5 |
| **Drop table** | `test_drop_table_idempotent` | 5 |
| **Compaction** | `test_compaction_settings_applied` | 5 |
| **Batch variants** | `test_unlogged_batch`, `test_counter_batch`, `test_empty_batch_no_execute` | 2 |
| **Noop save** | `test_noop_save_no_query`, `test_noop_update_no_query` | 8 |
| **Distinct query** | `test_distinct_partition_keys` | 8 |
| **only / defer** | `test_only_selects_columns`, `test_defer_excludes_column` | 8 |

#### `tests/integration/test_counter.py` *(new file)*

| Test Area | Test Cases | Phase |
|---|---|---|
| **Counter increment** | `test_counter_increment_accumulates` | 2 |
| **Counter decrement** | `test_counter_decrement_reduces` | 2 |
| **Counter save raises** | `test_counter_save_raises_integration` | 2 |

#### `tests/integration/test_udt.py` *(new file)*

| Test Area | Test Cases | Phase |
|---|---|---|
| **sync_type** | `test_sync_type_creates_udt` | 4 |
| **UDT round-trip** | `test_udt_field_roundtrip` | 4 |
| **Nested UDT** | `test_nested_udt_roundtrip` | 4 |
| **UDT in list** | `test_udt_in_list_roundtrip` | 4 |
| **Dependency order** | `test_sync_type_nested_dependency_order` | 4 |

#### `tests/integration/test_lwt.py` *(new file)*

| Test Area | Test Cases | Phase |
|---|---|---|
| **iff update** | `test_iff_update_success`, `test_iff_update_failure_raises_lwt_exception` | 6 |
| **iff delete** | `test_iff_delete_success`, `test_iff_delete_failure` | 6 |
| **if_exists delete** | `test_delete_if_exists_success`, `test_delete_if_exists_when_absent` | 6 |
| **batch LWT** | `test_batch_with_lwt_conditional` | 6 |

#### `tests/integration/test_ttl_timestamp.py` *(new file)*

| Test Area | Test Cases | Phase |
|---|---|---|
| **Instance TTL** | `test_instance_ttl_save_expires`, `test_instance_ttl_update` | 7 |
| **Class TTL** | `test_class_level_ttl_create` | 7 |
| **USING TIMESTAMP** | `test_timestamp_on_create`, `test_timestamp_on_update` | 7 |
| **Batch TIMESTAMP** | `test_batch_with_timestamp` | 7 |

---

## 4. References

- [scylladb/python-driver — unit cqlengine tests](https://github.com/scylladb/python-driver/tree/master/tests/unit/cqlengine)
- [scylladb/python-driver — integration cqlengine tests](https://github.com/scylladb/python-driver/tree/master/tests/integration/cqlengine)
- [coodie existing integration test coverage](integration-test-coverage.md)
- [coodie cqlengine feature-parity plan](cqlengine-feature-parity.md)
- [coodie UDT support plan](udt-support.md)
