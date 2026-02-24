# Counter Tables

Cassandra counter columns are special: they only support increment and
decrement operations. coodie provides a dedicated `CounterDocument`
base class that enforces these rules at the Python level.

## Defining a Counter Document

Use `CounterDocument` instead of `Document` and annotate every
non-key column with `Counter()`:

```python
from coodie.fields import PrimaryKey, Counter
from typing import Annotated
from uuid import UUID

class PageHits(CounterDocument):
    url: Annotated[str, PrimaryKey()]
    views: Annotated[int, Counter()]
    unique_visitors: Annotated[int, Counter()]

    class Settings:
        name = "page_hits"
```

For **sync** usage:

```python
from coodie.sync import CounterDocument, init_coodie
init_coodie(hosts=["127.0.0.1"], keyspace="my_ks")
```

For **async** usage:

```python
from coodie.aio import CounterDocument, init_coodie
await init_coodie(hosts=["127.0.0.1"], keyspace="my_ks")
```

Don't forget to sync the table:

```python
PageHits.sync_table()            # sync
await PageHits.sync_table()      # async
```

## Increment

Call `increment()` with keyword arguments naming the counter columns
and the amount to add:

```python
page = PageHits(url="/home")

page.increment(views=1)                    # sync
# await page.increment(views=1)            # async

# Increment multiple counters at once
page.increment(views=1, unique_visitors=1)
```

Generated CQL:

```sql
UPDATE page_hits SET views = views + 1, unique_visitors = unique_visitors + 1
WHERE url = '/home';
```

## Decrement

`decrement()` works the same way but subtracts:

```python
page.decrement(views=1)                   # sync
# await page.decrement(views=1)            # async
```

Generated CQL:

```sql
UPDATE page_hits SET views = views - 1 WHERE url = '/home';
```

## Reading Counter Values

Read counters with the usual `get()` or `find()` methods:

```python
page = PageHits.get(url="/home")            # sync
# page = await PageHits.get(url="/home")    # async
print(page.views, page.unique_visitors)
```

## Restrictions

Counter tables have strict rules imposed by Cassandra/ScyllaDB:

```{warning}
- `save()` and `insert()` are **not available** on `CounterDocument`.
  Calling them raises an error.
- Every non-key column **must** be a `Counter()`.
- You cannot mix counter and non-counter columns in the same table.
- Counter columns cannot have a TTL.
```

## What's Next?

- {doc}`querying` — QuerySet chaining and terminal methods
- {doc}`filtering` — Django-style lookup operators
- {doc}`collections` — set, list, and map operations
- {doc}`ttl` — time-to-live support
