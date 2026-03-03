"""FastAPI Realtime Counters demo — The Pulse Engine.

Showcases coodie's CounterDocument support:
- ``CounterDocument`` base class for counter tables
- ``Annotated[int, Counter()]`` for counter columns
- ``increment(**field_deltas)`` for atomic counter increments
- ``decrement(**field_deltas)`` for atomic counter decrements
- Counter tables forbid ``save()`` / ``insert()``
"""

from __future__ import annotations

__version__ = "0.1.0"

import os
from contextlib import asynccontextmanager
from pathlib import Path
from typing import AsyncIterator

from fastapi import FastAPI, Form, HTTPException, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

from coodie.aio import init_coodie

from models import PageViewCounter

BASE_DIR = Path(__file__).resolve().parent
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Startup: connect to ScyllaDB and sync tables."""
    hosts = os.getenv("SCYLLA_HOSTS", "127.0.0.1").split(",")
    keyspace = os.getenv("SCYLLA_KEYSPACE", "analytics")
    await init_coodie(hosts=hosts, keyspace=keyspace)
    await PageViewCounter.sync_table()
    yield


app = FastAPI(
    title="Realtime Counters — The Pulse Engine",
    version="0.1.0",
    lifespan=lifespan,
)


# ------------------------------------------------------------------
# JSON API routes
# ------------------------------------------------------------------


@app.get("/counters")
async def list_counters() -> list[dict]:
    """Return all page-view counters."""
    counters = await PageViewCounter.find().allow_filtering().all()
    return [
        {
            "url": c.url,
            "date": c.date,
            "view_count": c.view_count,
            "unique_visitors": c.unique_visitors,
        }
        for c in counters
    ]


@app.get("/counters/{url:path}")
async def get_counter(url: str, date: str | None = None) -> list[dict]:
    """Get counters for a specific URL, optionally filtered by date."""
    kwargs: dict = {"url": url}
    if date:
        kwargs["date"] = date
    counters = await PageViewCounter.find(**kwargs).all()
    if not counters:
        raise HTTPException(status_code=404, detail="No counters found for this URL")
    return [
        {
            "url": c.url,
            "date": c.date,
            "view_count": c.view_count,
            "unique_visitors": c.unique_visitors,
        }
        for c in counters
    ]


@app.post("/counters/increment", status_code=200)
async def increment_counter(
    url: str,
    date: str,
    view_count: int = 1,
    unique_visitors: int = 0,
) -> dict:
    """Increment counters for a URL/date pair.

    Demonstrates ``CounterDocument.increment(**field_deltas)``.
    """
    counter = PageViewCounter(url=url, date=date)
    await counter.increment(view_count=view_count, unique_visitors=unique_visitors)
    return {"url": url, "date": date, "incremented": {"view_count": view_count, "unique_visitors": unique_visitors}}


@app.post("/counters/decrement", status_code=200)
async def decrement_counter(
    url: str,
    date: str,
    view_count: int = 1,
    unique_visitors: int = 0,
) -> dict:
    """Decrement counters for a URL/date pair.

    Demonstrates ``CounterDocument.decrement(**field_deltas)``.
    """
    counter = PageViewCounter(url=url, date=date)
    await counter.decrement(view_count=view_count, unique_visitors=unique_visitors)
    return {"url": url, "date": date, "decremented": {"view_count": view_count, "unique_visitors": unique_visitors}}


# ------------------------------------------------------------------
# HTMX UI routes
# ------------------------------------------------------------------


@app.get("/", response_class=HTMLResponse)
async def ui_index(request: Request) -> HTMLResponse:
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/ui/counters", response_class=HTMLResponse)
async def ui_list_counters(request: Request) -> HTMLResponse:
    counters = await PageViewCounter.find().allow_filtering().all()
    counters_sorted = sorted(counters, key=lambda c: (c.url, c.date))
    return templates.TemplateResponse(
        "partials/counter_list.html",
        {"request": request, "counters": counters_sorted},
    )


@app.post("/ui/counters/increment", response_class=HTMLResponse)
async def ui_increment_counter(
    request: Request,
    url: str = Form(),
    date: str = Form(),
    view_count: int = Form(default=1),
    unique_visitors: int = Form(default=0),
) -> HTMLResponse:
    """Increment a counter from the HTMX form and return the updated list."""
    counter = PageViewCounter(url=url, date=date)
    await counter.increment(view_count=view_count, unique_visitors=unique_visitors)
    counters = await PageViewCounter.find().allow_filtering().all()
    counters_sorted = sorted(counters, key=lambda c: (c.url, c.date))
    return templates.TemplateResponse(
        "partials/counter_list.html",
        {"request": request, "counters": counters_sorted},
    )


@app.post("/ui/counters/decrement", response_class=HTMLResponse)
async def ui_decrement_counter(
    request: Request,
    url: str = Form(),
    date: str = Form(),
    view_count: int = Form(default=1),
    unique_visitors: int = Form(default=0),
) -> HTMLResponse:
    """Decrement a counter from the HTMX form and return the updated list."""
    counter = PageViewCounter(url=url, date=date)
    await counter.decrement(view_count=view_count, unique_visitors=unique_visitors)
    counters = await PageViewCounter.find().allow_filtering().all()
    counters_sorted = sorted(counters, key=lambda c: (c.url, c.date))
    return templates.TemplateResponse(
        "partials/counter_list.html",
        {"request": request, "counters": counters_sorted},
    )
