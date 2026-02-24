# Sync/Async Test Deduplication

Strategies for eliminating mirrored sync and async test classes in the coodie test suite.

---

## The Problem

The coodie codebase has parallel sync and async APIs:
- `coodie.sync.document.Document` (sync)
- `coodie.aio.document.Document` (async)

This leads to mirrored test files:
- `tests/sync/test_document.py` (~699 lines)
- `tests/aio/test_document.py` (~609 lines)

And mirrored test classes in integration tests:
- `TestSyncCRUD` / `TestAsyncCRUD`
- `TestSyncExtended` / `TestAsyncExtended`

The test logic is identical — only the `await` keyword differs.

---

## Strategy 1: The `_maybe_await` Helper

A simple helper that calls a function and awaits the result only if it's a coroutine:

```python
# tests/conftest.py
import inspect

async def _maybe_await(fn, *args, **kwargs):
    """Call fn(*args, **kwargs); await the result if it's a coroutine."""
    result = fn(*args, **kwargs)
    if inspect.isawaitable(result):
        return await result
    return result
```

### Usage in Tests

```python
# tests/test_document.py — single file replaces both sync/ and aio/ versions
import pytest

@pytest.fixture(params=["sync", "async"], ids=["sync", "async"])
def document_cls(request):
    if request.param == "sync":
        from coodie.sync.document import Document
        return Document
    else:
        from coodie.aio.document import Document
        return Document

async def test_save_and_find(document_cls, _maybe_await):
    # Define model inline or import from shared models
    # This runs twice: once with sync Document, once with async Document
    doc = MyModel(id=uuid4(), name="test")
    await _maybe_await(doc.save)
    found = await _maybe_await(MyModel.find_one, id=doc.id)
    assert found.name == "test"
```

### When to Use

- Unit tests where sync and async Document subclasses have identical interfaces
- Integration tests where the test logic is the same for both variants
- Any test that only uses Document methods (`.save()`, `.find_one()`, `.filter()`, etc.)

### When NOT to Use

- Tests that specifically test async-only behavior (e.g., `asyncio.gather` with multiple queries)
- Tests that specifically test sync-only behavior (e.g., thread-safety)
- Tests where the sync and async APIs intentionally differ

---

## Strategy 2: Shared Model Definitions

Extract model classes used by multiple test files into a shared module.

### Before (duplicated across files)

```python
# tests/sync/test_document.py
class Product(SyncDocument):
    class Settings:
        name = "products"
    id: Annotated[UUID, PrimaryKey()]
    name: str
    price: float

# tests/aio/test_document.py  (identical!)
class Product(AsyncDocument):
    class Settings:
        name = "products"
    id: Annotated[UUID, PrimaryKey()]
    name: str
    price: float
```

### After (shared definition)

```python
# tests/conftest.py or tests/models.py
from coodie.sync.document import Document as SyncDocument
from coodie.aio.document import Document as AsyncDocument

def _make_product(base_cls):
    """Factory that creates a Product model from either sync or async base."""
    class Product(base_cls):
        class Settings:
            name = "products"
        id: Annotated[UUID, PrimaryKey()]
        name: str
        price: float
    return Product

SyncProduct = _make_product(SyncDocument)
AsyncProduct = _make_product(AsyncDocument)
```

### Important: PEP 563 Caveat

Do **not** use `from __future__ import annotations` in files that define Document subclasses inside functions. PEP 563 (active when `from __future__ import annotations` is used, default in Python < 3.14) stores annotations as strings, and `get_type_hints()` cannot resolve them for classes defined in local scope, causing coodie's `build_schema()` to return empty columns.

Define model factories at module level, or ensure the file does not import `annotations` from `__future__`. This caveat may be resolved by PEP 649 (deferred evaluation, accepted for Python 3.14+).

---

## Strategy 3: Fixture Parametrization for Integration Tests

For integration tests that need a running database, parametrize the model class via a fixture:

```python
# tests/integration/conftest.py
import pytest

@pytest.fixture(
    params=[
        pytest.param("sync", id="sync"),
        pytest.param("async", id="async"),
    ],
)
def product_cls(request):
    """Yield sync or async Product class."""
    if request.param == "sync":
        return SyncProduct
    return AsyncProduct
```

Then tests receive the model via the fixture and use `_maybe_await`:

```python
async def test_crud_roundtrip(product_cls, _maybe_await):
    pid = uuid4()
    doc = product_cls(id=pid, name="Widget", price=9.99)
    await _maybe_await(doc.save)

    fetched = await _maybe_await(product_cls.find_one, id=pid)
    assert fetched is not None
    assert fetched.name == "Widget"
```

This cuts integration test count roughly in half while exercising both code paths.

---

## Strategy 4: Splitting `test_integration.py`

The monolithic `tests/test_integration.py` (~2,435 lines) should be split into a package:

```
tests/integration/
├── __init__.py
├── conftest.py          # session fixtures, _maybe_await, model factories
├── test_basic.py        # CRUD: save, find_one, filter, delete, update
├── test_raw_cql.py      # raw CQL execution tests
├── test_keyspace.py     # keyspace create/drop/sync
├── test_extended.py     # extended type roundtrips (BigInt, SmallInt, etc.)
└── test_views.py        # materialized view tests
```

### Migration Steps

1. Create `tests/integration/` package with `__init__.py`
2. Move session fixtures (`scylla_container`, `coodie_driver`, etc.) to `tests/integration/conftest.py`
3. Add shared model definitions and `_maybe_await` to `conftest.py`
4. Split test classes into focused modules by feature area
5. Merge sync/async test class pairs using Strategy 3
6. Verify all tests pass with the same `pytest -m integration` command

### Fixture Scope Considerations

| Fixture | Scope | Reason |
|---------|-------|--------|
| `scylla_container` | session | Container startup is expensive (~10s) |
| `coodie_driver` | session | Driver connection is expensive |
| `product_cls` | function (parametrized) | Each test needs a fresh class reference |
| `_maybe_await` | session | Stateless helper, safe to share |

---

## Applying These Strategies: Priority Order

| Priority | Target | Strategy | Lines Saved |
|----------|--------|----------|-------------|
| 1 | `tests/test_types.py` | Parametrize (Pattern 1, 2, 5, 6) | ~120 lines |
| 2 | `tests/test_cql_builder.py` | Parametrize (Pattern 3, 4) | ~150 lines |
| 3 | `tests/sync/` + `tests/aio/` | Shared models + `_maybe_await` | ~400 lines |
| 4 | `tests/test_integration.py` | Split + merge sync/async | ~800 lines |

Each step is independent and can be merged separately. Start with the simplest (test_types.py) to validate the pattern before tackling integration tests.
