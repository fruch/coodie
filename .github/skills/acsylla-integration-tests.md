# Running Integration Tests with acsylla

[acsylla](https://github.com/acsylla/acsylla) is an async-native Python client
for Cassandra and ScyllaDB built on the C/C++ cpp-driver. coodie supports it as
a first-class driver backend through `AcsyllaDriver`.

## Prerequisites

```bash
# Docker must be running (ScyllaDB runs in a container via testcontainers)
docker info

# Install the project with dev dependencies + acsylla extra
uv sync --all-groups
uv pip install -e ".[acsylla]"
```

## Running the tests

```bash
# Run all integration tests with the acsylla driver
uv run pytest -m integration -v --timeout=120 --driver-type=acsylla
```

### Run a specific test class or test

```bash
# Sync tests only
uv run pytest -m integration -v --timeout=120 --driver-type=acsylla \
  -k "TestSyncExtended"

# Async tests only
uv run pytest -m integration -v --timeout=120 --driver-type=acsylla \
  -k "TestAsyncExtended"

# A single test
uv run pytest -m integration -v --timeout=120 --driver-type=acsylla \
  -k "test_bigint_roundtrip"
```

## What is tested

All integration tests run against acsylla — no tests are skipped for
feature gaps. This includes:

| Feature area              | Tests                                          |
|---------------------------|-------------------------------------------------|
| CRUD operations           | save, find, update, delete, insert IF NOT EXISTS |
| Extended CQL types        | BigInt, SmallInt, TinyInt, VarInt, Double, Ascii, TimeUUID, Time |
| Frozen collections        | `frozen<list>`, `frozen<set>`, `frozen<map>`   |
| Batch writes              | `BatchQuery` / `AsyncBatchQuery` context managers |
| ALTER TABLE migration     | `sync_table()` adds new columns to existing tables |
| Composite partition keys  | Multi-column partition and clustering keys       |
| Clustering order          | ASC / DESC ordering                             |
| Secondary indexes         | Index creation and filtered queries              |
| Paging                    | Server-side paging with `fetch_size` / `page_state` |
| QuerySet enhancements     | `.only()`, `.defer()`, `.values_list()`, `.per_partition_limit()` |
| Polymorphic models        | Single-table inheritance with discriminator      |
| Materialized views        | `sync_view()` / `drop_view()` DDL               |

## How the acsylla fixture works

The test fixture in `tests/test_integration.py` sets up acsylla like this:

1. A ScyllaDB Docker container is started by testcontainers.
2. The fixture discovers the container's **internal Docker IP** from
   `NetworkSettings.Networks` (acsylla has no address translator, so it must
   connect directly to the container IP on port 9042).
3. An `acsylla.Cluster` and `Session` are created, and the `test_ks` keyspace
   is bootstrapped.
4. An `AcsyllaDriver` wraps the session and is registered as the default coodie
   driver.

### Key architectural details

- **Event-loop binding**: acsylla sessions are bound to the event loop they
  were created on. The fixture uses
  `@pytest_asyncio.fixture(scope="session", loop_scope="session")` and async
  test classes use `@pytest.mark.asyncio(loop_scope="session")` so everything
  shares the same loop.

- **Sync bridge**: `AcsyllaDriver` provides synchronous `execute()` /
  `sync_table()` / `close()` methods that delegate to the async methods via
  `loop.run_until_complete()`. These are used by the sync test class and must
  **not** be called from an already-running async context.

- **UUID handling**: acsylla returns UUID values as strings, not `uuid.UUID`
  objects. Pydantic model construction coerces these automatically, but raw
  driver results (e.g. `values_list()`) need `str()` for cross-driver
  comparisons.

## Troubleshooting

### `ImportError: acsylla`

```
SKIPPED: acsylla is not installed
```

Install the acsylla extra:
```bash
uv pip install -e ".[acsylla]"
```

### `NoHostAvailable` / connection timeout

acsylla connects to the Docker container's **internal IP** (e.g. `172.17.0.x`),
not `127.0.0.1`. If Docker networking is misconfigured the IP may be
unreachable. Ensure Docker is running and that the container's bridge network is
accessible from the host:
```bash
docker network inspect bridge
```

### `Future attached to a different loop`

All async tests and fixtures must share the same event loop. Verify that:
- `pyproject.toml` has `asyncio_default_fixture_loop_scope = "session"`
- Async test classes are decorated with
  `@pytest.mark.asyncio(loop_scope="session")`

## CI workflow

The GitHub Actions workflow `.github/workflows/test-integration.yml` runs
acsylla integration tests automatically on Python 3.13 and 3.14:

```yaml
strategy:
  matrix:
    python-version: ["3.13", "3.14"]
    driver-type: [scylla, cassandra, acsylla]
    exclude:
      - driver-type: cassandra  # incompatible with Python 3.13+
```
