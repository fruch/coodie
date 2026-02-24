# Test Refactoring Plan

This document describes a concrete plan for refactoring the coodie test suite.
The goals are:

- **Reduce repetition** by replacing groups of near-identical tests with
  `pytest.mark.parametrize`.
- **Split large files** into focused modules that are easier to navigate
  and maintain.
- **Eliminate sync/async duplication** in unit and integration tests by
  introducing shared fixtures and parametrized helpers.

---

## Current state

| File | Lines | Problem |
|---|---|---|
| `tests/test_integration.py` | ~2,435 | Monolithic; every sync test has an async twin |
| `tests/sync/test_document.py` | ~699 | Mirrors `aio/test_document.py` almost exactly |
| `tests/aio/test_document.py` | ~609 | Mirrors `sync/test_document.py` almost exactly |
| `tests/test_cql_builder.py` | ~706 | Many single-case functions that differ only in input/output |
| `tests/test_types.py` | ~242 | One function per Python→CQL type mapping |

---

## Refactoring 1 — Parametrize `test_types.py`

### Problem

`test_types.py` contains ~13 individual functions that all follow the same
pattern: call `python_type_to_cql_type_str(X)` and assert the result equals
some CQL string.

```python
# current — repeated 13 times
def test_str_to_text():
    assert python_type_to_cql_type_str(str) == "text"

def test_int_to_int():
    assert python_type_to_cql_type_str(int) == "int"

def test_float_to_float():
    assert python_type_to_cql_type_str(float) == "float"
# … and so on
```

### Solution

Replace the group with a single parametrized test:

```python
import pytest
from datetime import date, datetime
from decimal import Decimal
from ipaddress import IPv4Address
from uuid import UUID
from typing import Optional
from typing import Annotated
from coodie.fields import PrimaryKey
from coodie.types import python_type_to_cql_type_str

@pytest.mark.parametrize("python_type, expected_cql", [
    (str,           "text"),
    (int,           "int"),
    (float,         "float"),
    (bool,          "boolean"),
    (bytes,         "blob"),
    (UUID,          "uuid"),
    (datetime,      "timestamp"),
    (date,          "date"),
    (Decimal,       "decimal"),
    (IPv4Address,   "inet"),
    (list[str],     "list<text>"),
    (set[int],      "set<int>"),
    (dict[str,int], "map<text, int>"),
    (Optional[str], "text"),
    (Annotated[UUID, PrimaryKey()], "uuid"),
])
def test_python_type_to_cql_type_str(python_type, expected_cql):
    assert python_type_to_cql_type_str(python_type) == expected_cql
```

The existing tests for `coerce_row_none_collections` can also be collapsed:

```python
@pytest.mark.parametrize("annotation, input_val, expected", [
    (list[str],       None,   []),
    (set[str],        None,   set()),
    (dict[str, int],  None,   {}),
    (list[str],       ["x"],  ["x"]),   # non-None left alone
    (str,             None,   None),    # scalar None left alone
])
def test_coerce_row_none_collections(annotation, input_val, expected):
    class _Doc:
        x: annotation
    result = coerce_row_none_collections({"x": input_val}, _Doc)
    assert result["x"] == expected
```

---

## Refactoring 2 — Parametrize `test_cql_builder.py`

### Problem

Several groups of tests in `test_cql_builder.py` exercise the same builder
function with slightly different inputs.

#### 2a — `parse_filter_kwargs` operator variants

```python
# current
def test_parse_filter_kwargs_eq():      ...
def test_parse_filter_kwargs_operators():  ...
def test_parse_filter_kwargs_in():      ...
def test_parse_filter_kwargs_like():    ...
```

#### Solution

```python
@pytest.mark.parametrize("kwargs, expected_triples", [
    ({"name": "Alice"},              [("name", "=",    "Alice")]),
    ({"rating__gte": 4},             [("rating", ">=", 4)]),
    ({"price__lt": 100},             [("price", "<",   100)]),
    ({"id__in": [1, 2, 3]},          [("id", "IN",    [1, 2, 3])]),
    ({"name__like": "Al%"},          [("name", "LIKE", "Al%")]),
])
def test_parse_filter_kwargs(kwargs, expected_triples):
    result = parse_filter_kwargs(kwargs)
    for triple in expected_triples:
        assert triple in result
```

#### 2b — `build_update` collection operations

The four collection-op tests (`add`, `remove`, `append`, `prepend`) share the
same structure:

```python
@pytest.mark.parametrize("op, value, fragment", [
    ("add",     {"new_tag"}, '"tags" = "tags" + ?'),
    ("remove",  {"old_tag"}, '"tags" = "tags" - ?'),
    ("append",  ["z"],       '"items" = "items" + ?'),
    ("prepend", ["a"],       '"items" = ? + "items"'),
])
def test_build_update_collection_ops(op, value, fragment):
    col = "tags" if op in ("add", "remove") else "items"
    cql, params = build_update(
        "products", "ks",
        set_data={},
        where=[("id", "=", "1")],
        collection_ops=[(col, op, value)],
    )
    assert fragment in cql
    assert params == [value, "1"]
```

#### 2c — `build_insert`/`build_update` USING clause variants

```python
@pytest.mark.parametrize("kwargs, fragment", [
    ({"ttl": 60},                                "USING TTL 60"),
    ({"timestamp": 1234567890},                  "USING TIMESTAMP 1234567890"),
    ({"ttl": 60, "timestamp": 1234567890},       "USING TTL 60 AND TIMESTAMP 1234567890"),
])
def test_build_insert_using_clause(kwargs, fragment):
    cql, _ = build_insert("products", "ks", {"id": "1"}, **kwargs)
    assert fragment in cql
```

---

## Refactoring 3 — Eliminate sync/async duplication in unit tests

### Problem

`tests/sync/test_document.py` and `tests/aio/test_document.py` are nearly
identical. Every test in the sync file has a corresponding async twin. The
only difference is that async tests `await` method calls and use
`AsyncDocument` instead of `Document`.

### Solution — shared parametrized base

Extract the shared logic into a `tests/document_cases.py` module and
`conftest.py` fixtures, then call from both sync and async test files.

**Step 1 — `tests/conftest.py` additions**

Add a `doc_module` parametrized fixture that provides both module variants in
one run:

```python
# tests/conftest.py  (additions)
import pytest

@pytest.fixture(params=["sync", "async"], ids=["sync", "async"])
def doc_module(request):
    """Yield the sync or async document module."""
    if request.param == "sync":
        import coodie.sync.document as m
    else:
        import coodie.aio.document as m
    return m
```

**Step 2 — shared helper in `tests/document_cases.py`**

```python
# tests/document_cases.py
"""
Shared parametrized test logic for sync and async Document.

Each public function returns a coroutine-or-value so both the sync
and async test files can drive it.  The sync file calls `run()`,
the async file calls `await run()`.
"""
import inspect


def maybe_await(value):
    """Return value; if it's a coroutine, schedule it for the caller to await."""
    return value


async def save_produces_insert(Doc, driver):
    """Document.save() must produce an INSERT statement."""
    doc = Doc(name="Widget")
    result = doc.save()
    if inspect.isawaitable(result):
        await result
    stmt, _ = driver.executed[-1]
    assert "INSERT INTO" in stmt
```

**Step 3 — thin wrapper files**

`tests/sync/test_document.py` keeps its own model definitions (they need
distinct `Settings.name` values) but delegates assertions to the shared
helpers.

`tests/aio/test_document.py` does the same with `await`.

> **Alternative (simpler)**: keep two separate files but extract the
> model class definitions into a shared `tests/models.py` module to avoid
> redefining the same Pydantic models twice.

---

## Refactoring 4 — Split `test_integration.py`

### Problem

`test_integration.py` is 2,400+ lines. It contains 12+ test classes across 6
distinct feature areas. Every sync class has an async twin.

### Proposed module split

```
tests/
  integration/
    __init__.py
    conftest.py          ← moved from tests/ (session fixtures + models)
    test_basic.py        ← TestSyncIntegration + TestAsyncIntegration
    test_raw_cql.py      ← TestSyncRawCQL + TestAsyncRawCQL
    test_keyspace.py     ← TestSyncKeyspaceManagement + TestAsyncKeyspaceManagement
    test_extended.py     ← TestSyncExtended + TestAsyncExtended
    test_views.py        ← TestSyncMaterializedView + TestAsyncMaterializedView
```

Rules for each module:
- All files are marked `pytestmark = pytest.mark.integration`.
- Session fixtures (`scylla_container`, `scylla_session`, `coodie_driver`) live
  in `tests/integration/conftest.py` and are shared by all submodules.
- Document model definitions live in `tests/integration/models.py`.

### Further reduction — parametrize over sync/async

Inside each split module the sync and async test classes remain similar.
A clean way to merge them is a pytest **indirect parametrize** over the
document class pair:

```python
# tests/integration/conftest.py  (addition)
import pytest
from .models import SyncProduct, AsyncProduct, SyncReview, AsyncReview

@pytest.fixture(
    params=[
        pytest.param("sync",  marks=[]),
        pytest.param("async", marks=[pytest.mark.asyncio(loop_scope="session")]),
    ],
    ids=["sync", "async"],
)
def product_cls(request):
    return SyncProduct if request.param == "sync" else AsyncProduct
```

Then a single test handles both variants:

```python
# tests/integration/test_basic.py
import pytest

pytestmark = pytest.mark.integration

async def test_save_and_find_one(coodie_driver, product_cls):
    Product = product_cls
    await _maybe_sync(Product.sync_table)
    pid = uuid4()
    doc = Product(id=pid, name="Widget")
    await _maybe_sync(doc.save)
    fetched = await _maybe_sync(Product.find_one, id=pid)
    assert fetched is not None
    assert fetched.name == "Widget"
```

Where `_maybe_sync` is a tiny helper in `conftest.py`:

```python
import asyncio, inspect

async def _maybe_sync(fn, *args, **kwargs):
    result = fn(*args, **kwargs)
    if inspect.isawaitable(result):
        return await result
    return result
```

This cuts the integration test count roughly in half while exercising
both sync and async code paths.

---

## Refactoring 5 — Extended-type roundtrip parametrization

### Problem

`TestSyncExtended` and `TestAsyncExtended` each repeat the same roundtrip
pattern for eight extended CQL types (`BigInt`, `SmallInt`, `TinyInt`,
`VarInt`, `Double`, `Ascii`, `TimeUUID`, `Time`).  Each gets its own test
method with identical structure.

### Solution

```python
from coodie.fields import BigInt, SmallInt, TinyInt, VarInt, Double, Ascii, TimeUUID, Time

@pytest.mark.parametrize("field_name, write_val, read_check", [
    ("big",   2**40,                lambda v: v == 2**40),
    ("small", 32_000,               lambda v: v == 32_000),
    ("tiny",  127,                  lambda v: v == 127),
    ("var",   10**30,               lambda v: v == 10**30),
    ("dbl",   3.14,                 lambda v: abs(v - 3.14) < 1e-9),
    ("ascii_val", "hello",          lambda v: v == "hello"),
])
async def test_extended_type_roundtrip(coodie_driver, field_name, write_val, read_check, ...):
    ...
```

---

## Implementation order

The refactorings are independent; each can be merged separately.

| Step | File(s) changed | Effort |
|------|----------------|--------|
| 1 | `tests/test_types.py` | Low — pure collapse |
| 2 | `tests/test_cql_builder.py` | Low — pure collapse |
| 3 | `tests/sync/test_document.py`, `tests/aio/test_document.py` | Medium — extract shared models |
| 4 | `tests/test_integration.py` → `tests/integration/` | Medium — split + move session fixtures |
| 5 | `tests/integration/test_extended.py` | Low after step 4 |

---

## Conventions when adding new tests

1. **Always use `pytest.mark.parametrize`** when testing the same function
   with multiple input/output pairs instead of writing one function per case.

2. **Group parametrize IDs** with `pytest.param(..., id="description")` so
   failure output is readable:
   ```python
   @pytest.mark.parametrize("op, val, fragment", [
       pytest.param("add",    {"t"}, '"x" = "x" + ?', id="add"),
       pytest.param("remove", {"t"}, '"x" = "x" - ?', id="remove"),
   ])
   ```

3. **Shared model definitions** go in a module-level `models.py` (or
   `conftest.py`), never duplicated across files.

4. **Sync/async parity tests** should live in the same function using a
   `_maybe_sync` helper rather than duplicated sync and async test classes.

5. **Session-scoped fixtures** for expensive resources (DB containers, driver
   setup) belong in `conftest.py`.  Function-scoped fixtures that clear state
   (e.g. `registered_mock_driver`) stay function-scoped.

6. **File size guideline**: aim for < 400 lines per test file.  If a file
   grows beyond 500 lines, consider splitting it by feature area.

---

## Running the refactored tests

After applying the changes, the existing test commands continue to work:

```bash
# Unit tests (no Docker required)
uv run pytest tests/ -v --ignore=tests/integration

# Integration tests
uv run pytest -m integration -v --timeout=120
uv run pytest -m integration -v --timeout=120 --driver-type=acsylla
```
