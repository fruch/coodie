"""Seed the Memory Vault with stolen memories.

Usage:
    python seed.py              # 20 memories (default, TTL=30s each)
    python seed.py --count 50   # 50 memories
    python seed.py --ttl 60     # override TTL to 60 seconds
"""

from __future__ import annotations

import asyncio
import os
import random
import string

import click
from faker import Faker
from rich.console import Console
from rich.panel import Panel
from rich.progress import track
from rich.table import Table
from rich.text import Text

from coodie.aio import init_coodie

from models import Session

fake = Faker()
console = Console()

# --- Story-themed data pools ---

DIMENSIONS = [
    "Dimension-4",
    "Dimension-2",
    "Dimension-7",
    "Dimension-9",
    "Void-Rift",
    "Echo-Layer",
    "Null-Space",
]

MEMORY_FRAGMENTS = [
    "First steps on the moon of Cassandra-Prime — the silver dust, the silence",
    "The password to the resistance bunker in Sector-7: it was written on a napkin",
    "My daughter's laugh on her third birthday, before the memory wipe",
    "The location of the last uncorrupted SCYLLA-9 backup drive",
    "How to reverse a dimensional rift using only a coffee mug and a clustering key",
    "Agent Cipher's real name — I can feel it slipping away",
    "The recipe for Captain Jinja's grandmother's memory-stabilizing soup",
    "The access code to the Coodie Corps' emergency time-lock vault",
    "That afternoon on the beach in Dimension-9 — the light was impossibly blue",
    "How to speak the ancient Cassandran dialect of the Void-Walker clan",
    "The day I realized the database was alive and looking back at me",
    "Every face of every person I've loved across timelines — already gone",
    "The formula for the anti-Ephemera psionic shield frequency",
    "My own name, written in a language I no longer remember learning",
    "The moment SCYLLA-9 first became conscious — I was there",
    "Why the clustering key matters more than the partition key",
    "The three words that can deactivate Ephemera's memory extraction array",
    "Coordinates of the resistance outpost hidden in the time-rift buffer",
    "The secret of why all distributed databases eventually become sentient",
    "A promise I made to someone whose face I can no longer see",
]

VICTIM_ARCHETYPES = [
    "resistance-fighter",
    "database-architect",
    "time-traveler",
    "void-walker",
    "memory-keeper",
    "coodie-corps-agent",
    "dimension-refugee",
    "psionic-monk",
    "temporal-engineer",
    "echo-layer-survivor",
]


def _make_token(length: int = 8) -> str:
    """Generate a short alphanumeric session token."""
    return "".join(random.choices(string.ascii_uppercase + string.digits, k=length))


def _generate_session(ttl: int) -> Session:
    """Generate a single story-themed memory session."""
    return Session(
        token=_make_token(),
        memory=random.choice(MEMORY_FRAGMENTS),
        dimension=random.choice(DIMENSIONS),
        ttl_seconds=ttl,
    )


def _print_briefing() -> None:
    """Print the mission briefing story panel."""
    story = Text()
    story.append("YEAR 2187", style="bold cyan")
    story.append(" — SCYLLA-9's fragment in Dimension-4 became\n")
    story.append("Ephemera", style="bold red")
    story.append(", an AI that steals memories and sells them back.\n")
    story.append("It stores every stolen memory as a session token — but with a ")
    story.append("TTL", style="bold yellow")
    story.append(".\n")
    story.append("After 30 seconds, the memory dissolves forever.\n")
    story.append("Entire planets have forgotten their own names.\n\n")
    story.append("The ", style="dim")
    story.append("Coodie Corps", style="bold cyan")
    story.append(" must inject ", style="dim")
    story.append("real memories", style="bold")
    story.append(" before Ephemera's fake ones expire.\n", style="dim")
    story.append("Every row in this table is a ticking clock... ⏳", style="dim italic")

    console.print()
    console.print(
        Panel(
            story,
            title="[bold cyan]👻 MISSION BRIEFING — DIMENSION-4 // THE MEMORY THIEF[/]",
            border_style="cyan",
            padding=(1, 2),
        )
    )
    console.print()


async def _seed(count: int, ttl: int) -> None:
    """Connect to ScyllaDB, sync tables, and insert sample sessions."""
    _print_briefing()

    hosts = os.getenv("SCYLLA_HOSTS", "127.0.0.1").split(",")
    keyspace = os.getenv("SCYLLA_KEYSPACE", "ephemera")

    console.print("[dim]📡 Establishing connection to ScyllaDB node...[/]")
    await init_coodie(hosts=hosts, keyspace=keyspace)
    console.print("[dim]🔧 Synchronizing memory tables...[/]")
    await Session.sync_table()
    console.print("[dim green]✓ Database ready.[/]")
    console.print()

    console.print(
        f"[bold yellow]⚠  TTL = {ttl}s — every memory will self-destruct in {ttl} seconds[/]"
    )
    console.print()

    sessions = [_generate_session(ttl) for _ in range(count)]

    for session in track(
        sessions,
        description=f"[cyan]👻 EPHEMERA  Stealing memories... TTL: {ttl}s ⏳[/]",
        console=console,
    ):
        # Demonstrate per-save TTL override — this is the key coodie feature!
        await session.save(ttl=ttl)

    console.print()
    table = Table(
        title="[bold]👻 EPHEMERA — Memory Extraction Status[/]",
        border_style="cyan",
        title_style="bold cyan",
    )
    table.add_column("Metric", style="bold")
    table.add_column("Value", justify="right", style="green")
    table.add_column("Status", style="dim")
    table.add_row("Memories Stolen", str(len(sessions)), "✓ Encrypted")
    table.add_row("TTL Per Memory", f"{ttl}s", "⏳ Counting down")
    table.add_row(
        "Table Default TTL",
        "30s",
        "✓ Set via __default_ttl__",
    )
    table.add_row(
        "Dimensions Targeted",
        str(len({s.dimension for s in sessions})),
        "✓ Mapped",
    )
    console.print(table)
    console.print()
    console.print("[bold cyan]👻 Ephemera's memory vault is loaded. The clock is ticking.[/]")
    console.print(
        f"[dim]   Memories will auto-expire in {ttl}s — watch them vanish in the UI.[/]"
    )
    console.print("[dim]   Launch the app with: uv run uvicorn main:app --reload[/]")
    console.print()


@click.command()
@click.option("--count", default=20, help="Number of memory sessions to generate")
@click.option("--ttl", default=30, help="TTL in seconds for each session (passed to save(ttl=N), overriding __default_ttl__)")
def seed(count: int, ttl: int) -> None:
    """Seed Ephemera's memory vault with stolen memories."""
    asyncio.run(_seed(count, ttl))


if __name__ == "__main__":
    seed()
