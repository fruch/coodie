# TTL (Time-To-Live)

Cassandra and ScyllaDB can automatically expire data after a given
number of seconds. coodie exposes TTL through the `ttl` parameter on
write operations and through the `QuerySet.ttl()` chain method.

## Setup

```python
from coodie.fields import PrimaryKey
from pydantic import Field
from typing import Annotated
from uuid import UUID, uuid4
from datetime import datetime

class Session(Document):
    token: Annotated[str, PrimaryKey()]
    user_id: UUID
    created_at: datetime

    class Settings:
        name = "sessions"
```

## Save with TTL

Pass `ttl=<seconds>` to `save()` to make the row expire:

```python
session = Session(
    token="abc123",
    user_id=uuid4(),
    created_at=datetime.now(),
)

session.save(ttl=3600)              # expires in 1 hour — sync
# await session.save(ttl=3600)      # async
```

Generated CQL:

```sql
INSERT INTO sessions (token, user_id, created_at)
VALUES (?, ?, ?)
USING TTL 3600;
```

## Insert with TTL

`insert()` also accepts `ttl`:

```python
session.insert(ttl=300)             # expires in 5 minutes — sync
# await session.insert(ttl=300)     # async
```

## Update with TTL

Apply a TTL when updating specific fields:

```python
session.update(ttl=7200, user_id=new_user_id)       # sync
# await session.update(ttl=7200, user_id=new_user_id)  # async
```

Generated CQL:

```sql
UPDATE sessions USING TTL 7200
SET user_id = ?
WHERE token = ?;
```

## QuerySet TTL

Set the TTL on the query chain for `create()` or `update()` calls:

```python
Session.find().ttl(3600).create(
    token="xyz789",
    user_id=uuid4(),
    created_at=datetime.now(),
)
```

Or use `using()` to set TTL alongside other options:

```python
Session.find(token="abc123").using(ttl=7200).update(
    user_id=new_user_id,
)
```

## How TTL Works

```{note}
TTL is applied **per cell**, not per row. When you `save()` with a TTL,
every non-key column gets the same TTL. When you `update()` with a TTL,
only the columns you set in that update get the TTL. Key columns never
expire.
```

After the TTL elapses, the affected cells become tombstones and are
eventually removed during compaction. Reads will return `None` (or the
column default) for expired cells.

For more details on TTL mechanics, see the database documentation:

- [Cassandra — Expiring data with TTL](https://cassandra.apache.org/doc/latest/cassandra/operating/ttl.html)
- [ScyllaDB — Expiring data with TTL](https://opensource.docs.scylladb.com/stable/cql/time-to-live.html)

## What's Next?

- {doc}`querying` — QuerySet chaining and terminal methods
- {doc}`filtering` — Django-style lookup operators
- {doc}`collections` — set, list, and map operations
- {doc}`counters` — counter tables and increment/decrement
