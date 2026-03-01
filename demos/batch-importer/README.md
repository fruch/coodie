# 📦 coodie Batch Importer Demo

> *Dimension-7: The Dimensional Cargo Drop* — Use `BatchQuery` to import the
> counter-manifest before LoadMaster ships the sentient population of Kepler-442b
> into a `TRUNCATE TABLE`.

A runnable CLI demo showcasing **coodie**'s `BatchQuery` with both **logged**
and **unlogged** batches for high-throughput CSV bulk imports, with colorful
[rich](https://rich.readthedocs.io/) progress bars.

## Quick Start

```bash
cd demos/batch-importer
make seed
```

This single command starts ScyllaDB, creates the keyspace, and imports 200
cargo manifest entries using logged and unlogged batches.

## Prerequisites

* Python ≥ 3.10
* [uv](https://docs.astral.sh/uv/) (recommended) or pip
* Docker & Docker Compose (for ScyllaDB)

## Step-by-Step

### 1. Start ScyllaDB and create keyspace

```bash
make db-up
```

### 2. Run the batch import

```bash
make seed                                          # generate + import 200 entries
uv run python seed.py --count 500                  # custom count
uv run python seed.py --batch-size 25              # smaller batches
make seed-csv                                      # import bundled sample_manifest.csv (100 entries)
uv run python seed.py --feed sample_manifest.csv   # same, run directly
```

### 3. Clean up

```bash
make clean
```

### Environment variables

| Variable | Default | Description |
|---|---|---|
| `SCYLLA_HOSTS` | `127.0.0.1` | Comma-separated ScyllaDB contact points |
| `SCYLLA_KEYSPACE` | `cargo` | Keyspace to use |

## Makefile Targets

| Target | Description |
|---|---|
| `make db-up` | Start ScyllaDB and create the `cargo` keyspace |
| `make db-down` | Stop ScyllaDB |
| `make seed` | Generate and import 200 random entries (depends on `db-up`) |
| `make seed-csv` | Import the bundled `sample_manifest.csv` (100 entries, depends on `db-up`) |
| `make clean` | Stop DB and remove data volumes |
| `make test` | Run the smoke test |

## CSV Import Format

A bundled `sample_manifest.csv` (100 rows) is included in the demo directory
and can be imported directly:

```bash
make seed-csv
# or
uv run python seed.py --feed sample_manifest.csv
```

When providing your own CSV file, it must use the following header:

```
name,origin_system,destination_system,cargo_type,mass_kg,status
```

| Column | Type | Required | Description |
|---|---|---|---|
| `name` | string | ✓ | Cargo item name |
| `origin_system` | string | ✓ | Source star system |
| `destination_system` | string | ✓ | Target star system |
| `cargo_type` | string | ✓ | Type of cargo (e.g. `crystalline`) |
| `mass_kg` | float | ✓ | Mass in kilograms |
| `status` | string | | Import status (default: `pending`) |

## Batch Types Explained

This demo uses **two batch modes** to demonstrate the trade-offs:

### Logged Batches (Phase 1 — orange bars)

```python
with BatchQuery(logged=True) as batch:
    CargoEntry(**row).save(batch=batch)
    ...
```

* **Atomic** — if any statement in the batch fails, none are applied
* **Use for** critical data where partial writes are unacceptable
* **Trade-off** — slightly higher write latency due to the batch log

### Unlogged Batches (Phase 2 — steel-blue bars)

```python
with BatchQuery(logged=False) as batch:
    ShipmentLog(**row).save(batch=batch)
    ...
```

* **Best-effort** — no atomicity guarantee; maximises write throughput
* **Use for** high-volume event logs, metrics, time-series data
* **Trade-off** — individual statements may fail without rolling back others

## Models

```python
class CargoEntry(Document):
    """Primary cargo manifest record — imported with LOGGED batches."""
    id: Annotated[UUID, PrimaryKey()]
    name: str
    origin_system: Annotated[str, Indexed()]
    destination_system: Annotated[str, Indexed()]
    cargo_type: Annotated[str, Indexed()]
    mass_kg: float
    status: Annotated[str, Indexed()]

class ShipmentLog(Document):
    """Shipment event log — imported with UNLOGGED batches."""
    shipment_id: Annotated[UUID, PrimaryKey()]
    logged_at: Annotated[datetime, ClusteringKey(order="DESC")]
    entry_id: UUID
    event_type: Annotated[str, Indexed()]
    notes: Optional[str]
```

## Cleanup

```bash
make clean
```
