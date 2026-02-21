# Integration Test Coverage

This document describes what is (and is not) exercised by `tests/test_integration.py`
against a real ScyllaDB instance.

---

## Covered features

### DDL / schema management
| Feature | Test class / method |
|---|---|
| `sync_table()` — CREATE TABLE IF NOT EXISTS | `TestSyncIntegration.test_sync_table_creates_table`, `TestAsyncIntegration.test_sync_table_creates_table` |
| `sync_table()` idempotency (call twice) | `TestSyncIntegration.test_sync_table_idempotent`, `TestAsyncIntegration.test_sync_table_idempotent` |
| Secondary index creation (`Indexed` field) | implicit in all `SyncProduct` / `AsyncProduct` tests (`brand`, `category` columns) |
| Schema migration — `ALTER TABLE ADD column` | `TestSyncExtended.test_schema_migration_add_column` |
| Composite partition key (`PrimaryKey(partition_key_index=N)`) | `TestSyncExtended.test_composite_pk_and_clustering`, `TestAsyncExtended.test_composite_pk_and_clustering` |
| Multiple clustering columns (`ClusteringKey(clustering_key_index=N)`) | `SyncEvent` / `AsyncEvent` models used in extended tests |
| Clustering ORDER (ASC + DESC per column) | `TestSyncExtended.test_clustering_asc_order`, `TestSyncIntegration.test_clustering_key_order`, `TestAsyncIntegration.test_clustering_key_order` |

### CQL scalar types
| Python type | CQL type | Test |
|---|---|---|
| `str` | `text` | All `SyncProduct` / `AsyncProduct` tests |
| `int` | `int` | `TestSyncExtended.test_scalar_types_roundtrip`, `TestAsyncExtended.test_scalar_types_roundtrip` |
| `float` | `float` | same |
| `bool` | `boolean` | same |
| `bytes` | `blob` | same |
| `decimal.Decimal` | `decimal` | same |
| `datetime` | `timestamp` | same |
| `date` | `date` | same |
| `uuid.UUID` | `uuid` | same (all PK columns) |
| `ipaddress.IPv4Address` | `inet` | same |
| `ipaddress.IPv6Address` | `inet` | same |

### Collection types
| Python type | CQL type | Test |
|---|---|---|
| `list[str]` | `list<text>` | `TestSyncIntegration.test_collections_list`, `TestAsyncIntegration.test_collections_list` |
| `set[str]` | `set<text>` | `TestSyncExtended.test_set_collection_roundtrip`, `TestAsyncExtended.test_set_collection_roundtrip` |
| `dict[str, int]` | `map<text, int>` | `TestSyncExtended.test_map_collection_roundtrip`, `TestAsyncExtended.test_map_collection_roundtrip` |

### Write operations
| Feature | Test |
|---|---|
| `save()` — upsert / INSERT | All CRUD tests |
| `insert()` — INSERT IF NOT EXISTS (LWT) | `TestSyncExtended.test_insert_if_not_exists_*`, `TestAsyncExtended.test_insert_if_not_exists` |
| `save(ttl=N)` — TTL | `TestSyncIntegration.test_ttl_row_expires`, `TestAsyncIntegration.test_ttl_row_expires` |
| `document.delete()` — DELETE by PK | `TestSyncIntegration.test_delete`, `TestAsyncIntegration.test_delete` |
| Batch writes (`build_batch`) | `TestSyncExtended.test_batch_insert`, `TestAsyncExtended.test_batch_insert` |

### Read operations
| Feature | Test |
|---|---|
| `find_one()` | `TestSyncIntegration.test_save_and_find_one`, `TestAsyncIntegration.test_save_and_find_one` |
| `get()` — raises `DocumentNotFound` | `TestSyncIntegration.test_get_by_pk`, `TestAsyncIntegration.test_get_by_pk` |
| `find()` + `all()` | `TestSyncIntegration.test_save_write_read_cycle` etc. |
| `QuerySet.filter()` with secondary index | `TestSyncIntegration.test_queryset_filtering_by_secondary_index` etc. |
| `QuerySet.limit()` | `TestSyncIntegration.test_queryset_limit` |
| `QuerySet.count()` | `TestSyncIntegration.test_queryset_count` |
| `QuerySet.first()` | `TestSyncExtended.test_queryset_first`, `TestAsyncExtended.test_queryset_first` |
| `QuerySet.order_by()` | `TestSyncExtended.test_queryset_order_by_clustering` |
| `QuerySet.allow_filtering()` | multiple tests |
| `QuerySet.delete()` (bulk) | `TestSyncIntegration.test_queryset_delete`, `TestAsyncIntegration.test_queryset_delete` |
| `__iter__` (sync QuerySet) | `TestSyncExtended.test_queryset_iter` |
| `__len__` (sync QuerySet) | `TestSyncExtended.test_queryset_len` |
| `__aiter__` (async QuerySet) | `TestAsyncIntegration.test_aiter` |
| `MultipleDocumentsFound` | `TestSyncIntegration.test_multiple_documents_found`, `TestAsyncIntegration.test_multiple_documents_found` |

### Optional fields
| Feature | Test |
|---|---|
| `Optional[str]` — None round-trip | `TestSyncIntegration.test_optional_field_none_roundtrip` |
| `Optional[str]` — value round-trip | `TestSyncIntegration.test_optional_field_value_roundtrip`, `TestAsyncIntegration.test_optional_field_roundtrip` |

### Multi-model isolation
| Feature | Test |
|---|---|
| Two document classes → separate tables | `TestSyncIntegration.test_multi_model_isolation`, `TestAsyncIntegration.test_multi_model_isolation` |

---

## Features NOT covered — and why

### Materialized Views
**Status: not implemented in coodie.**
The codebase has no API for CREATE MATERIALIZED VIEW / DROP MATERIALIZED VIEW.
Scylla/Cassandra materialized views require explicit DDL and have restrictions
(base table must have all PK columns of the view). Until a `MaterializedView`
abstraction is added to coodie, integration tests cannot cover this feature.

### Pagination (paging_state / fetch_next_page)
**Status: not implemented in coodie.**
The `QuerySet` API has no `fetch_size`, `paging_state`, or async page-iteration
support. `cassandra-driver` exposes `ResultSet.paging_state` / `fetch_next_page()`
but coodie does not plumb those through. When this is implemented, tests should
cover: full-table scans of >fetch_size rows, page-token hand-off, and async
paged iteration.

### UPDATE with IF conditions (LWT)
**Status: `build_update` in `cql_builder.py` supports `if_conditions`, but there
is no Document-level API to trigger it.**
`Document.save()` always generates a plain INSERT (upsert), not an UPDATE with
a conditional `IF col = ?` clause. Until a `document.update(if_conditions={...})`
or `QuerySet.update(set_data, if_conditions)` method is added, this cannot be
tested end-to-end through the public API.

### Counter columns
**Status: partially implemented — `Counter` field marker exists in `fields.py`
and is recognised by `schema.py` (emits `counter` CQL type) — but there is no
`increment()` / `decrement()` API on Document.**
Cassandra counter tables have strict rules: a table with a counter column can
*only* contain counter columns (plus PK columns); INSERT is not valid —
only `UPDATE … SET col = col + ?` is allowed. Because `Document.save()` issues
an INSERT, saving a counter document would raise a server error. Tests are
omitted until a dedicated counter API is provided.

### `build_update` (raw UPDATE statements)
**Status: `build_update` and `build_delete` with column-list are implemented
in `cql_builder.py` but are not exposed via the Document or QuerySet API.**
They can be invoked directly via `driver.execute()` with a hand-crafted CQL
string; however, the public-facing API does not yet surface UPDATE semantics
(partial field updates, TTL on UPDATE, IF conditions). Tests will be added once
the high-level API wraps these builders.

### `build_select` with `per_partition_limit`
**Status: `per_partition_limit` is accepted by `build_select` in `cql_builder.py`
but the `QuerySet` API has no `.per_partition_limit(n)` method.**
Once exposed on `QuerySet` this should be tested with a multi-row-per-partition
model to assert that exactly N rows are returned per partition key.

### Secondary index with custom `index_name`
**Status: `Indexed(index_name="my_idx")` is handled by `build_create_index` and
`schema.py`, but the existing tests only use the default auto-generated name.**
A targeted test verifying that a named index is created and queryable is a low
priority but straightforward addition.

### AcsyllaDriver (async native driver)
**Status: `src/coodie/drivers/acsylla.py` exists but requires the `acsylla`
native C extension which is not installed in the CI image.**
All async integration tests run through the `CassandraDriver` asyncio bridge.
A separate workflow targeting the `acsylla` driver can be added when that
dependency is available.
