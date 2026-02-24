# Lightweight Transactions (LWT)

Cassandra and ScyllaDB support conditional writes through **Lightweight
Transactions** (LWT). These use the Paxos consensus protocol to provide
linearisable consistency for individual operations — think of them as
compare-and-swap for your database.

coodie exposes LWT through `IF NOT EXISTS`, `IF EXISTS`, and custom
`IF` conditions on inserts, updates, and deletes.

## LWTResult

Every conditional write returns an `LWTResult` dataclass:

```python
from coodie.results import LWTResult

result: LWTResult
result.applied    # True if the write was applied
result.existing   # dict of the existing row (when applied is False), or None
```

## Conditional Insert (IF NOT EXISTS)

Use `insert()` on a document to perform an `INSERT ... IF NOT EXISTS`.
This is the classic "create only if it doesn't already exist" pattern:

```python
from coodie.fields import PrimaryKey
from typing import Annotated
from datetime import datetime

class DeployLock(Document):
    service: Annotated[str, PrimaryKey()]
    locked_by: str
    locked_at: datetime

    class Settings:
        name = "deploy_locks"
```

```python
lock = DeployLock(
    service="coodie-api",
    locked_by="alice",
    locked_at=datetime.now(),
)

result = lock.insert()               # sync
# result = await lock.insert()       # async

if result.applied:
    print("Lock acquired! Deploying... 🚀")
else:
    print(f"Lock held by {result.existing['locked_by']}")
    print("Guess we're waiting. Again. ☕")
```

Generated CQL:

```sql
INSERT INTO deploy_locks (service, locked_by, locked_at)
VALUES (?, ?, ?)
IF NOT EXISTS;
```

### QuerySet: if_not_exists().create()

You can also use the QuerySet chain method:

```python
result = DeployLock.find().if_not_exists().create(
    service="coodie-api",
    locked_by="alice",
    locked_at=datetime.now(),
)
# Returns LWTResult when if_not_exists() is chained
```

## Conditional Delete (IF EXISTS)

Delete a row only if it currently exists:

```python
result = lock.delete(if_exists=True)         # sync
# result = await lock.delete(if_exists=True) # async

if result.applied:
    print("Lock released! 🔓")
else:
    print("Lock was already gone. Someone beat us to it.")
```

Generated CQL:

```sql
DELETE FROM deploy_locks WHERE service = ?
IF EXISTS;
```

### QuerySet: if_exists().delete()

```python
result = DeployLock.find(service="coodie-api").if_exists().delete()
# Returns LWTResult when if_exists() is chained
```

## Conditional Update (IF EXISTS)

Update a row only if it already exists:

```python
result = lock.update(if_exists=True, locked_by="bob")   # sync
# result = await lock.update(if_exists=True, locked_by="bob")  # async

if not result.applied:
    print("Someone stole our lock! This is fine. 🔥")
```

Generated CQL:

```sql
UPDATE deploy_locks SET locked_by = ?
WHERE service = ?
IF EXISTS;
```

## Custom IF Conditions

For optimistic locking patterns, pass a dict of conditions the current
row must satisfy for the update to proceed:

```python
class AppConfig(Document):
    key: Annotated[str, PrimaryKey()]
    value: str
    version: int

    class Settings:
        name = "app_config"
```

```python
result = config.update(
    if_conditions={"version": 42},
    value="new_value",
    version=43,
)

if result.applied:
    print("Config updated! Version bumped to 43.")
else:
    print(f"Conflict! Current version is {result.existing['version']}")
```

Generated CQL:

```sql
UPDATE app_config SET value = ?, version = ?
WHERE key = ?
IF version = ?;
```

### QuerySet Custom Conditions

```python
AppConfig.find(key="feature_flag").update(
    if_conditions={"version": 42},
    value="enabled",
    version=43,
)
```

## Performance Considerations

```{warning}
LWT operations use the Paxos consensus protocol under the hood. Every
conditional write requires multiple round-trips between nodes to reach
agreement. Expect **~4× the latency** of a regular write.

Use LWT when correctness matters more than speed — deploy locks,
idempotent creates, optimistic concurrency. For high-throughput writes
where a rare duplicate is acceptable, skip the IF clause.
```

Tips:

- **Don't mix LWT and non-LWT writes** to the same partition. Mixing
  conditional and unconditional writes can lead to unexpected results
  because non-LWT writes bypass the Paxos state.
- **Batch + LWT**: A batch can contain at most one conditional
  statement, and it must target a single partition.
- **Read before write**: If you just need to check existence, a
  `SELECT` is cheaper than an `INSERT IF NOT EXISTS`.

## Quick Reference

| Operation | Document Method | QuerySet Chain |
|-----------|----------------|----------------|
| Create if absent | `doc.insert()` | `.if_not_exists().create(...)` |
| Delete if present | `doc.delete(if_exists=True)` | `.if_exists().delete()` |
| Update if present | `doc.update(if_exists=True, ...)` | N/A |
| Update if conditions | `doc.update(if_conditions={...}, ...)` | `.update(if_conditions={...}, ...)` |

All conditional operations return `LWTResult` with `applied` and
`existing` fields.

## What's Next?

- {doc}`batch-operations` — batch multiple statements into one round-trip
- {doc}`sync-vs-async` — choosing between sync and async APIs
- {doc}`drivers` — driver configuration and multi-cluster setups
- {doc}`exceptions` — error handling patterns
