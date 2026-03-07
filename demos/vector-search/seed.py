"""Seed the vector-search demo with sample products and pre-computed embeddings.

Usage:
    python seed.py              # 30 products (default)
    python seed.py --count 50   # 50 products

Embeddings are deterministic 16-dimensional vectors derived from product
descriptions via a simple hash-based projection (no ML model required).
"""

from __future__ import annotations

import asyncio
import hashlib
import math
import os
import random

import click
from rich.console import Console
from rich.panel import Panel
from rich.progress import track
from rich.table import Table
from rich.text import Text

from coodie.aio import init_coodie

from models import ProductEmbedding

console = Console()

# ------------------------------------------------------------------
# Sample product catalog
# ------------------------------------------------------------------

PRODUCTS = [
    ("Wireless Noise-Cancelling Headphones", "electronics", "Premium over-ear headphones with ANC and 30-hour battery life", 299.99),
    ("Ergonomic Mechanical Keyboard", "electronics", "Cherry MX switches, split layout, wrist rest included", 179.99),
    ("Ultra-Wide Curved Monitor 34\"", "electronics", "3440×1440 IPS panel, 144Hz, USB-C hub built in", 549.99),
    ("Portable Bluetooth Speaker", "electronics", "Waterproof speaker with 360-degree sound and 12-hour battery", 79.99),
    ("Smart Home Hub", "electronics", "Voice-controlled hub compatible with Zigbee, Z-Wave, and WiFi devices", 129.99),
    ("Organic Green Tea Collection", "food", "Assorted pack of 6 premium Japanese green teas, 50 tea bags", 24.99),
    ("Dark Chocolate Truffle Box", "food", "Handcrafted Belgian truffles, assorted flavors, gift box of 24", 39.99),
    ("Artisan Sourdough Bread Mix", "food", "Just add water — organic flour blend for perfect sourdough loaves", 12.99),
    ("Cold Brew Coffee Concentrate", "food", "Single-origin Ethiopian beans, 32oz bottle, makes 16 servings", 18.99),
    ("Gourmet Hot Sauce Trio", "food", "Habanero, ghost pepper, and smoky chipotle — handmade small batch", 29.99),
    ("Running Shoes Ultra Boost", "sports", "Lightweight with responsive cushioning and breathable mesh upper", 159.99),
    ("Yoga Mat Premium", "sports", "Extra-thick 6mm mat with alignment lines, non-slip surface", 49.99),
    ("Adjustable Dumbbells Set", "sports", "5–52.5 lbs each, quick-change mechanism, compact design", 349.99),
    ("Cycling Water Bottle 750ml", "sports", "Insulated, BPA-free, fits standard bottle cages", 19.99),
    ("Resistance Bands Set", "sports", "5 bands with handles, door anchor, and carry bag for home workouts", 34.99),
    ("Hardcover Sci-Fi Novel", "books", "A sweeping space opera spanning three galaxies and five centuries", 27.99),
    ("Python Programming Cookbook", "books", "300+ recipes for data science, web dev, and automation with Python", 44.99),
    ("Watercolor Painting Guide", "books", "Step-by-step tutorials for beginners, includes 12 project ideas", 22.99),
    ("History of Ancient Rome", "books", "Comprehensive account from founding to fall, richly illustrated", 35.99),
    ("Mindfulness Meditation Journal", "books", "Guided 90-day journal with daily prompts and reflection space", 16.99),
    ("Ceramic Plant Pot Set", "home", "Set of 3 minimalist pots with drainage, matte white finish", 42.99),
    ("LED Desk Lamp Adjustable", "home", "Touch dimming, 5 color temperatures, USB charging port", 54.99),
    ("Scented Candle Gift Set", "home", "4 soy wax candles — lavender, vanilla, cedar, ocean breeze", 32.99),
    ("Bamboo Cutting Board", "home", "Extra-large with juice groove, organic bamboo, knife-friendly", 29.99),
    ("Smart Thermostat", "home", "Wi-Fi enabled, learns your schedule, saves up to 25% on energy", 199.99),
    ("Wireless Earbuds Active", "electronics", "Sweat-resistant with secure fit, 8-hour playtime, quick charge", 89.99),
    ("Espresso Machine Compact", "home", "15-bar pressure, built-in grinder, steaming wand for lattes", 449.99),
    ("Trail Running Backpack 12L", "sports", "Hydration-compatible vest pack with reflective details", 69.99),
    ("Graphic Novel Anthology", "books", "Collection of 10 award-winning short graphic stories", 31.99),
    ("Organic Protein Bars Box", "food", "12-pack, peanut butter chocolate, 20g protein per bar", 27.99),
]


def _text_to_embedding(text: str, dimensions: int = 16) -> list[float]:
    """Derive a deterministic embedding from text using hash-based projection.

    This is a simple, dependency-free approach that produces consistent vectors
    for the same input text. Not a real embedding model — purely for demo purposes.
    """
    raw: list[float] = []
    for i in range(dimensions):
        h = hashlib.sha256(f"{text}:{i}".encode()).hexdigest()
        raw.append(int(h[:8], 16) / 0xFFFFFFFF * 2 - 1)  # map to [-1, 1]

    # L2-normalize
    norm = math.sqrt(sum(x * x for x in raw))
    if norm > 0:
        raw = [x / norm for x in raw]

    return raw


def _print_briefing() -> None:
    story = Text()
    story.append("NEURAL INDEX ONLINE", style="bold cyan")
    story.append(" — The product catalog has been vectorized.\n")
    story.append("Each product carries a ", style="dim")
    story.append("16-dimensional embedding", style="bold cyan")
    story.append(" derived from its\n", style="dim")
    story.append("description. The vector index uses ", style="dim")
    story.append("cosine similarity", style="bold cyan")
    story.append(" to find\n", style="dim")
    story.append("semantically similar products via ", style="dim")
    story.append("ORDER BY … ANN OF", style="bold yellow")
    story.append(" queries.\n\n", style="dim")
    story.append("🔍 Seeding the product embeddings catalog...", style="dim italic")

    console.print()
    console.print(
        Panel(
            story,
            title="[bold cyan]🔍 VECTOR SEARCH — NEURAL PRODUCT INDEX[/]",
            border_style="cyan",
            padding=(1, 2),
        )
    )
    console.print()


async def _seed(count: int) -> None:
    _print_briefing()

    hosts = os.getenv("SCYLLA_HOSTS", "127.0.0.1").split(",")
    keyspace = os.getenv("SCYLLA_KEYSPACE", "vector_demo")

    console.print("[dim]📡 Connecting to ScyllaDB...[/]")
    await init_coodie(hosts=hosts, keyspace=keyspace)
    console.print("[dim]🔧 Synchronizing product_embeddings table...[/]")
    await ProductEmbedding.sync_table()
    console.print("[dim green]✓ Table and vector index ready.[/]")
    console.print()

    products_to_seed = PRODUCTS[:count] if count < len(PRODUCTS) else PRODUCTS
    # If count > len(PRODUCTS), add random variations
    while len(products_to_seed) < count:
        base = random.choice(PRODUCTS)
        variation = (
            f"{base[0]} v{random.randint(2, 9)}",
            base[1],
            base[2],
            round(base[3] * random.uniform(0.8, 1.3), 2),
        )
        products_to_seed = [*products_to_seed, variation]

    console.print(f"[bold cyan]Seeding {len(products_to_seed)} products with embeddings...[/]")
    seeded = 0

    for name, category, description, price in track(
        products_to_seed,
        description="[cyan]🧠 Computing embeddings...[/]",
        console=console,
    ):
        embedding = _text_to_embedding(description)
        product = ProductEmbedding(
            name=name,
            category=category,
            description=description,
            price=price,
            embedding=embedding,
        )
        await product.save()
        seeded += 1

    # Summary
    console.print()
    categories = {p[1] for p in products_to_seed}

    table = Table(
        title="[bold]🔍 VECTOR SEARCH — Seed Summary[/]",
        border_style="cyan",
        title_style="bold cyan",
    )
    table.add_column("Metric", style="bold")
    table.add_column("Value", justify="right", style="green")
    table.add_row("Products Seeded", str(seeded))
    table.add_row("Categories", ", ".join(sorted(categories)))
    table.add_row("Embedding Dimensions", "16")
    table.add_row("Similarity Function", "COSINE")
    console.print(table)
    console.print()
    console.print("[bold cyan]🔍 The neural product index is live.[/]")
    console.print("[dim]   Launch the app: uv run uvicorn main:app --reload[/]")
    console.print()


@click.command()
@click.option("--count", default=30, help="Number of products to seed")
def seed(count: int) -> None:
    """Seed the product embeddings catalog."""
    asyncio.run(_seed(count))


if __name__ == "__main__":
    seed()
