# Phase A: User-Defined Types (UDT) — Implementation Plan — ✅ DONE

> **Goal:** Add complete UDT support to coodie, matching every public feature
> of cqlengine's `cassandra.cqlengine.usertype` — `UserType` base class,
> `sync_type()` DDL, UDTs as model fields (including nested UDTs and UDTs
> inside collections), serialization/deserialization, and driver-level type
> registration — using Pydantic `BaseModel` as the foundation instead of
> cqlengine's metaclass machinery.

---

## Table of Contents

1. [Feature Gap Analysis](#1-feature-gap-analysis)
   - [1.1 UserType Definition](#11-usertype-definition)
   - [1.2 DDL / Schema Management](#12-ddl--schema-management)
   - [1.3 Type System Integration](#13-type-system-integration)
   - [1.4 Serialization & Deserialization](#14-serialization--deserialization)
   - [1.5 Driver Registration](#15-driver-registration)
2. [Design Decisions](#2-design-decisions)
   - [2.1 Pydantic BaseModel vs Metaclass](#21-pydantic-basemodel-vs-metaclass)
   - [2.2 Type Name Resolution](#22-type-name-resolution)
   - [2.3 Frozen Semantics](#23-frozen-semantics)
   - [2.4 Nested UDT Ordering](#24-nested-udt-ordering)
   - [2.5 Serialization Strategy](#25-serialization-strategy)
3. [Implementation Phases](#3-implementation-phases)
4. [Test Plan](#4-test-plan)
   - [4.1 Unit Tests](#41-unit-tests)
   - [4.2 Integration Tests](#42-integration-tests)
5. [Performance Benchmarks](#5-performance-benchmarks)
6. [Migration Guide](#6-migration-guide)
   - [6.1 Import Changes](#61-import-changes)
   - [6.2 Type Definition](#62-type-definition)
   - [6.3 Using UDTs in Models](#63-using-udts-in-models)
   - [6.4 Schema Sync](#64-schema-sync)
   - [6.5 Nested UDTs](#65-nested-udts)
   - [6.6 UDTs in Collections](#66-udts-in-collections)
7. [Amendments](#7-amendments)
8. [References](#8-references)

---

## 1. Feature Gap Analysis

Legend:
- ✅ **Implemented** — working in coodie today
- 🔧 **Partial** — infrastructure exists but not fully exposed
- ❌ **Missing** — not yet implemented

### 1.1 UserType Definition

| cqlengine Feature | coodie Equivalent | Status |
|---|---|---|
| `class Address(UserType)` base class | — | ❌ |
| `__type_name__` override | — | ❌ |
| `type_name()` classmethod (auto snake_case) | — | ❌ |
| Fields via `columns.*` class attributes | — | ❌ |
| `validate()` method | — | 🔧 Pydantic validation exists but no `UserType` class |
| `__eq__` / `__ne__` comparison | — | 🔧 Pydantic provides this natively |
| `__iter__`, `keys()`, `values()`, `items()` | — | 🔧 Pydantic `model_dump()` covers this |
| `has_changed_fields()` / `reset_changed_fields()` | — | ❌ |

**Gap summary — UserType definition:**
- `UserType` → create `coodie.usertype` module with `UserType(BaseModel)` base class
- `__type_name__` → add `Settings.__type_name__` override; default to snake_case of class name
- `type_name()` → classmethod that returns the CQL type name
- Field declarations → standard Pydantic type annotations (no `columns.*` needed)
- Validation → Pydantic provides this automatically via `model_validate()`
- Change tracking → out of scope for initial implementation (Pydantic models are typically immutable or replaced)

### 1.2 DDL / Schema Management

| cqlengine Feature | coodie Equivalent | Status |
|---|---|---|
| `management.sync_type(ks, type_model)` | — | ❌ |
| `CREATE TYPE IF NOT EXISTS` generation | — | ❌ |
| `ALTER TYPE ... ADD` for new fields | — | ❌ |
| `DROP TYPE IF EXISTS` generation | — | ❌ |
| Auto-sync nested UDTs before parent | — | ❌ |
| Auto-sync UDTs used in `sync_table()` | — | ❌ |
| Introspect `system_schema.types` for existing types | — | ❌ |

**Gap summary — DDL / schema management:**
- `sync_type()` → classmethod on `UserType` (sync + async variants)
- `build_create_type()` → new CQL builder function in `cql_builder.py`
- `build_drop_type()` → new CQL builder function in `cql_builder.py`
- `build_alter_type_add()` → new CQL builder function for adding fields
- Nested UDT ordering → recursive `sync_type()` on dependencies before parent
- `sync_table()` integration → detect UDT fields and sync them automatically

### 1.3 Type System Integration

| cqlengine Feature | coodie Equivalent | Status |
|---|---|---|
| `columns.UserDefinedType(MyUDT)` column type | — | ❌ |
| UDT field → `frozen<type_name>` in CQL | `Frozen` marker exists | 🔧 |
| UDT inside `list` → `list<frozen<type_name>>` | — | ❌ |
| UDT inside `set` → `set<frozen<type_name>>` | — | ❌ |
| UDT inside `map` value → `map<K, frozen<type_name>>` | — | ❌ |
| UDT inside `tuple` → `tuple<frozen<type_name>, ...>` | — | ❌ |
| Nested UDTs (UDT containing another UDT) | — | ❌ |

**Gap summary — type system integration:**
- `python_type_to_cql_type_str()` → detect `UserType` subclasses and emit `frozen<type_name>`
- Collections containing UDTs → recursively resolve inner types
- No need for a separate `UserDefinedType()` column marker — coodie auto-detects `UserType` subclasses by type introspection
- Nested UDTs → recursive type resolution in `python_type_to_cql_type_str()`

### 1.4 Serialization & Deserialization

| cqlengine Feature | coodie Equivalent | Status |
|---|---|---|
| UDT instance → CQL tuple/dict on INSERT | — | ❌ |
| CQL result row → UDT instance on SELECT | — | ❌ |
| Nested UDT serialization (recursive) | — | ❌ |
| `None` handling for optional UDT fields | — | ❌ |
| UDTs inside collections serialized correctly | — | ❌ |

**Gap summary — serialization:**
- INSERT path → `UserType.model_dump()` converts to dict; driver handles dict → CQL tuple
- SELECT path → driver returns named tuple or dict; construct `UserType(**data)`
- Nested UDTs → recursive `model_dump()` on INSERT; recursive construction on SELECT
- `None` → pass through as `None` (CQL allows null UDT fields)
- Collections → `[udt.model_dump() for udt in items]` on INSERT; `[UserType(**d) for d in items]` on SELECT

### 1.5 Driver Registration

| cqlengine Feature | coodie Equivalent | Status |
|---|---|---|
| `cluster.register_user_type(ks, type_name, cls)` | — | ❌ |
| `register_for_keyspace()` on UserType | — | ❌ |
| Keyspace-scoped registration | — | ❌ |
| acsylla driver UDT support | — | ❌ |

**Gap summary — driver registration:**
- `register_user_type()` → add method to `AbstractDriver` and implement in `CassandraDriver` / `AcsyllaDriver`
- `register_for_keyspace()` → classmethod on `UserType` that calls `driver.register_user_type()`
- Cassandra-driver: `cluster.register_user_type(keyspace, type_name, klass)`
- acsylla: register UDT via acsylla's type registration API (or handle dict-based round-trip)

---

## 2. Design Decisions

### 2.1 Pydantic BaseModel vs Metaclass

cqlengine uses a `UserTypeMetaClass` that transforms `columns.*` class
attributes into field descriptors.  coodie uses standard Pydantic models.

**Decision:** `UserType` inherits from `pydantic.BaseModel`.  Fields are
declared as standard Python type annotations:

```python
from coodie.usertype import UserType

class Address(UserType):
    street: str
    city: str
    zipcode: int
```

**Rationale:**
- Consistent with `Document(BaseModel)` — same mental model
- Full Pydantic validation, serialization, IDE autocompletion
- No custom metaclass needed — Pydantic's `ModelMetaclass` handles everything
- `model_dump()` / `model_validate()` provide serialization/deserialization

### 2.2 Type Name Resolution

cqlengine converts the class name to snake_case and truncates to 48 chars.
coodie provides a `Settings` inner class for configuration.

**Decision:** Type name resolution follows the same pattern as `Document`:

```python
class Address(UserType):
    street: str

    class Settings:
        __type_name__ = "my_address"   # explicit override
        keyspace = "my_ks"             # keyspace for sync_type()
```

Default type name: `snake_case(ClassName)` (same algorithm as `Document._get_table()`).

The `type_name()` classmethod returns the resolved name:
```python
Address.type_name()  # → "address" (auto) or "my_address" (override)
```

### 2.3 Frozen Semantics

CQL requires UDT column values to be `frozen<type_name>` when used as a
column type, inside collections, or as part of a primary key.

**Decision:** UDT fields are **always frozen** — `python_type_to_cql_type_str()`
emits `frozen<type_name>` whenever it detects a `UserType` subclass:

```python
class User(Document):
    id: Annotated[UUID, PrimaryKey()]
    addr: Address                              # → frozen<address>
    addrs: list[Address]                       # → list<frozen<address>>
    contacts: dict[str, Address]               # → map<text, frozen<address>>
    pair: tuple[Address, Address]              # → tuple<frozen<address>, frozen<address>>
    explicit: Annotated[Address, Frozen()]     # → frozen<address> (Frozen marker is redundant but accepted)
```

**Rationale:** Cassandra/ScyllaDB always requires UDTs to be frozen when
used as column types.  Non-frozen UDTs (individual field updates) are a
Cassandra 4.x feature with limited driver support and are rarely used.
Making frozen the default matches cqlengine behavior.

### 2.4 Nested UDT Ordering

When `sync_type()` or `sync_table()` encounters a UDT that references
other UDTs, the dependencies must be created first.

**Decision:** Recursive depth-first resolution:

```
sync_type(OuterUDT)
  → detect InnerUDT fields
  → sync_type(InnerUDT) first
  → CREATE TYPE outer_udt
```

`sync_table()` will extract all UDT fields from the model, topologically
sort them by dependency, and sync each before creating the table.

**Cycle detection:** Raise `InvalidQueryError` if a circular UDT dependency
is detected (CQL does not support circular UDT references).

### 2.5 Serialization Strategy

**INSERT (Python → CQL):**

```python
# UserType instance
addr = Address(street="123 Main St", city="Springfield", zipcode=62704)

# For INSERT, convert to dict via model_dump()
data = addr.model_dump()  # → {"street": "123 Main St", "city": "Springfield", "zipcode": 62704}

# The cassandra-driver accepts dicts for registered UDT columns
# acsylla accepts dicts or tuples
```

**SELECT (CQL → Python):**

```python
# cassandra-driver returns registered UDT instances (if registered) or named tuples
# acsylla returns dicts

# Reconstruct UserType from dict/named-tuple:
addr = Address(**row_data)  # or Address.model_validate(row_data)
```

**Nested UDTs:** Recursive `model_dump()` on INSERT already handles nested
BaseModel instances.  On SELECT, a custom `_deserialize_udt()` helper
recursively constructs nested `UserType` instances.

---

## 3. Implementation Phases

### Phase 1: Core UserType Module (Priority: High)

**Goal:** Create the `UserType` base class with type name resolution and Settings support.

| Task | Description |
|---|---|
| 1.1 | Create `src/coodie/usertype.py` with `UserType(BaseModel)` base class |
| 1.2 | Add `type_name()` classmethod — returns `Settings.__type_name__` or snake_case of class name |
| 1.3 | Add `Settings` inner class support with `__type_name__` and `keyspace` attributes |
| 1.4 | Add `UserTypeError` exception to `coodie/exceptions.py` |
| 1.5 | Export `UserType` from `coodie.__init__` and `coodie.usertype` |
| 1.6 | Unit tests for `UserType` class, `type_name()`, and Settings resolution |

### Phase 2: CQL Builder Support (Priority: High)

**Goal:** Generate `CREATE TYPE`, `DROP TYPE`, and `ALTER TYPE ADD` CQL statements.

| Task | Description |
|---|---|
| 2.1 | Add `build_create_type(type_name, keyspace, fields)` to `cql_builder.py` — generates `CREATE TYPE IF NOT EXISTS ks.type_name (field1 type1, field2 type2)` |
| 2.2 | Add `build_drop_type(type_name, keyspace)` to `cql_builder.py` — generates `DROP TYPE IF EXISTS ks.type_name` |
| 2.3 | Add `build_alter_type_add(type_name, keyspace, field_name, cql_type)` to `cql_builder.py` — generates `ALTER TYPE ks.type_name ADD field_name cql_type` |
| 2.4 | Unit tests for all three CQL builder functions |

### Phase 3: Type System Integration (Priority: High)

**Goal:** Make `python_type_to_cql_type_str()` recognize `UserType` subclasses and emit correct CQL types.

| Task | Description |
|---|---|
| 3.1 | Update `python_type_to_cql_type_str()` in `types.py` to detect `UserType` subclasses → return `frozen<type_name>` |
| 3.2 | Handle UDTs inside `list[MyUDT]` → `list<frozen<type_name>>` (recursive resolution) |
| 3.3 | Handle UDTs inside `set[MyUDT]` → `set<frozen<type_name>>` |
| 3.4 | Handle UDTs inside `dict[K, MyUDT]` → `map<K, frozen<type_name>>` |
| 3.5 | Handle UDTs inside `tuple[MyUDT, ...]` → `tuple<frozen<type_name>, ...>` |
| 3.6 | Handle nested UDTs — `UserType` fields containing other `UserType` subclasses |
| 3.7 | Handle `Annotated[MyUDT, Frozen()]` — accept but don't double-wrap `frozen<frozen<...>>` |
| 3.8 | Add `_extract_udt_classes(doc_cls)` helper to `schema.py` — returns all `UserType` subclasses referenced by a `Document` (direct + nested, topologically sorted) |
| 3.9 | Unit tests for all type resolution scenarios |

### Phase 4: Schema Sync — `sync_type()` (Priority: High)

**Goal:** Create and update UDT schemas in the database.

| Task | Description |
|---|---|
| 4.1 | Add `_get_existing_type_fields(type_name, keyspace)` to `CassandraDriver` — introspect `system_schema.types` |
| 4.2 | Add `_get_existing_type_fields(type_name, keyspace)` to `AcsyllaDriver` |
| 4.3 | Add `sync_type(type_name, keyspace, fields)` method to `AbstractDriver` base class |
| 4.4 | Implement `sync_type()` in `CassandraDriver` — `CREATE TYPE IF NOT EXISTS`, `ALTER TYPE ADD` for new fields |
| 4.5 | Implement `sync_type_async()` in `CassandraDriver` (asyncio bridge) |
| 4.6 | Implement `sync_type()` / `sync_type_async()` in `AcsyllaDriver` |
| 4.7 | Add `sync_type()` classmethod on `UserType` (sync variant) — resolves dependencies, calls driver |
| 4.8 | Add `sync_type()` classmethod on `UserType` (async variant in `coodie.aio`) |
| 4.9 | Integrate UDT sync into `Document.sync_table()` — auto-sync UDTs before table creation |
| 4.10 | Unit tests for `sync_type()` with mock driver |

### Phase 5: Serialization & Deserialization (Priority: High)

**Goal:** Round-trip UDT values between Python and CQL.

| Task | Description |
|---|---|
| 5.1 | Add `_serialize_udt(value)` helper — converts `UserType` instance to dict via `model_dump()`, recursively handling nested UDTs |
| 5.2 | Update `Document.save()` / `insert()` to serialize UDT fields before building INSERT CQL |
| 5.3 | Add `_deserialize_udt(udt_cls, data)` helper — constructs `UserType` from dict/named-tuple, recursively handling nested UDTs |
| 5.4 | Update `_rows_to_docs()` / result processing to deserialize UDT fields on SELECT |
| 5.5 | Handle `None` UDT values (optional fields) |
| 5.6 | Handle UDTs inside collections — serialize/deserialize `list[MyUDT]`, `set[MyUDT]`, `dict[K, MyUDT]` |
| 5.7 | Unit tests for serialization and deserialization round-trips |

### Phase 6: Driver Registration (Priority: Medium)

**Goal:** Register UDTs with the underlying driver so it can natively handle type mapping.

| Task | Description |
|---|---|
| 6.1 | Add `register_user_type(keyspace, type_name, udt_class)` to `AbstractDriver` |
| 6.2 | Implement in `CassandraDriver` — calls `cluster.register_user_type(keyspace, type_name, klass)` |
| 6.3 | Implement in `AcsyllaDriver` — use acsylla's UDT registration or dict-based fallback |
| 6.4 | Call `register_user_type()` at the end of `sync_type()` for each keyspace |
| 6.5 | Add `register_for_keyspace(keyspace)` classmethod on `UserType` |
| 6.6 | Unit tests for driver registration |

### Phase 7: Documentation & Polish (Priority: Medium)

**Goal:** Update documentation and public API exports.

| Task | Description |
|---|---|
| 7.1 | Update `docs/source/migration/from-cqlengine.md` — remove UDT from "not yet implemented" list, add migration examples |
| 7.2 | Add UDT section to `docs/source/guide/` (user guide) |
| 7.3 | Update `docs/plans/cqlengine-feature-parity.md` — mark UDT features as ✅ |
| 7.4 | Update `docs/plans/cqlengine-missing-features.md` — mark Phase A as complete |
| 7.5 | Add UDT example to demo app |
| 7.6 | Verify all public API exports in `coodie.__init__` |
| 7.7 | Integration tests: full round-trip with real ScyllaDB |

---

## 4. Test Plan

### 4.1 Unit Tests

Each phase adds unit tests alongside implementation.  Tests use the existing
`MockDriver` fixture from `tests/conftest.py`.

#### UserType Tests (`tests/test_usertype.py`)

| Test Case | Phase |
|---|---|
| Define `UserType` subclass with scalar fields — class created successfully | 1 |
| `type_name()` returns snake_case of class name (e.g., `ShippingAddress` → `shipping_address`) | 1 |
| `type_name()` returns `Settings.__type_name__` when set explicitly | 1 |
| `type_name()` lowercases the result | 1 |
| `UserType` instance created via constructor — fields set correctly | 1 |
| `UserType` instance created via `model_validate(dict)` — fields set correctly | 1 |
| `UserType` equality comparison (`==` / `!=`) works via Pydantic | 1 |
| `UserType.model_dump()` returns dict of field values | 1 |
| Nested `UserType` — outer type contains inner type as a field | 1 |
| `UserType` with optional field (`Optional[str] = None`) | 1 |
| `UserType` with collection field (`list[str]`, `dict[str, int]`) | 1 |
| `UserTypeError` raised for invalid definitions (no fields) | 1 |
| `_extract_udt_classes()` returns topologically sorted UDT dependencies | 3 |
| `_extract_udt_classes()` detects circular dependencies and raises error | 3 |

#### Type System Tests (`tests/test_types.py`)

| Test Case | Phase |
|---|---|
| `python_type_to_cql_type_str(Address)` → `frozen<address>` | 3 |
| `python_type_to_cql_type_str(Annotated[Address, Frozen()])` → `frozen<address>` (no double-wrap) | 3 |
| `python_type_to_cql_type_str(list[Address])` → `list<frozen<address>>` | 3 |
| `python_type_to_cql_type_str(set[Address])` → `set<frozen<address>>` | 3 |
| `python_type_to_cql_type_str(dict[str, Address])` → `map<text, frozen<address>>` | 3 |
| `python_type_to_cql_type_str(tuple[Address, int])` → `tuple<frozen<address>, int>` | 3 |
| Nested UDT: `python_type_to_cql_type_str(OuterUDT)` → `frozen<outer_udt>` where `OuterUDT` has `InnerUDT` field | 3 |
| Custom type name: `Address` with `__type_name__ = "addr"` → `frozen<addr>` | 3 |
| `Optional[Address]` → `frozen<address>` (unwraps Optional) | 3 |

#### CQL Builder Tests (`tests/test_cql_builder.py`)

| Test Case | Phase |
|---|---|
| `build_create_type("address", "my_ks", fields)` → `CREATE TYPE IF NOT EXISTS my_ks.address (...)` | 2 |
| `build_create_type()` with multiple fields — correct column list | 2 |
| `build_drop_type("address", "my_ks")` → `DROP TYPE IF EXISTS my_ks.address` | 2 |
| `build_alter_type_add("address", "my_ks", "phone", "text")` → `ALTER TYPE my_ks.address ADD "phone" text` | 2 |
| `build_create_type()` with UDT field → `frozen<inner_type>` in field list | 2 |

#### Schema Tests (`tests/test_schema.py`)

| Test Case | Phase |
|---|---|
| `build_schema()` on Document with UDT field → `ColumnDefinition` with `cql_type = "frozen<address>"` | 3 |
| `build_schema()` on Document with `list[Address]` field → `cql_type = "list<frozen<address>>"` | 3 |
| `build_schema()` on Document with nested UDT field → correct `cql_type` | 3 |

#### Document Tests (`tests/test_document.py`)

| Test Case | Phase |
|---|---|
| `sync_table()` auto-syncs UDTs before creating table | 4 |
| `save()` serializes UDT field to dict | 5 |
| `save()` serializes nested UDT field recursively | 5 |
| `save()` serializes `list[MyUDT]` field | 5 |
| `get()` deserializes UDT field from dict | 5 |
| `get()` deserializes nested UDT field | 5 |
| `get()` deserializes `list[MyUDT]` field | 5 |
| `get()` handles `None` UDT field | 5 |

### 4.2 Integration Tests

Integration tests run against a real ScyllaDB container and are marked with
`@pytest.mark.integration`.

#### `tests/integration/test_udt.py`

| Test Area | Test Cases | Phase |
|---|---|---|
| **Type creation** | `sync_type()` creates type; verify via `system_schema.types` | 4 |
| **Type idempotency** | `sync_type()` called twice — no error, no duplicate | 4 |
| **Type add field** | Add field to `UserType`; `sync_type()` runs `ALTER TYPE ADD`; verify new field | 4 |
| **Simple UDT round-trip** | Insert `Document` with `Address` field; read back; verify field values | 5 |
| **Nested UDT round-trip** | `UserType` containing another `UserType`; insert + read; verify nested values | 5 |
| **UDT in list** | `list[Address]` field; insert list of 3 addresses; read back; verify all 3 | 5 |
| **UDT in set** | `set[Address]` field; insert set; read back; verify elements (frozen UDTs are comparable) | 5 |
| **UDT in map value** | `dict[str, Address]` field; insert map; read back; verify keys and values | 5 |
| **UDT in tuple** | `tuple[Address, int]` field; insert tuple; read back; verify elements | 5 |
| **Null UDT field** | Insert `Document` with `Optional[Address] = None`; read back; verify `None` | 5 |
| **Auto-sync from sync_table** | Define `Document` with UDT field; call `sync_table()` (not `sync_type()`); verify type exists | 4 |
| **Multiple UDTs** | Two different UDT types in same model; both synced and round-tripped | 4, 5 |
| **Driver registration** | After `sync_type()`, driver returns native UDT instances (not raw dicts) | 6 |
| **Custom type name** | `UserType` with `__type_name__ = "custom_addr"`; verify created with custom name | 4 |
| **UDT with all scalar types** | UDT with `str`, `int`, `float`, `bool`, `UUID`, `datetime`, `Decimal`, `bytes` fields | 5 |
| **Async round-trip** | Same as simple round-trip but using `coodie.aio.Document` | 5 |

---

## 5. Performance Benchmarks

UDT benchmarks compare coodie vs cqlengine for UDT-related operations.

### 5.1 Write Operations

| Benchmark | cqlengine Operation | coodie Operation | Phase |
|---|---|---|---|
| Single INSERT with UDT field | `Model.create(addr=Address(...))` | `Document(addr=Address(...)).save()` | 5 |
| INSERT with nested UDT | `Model.create(contact=Contact(...))` | `Document(contact=Contact(...)).save()` | 5 |
| INSERT with `list[UDT]` | `Model.create(addrs=[Address(...), ...])` | `Document(addrs=[Address(...), ...]).save()` | 5 |
| Batch INSERT 10 rows with UDT | `BatchQuery` context | `BatchQuery` context | 5 |

### 5.2 Read Operations

| Benchmark | cqlengine Operation | coodie Operation | Phase |
|---|---|---|---|
| GET by PK with UDT field | `Model.objects.get(pk=val)` | `Document.get(pk=val)` | 5 |
| GET with nested UDT | `Model.objects.get(pk=val)` | `Document.get(pk=val)` | 5 |
| GET with `list[UDT]` | `Model.objects.get(pk=val)` | `Document.get(pk=val)` | 5 |
| Filter 100 rows with UDT field | `.filter(...).limit(100)` | `.find(...).limit(100).all()` | 5 |

### 5.3 Schema / DDL

| Benchmark | cqlengine Operation | coodie Operation | Phase |
|---|---|---|---|
| `sync_type` (create) | `management.sync_type(ks, Address)` | `Address.sync_type()` | 4 |
| `sync_type` (no-op) | `management.sync_type(ks, Address)` 2nd call | `Address.sync_type()` 2nd call | 4 |
| `sync_table` with UDT auto-sync | `management.sync_table(Model)` | `Document.sync_table()` | 4 |

### 5.4 Serialization / Deserialization

| Benchmark | What It Measures | Phase |
|---|---|---|
| UDT `model_dump()` (5 fields) | Time to convert UserType to dict for INSERT | 5 |
| UDT construction from dict (5 fields) | Time to construct UserType from query result | 5 |
| Nested UDT serialization (2 levels) | Recursive `model_dump()` overhead | 5 |
| `list[UDT]` serialization (10 items) | Collection of UDTs to list of dicts | 5 |

### 5.5 Performance Targets

| Metric | Target |
|---|---|
| Single INSERT with UDT field | ≤ 1.3× cqlengine |
| Single GET with UDT field | ≤ 1.2× cqlengine |
| UDT serialization (model_dump) | ≤ 1.5× cqlengine (Pydantic validation overhead) |
| UDT deserialization (model_validate) | ≤ 1.5× cqlengine |
| `sync_type` DDL | ≤ 1.1× cqlengine |

---

## 6. Migration Guide

### 6.1 Import Changes

| Before (cqlengine) | After (coodie) |
|---|---|
| `from cassandra.cqlengine.usertype import UserType` | `from coodie.usertype import UserType` |
| `from cassandra.cqlengine import columns` | `from typing import Annotated` (no marker needed for UDT fields) |
| `from cassandra.cqlengine.management import sync_type` | `Address.sync_type()` (called on the class) |

### 6.2 Type Definition

#### cqlengine

```python
from cassandra.cqlengine.usertype import UserType
from cassandra.cqlengine import columns

class Address(UserType):
    __type_name__ = "address"

    street = columns.Text()
    city = columns.Text()
    state = columns.Text()
    zipcode = columns.Integer()
```

#### coodie

```python
from coodie.usertype import UserType

class Address(UserType):
    street: str
    city: str
    state: str
    zipcode: int

    class Settings:
        __type_name__ = "address"   # optional — defaults to "address" (snake_case of class name)
```

### 6.3 Using UDTs in Models

#### cqlengine

```python
from cassandra.cqlengine.models import Model
from cassandra.cqlengine import columns

class User(Model):
    id = columns.UUID(primary_key=True)
    name = columns.Text()
    home_address = columns.UserDefinedType(Address)
    work_address = columns.UserDefinedType(Address)
```

#### coodie

```python
from coodie.sync import Document
from coodie import PrimaryKey

class User(Document):
    id: Annotated[UUID, PrimaryKey()]
    name: str
    home_address: Address                    # auto-detected as frozen<address>
    work_address: Address
    alt_addresses: list[Address] = []        # list<frozen<address>>
    contacts: dict[str, Address] = {}        # map<text, frozen<address>>

    class Settings:
        keyspace = "my_ks"
```

### 6.4 Schema Sync

#### cqlengine

```python
from cassandra.cqlengine.management import sync_type, sync_table

# Must sync type before table
sync_type("my_ks", Address)
sync_table(User)
```

#### coodie

```python
# Option A: explicit sync_type (if needed independently)
Address.sync_type()         # sync
await Address.sync_type()   # async

# Option B: sync_table auto-syncs UDTs (recommended)
User.sync_table()           # auto-syncs Address type first, then creates table
await User.sync_table()     # async variant
```

### 6.5 Nested UDTs

#### cqlengine

```python
class PhoneNumber(UserType):
    country_code = columns.Text()
    number = columns.Text()

class Contact(UserType):
    name = columns.Text()
    phone = columns.UserDefinedType(PhoneNumber)
    address = columns.UserDefinedType(Address)

# Must sync in dependency order:
sync_type("my_ks", PhoneNumber)
sync_type("my_ks", Address)
sync_type("my_ks", Contact)
```

#### coodie

```python
class PhoneNumber(UserType):
    country_code: str
    number: str

class Contact(UserType):
    name: str
    phone: PhoneNumber
    address: Address

# Auto-resolves dependency order:
Contact.sync_type()   # syncs PhoneNumber, Address, then Contact
```

### 6.6 UDTs in Collections

#### cqlengine

```python
class Team(Model):
    id = columns.UUID(primary_key=True)
    members = columns.List(columns.UserDefinedType(Contact))
    offices = columns.Map(columns.Text, columns.UserDefinedType(Address))
```

#### coodie

```python
class Team(Document):
    id: Annotated[UUID, PrimaryKey()]
    members: list[Contact] = []           # list<frozen<contact>>
    offices: dict[str, Address] = {}      # map<text, frozen<address>>
```

---

## 7. Amendments

*No amendments yet.*

---

## 8. References

### cqlengine UDT Documentation

- [cassandra.cqlengine.usertype](https://python-driver.docs.scylladb.com/stable/api/cassandra/cqlengine/usertype.html) — UserType class API
- [cassandra.cqlengine.management.sync_type](https://python-driver.docs.scylladb.com/stable/api/cassandra/cqlengine/management.html#cassandra.cqlengine.management.sync_type) — sync_type function
- [cassandra.cqlengine.columns.UserDefinedType](https://python-driver.docs.scylladb.com/stable/api/cassandra/cqlengine/columns.html#cassandra.cqlengine.columns.UserDefinedType) — column type for UDTs
- [cqlengine UserType source](https://github.com/scylladb/python-driver/blob/master/cassandra/cqlengine/usertype.py) — reference implementation

### CQL UDT Documentation

- [CQL User-Defined Types](https://cassandra.apache.org/doc/latest/cql/types.html#user-defined-types) — CQL syntax reference
- [CREATE TYPE](https://cassandra.apache.org/doc/latest/cql/ddl.html#create-type) — DDL reference
- [ALTER TYPE](https://cassandra.apache.org/doc/latest/cql/ddl.html#alter-type) — schema evolution
- [DROP TYPE](https://cassandra.apache.org/doc/latest/cql/ddl.html#drop-type) — cleanup

### coodie Internal References

- [Feature parity plan — §1.5 UDT](cqlengine-feature-parity.md#15-user-defined-types-udt) — gap analysis
- [Missing features plan — Phase A](cqlengine-missing-features.md#phase-a-user-defined-types-udt--future) — original task list
- [Migration guide](../source/migration/from-cqlengine.md) — cqlengine → coodie migration
- `src/coodie/types.py` — `python_type_to_cql_type_str()` type system
- `src/coodie/schema.py` — `build_schema()` schema introspection
- `src/coodie/cql_builder.py` — CQL generation functions
- `src/coodie/fields.py` — annotation markers (`Frozen`, etc.)
- `src/coodie/drivers/base.py` — `AbstractDriver` interface
- `src/coodie/drivers/cassandra.py` — `CassandraDriver` implementation
- `src/coodie/drivers/acsylla.py` — `AcsyllaDriver` implementation
