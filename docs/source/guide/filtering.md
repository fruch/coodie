# Filtering (Django-Style Lookups)

coodie uses a Django-inspired double-underscore syntax to express
comparison operators inside `find()` and `filter()` calls. Plain
keyword arguments produce equality checks; append a suffix like
`__gte` to get a different operator.

## Setup

```python
from coodie.fields import PrimaryKey, ClusteringKey, Indexed
from typing import Annotated, Optional
from uuid import UUID, uuid4
from datetime import datetime

class Metric(Document):
    sensor_id: Annotated[str, PrimaryKey()]
    recorded_at: Annotated[datetime, ClusteringKey(order="DESC")]
    temperature: float
    tags: set[str] = set()
    metadata: dict[str, str] = {}

    class Settings:
        name = "metrics"
```

## Equality

The default — no suffix needed:

```python
Metric.find(sensor_id="sensor-1").all()
```

Generated CQL:

```sql
SELECT * FROM metrics WHERE sensor_id = 'sensor-1';
```

## Comparison Operators

| Suffix | CQL Operator | Example |
|--------|-------------|---------|
| `__gt` | `>` | `recorded_at__gt=some_dt` |
| `__gte` | `>=` | `temperature__gte=20.0` |
| `__lt` | `<` | `recorded_at__lt=some_dt` |
| `__lte` | `<=` | `temperature__lte=30.0` |

```python
# Range query — temperature between 20 and 30
results = (
    Metric.find(sensor_id="sensor-1")
    .filter(temperature__gte=20.0, temperature__lte=30.0)
    .all()
)
```

Generated CQL:

```sql
SELECT * FROM metrics WHERE sensor_id = 'sensor-1'
  AND temperature >= 20.0 AND temperature <= 30.0;
```

```{warning}
Range filters on non-clustering columns require `allow_filtering()`.
```

## IN Queries

`__in` matches any value in a list:

```python
results = Metric.find(
    sensor_id__in=["sensor-1", "sensor-2", "sensor-3"]
).all()
```

Generated CQL:

```sql
SELECT * FROM metrics WHERE sensor_id IN ('sensor-1', 'sensor-2', 'sensor-3');
```

## CONTAINS (Collections)

`__contains` checks whether a collection column contains an element:

```python
results = (
    Metric.find(tags__contains="outdoor")
    .allow_filtering()
    .all()
)
```

Generated CQL:

```sql
SELECT * FROM metrics WHERE tags CONTAINS 'outdoor' ALLOW FILTERING;
```

## CONTAINS KEY (Maps)

`__contains_key` checks whether a map column has a specific key:

```python
results = (
    Metric.find(metadata__contains_key="unit")
    .allow_filtering()
    .all()
)
```

Generated CQL:

```sql
SELECT * FROM metrics WHERE metadata CONTAINS KEY 'unit' ALLOW FILTERING;
```

## LIKE (Text Pattern)

`__like` performs a CQL `LIKE` match. Requires a SASI or SAI index on
the column:

```python
results = Metric.find(sensor_id__like="sensor-%").all()
```

Generated CQL:

```sql
SELECT * FROM metrics WHERE sensor_id LIKE 'sensor-%';
```

## TOKEN Queries

Token-based range scans use a double-underscore prefix
`__token__<op>`:

| Suffix | CQL Equivalent |
|--------|----------------|
| `__token__gt` | `TOKEN(col) > TOKEN(?)` |
| `__token__gte` | `TOKEN(col) >= TOKEN(?)` |
| `__token__lt` | `TOKEN(col) < TOKEN(?)` |
| `__token__lte` | `TOKEN(col) <= TOKEN(?)` |

```python
results = Metric.find(sensor_id__token__gt="sensor-5").all()
```

Generated CQL:

```sql
SELECT * FROM metrics WHERE TOKEN("sensor_id") > ?;
```

## Combining Filters

Multiple keyword arguments in the same call are ANDed together.
You can also chain `.filter()` calls — each one adds more conditions:

```python
results = (
    Metric.find(sensor_id="sensor-1")
    .filter(temperature__gte=20.0)
    .filter(temperature__lte=30.0)
    .all()
)
```

This is equivalent to:

```python
results = (
    Metric.find(sensor_id="sensor-1")
    .filter(temperature__gte=20.0, temperature__lte=30.0)
    .all()
)
```

Both produce:

```sql
SELECT * FROM metrics WHERE sensor_id = 'sensor-1'
  AND temperature >= 20.0 AND temperature <= 30.0;
```

## Reference Table

| Suffix | Operator | Works On |
|--------|----------|----------|
| *(none)* | `=` | Any column |
| `__gt` | `>` | Clustering / numeric columns |
| `__gte` | `>=` | Clustering / numeric columns |
| `__lt` | `<` | Clustering / numeric columns |
| `__lte` | `<=` | Clustering / numeric columns |
| `__in` | `IN` | Partition key / clustering columns |
| `__contains` | `CONTAINS` | `set`, `list`, `map` columns |
| `__contains_key` | `CONTAINS KEY` | `map` columns |
| `__like` | `LIKE` | `text` columns (with SASI/SAI index) |
| `__token__gt` | `TOKEN(col) >` | Partition key |
| `__token__gte` | `TOKEN(col) >=` | Partition key |
| `__token__lt` | `TOKEN(col) <` | Partition key |
| `__token__lte` | `TOKEN(col) <=` | Partition key |

## Debugging Generated CQL

coodie uses prepared statements under the hood, so the actual CQL sent
to the cluster uses `?` placeholders. To see the generated queries,
enable `DEBUG`-level logging on the cassandra-driver:

```python
import logging

logging.getLogger("cassandra").setLevel(logging.DEBUG)
```

This will print every CQL statement the driver prepares and executes.

## What's Next?

- {doc}`querying` — QuerySet chaining and terminal methods
- {doc}`collections` — set, list, and map operations
- {doc}`ttl` — time-to-live support
- {doc}`counters` — counter tables and increment/decrement
