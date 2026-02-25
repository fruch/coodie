"""Seed the Product Catalog with sample data.

Usage:
    python seed.py              # 50 products + reviews (default)
    python seed.py --count 200  # 200 products + reviews
    python seed.py --feed products.csv  # load from CSV file
"""

from __future__ import annotations

import asyncio
import csv
import json
import os
import random
from pathlib import Path
from uuid import uuid4

import click
from faker import Faker
from rich.console import Console
from rich.progress import track
from rich.table import Table

from coodie.aio import init_coodie

from models import Product, Review

fake = Faker()
console = Console()

BRANDS = ["Acme", "Nexus", "Orbit", "Vertex", "Quantum", "Zenith", "Pulse", "Nova"]
CATEGORIES = ["gadgets", "clothing", "home", "sports", "books", "food", "electronics", "toys"]
TAG_POOL = [
    "bestseller",
    "new",
    "sale",
    "eco-friendly",
    "premium",
    "limited-edition",
    "trending",
    "handmade",
    "organic",
    "imported",
]


def _generate_product() -> Product:
    """Generate a single fake product."""
    return Product(
        id=uuid4(),
        name=fake.catch_phrase(),
        brand=random.choice(BRANDS),
        category=random.choice(CATEGORIES),
        price=round(random.uniform(4.99, 499.99), 2),
        description=fake.sentence(nb_words=12),
        tags=random.sample(TAG_POOL, k=random.randint(1, 4)),
    )


def _generate_review(product_id) -> Review:
    """Generate a single fake review for a product."""
    return Review(
        product_id=product_id,
        author=fake.first_name(),
        rating=random.randint(1, 5),
        content=fake.sentence(nb_words=random.randint(5, 20)),
    )


def _load_products_from_csv(path: str) -> list[Product]:
    """Load products from a CSV file.

    Expected columns: name, brand, category, price, description, tags
    The ``tags`` column should be semicolon-separated values.
    """
    products: list[Product] = []
    with open(path, newline="", encoding="utf-8") as fh:
        reader = csv.DictReader(fh)
        for row in reader:
            tags = [t.strip() for t in row.get("tags", "").split(";") if t.strip()]
            products.append(
                Product(
                    id=uuid4(),
                    name=row["name"],
                    brand=row["brand"],
                    category=row["category"],
                    price=float(row["price"]),
                    description=row.get("description") or None,
                    tags=tags,
                )
            )
    return products


def _load_products_from_json(path: str) -> list[Product]:
    """Load products from a JSON file (list of objects)."""
    with open(path, encoding="utf-8") as fh:
        data = json.load(fh)
    return [
        Product(
            id=uuid4(),
            name=item["name"],
            brand=item["brand"],
            category=item["category"],
            price=float(item["price"]),
            description=item.get("description"),
            tags=item.get("tags", []),
        )
        for item in data
    ]


async def _seed(count: int, feed: str | None) -> None:
    """Connect to ScyllaDB, sync tables, and insert sample data."""
    hosts = os.getenv("SCYLLA_HOSTS", "127.0.0.1").split(",")
    keyspace = os.getenv("SCYLLA_KEYSPACE", "catalog")

    await init_coodie(hosts=hosts, keyspace=keyspace)
    await Product.sync_table()
    await Review.sync_table()

    # --- Load or generate products ---
    if feed:
        ext = Path(feed).suffix.lower()
        if ext == ".csv":
            products = _load_products_from_csv(feed)
        elif ext == ".json":
            products = _load_products_from_json(feed)
        else:
            raise click.BadParameter(f"Unsupported feed format: {ext} (use .csv or .json)")
        console.print(f"[bold cyan]📂 Loaded {len(products)} products from {feed}[/]")
    else:
        products = [_generate_product() for _ in range(count)]

    # --- Insert products ---
    console.print()
    for product in track(
        products,
        description="[cyan]⚡ Cataloging artifacts from the Infinite Bazaar...[/]",
        console=console,
    ):
        await product.save()

    # --- Generate & insert reviews ---
    reviews_count = 0
    for product in track(
        products,
        description="[cyan]💬 Collecting interdimensional reviews...[/]",
        console=console,
    ):
        num_reviews = random.randint(0, 5)
        for _ in range(num_reviews):
            review = _generate_review(product.id)
            await review.save()
            reviews_count += 1

    # --- Summary table ---
    console.print()
    table = Table(title="⚡ Seed Complete — Infinite Bazaar", border_style="cyan")
    table.add_column("Metric", style="bold")
    table.add_column("Count", justify="right", style="green")
    table.add_row("Products", str(len(products)))
    table.add_row("Reviews", str(reviews_count))
    console.print(table)
    console.print()


@click.command()
@click.option("--count", default=50, help="Number of products to generate")
@click.option("--feed", type=click.Path(exists=True), help="CSV or JSON file with product data")
def seed(count: int, feed: str | None) -> None:
    """Seed the Product Catalog with sample data."""
    asyncio.run(_seed(count, feed))


if __name__ == "__main__":
    seed()
