# Advanced Patterns & Recipes

This page collects patterns and recipes for common real-world scenarios
with coodie. Each recipe is self-contained and copy-pastable.

## Time-Bucketed Event Log

Storing all events for a service in a single partition eventually leads to
"partition too large" warnings. The fix: add a **date bucket** to the
partition key so each day gets its own partition.

```python
from datetime import date, datetime, timezone
from typing import Annotated
from uuid import UUID, uuid4

from pydantic import Field
from coodie.sync import Document
from coodie.fields import PrimaryKey, ClusteringKey

class EventLog(Document):
    service: Annotated[str, PrimaryKey(partition_key_index=0)]
    day_bucket: Annotated[date, PrimaryKey(partition_key_index=1)]
    event_time: Annotated[datetime, ClusteringKey(order="DESC")]
    event_type: str
    payload: dict[str, str] = Field(default_factory=dict)

    class Settings:
        name = "event_log"

# Insert an event — bucket is today's date
EventLog(
    service="payments",
    day_bucket=date.today(),
    event_time=datetime.now(timezone.utc),
    event_type="payment_received",
    payload={"amount": "42.00", "currency": "USD"},
).save()

# Query today's events (newest first — thanks to clustering order)
events = EventLog.find(
    service="payments",
    day_bucket=date.today(),
).limit(50).all()
```

## Frozen Collections

Use `Frozen()` when you need a collection inside another collection, or
when you want the entire collection stored as a single immutable blob.

```python
from typing import Annotated
from uuid import UUID
from pydantic import Field
from coodie.sync import Document
from coodie.fields import PrimaryKey, Frozen

class GameState(Document):
    player_id: Annotated[UUID, PrimaryKey()]
    # Frozen list — stored as a single value, not element-by-element
    inventory: Annotated[list[str], Frozen()] = Field(default_factory=list)
    # Frozen set
    achievements: Annotated[set[str], Frozen()] = Field(default_factory=set)
    # Frozen map
    stats: Annotated[dict[str, int], Frozen()] = Field(default_factory=dict)
```

Frozen collections cannot be partially updated (no `add__` / `remove__`).
You must replace the entire value on update.

## Polymorphic Models (Single-Table Inheritance)

Use `Discriminator()` to store multiple document types in one table.
coodie uses a discriminator column to route rows to the correct subclass.

```python
from typing import Annotated, Optional
from uuid import UUID, uuid4

from pydantic import Field
from coodie.sync import Document
from coodie.fields import PrimaryKey, Discriminator

class Pet(Document):
    id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)
    name: str
    pet_type: Annotated[str, Discriminator()] = ""

    class Settings:
        name = "pets"

class Cat(Pet):
    indoor: bool = True

    class Settings:
        __discriminator_value__ = "cat"

class Dog(Pet):
    breed: Optional[str] = None

    class Settings:
        __discriminator_value__ = "dog"

# Insert different types
Cat(name="Whiskers", indoor=True).save()
Dog(name="Rex", breed="German Shepherd").save()

# Query returns the correct subclass
pets = Pet.find().allow_filtering().all()
for pet in pets:
    print(type(pet).__name__, pet.name)
    # "Cat Whiskers" or "Dog Rex"
```

## Paginated Queries

Use `fetch_size()` and `paged_all()` for token-based pagination — ideal
for large result sets or infinite-scroll UIs.

```python
from coodie.sync import Document

# First page
page = Product.find().fetch_size(25).paged_all()
products = page.data       # list of up to 25 Product instances
token = page.paging_state  # opaque bytes (or None if no more pages)

# Next page — pass the token back
if token:
    next_page = Product.find().fetch_size(25).paged_all(paging_state=token)
```

## Raw CQL Queries

Sometimes you need to step outside the ORM — for analytics queries, DDL
statements, or anything that doesn't map to a `Document`.

```python
from coodie.sync import execute_raw

# SELECT
rows = execute_raw("SELECT release_version FROM system.local")
print(rows[0]["release_version"])

# INSERT with parameters
execute_raw(
    "INSERT INTO my_ks.audit_log (id, action) VALUES (?, ?)",
    [event_id, "user_login"],
)
```

The async version works the same way with `await`:

```python
from coodie.aio import execute_raw

rows = await execute_raw("SELECT release_version FROM system.local")
```

## Testing with MockDriver

coodie's test suite includes a `MockDriver` that records executed CQL
without requiring a live database. You can use a similar pattern in your
own tests:

```python
import pytest
from coodie.drivers import register_driver
from coodie.drivers.base import AbstractDriver


class MockDriver(AbstractDriver):
    """Minimal mock driver for unit tests."""

    def __init__(self):
        super().__init__(session=None, default_keyspace="test_ks")
        self.executed: list[tuple[str, list]] = []
        self._return_rows: list[dict] = []

    def set_return_rows(self, rows: list[dict]) -> None:
        self._return_rows = rows

    def execute(self, stmt, params=None, **kwargs):
        self.executed.append((stmt, params or []))
        return list(self._return_rows)

    async def execute_async(self, stmt, params=None, **kwargs):
        return self.execute(stmt, params, **kwargs)


@pytest.fixture
def mock_driver():
    driver = MockDriver()
    register_driver("default", driver, default=True)
    return driver


def test_product_save(mock_driver):
    from myapp.models import Product

    p = Product(name="Widget", price=9.99)
    p.save()

    assert len(mock_driver.executed) == 1
    cql, params = mock_driver.executed[0]
    assert "INSERT INTO" in cql
```
