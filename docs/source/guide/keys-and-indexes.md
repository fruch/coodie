# Primary Keys, Clustering Keys & Indexes

Cassandra's data model revolves around partition keys and clustering keys.
coodie lets you declare these with `Annotated[]` markers.

## Partition Key

The partition key determines which node stores the row. Use `PrimaryKey()`:

```python
from coodie.sync import Document
from coodie.fields import PrimaryKey
from typing import Annotated
from uuid import UUID

class User(Document):
    id: Annotated[UUID, PrimaryKey()]
    name: str
    email: str
```

This produces:

```sql
CREATE TABLE user (
    id uuid,
    name text,
    email text,
    PRIMARY KEY (id)
);
```

## Composite Partition Key

When you need multiple columns in the partition key, use
`partition_key_index` to specify the order:

```python
from datetime import date

class DailySales(Document):
    store_id: Annotated[str, PrimaryKey(partition_key_index=0)]
    sale_date: Annotated[date, PrimaryKey(partition_key_index=1)]
    total: float = 0.0
```

This produces:

```sql
CREATE TABLE daily_sales (
    store_id text,
    sale_date date,
    total float,
    PRIMARY KEY ((store_id, sale_date))
);
```

All rows for the same `(store_id, sale_date)` pair live on the same node.

## Clustering Key

Clustering keys determine the sort order of rows within a partition.
Use `ClusteringKey()`:

```python
from coodie.fields import ClusteringKey
from datetime import datetime

class ChatMessage(Document):
    room_id: Annotated[UUID, PrimaryKey()]
    sent_at: Annotated[datetime, ClusteringKey(order="ASC")]
    sender: str
    body: str
```

This produces:

```sql
CREATE TABLE chat_message (
    room_id uuid,
    sent_at timestamp,
    sender text,
    body text,
    PRIMARY KEY (room_id, sent_at)
) WITH CLUSTERING ORDER BY (sent_at ASC);
```

### Multiple Clustering Keys

Use `clustering_key_index` to define the order of multiple clustering columns:

```python
class Event(Document):
    tenant_id: Annotated[str, PrimaryKey()]
    event_date: Annotated[date, ClusteringKey(order="DESC", clustering_key_index=0)]
    event_id: Annotated[UUID, ClusteringKey(order="ASC", clustering_key_index=1)]
    payload: str
```

This produces:

```sql
CREATE TABLE event (
    tenant_id text,
    event_date date,
    event_id uuid,
    payload text,
    PRIMARY KEY (tenant_id, event_date, event_id)
) WITH CLUSTERING ORDER BY (event_date DESC, event_id ASC);
```

## Compound Primary Key (Partition + Clustering)

A typical Cassandra table has both partition and clustering keys:

```python
class GitCommit(Document):
    # Composite partition key
    repo: Annotated[str, PrimaryKey(partition_key_index=0)]
    branch: Annotated[str, PrimaryKey(partition_key_index=1)]

    # Clustering key
    committed_at: Annotated[datetime, ClusteringKey(order="DESC")]

    sha: str
    message: str
    author: str

    class Settings:
        name = "git_commits"
```

This maps to:

```sql
CREATE TABLE git_commits (
    repo text,
    branch text,
    committed_at timestamp,
    sha text,
    message text,
    author text,
    PRIMARY KEY ((repo, branch), committed_at)
) WITH CLUSTERING ORDER BY (committed_at DESC);
```

## Secondary Indexes

Use `Indexed()` to create a secondary index on a column, which allows
querying by that column without `ALLOW FILTERING`:

```python
from coodie.fields import Indexed

class Product(Document):
    id: Annotated[UUID, PrimaryKey()]
    name: str
    brand: Annotated[str, Indexed()]                             # Auto-named index
    category: Annotated[str, Indexed(index_name="idx_category")] # Custom name
```

Now you can query by `brand` or `category` directly:

```python
# No ALLOW FILTERING needed — secondary index handles it
products = Product.find(brand="Acme").all()
```

```{warning}
Secondary indexes work best on **low-cardinality** columns (columns with
few distinct values, like `status` or `category`). Avoid indexing
high-cardinality columns like email addresses or UUIDs — use partition
keys for those instead.
```

## What's Next?

- {doc}`crud` — save, insert, update, delete, and query operations
- {doc}`field-types` — all type annotations and CQL mappings
