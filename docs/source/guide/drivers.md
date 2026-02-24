# Drivers & Initialization

coodie talks to Cassandra and ScyllaDB through a pluggable driver layer.
You initialize the connection with `init_coodie()`, and coodie takes
care of the rest.

## Quick Start

The simplest way to connect — point at your cluster and go:

```python
from coodie.sync import init_coodie

driver = init_coodie(
    hosts=["127.0.0.1"],
    keyspace="my_keyspace",
)
```

For async applications:

```python
from coodie.aio import init_coodie

driver = await init_coodie(
    hosts=["127.0.0.1"],
    keyspace="my_keyspace",
)
```

## Supported Drivers

coodie ships with two driver implementations:

| Driver | Backend | Protocol | Best For |
|--------|---------|----------|----------|
| `CassandraDriver` | `cassandra-driver` or `scylla-driver` | CQL native protocol | General use, sync and async |
| `AcsyllaDriver` | `acsylla` | CQL native protocol (Cython) | High-performance async workloads |

### scylla-driver (Default)

The default `driver_type="scylla"` uses `scylla-driver` (a fork of
`cassandra-driver` optimized for ScyllaDB, fully compatible with
Cassandra):

```python
init_coodie(
    hosts=["node1", "node2", "node3"],
    keyspace="my_ks",
    driver_type="scylla",  # default — can be omitted
)
```

Install:

```bash
pip install scylla-driver
```

### cassandra-driver

If you prefer the DataStax `cassandra-driver`:

```python
init_coodie(
    hosts=["node1", "node2"],
    keyspace="my_ks",
    driver_type="cassandra",
)
```

Install:

```bash
pip install cassandra-driver
```

```{note}
`driver_type="scylla"` and `driver_type="cassandra"` both use the
`CassandraDriver` class internally. The only difference is which Python
package provides the `cassandra` module. Both work with Cassandra and
ScyllaDB clusters.
```

### acsylla (Async)

For maximum async performance, use `acsylla` — a Cython-based ScyllaDB
driver. Initialize with `init_coodie_async()` (or `coodie.aio.init_coodie()`):

```python
from coodie.aio import init_coodie

driver = await init_coodie(
    hosts=["node1", "node2"],
    keyspace="my_ks",
    driver_type="acsylla",
)
```

Install:

```bash
pip install acsylla
```

```{note}
The synchronous `init_coodie()` cannot create an acsylla session from
hosts because acsylla requires a running event loop. Use
`init_coodie_async()` with `hosts`, or create the session yourself and
pass it via `session=`.
```

## init_coodie() Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `hosts` | `list[str] \| None` | `None` | Contact points for the cluster |
| `session` | `Any \| None` | `None` | Pre-created driver session (BYOS) |
| `keyspace` | `str \| None` | `None` | Default keyspace |
| `driver_type` | `str` | `"scylla"` | `"scylla"`, `"cassandra"`, or `"acsylla"` |
| `name` | `str` | `"default"` | Name for multi-driver setups |
| `**kwargs` | | | Passed to the underlying `Cluster()` constructor |

Either `hosts` or `session` must be provided. If you pass `hosts`,
coodie creates the cluster and session for you. If you pass `session`,
coodie wraps your existing session.

## Bring Your Own Session (BYOS)

Already have a configured session? Pass it directly:

```python
from cassandra.cluster import Cluster

cluster = Cluster(
    ["node1", "node2"],
    protocol_version=4,
    # ... any other cluster options
)
session = cluster.connect("my_keyspace")

from coodie.sync import init_coodie
driver = init_coodie(session=session, keyspace="my_keyspace")
```

This is useful when you need fine-grained control over connection
pooling, load balancing policies, or authentication.

## Named Drivers (Multi-Cluster)

For applications that talk to multiple clusters, register each with a
unique name:

```python
from coodie.sync import init_coodie

init_coodie(hosts=["analytics-cluster"], keyspace="analytics", name="analytics")
init_coodie(hosts=["production-cluster"], keyspace="prod", name="prod")
```

Retrieve a specific driver by name:

```python
from coodie.drivers import get_driver

analytics_driver = get_driver("analytics")
prod_driver = get_driver("prod")
```

The first driver registered (or the one registered with the default
name `"default"`) is used when no name is specified.

## Low-Level Driver API

The `AbstractDriver` base class defines the driver interface:

```python
from coodie.drivers import get_driver

driver = get_driver()

# Sync
rows = driver.execute("SELECT * FROM users WHERE id = ?", [user_id])

# Async
rows = await driver.execute_async("SELECT * FROM users WHERE id = ?", [user_id])
```

### register_driver()

Register a custom driver implementation:

```python
from coodie.drivers import register_driver

register_driver("my_driver", my_driver_instance, default=True)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | `str` | Unique name for the driver |
| `driver` | `AbstractDriver` | Driver instance |
| `default` | `bool` | Set as the default driver (default: `False`) |

## Extra Cluster Options

Any extra keyword arguments to `init_coodie()` are forwarded to the
underlying `Cluster()` constructor:

```python
init_coodie(
    hosts=["node1"],
    keyspace="my_ks",
    port=19042,
    connect_timeout=30,
)
```

## What's Next?

- {doc}`sync-vs-async` — choosing between sync and async APIs
- {doc}`lwt` — conditional writes with IF NOT EXISTS / IF EXISTS
- {doc}`batch-operations` — batch multiple statements into one round-trip
- {doc}`exceptions` — error handling patterns
