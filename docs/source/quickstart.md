# Quick Start

> From zero to first query in 60 seconds — because life is too short
> for long setup guides.

## Prerequisites

- **Python 3.10+**
- A running **Cassandra** or **ScyllaDB** cluster (or Docker — see below)

## Start a Local ScyllaDB

If you don't have a cluster handy, spin one up with Docker:

```bash
# Start ScyllaDB (takes ~30 seconds to be ready)
docker run --name scylla -d -p 9042:9042 scylladb/scylla --smp 1

# Wait until it's ready
docker exec -it scylla cqlsh -e "DESCRIBE CLUSTER"

# Create a keyspace
docker exec -it scylla cqlsh -e \
  "CREATE KEYSPACE IF NOT EXISTS my_ks
   WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};"
```

## Your First coodie Script

### Sync Version

```python
from coodie.sync import Document, init_coodie
from coodie.fields import PrimaryKey
from pydantic import Field
from typing import Annotated
from uuid import UUID, uuid4

# 1. Connect to the cluster
init_coodie(hosts=["127.0.0.1"], keyspace="my_ks")

# 2. Define a Document (like a table, but Pythonic)
class User(Document):
    id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)
    name: str
    email: str

    class Settings:
        name = "users"

# 3. Create the table
User.sync_table()

# 4. Insert a row
user = User(name="Alice", email="alice@example.com")
user.save()

# 5. Query it back
found = User.get(id=user.id)
print(found.name)   # "Alice"
print(found.email)  # "alice@example.com"

# 6. Update
found.update(email="alice@newdomain.com")

# 7. Delete
found.delete()
```

### Async Version

```python
import asyncio
from coodie.aio import Document, init_coodie
from coodie.fields import PrimaryKey
from pydantic import Field
from typing import Annotated
from uuid import UUID, uuid4

class User(Document):
    id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)
    name: str
    email: str

    class Settings:
        name = "users"

async def main():
    # 1. Connect
    await init_coodie(hosts=["127.0.0.1"], keyspace="my_ks")

    # 2. Create the table
    await User.sync_table()

    # 3. Insert
    user = User(name="Bob", email="bob@example.com")
    await user.save()

    # 4. Query
    found = await User.get(id=user.id)
    print(found.name)  # "Bob"

    # 5. Update
    await found.update(email="bob@newdomain.com")

    # 6. Delete
    await found.delete()

asyncio.run(main())
```

## What's Next?

- {doc}`guide/defining-documents` — learn how Document classes work
- {doc}`guide/field-types` — all the type annotations you can use
- {doc}`guide/keys-and-indexes` — primary keys, clustering keys, and indexes
- {doc}`guide/crud` — the full CRUD reference
