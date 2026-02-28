"""FastAPI TTL Sessions demo showcasing coodie's TTL support."""

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
from coodie.drivers import get_driver

from models import Session

BASE_DIR = Path(__file__).resolve().parent
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Startup: connect to ScyllaDB and sync tables."""
    hosts = os.getenv("SCYLLA_HOSTS", "127.0.0.1").split(",")
    keyspace = os.getenv("SCYLLA_KEYSPACE", "ephemera")
    await init_coodie(hosts=hosts, keyspace=keyspace)
    await Session.sync_table()
    yield


app = FastAPI(title="TTL Sessions — The Memory Thief", version="0.1.0", lifespan=lifespan)


async def _fetch_sessions_with_ttl() -> list[dict]:
    """Query sessions with remaining TTL using the CQL TTL() function."""
    driver = get_driver()
    # TTL(column) returns the remaining seconds for that column's TTL.
    # We query TTL(memory) as a non-null non-PK column to get the row TTL.
    keyspace = Session._get_keyspace()
    table = Session._get_table()
    cql = (
        f"SELECT token, user_id, memory, dimension, stolen_at, TTL(memory) AS remaining_ttl "
        f"FROM {keyspace}.{table}"
    )
    rows = await driver.execute_async(cql, [])
    return list(rows)


# ------------------------------------------------------------------
# JSON API routes
# ------------------------------------------------------------------


@app.get("/api/sessions")
async def api_list_sessions() -> list[dict]:
    """List all active sessions with their remaining TTL."""
    return await _fetch_sessions_with_ttl()


@app.post("/api/sessions", status_code=201)
async def api_create_session(
    token: str,
    memory: str,
    dimension: str = "Dimension-4",
    ttl: int = 30,
) -> dict:
    """Create a new session with an explicit TTL (default 30 s)."""
    session = Session(token=token, memory=memory, dimension=dimension, ttl_seconds=ttl)
    await session.save(ttl=ttl)
    return {"token": token, "ttl": ttl}


@app.delete("/api/sessions/{token}", status_code=204)
async def api_delete_session(token: str) -> None:
    """Immediately delete a session (before its TTL expires)."""
    session = await Session.find_one(token=token)
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")
    await session.delete()


# ------------------------------------------------------------------
# HTMX UI routes (server-rendered HTML fragments)
# ------------------------------------------------------------------


@app.get("/", response_class=HTMLResponse)
async def ui_index(request: Request) -> HTMLResponse:
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/ui/sessions", response_class=HTMLResponse)
async def ui_list_sessions(request: Request) -> HTMLResponse:
    rows = await _fetch_sessions_with_ttl()
    return templates.TemplateResponse(
        "partials/session_list.html",
        {"request": request, "sessions": rows},
    )


@app.post("/ui/sessions", response_class=HTMLResponse)
async def ui_create_session(
    request: Request,
    token: str = Form(),
    memory: str = Form(),
    dimension: str = Form(default="Dimension-4"),
    ttl: int = Form(default=30),
) -> HTMLResponse:
    """Create a session and return the refreshed session list."""
    session = Session(token=token, memory=memory, dimension=dimension, ttl_seconds=ttl)
    await session.save(ttl=ttl)
    rows = await _fetch_sessions_with_ttl()
    return templates.TemplateResponse(
        "partials/session_list.html",
        {"request": request, "sessions": rows},
    )


@app.delete("/ui/sessions/{token}", response_class=HTMLResponse)
async def ui_delete_session(request: Request, token: str) -> HTMLResponse:
    """Immediately purge a session and return the refreshed list."""
    session = await Session.find_one(token=token)
    if session is not None:
        await session.delete()
    rows = await _fetch_sessions_with_ttl()
    return templates.TemplateResponse(
        "partials/session_list.html",
        {"request": request, "sessions": rows},
    )
