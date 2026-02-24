# Field Types & Annotations

coodie maps Python types to CQL types automatically. For most cases you just
write standard Python type hints and coodie does the right thing.

## Python → CQL Type Mappings

### Scalar Types

| Python Type | CQL Type | Notes |
|-------------|----------|-------|
| `str` | `text` | Default string type |
| `int` | `int` | 32-bit signed integer |
| `float` | `float` | 32-bit IEEE 754 |
| `bool` | `boolean` | `True` / `False` |
| `bytes` | `blob` | Raw binary data |
| `UUID` | `uuid` | From `uuid.UUID` |
| `datetime` | `timestamp` | From `datetime.datetime` |
| `date` | `date` | From `datetime.date` |
| `Decimal` | `decimal` | From `decimal.Decimal` |
| `IPv4Address` | `inet` | From `ipaddress` |
| `IPv6Address` | `inet` | From `ipaddress` |

### Collection Types

| Python Type | CQL Type | Example |
|-------------|----------|---------|
| `list[X]` | `list<X>` | `list[str]` → `list<text>` |
| `set[X]` | `set<X>` | `set[int]` → `set<int>` |
| `dict[K, V]` | `map<K, V>` | `dict[str, int]` → `map<text, int>` |
| `tuple[X, ...]` | `tuple<X, ...>` | `tuple[str, int]` → `tuple<text, int>` |

## Type Override Markers

Sometimes you need a CQL type that doesn't map one-to-one to a Python type.
Use type override markers inside `Annotated[]`:

```python
from coodie.fields import BigInt, SmallInt, TinyInt, VarInt, Double, Ascii, TimeUUID, Time, Frozen, Static

class SensorReading(Document):
    sensor_id: Annotated[UUID, PrimaryKey()]

    # Integer overrides
    reading_big: Annotated[int, BigInt()]       # CQL: bigint (64-bit)
    reading_small: Annotated[int, SmallInt()]   # CQL: smallint (16-bit)
    reading_tiny: Annotated[int, TinyInt()]     # CQL: tinyint (8-bit)
    reading_var: Annotated[int, VarInt()]       # CQL: varint (arbitrary precision)

    # Float override
    precise_value: Annotated[float, Double()]   # CQL: double (64-bit IEEE 754)

    # String override
    code: Annotated[str, Ascii()]               # CQL: ascii (US-ASCII only)

    # UUID override
    event_id: Annotated[UUID, TimeUUID()]       # CQL: timeuuid (time-based UUID)

    # Time override
    sampled_at: Annotated[int, Time()]          # CQL: time (nanoseconds since midnight)
```

### Override Summary

| Marker | Python Type | CQL Type |
|--------|-------------|----------|
| `BigInt()` | `int` | `bigint` |
| `SmallInt()` | `int` | `smallint` |
| `TinyInt()` | `int` | `tinyint` |
| `VarInt()` | `int` | `varint` |
| `Double()` | `float` | `double` |
| `Ascii()` | `str` | `ascii` |
| `TimeUUID()` | `UUID` | `timeuuid` |
| `Time()` | `int` | `time` |

## Frozen Collections

Use `Frozen()` to wrap a collection type as `frozen<...>` in CQL. Frozen
collections are stored as a single serialised blob and can be used in
primary keys or as elements of other collections:

```python
from coodie.fields import PrimaryKey, Frozen

class GeoPoint(Document):
    id: Annotated[UUID, PrimaryKey()]
    coordinates: Annotated[tuple[float, float], Frozen()]  # frozen<tuple<float, float>>
    tags: Annotated[set[str], Frozen()]                    # frozen<set<text>>
```

## Key & Index Markers

These markers control how columns participate in the table's primary key
and indexing:

| Marker | Purpose | Parameters |
|--------|---------|------------|
| `PrimaryKey()` | Partition key column | `partition_key_index` (default `0`) |
| `ClusteringKey()` | Clustering column | `order` (`"ASC"` or `"DESC"`), `clustering_key_index` (default `0`) |
| `Indexed()` | Secondary index | `index_name` (optional) |
| `Counter()` | Counter column | — |
| `Static()` | Static column (shared across partition) | — |

See {doc}`keys-and-indexes` for detailed usage of keys and indexes.

## Static Columns

In Cassandra, a **static column** is shared across all rows within the same
partition. This is useful when you have data that belongs to the partition
as a whole, not to individual clustering rows.

Use `Static()` to mark a column as static:

```python
from coodie.fields import PrimaryKey, ClusteringKey, Static

class SensorReading(Document):
    sensor_id: Annotated[str, PrimaryKey()]
    reading_time: Annotated[str, ClusteringKey()]
    sensor_name: Annotated[str, Static()] = ""   # shared across partition
    value: float = 0.0
```

This produces:

```sql
CREATE TABLE sensor_reading (
    sensor_id text,
    reading_time text,
    sensor_name text STATIC,
    value float,
    PRIMARY KEY (sensor_id, reading_time)
);
```

Every row for the same `sensor_id` shares the same `sensor_name` value.
Updating `sensor_name` on any row updates it for all rows in that partition.

```{note}
Static columns require at least one clustering column in the table.
A table with only a partition key and no clustering key cannot have
static columns.
```

## Combining Markers

You can combine multiple markers in a single `Annotated[]`:

```python
# A TimeUUID that is also a primary key
event_id: Annotated[UUID, PrimaryKey(), TimeUUID()]

# A BigInt with a secondary index
population: Annotated[int, Indexed(), BigInt()]
```

## Optional Fields

Use `Optional[X]` (or `X | None` on Python 3.10+) for nullable fields:

```python
class Profile(Document):
    user_id: Annotated[UUID, PrimaryKey()]
    name: str                           # Required
    bio: Optional[str] = None           # Optional, defaults to None
    age: int | None = None              # Same as Optional[int]
```

When a field is `Optional` and the stored value is `NULL` in Cassandra,
coodie returns `None`.

## What's Next?

- {doc}`keys-and-indexes` — primary keys, clustering keys, and secondary indexes
- {doc}`crud` — save, insert, update, delete, and query operations
