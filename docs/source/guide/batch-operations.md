# Batch Operations

Cassandra batches group multiple CQL statements into a single request.
coodie provides `BatchQuery` (sync) and `AsyncBatchQuery` (async) as
context managers that accumulate statements and execute them together
on exit.

```{warning}
Cassandra batches are **not** like SQL transactions. They guarantee
atomicity (all-or-nothing) only for **logged** batches, and they work
best when all statements target the **same partition**. Batching across
partitions adds coordinator overhead and rarely improves performance.
```

## Setup

```python
from coodie.fields import PrimaryKey
from typing import Annotated
from uuid import UUID, uuid4
from datetime import datetime
from pydantic import Field

class Event(Document):
    user_id: Annotated[UUID, PrimaryKey()]
    ts: Annotated[datetime, PrimaryKey(clustering=True)]
    event_type: str

    class Settings:
        name = "events"
```

## Sync Batches

Use `BatchQuery` as a context manager. Pass `batch=batch` to each
`save()`, `insert()`, `update()`, or `delete()` call to defer execution:

```python
from coodie.sync import BatchQuery

with BatchQuery() as batch:
    Event(user_id=uid, ts=datetime.now(), event_type="login").save(batch=batch)
    Event(user_id=uid, ts=datetime.now(), event_type="page_view").save(batch=batch)
# All statements execute as one batch when the `with` block exits
```

Generated CQL:

```sql
BEGIN BATCH
  INSERT INTO events (user_id, ts, event_type) VALUES (?, ?, ?);
  INSERT INTO events (user_id, ts, event_type) VALUES (?, ?, ?);
APPLY BATCH;
```

## Async Batches

The async equivalent is `AsyncBatchQuery`:

```python
from coodie.aio import AsyncBatchQuery

async with AsyncBatchQuery() as batch:
    await Event(user_id=uid, ts=datetime.now(), event_type="login").save(batch=batch)
    await Event(user_id=uid, ts=datetime.now(), event_type="page_view").save(batch=batch)
```

## Batch Types

Cassandra supports three batch types:

| Type | CQL | Use Case |
|------|-----|----------|
| Logged (default) | `BEGIN BATCH` | Atomicity across rows in the same partition |
| Unlogged | `BEGIN UNLOGGED BATCH` | Performance when atomicity is not needed |
| Counter | `BEGIN COUNTER BATCH` | Batching counter updates |

### Logged Batch (Default)

Logged batches guarantee that either all statements succeed or none do.
This is the default:

```python
with BatchQuery(logged=True) as batch:  # logged=True is the default
    ...
```

### Unlogged Batch

Unlogged batches skip the batch log, reducing overhead. Use them when
all statements target the same partition and you don't need the
atomicity guarantee:

```python
with BatchQuery(logged=False) as batch:
    ...
```

### Counter Batch

Counter updates must use a counter batch:

```python
with BatchQuery(batch_type="COUNTER") as batch:
    ...
```

## Manual Execution

You don't have to use the context manager. Call `execute()` directly
when you want to fire the batch at a specific point:

```python
batch = BatchQuery()
batch.add("INSERT INTO events (user_id, ts, event_type) VALUES (?, ?, ?)", [uid, now, "login"])
batch.add("INSERT INTO events (user_id, ts, event_type) VALUES (?, ?, ?)", [uid, now, "logout"])
batch.execute()
```

## Error Handling

If an exception occurs inside the `with` block, the batch is **not**
executed. The context manager only calls `execute()` when no exception
is raised:

```python
with BatchQuery() as batch:
    Event(user_id=uid, ts=datetime.now(), event_type="login").save(batch=batch)
    raise ValueError("oops")
    # batch.execute() is NOT called — no statements are sent
```

## Best Practices

1. **Same partition**: Keep all statements in a batch targeting the same
   partition key. Cross-partition batches add coordinator log overhead.

2. **Small batches**: Keep batches small (tens of statements, not
   thousands). Large batches can cause pressure on the coordinator node.

3. **Don't use batches for bulk loading**: For inserting thousands of
   rows, use individual inserts with async concurrency. Batches are for
   atomicity, not throughput.

4. **Counter batches are separate**: You cannot mix counter and
   non-counter statements in the same batch.

5. **LWT in batches**: A batch can contain at most **one** conditional
   (LWT) statement, and all statements must target the same partition.

## Low-Level: build_batch()

For advanced use cases, you can build batch CQL directly:

```python
from coodie.cql_builder import build_batch, build_insert

statements = [
    build_insert("events", "myapp", {"user_id": uid, "ts": now, "event_type": "login"}),
    build_insert("events", "myapp", {"user_id": uid, "ts": now, "event_type": "page_view"}),
]

cql, params = build_batch(statements, logged=True)
# cql = "BEGIN BATCH\n  INSERT INTO ...;\n  INSERT INTO ...;\nAPPLY BATCH"
```

## What's Next?

- {doc}`lwt` — conditional writes with IF NOT EXISTS / IF EXISTS
- {doc}`sync-vs-async` — choosing between sync and async APIs
- {doc}`drivers` — driver configuration and multi-cluster setups
- {doc}`exceptions` — error handling patterns
