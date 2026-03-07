"""FastAPI vector search demo showcasing coodie's ANN query support."""

from __future__ import annotations

__version__ = "0.1.0"

import hashlib
import math
import os
from contextlib import asynccontextmanager
from pathlib import Path
from typing import AsyncIterator

from fastapi import FastAPI, Form, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

from coodie.aio import init_coodie

from models import ProductEmbedding

BASE_DIR = Path(__file__).resolve().parent
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))


def _text_to_embedding(text: str, dimensions: int = 16) -> list[float]:
    """Derive a deterministic embedding from text (same as seed.py)."""
    raw: list[float] = []
    for i in range(dimensions):
        h = hashlib.sha256(f"{text}:{i}".encode()).hexdigest()
        raw.append(int(h[:8], 16) / 0xFFFFFFFF * 2 - 1)
    norm = math.sqrt(sum(x * x for x in raw))
    if norm > 0:
        raw = [x / norm for x in raw]
    return raw


def _cosine_similarity(a: list[float], b: list[float]) -> float:
    """Compute cosine similarity between two vectors."""
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(x * x for x in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Startup: connect to ScyllaDB and sync tables."""
    hosts = os.getenv("SCYLLA_HOSTS", "127.0.0.1").split(",")
    keyspace = os.getenv("SCYLLA_KEYSPACE", "vector_demo")
    await init_coodie(hosts=hosts, keyspace=keyspace)
    await ProductEmbedding.sync_table()
    yield


app = FastAPI(title="Vector Search Demo", version="0.1.0", lifespan=lifespan)


@app.get("/", response_class=HTMLResponse)
async def ui_index(request: Request) -> HTMLResponse:
    """Render the main search page."""
    total = await ProductEmbedding.find().count()
    return templates.TemplateResponse("index.html", {"request": request, "total": total})


@app.post("/ui/search", response_class=HTMLResponse)
async def ui_search(
    request: Request,
    query: str = Form(default=""),
    limit: int = Form(default=10),
) -> HTMLResponse:
    """Compute embedding for the query text and run ANN search."""
    if not query.strip():
        return templates.TemplateResponse(
            "partials/results.html",
            {"request": request, "results": [], "query": ""},
        )

    query_embedding = _text_to_embedding(query)
    products = await (
        ProductEmbedding.find()
        .order_by_ann("embedding", query_embedding)
        .limit(limit)
        .all()
    )

    # Compute similarity scores for display
    results = []
    for p in products:
        score = _cosine_similarity(query_embedding, p.embedding)
        results.append({"product": p, "score": score})

    return templates.TemplateResponse(
        "partials/results.html",
        {"request": request, "results": results, "query": query},
    )


@app.get("/ui/browse", response_class=HTMLResponse)
async def ui_browse(request: Request) -> HTMLResponse:
    """Browse all products (no vector search)."""
    products = await ProductEmbedding.find().limit(50).all()
    return templates.TemplateResponse(
        "partials/browse.html",
        {"request": request, "products": products},
    )
