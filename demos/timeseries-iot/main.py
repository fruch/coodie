"""FastAPI IoT Sensor Dashboard — Station Argos-7.

Showcases coodie's time-series capabilities:
- **Time-bucketed partitions** — ``(sensor_id, date_bucket)`` composite PK
- **ClusteringKey(order="DESC")** — newest readings first within each partition
- **per_partition_limit()** — latest N readings per sensor in one query
- **paged_all()** — cursor-based pagination across large result sets
- **Background device** — continuously generates new sensor telemetry
- **Real-time dashboard** — auto-updates as new data arrives
- **Infinite scroll** — scroll-triggered pagination with date filtering
"""

from __future__ import annotations

__version__ = "0.2.0"

import asyncio
import base64
import logging
import os
import random
from contextlib import asynccontextmanager
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from typing import AsyncIterator

from fastapi import FastAPI, Query, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

from coodie.aio import init_coodie
from coodie.results import PagedResult

from models import SensorReading

logger = logging.getLogger("coodie")

BASE_DIR = Path(__file__).resolve().parent
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))

# --- Background device configuration ---
DEVICE_INTERVAL = float(os.getenv("DEVICE_INTERVAL", "3"))  # seconds between readings
DEVICE_SENSORS: list[str] = []  # populated at startup from DB or defaults
_bg_task: asyncio.Task[None] | None = None


def _generate_live_reading(sensor_id: str) -> dict:
    """Generate a single sensor reading with realistic-ish values."""
    base_temp = {"reactor": 85.0, "coolant": 15.0, "cryo": -40.0, "engine": 70.0}
    temp_base = 22.0
    for prefix, base in base_temp.items():
        if sensor_id.startswith(prefix):
            temp_base = base
            break

    now = datetime.now(timezone.utc)
    return {
        "sensor_id": sensor_id,
        "date_bucket": now.date(),
        "ts": now,
        "temperature": round(temp_base + random.gauss(0, 3.0), 2),
        "humidity": round(max(0, min(100, 45.0 + random.gauss(0, 10.0))), 2),
        "pressure": round(1013.25 + random.gauss(0, 5.0), 2),
        "battery_pct": max(0, min(100, int(95 + random.gauss(0, 5)))),
    }


async def _background_device_loop() -> None:
    """Continuously generate new sensor readings in the background."""
    default_sensors = [
        "reactor-core-A1",
        "coolant-loop-B2",
        "exhaust-vent-C3",
        "cryo-chamber-D4",
        "engine-bay-E5",
    ]

    # Wait briefly for startup to complete
    await asyncio.sleep(2)

    # Discover existing sensors or use defaults
    sensors = await _discover_sensors()
    if not sensors:
        sensors = default_sensors
    DEVICE_SENSORS.clear()
    DEVICE_SENSORS.extend(sensors)

    logger.info("Background device started — %d sensors, interval=%ss", len(sensors), DEVICE_INTERVAL)
    while True:
        try:
            # Pick a random sensor and generate a reading
            sensor_id = random.choice(DEVICE_SENSORS)
            data = _generate_live_reading(sensor_id)
            reading = SensorReading(**data)
            await reading.save()
        except asyncio.CancelledError:
            logger.info("Background device stopped")
            return
        except Exception:
            logger.exception("Background device error")
        await asyncio.sleep(DEVICE_INTERVAL)


async def _discover_sensors() -> list[str]:
    """Find existing sensor IDs from recent data."""
    today = date.today()
    sensor_ids: set[str] = set()
    for day_offset in range(3):
        bucket = today - timedelta(days=day_offset)
        readings = await SensorReading.find(date_bucket=bucket).per_partition_limit(1).allow_filtering().all()
        for r in readings:
            sensor_ids.add(r.sensor_id)
    return sorted(sensor_ids)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Startup: connect to ScyllaDB, sync tables, and start background device."""
    global _bg_task  # noqa: PLW0603

    hosts = os.getenv("SCYLLA_HOSTS", "127.0.0.1").split(",")
    keyspace = os.getenv("SCYLLA_KEYSPACE", "iot")
    await init_coodie(hosts=hosts, keyspace=keyspace)
    await SensorReading.sync_table()

    # Start the background device unless explicitly disabled
    if os.getenv("DISABLE_BACKGROUND_DEVICE", "").lower() not in ("1", "true", "yes"):
        _bg_task = asyncio.create_task(_background_device_loop())

    yield

    # Shutdown: cancel the background device
    if _bg_task and not _bg_task.done():
        _bg_task.cancel()
        try:
            await _bg_task
        except asyncio.CancelledError:
            pass


app = FastAPI(
    title="IoT Sensor Dashboard — Station Argos-7",
    version="0.2.0",
    lifespan=lifespan,
)


# ------------------------------------------------------------------
# JSON API routes
# ------------------------------------------------------------------


@app.get("/sensors")
async def list_sensors() -> list[str]:
    """Return distinct sensor IDs found in the data."""
    return await _discover_sensors()


@app.get("/sensors/{sensor_id}/latest")
async def get_latest_readings(
    sensor_id: str,
    days: int = Query(default=1, ge=1, le=30),
    limit: int = Query(default=5, ge=1, le=100),
) -> list[SensorReading]:
    """Get the latest readings for a sensor using per_partition_limit().

    Demonstrates ``per_partition_limit(n)`` — returns at most ``limit``
    rows from each daily partition for the given sensor.
    """
    today = date.today()
    all_readings: list[SensorReading] = []
    for day_offset in range(days):
        bucket = today - timedelta(days=day_offset)
        readings = await SensorReading.find(sensor_id=sensor_id, date_bucket=bucket).per_partition_limit(limit).all()
        all_readings.extend(readings)
    return all_readings


@app.get("/readings/paged")
async def get_paged_readings(
    sensor_id: str | None = Query(default=None),
    bucket: date | None = Query(default=None),
    start_date: date | None = Query(default=None),
    page_size: int = Query(default=10, ge=1, le=100),
    cursor: str | None = Query(default=None),
) -> dict:
    """Paginated reading list using paged_all().

    Demonstrates ``paged_all()`` — returns a ``PagedResult`` with a
    ``paging_state`` cursor that can be passed back to fetch the next page.

    If ``start_date`` is given, queries partitions from that date forward to today.
    """
    if start_date and not bucket:
        # Query across date range: collect from start_date to today
        today = date.today()
        all_readings: list[SensorReading] = []
        current = start_date
        while current <= today:
            qs = SensorReading.find(date_bucket=current)
            if sensor_id:
                qs = qs.filter(sensor_id=sensor_id)
            readings = await qs.per_partition_limit(page_size).allow_filtering().all()
            all_readings.extend(readings)
            current += timedelta(days=1)
        return {
            "data": [r.model_dump(mode="json") for r in all_readings[:page_size]],
            "next_cursor": None,
            "has_more": len(all_readings) > page_size,
        }

    qs = SensorReading.find()
    if sensor_id:
        qs = qs.filter(sensor_id=sensor_id)
    if bucket:
        qs = qs.filter(date_bucket=bucket)

    qs = qs.fetch_size(page_size).allow_filtering()
    if cursor:
        paging_bytes = base64.urlsafe_b64decode(cursor.encode())
        qs = qs.page(paging_bytes)

    result: PagedResult = await qs.paged_all()
    next_cursor = None
    if result.paging_state:
        next_cursor = base64.urlsafe_b64encode(result.paging_state).decode()

    return {
        "data": [r.model_dump(mode="json") for r in result.data],
        "next_cursor": next_cursor,
        "has_more": result.paging_state is not None,
    }


@app.get("/device/status")
async def device_status() -> dict:
    """Return the background device status."""
    return {
        "running": _bg_task is not None and not _bg_task.done(),
        "sensors": DEVICE_SENSORS,
        "interval_seconds": DEVICE_INTERVAL,
    }


# ------------------------------------------------------------------
# HTMX UI routes
# ------------------------------------------------------------------


@app.get("/", response_class=HTMLResponse)
async def ui_index(request: Request) -> HTMLResponse:
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/ui/dashboard", response_class=HTMLResponse)
async def ui_dashboard(request: Request) -> HTMLResponse:
    """Return the sensor dashboard partial with latest readings per sensor."""
    today = date.today()
    sensors: dict[str, list[SensorReading]] = {}

    # Discover sensors from recent days
    sensor_ids = await _discover_sensors()

    # Get latest 5 readings per sensor (today's partition)
    for sid in sensor_ids:
        readings = await SensorReading.find(sensor_id=sid, date_bucket=today).per_partition_limit(5).all()
        if not readings:
            # Try yesterday if no data today
            yesterday = today - timedelta(days=1)
            readings = await SensorReading.find(sensor_id=sid, date_bucket=yesterday).per_partition_limit(5).all()
        sensors[sid] = readings

    device_active = _bg_task is not None and not _bg_task.done()
    return templates.TemplateResponse(
        "partials/dashboard.html",
        {"request": request, "sensors": sensors, "device_active": device_active},
    )


@app.get("/ui/sensor/{sensor_id}", response_class=HTMLResponse)
async def ui_sensor_detail(
    request: Request,
    sensor_id: str,
    days: int = Query(default=3, ge=1, le=7),
) -> HTMLResponse:
    """Return paginated reading history for a single sensor."""
    today = date.today()
    readings: list[SensorReading] = []
    for day_offset in range(days):
        bucket = today - timedelta(days=day_offset)
        day_readings = await SensorReading.find(sensor_id=sensor_id, date_bucket=bucket).per_partition_limit(20).all()
        readings.extend(day_readings)

    return templates.TemplateResponse(
        "partials/sensor_detail.html",
        {"request": request, "sensor_id": sensor_id, "readings": readings, "days": days},
    )


@app.get("/ui/paged", response_class=HTMLResponse)
async def ui_paged_readings(
    request: Request,
    page_size: int = Query(default=15, ge=1, le=50),
    cursor: str | None = Query(default=None),
    start_date: date | None = Query(default=None),
    sensor_id: str | None = Query(default=None),
) -> HTMLResponse:
    """Return a page of readings using paged_all() for HTMX infinite scroll.

    Supports filtering by ``start_date`` and ``sensor_id``.
    """
    qs = SensorReading.find()

    if sensor_id:
        qs = qs.filter(sensor_id=sensor_id)
    if start_date:
        qs = qs.filter(date_bucket=start_date)

    qs = qs.fetch_size(page_size).allow_filtering()
    if cursor:
        paging_bytes = base64.urlsafe_b64decode(cursor.encode())
        qs = qs.page(paging_bytes)

    result: PagedResult = await qs.paged_all()
    next_cursor = None
    if result.paging_state:
        next_cursor = base64.urlsafe_b64encode(result.paging_state).decode()

    return templates.TemplateResponse(
        "partials/paged_readings.html",
        {
            "request": request,
            "readings": result.data,
            "next_cursor": next_cursor,
            "page_size": page_size,
            "start_date": start_date.isoformat() if start_date else "",
            "sensor_id": sensor_id or "",
        },
    )
