# Usage

To use this package, import it:

```python
import coodie
```

## Raw CQL Queries

Sometimes you need to execute CQL statements that go beyond what the ORM
helpers provide — for example, ad-hoc analytics queries, DDL statements, or
anything that does not map directly to a `Document` model.

coodie exposes an `execute_raw` helper in both the **sync** and **async**
packages.  It delegates to the registered driver's `execute` /
`execute_async` method and returns rows as a list of plain dictionaries.

### Synchronous

```python
from coodie.sync import init_coodie, execute_raw

# Initialise the driver (once, at application start-up)
init_coodie(hosts=["127.0.0.1"], keyspace="my_ks")

# SELECT — returns list[dict[str, Any]]
rows = execute_raw("SELECT * FROM my_ks.users WHERE id = ?", [some_id])
for row in rows:
    print(row["name"], row["email"])

# INSERT / UPDATE / DELETE — returns an empty list
execute_raw(
    "INSERT INTO my_ks.users (id, name, email) VALUES (?, ?, ?)",
    [user_id, "Alice", "alice@example.com"],
)

# No params — pass just the statement
rows = execute_raw("SELECT release_version FROM system.local")
```

### Asynchronous

```python
from coodie.aio import init_coodie, execute_raw

# Initialise the driver (once, at application start-up)
await init_coodie(hosts=["127.0.0.1"], keyspace="my_ks")

# SELECT
rows = await execute_raw("SELECT * FROM my_ks.users WHERE id = ?", [some_id])

# INSERT
await execute_raw(
    "INSERT INTO my_ks.users (id, name, email) VALUES (?, ?, ?)",
    [user_id, "Alice", "alice@example.com"],
)
```

> **Tip:** The top-level `coodie` package re-exports the *async* variant, so
> `from coodie import execute_raw` gives you the `async` version.
