# 📡 Time-Series IoT Demo — Station Argos-7

> Deep in the Scylla Nebula, Station **Argos-7** monitors environmental
> conditions across all decks. Dozens of sensors transmit temperature,
> humidity, pressure, and battery data — stored in **time-bucketed
> partitions** with **DESC clustering** so the crew always sees the
> newest readings first.

## coodie Patterns Showcased

| Pattern | Description |
|---|---|
| **Composite Partition Key** | `(sensor_id, date_bucket)` — one partition per sensor per day |
| **ClusteringKey(order="DESC")** | `ts DESC` — newest readings at the top of each partition |
| **`per_partition_limit()`** | Latest *N* readings per sensor in a single query |
| **`paged_all()`** | Cursor-based pagination across large result sets |
| **`Indexed()`** | Secondary index on `battery_pct` for low-battery alerts |
| **Background Device** | Continuously generates new sensor readings in real-time |
| **Infinite Scroll** | Scroll-triggered pagination with HTMX `revealed` trigger |
| **Date Filtering** | Browse time-series data starting from a specific date |

## Quick Start

```bash
cd demos/timeseries-iot
make run
```

This single command:
1. Starts ScyllaDB (shared Docker Compose)
2. Creates the `iot` keyspace
3. Seeds 5 sensors × 3 days × 50 readings/day = **750 readings**
4. Launches the dashboard at **http://127.0.0.1:8000**
5. Starts a **background device** that generates new readings every 3 seconds

## Data Model

```python
class SensorReading(Document):
    sensor_id:   Annotated[str,      PrimaryKey(partition_key_index=0)]
    date_bucket: Annotated[date,     PrimaryKey(partition_key_index=1)]
    ts:          Annotated[datetime, ClusteringKey(order="DESC")]
    temperature: float
    humidity:    float
    pressure:    float
    battery_pct: Annotated[int, Indexed()] = 100

    class Settings:
        name = "sensor_readings"
        keyspace = "iot"
```

### CQL Behind the Scenes

```sql
CREATE TABLE iot.sensor_readings (
    sensor_id   text,
    date_bucket date,
    ts          timestamp,
    temperature double,
    humidity    double,
    pressure    double,
    battery_pct int,
    PRIMARY KEY ((sensor_id, date_bucket), ts)
) WITH CLUSTERING ORDER BY (ts DESC);
```

## Real-Time Features

### Background Device
The app starts a background async task that continuously generates new
sensor readings every 3 seconds (configurable via `DEVICE_INTERVAL` env var).
The dashboard auto-refreshes every 3 seconds to show the latest data.

```bash
# Customize the background device interval (seconds)
DEVICE_INTERVAL=5 uv run uvicorn main:app --reload

# Disable the background device
DISABLE_BACKGROUND_DEVICE=1 uv run uvicorn main:app --reload
```

### Live Dashboard
The sensor grid refreshes every 3 seconds using HTMX polling, showing
real-time updates as new readings arrive from the background device.

### Infinite Scroll
The paginated feed uses HTMX's `revealed` trigger on a sentinel element.
When the user scrolls to the bottom, the next page is automatically loaded
without clicking any button.

### Date Filtering
The paginated feed includes a date picker to start browsing from a specific
date — a natural requirement for time-series data exploration.

## API Reference

### JSON Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/sensors` | List distinct sensor IDs |
| `GET` | `/sensors/{id}/latest?days=1&limit=5` | Latest readings using `per_partition_limit()` |
| `GET` | `/readings/paged?page_size=10&cursor=...` | Paginated readings using `paged_all()` |
| `GET` | `/readings/paged?start_date=2026-01-15` | Readings from a specific start date |
| `GET` | `/device/status` | Background device status (running, sensors, interval) |

### HTMX UI Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/` | Dashboard index page |
| `GET` | `/ui/dashboard` | Sensor grid partial (auto-refresh every 3s) |
| `GET` | `/ui/sensor/{id}?days=3` | Sensor detail with reading history |
| `GET` | `/ui/paged?page_size=15&start_date=...&sensor_id=...` | Infinite scroll feed with filters |

## Makefile Targets

| Target | Description |
|---|---|
| `make db-up` | Start ScyllaDB and create `iot` keyspace |
| `make db-down` | Stop ScyllaDB |
| `make seed` | Seed 5 sensors × 3 days × 50 readings/day |
| `make seed-large` | Seed 10 sensors × 7 days × 100 readings/day (pagination demo) |
| `make run` | Full start: db-up → seed → launch dashboard |
| `make clean` | Stop DB and remove data volumes |
| `make test` | Run smoke tests |

## Seeding Options

```bash
python seed.py                            # Default: 5 sensors, 3 days, 50/day
python seed.py --sensors 10               # 10 sensors
python seed.py --days 7                   # 7 days of data
python seed.py --readings-per-day 100     # 100 readings per sensor per day
```

## Key Code Patterns

### 1. Time-Bucketed Partitions

```python
# Composite partition key: one partition per sensor per day
sensor_id:   Annotated[str,  PrimaryKey(partition_key_index=0)]
date_bucket: Annotated[date, PrimaryKey(partition_key_index=1)]
```

### 2. DESC Clustering Order

```python
# Newest readings first — no need to sort in application code
ts: Annotated[datetime, ClusteringKey(order="DESC")]
```

### 3. per_partition_limit()

```python
# Latest 5 readings for a specific sensor on a specific day
readings = await SensorReading.find(
    sensor_id="reactor-core-A1",
    date_bucket=date.today(),
).per_partition_limit(5).all()
```

### 4. paged_all() — Cursor-Based Pagination with Infinite Scroll

```python
# First page
result = await SensorReading.find().fetch_size(15).paged_all()
# result.data         → list[SensorReading]
# result.paging_state → bytes | None

# Next page (pass the cursor back)
if result.paging_state:
    next_page = await SensorReading.find() \
        .fetch_size(15) \
        .page(result.paging_state) \
        .paged_all()
```

### 5. Background Device — Real-Time Data Generation

```python
# Runs in an asyncio background task during app lifespan
async def _background_device_loop():
    while True:
        sensor_id = random.choice(DEVICE_SENSORS)
        reading = SensorReading(**_generate_live_reading(sensor_id))
        await reading.save()
        await asyncio.sleep(DEVICE_INTERVAL)
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `SCYLLA_HOSTS` | `127.0.0.1` | Comma-separated ScyllaDB hosts |
| `SCYLLA_KEYSPACE` | `iot` | Keyspace name |
| `DEVICE_INTERVAL` | `3` | Seconds between background device readings |
| `DISABLE_BACKGROUND_DEVICE` | *(unset)* | Set to `1` to disable the background device |

## Manual Testing

1. **Real-time dashboard**: Watch sensor cards update every 3 seconds with live data
2. **Live indicator**: Green pulsing dot shows when background device is active
3. **Sensor drill-down**: Click any sensor card to see its reading history
4. **Infinite scroll**: Switch to the "Infinite Scroll Feed" tab and scroll down
5. **Date filter**: Pick a date in the feed tab to browse historical data
6. **Sensor filter**: Select a specific sensor in the feed dropdown
7. **JSON API**: `curl http://localhost:8000/device/status`
8. **Large dataset**: Run `make seed-large` for a bigger pagination demo
