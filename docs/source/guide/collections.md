# Collection Operations

Cassandra and ScyllaDB support four collection types: **set**, **list**,
**map**, and **tuple**. coodie maps them directly to their Python
counterparts and lets you update them in place with special
double-underscore prefixes.

## Defining Collections

Declare collection columns using standard Python type hints:

```python
from coodie.fields import PrimaryKey
from typing import Annotated
from uuid import UUID, uuid4
from pydantic import Field

class Developer(Document):
    id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)
    name: str
    skills: set[str] = set()
    todo: list[str] = []
    config: dict[str, str] = {}
    coordinates: tuple[float, float] = (0.0, 0.0)

    class Settings:
        name = "developers"
```

| Python Type | CQL Type | Mutable In-Place? |
|-------------|----------|-------------------|
| `set[X]` | `set<X>` | Yes |
| `list[X]` | `list<X>` | Yes |
| `dict[K, V]` | `map<K, V>` | Yes |
| `tuple[X, ...]` | `tuple<X, ...>` | No (replace only) |

## Creating Documents with Collections

Pass collection values normally when creating a document:

```python
dev = Developer(
    name="Alice",
    skills={"Python", "Rust"},
    todo=["Write docs", "Fix bug"],
    config={"theme": "dark", "editor": "vim"},
)
dev.save()                # sync
# await dev.save()        # async
```

## Set Operations

### Add Elements

Use the `add__` prefix to add elements to a set:

```python
dev.update(add__skills={"Go"})            # sync
# await dev.update(add__skills={"Go"})    # async
```

Generated CQL:

```text
UPDATE developers SET skills = skills + {'Go'} WHERE id = ?;
```

### Remove Elements

Use the `remove__` prefix to remove elements from a set:

```python
dev.update(remove__skills={"jQuery"})
```

Generated CQL:

```text
UPDATE developers SET skills = skills - {'jQuery'} WHERE id = ?;
```

### Replace Entirely

A plain assignment replaces the whole set:

```python
dev.update(skills={"Python", "Rust", "Go"})
```

## List Operations

### Append

Use the `append__` prefix to add an element to the end of a list:

```python
dev.update(append__todo="Deploy v2")
```

Generated CQL:

```sql
UPDATE developers SET todo = todo + ['Deploy v2'] WHERE id = ?;
```

### Prepend

Use the `prepend__` prefix to add an element to the beginning:

```python
dev.update(prepend__todo="Fix prod")
```

Generated CQL:

```sql
UPDATE developers SET todo = ['Fix prod'] + todo WHERE id = ?;
```

### Remove

Use the `remove__` prefix to remove all occurrences of an element:

```python
dev.update(remove__todo=["Write docs"])
```

Generated CQL:

```sql
UPDATE developers SET todo = todo - ['Write docs'] WHERE id = ?;
```

### Replace Entirely

```python
dev.update(todo=["New task 1", "New task 2"])
```

## Map Operations

### Update / Add Keys

A plain dict assignment merges keys into the existing map:

```python
dev.update(config={"theme": "light", "font_size": "14"})
```

### Remove Keys

Use the `remove__` prefix with a set of keys to remove:

```python
dev.update(remove__config={"font_size"})
```

### Replace Entirely

Replacing the full map is the same as setting it:

```python
dev.update(config={"theme": "dark"})
```

## Tuple Columns

Tuples are immutable in CQL — you can only replace the entire value:

```python
dev.update(coordinates=(37.7749, -122.4194))
```

## Frozen Collections

Wrap a collection with `Frozen()` to store it as a frozen CQL type.
Frozen collections are serialised as a single value and can be used in
primary keys:

```python
from coodie.fields import PrimaryKey, Frozen

class Route(Document):
    path: Annotated[list[str], PrimaryKey(), Frozen()]

    class Settings:
        name = "routes"
```

```{warning}
Frozen collections cannot be partially updated. You must replace the
entire value on every write.
```

## Combining Collection Updates

You can mix collection operations with regular field updates in a
single `update()` call:

```python
dev.update(
    name="Alice Smith",
    add__skills={"TypeScript"},
    append__todo="Review PR",
    config={"editor": "neovim"},
)
```

## Collection Update Reference

| Prefix | Operation | Works On |
|--------|-----------|----------|
| `add__` | Add elements | `set` |
| `remove__` | Remove elements | `set`, `list`, `map` (keys) |
| `append__` | Append element | `list` |
| `prepend__` | Prepend element | `list` |
| *(none)* | Replace entirely | `set`, `list`, `map`, `tuple` |

## What's Next?

- {doc}`querying` — QuerySet chaining and terminal methods
- {doc}`filtering` — Django-style lookup operators
- {doc}`ttl` — time-to-live support
- {doc}`counters` — counter tables and increment/decrement
