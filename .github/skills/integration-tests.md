# Running Integration Tests

Integration tests run against a real ScyllaDB instance via
[testcontainers](https://testcontainers-python.readthedocs.io/).
Docker must be running on the host.

## Prerequisites

```bash
# Install the project with dev dependencies
uv sync --all-groups

# Install the driver you want to test
uv pip install -e ".[scylla]"    # scylla-driver (default)
uv pip install -e ".[cassandra]" # cassandra-driver
uv pip install -e ".[acsylla]"   # acsylla
```

## Running tests

```bash
# Run with the default scylla driver
uv run pytest -m integration -v --timeout=120

# Run with a specific driver
uv run pytest -m integration -v --timeout=120 --driver-type=scylla
uv run pytest -m integration -v --timeout=120 --driver-type=cassandra
uv run pytest -m integration -v --timeout=120 --driver-type=acsylla
```

## Driver types

| `--driver-type` | Python package  | Install extra     | Notes |
|-----------------|-----------------|-------------------|-------|
| `scylla`        | `scylla-driver` | `coodie[scylla]`  | Default. Fork of cassandra-driver. |
| `cassandra`     | `cassandra-driver` | `coodie[cassandra]` | Incompatible with Python 3.13+. |
| `acsylla`       | `acsylla`       | `coodie[acsylla]` | Async-native C++ driver. Uses Docker internal IP (no address translator). |

## Known limitations

- **cassandra-driver** does not work on Python 3.13+ (`ImportError: OperationType`).
- **acsylla** has no address translator — the test fixture connects via the
  Docker container's internal IP on port 9042.
- **acsylla** sessions are event-loop-bound. Integration tests use
  `asyncio_default_fixture_loop_scope = "session"` and
  `@pytest.mark.asyncio(loop_scope="session")` so all async tests and the
  session-scoped fixture share the same loop.
- **acsylla** returns UUIDs as strings; comparisons in raw driver results
  (e.g. `values_list()`) should use `str()` for cross-driver compatibility.

## CI workflow

The `.github/workflows/test-integration.yml` matrix covers all three drivers
on Python 3.13 and 3.14, excluding `cassandra` on both versions.
