"""FastAPI IoT Sensor Dashboard — Station Argos-7.

Showcases coodie's time-series capabilities:
- **Time-bucketed partitions** — ``(sensor_id, date_bucket)`` composite PK
- **ClusteringKey(order="DESC")** — newest readings first within each partition
- **per_partition_limit()** — latest N readings per sensor in one query
- **paged_all()** — cursor-based pagination across large result sets
"""

from __future__ import annotations

__version__ = "0.1.0"

import base64
import os
from contextlib import asynccontextmanager
from datetime import date, timedelta
from pathlib import Path
from typing import AsyncIterator

from fastapi import FastAPI, Query, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

from coodie.aio import init_coodie
from coodie.results import PagedResult

from models import SensorReading

BASE_DIR = Path(__file__).resolve().parent
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Startup: connect to ScyllaDB and sync tables."""
    hosts = os.getenv("SCYLLA_HOSTS", "127.0.0.1").split(",")
    keyspace = os.getenv("SCYLLA_KEYSPACE", "iot")
    await init_coodie(hosts=hosts, keyspace=keyspace)
    await SensorReading.sync_table()
    yield


app = FastAPI(
    title="IoT Sensor Dashboard — Station Argos-7",
    version="0.1.0",
    lifespan=lifespan,
)


# ------------------------------------------------------------------
# JSON API routes
# ------------------------------------------------------------------


@app.get("/sensors")
async def list_sensors() -> list[str]:
    """Return distinct sensor IDs found in the data."""
    today = date.today()
    sensors: set[str] = set()
    for day_offset in range(7):
        bucket = today - timedelta(days=day_offset)
        readings = (
            await SensorReading.find(date_bucket=bucket)
            .per_partition_limit(1)
            .allow_filtering()
            .all()
        )
        for r in readings:
            sensors.add(r.sensor_id)
    return sorted(sensors)


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
        readings = (
            await SensorReading.find(sensor_id=sensor_id, date_bucket=bucket)
            .per_partition_limit(limit)
            .all()
        )
        all_readings.extend(readings)
    return all_readings


@app.get("/readings/paged")
async def get_paged_readings(
    sensor_id: str | None = Query(default=None),
    bucket: date | None = Query(default=None),
    page_size: int = Query(default=10, ge=1, le=100),
    cursor: str | None = Query(default=None),
) -> dict:
    """Paginated reading list using paged_all().

    Demonstrates ``paged_all()`` — returns a ``PagedResult`` with a
    ``paging_state`` cursor that can be passed back to fetch the next page.
    """
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
    sensor_ids: set[str] = set()
    for day_offset in range(3):
        bucket = today - timedelta(days=day_offset)
        readings = (
            await SensorReading.find(date_bucket=bucket)
            .per_partition_limit(1)
            .allow_filtering()
            .all()
        )
        for r in readings:
            sensor_ids.add(r.sensor_id)

    # Get latest 5 readings per sensor (today's partition)
    for sid in sorted(sensor_ids):
        readings = (
            await SensorReading.find(sensor_id=sid, date_bucket=today)
            .per_partition_limit(5)
            .all()
        )
        if not readings:
            # Try yesterday if no data today
            yesterday = today - timedelta(days=1)
            readings = (
                await SensorReading.find(sensor_id=sid, date_bucket=yesterday)
                .per_partition_limit(5)
                .all()
            )
        sensors[sid] = readings

    return templates.TemplateResponse(
        "partials/dashboard.html",
        {"request": request, "sensors": sensors},
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
        day_readings = (
            await SensorReading.find(sensor_id=sensor_id, date_bucket=bucket)
            .per_partition_limit(20)
            .all()
        )
        readings.extend(day_readings)

    return templates.TemplateResponse(
        "partials/sensor_detail.html",
        {"request": request, "sensor_id": sensor_id, "readings": readings, "days": days},
    )


@app.get("/ui/paged", response_class=HTMLResponse)
async def ui_paged_readings(
    request: Request,
    page_size: int = Query(default=10, ge=1, le=50),
    cursor: str | None = Query(default=None),
) -> HTMLResponse:
    """Return a page of readings using paged_all() for HTMX infinite scroll."""
    qs = SensorReading.find().fetch_size(page_size).allow_filtering()
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
        },
    )
