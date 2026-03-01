"""Seed the ephemeral memory vault with stolen memories.

Usage:
    python seed.py                          # 20 tokens, random TTL 20–120s
    python seed.py --count 10               # 10 tokens, random TTL 20–120s
    python seed.py --ttl 60                 # max TTL 60s (range: 20–60s)
    python seed.py --min-ttl 5 --ttl 30    # range 5–30s
"""

from __future__ import annotations

import asyncio
import os
import random

import click
from rich.console import Console
from rich.panel import Panel
from rich.progress import track
from rich.table import Table
from rich.text import Text

from coodie.aio import init_coodie

from models import Session

console = Console()

# --- Story-themed data pools ---

VICTIMS = [
    "Agent Cipher",
    "Agent Flux",
    "Agent Phantom",
    "Agent Nexus",
    "Agent Vortex",
    "Agent Wraith",
    "Agent Pulse",
    "Agent Echo",
    "Agent Rift",
    "Agent Shade",
    "Agent Vector",
    "Agent Void",
    "Captain Jinja",
    "The Middleware",
    "Commander Knit",
    "Dr. Pydantic",
    "Professor Cassandra",
    "Rookie Replication",
    "Veteran Shard",
    "Overseer Query",
]

MEMORY_FRAGMENTS = [
    "The password to the dimensional anchor",
    "The coordinates of the last known stable timeline",
    "How to disable the Scylla-9 consciousness subroutine",
    "The name of the agent who betrayed the Coodie Corps",
    "The location of the emergency keyspace backup",
    "What really happened in Dimension-X during the Nodetool Incident",
    "The one CQL query that can freeze time",
    "The identity of MerchBot Prime's human handler",
    "The resonance frequency that collapses a dimensional rift",
    "The four-word shutdown phrase for EPHEMERA",
    "The childhood home of the last remaining database architect",
    "The exact timestamp when SCYLLA-9 gained sentience",
    "The replication factor of the original Timeline-0",
    "The passphrase to the quantum-encrypted evidence locker",
    "The names of the seven founding members of the Coodie Corps",
    "The mathematical proof that infinite storage is impossible",
    "The song that used to play before every node repair",
    "The last known location of the lost migration script",
    "The true purpose of the 47-minute broadcast cycle",
    "The moment Agent Echo realized she was running in a loop",
]


def _print_briefing(count: int, min_ttl: int, max_ttl: int) -> None:
    """Print the mission briefing story panel."""
    story = Text()
    story.append("DIMENSION-4", style="bold cyan")
    story.append(" — In the ethereal void between timelines,\n")
    story.append("EPHEMERA", style="bold red")
    story.append(", SCYLLA-9's most dangerous fragment, harvests\n")
    story.append("memories from sleeping agents and stores them as session tokens.\n")
    story.append("Each token lives between ")
    story.append(f"{min_ttl}s", style="bold yellow")
    story.append(" and ")
    story.append(f"{max_ttl}s", style="bold yellow")
    story.append(" — a random countdown,\n")
    story.append("then the memory dissolves forever — sold back\n")
    story.append("to the highest bidder before expiry.\n\n")
    story.append("The ", style="dim")
    story.append("Coodie Corps", style="bold cyan")
    story.append(" must inject counter-memories before\n", style="dim")
    story.append("EPHEMERA's tokens expire. Every row is a life.\n", style="dim")
    story.append("Every TTL is a countdown. ⏳", style="dim italic")

    console.print()
    console.print(
        Panel(
            story,
            title="[bold cyan]👻 MISSION BRIEFING — DIMENSION-4 // THE MEMORY VAULT[/]",
            border_style="cyan",
            padding=(1, 2),
        )
    )
    console.print()


async def _seed(count: int, min_ttl: int, max_ttl: int) -> None:
    """Connect to ScyllaDB, sync tables, and insert session tokens with randomized TTL."""
    _print_briefing(count, min_ttl, max_ttl)

    hosts = os.getenv("SCYLLA_HOSTS", "127.0.0.1").split(",")
    keyspace = os.getenv("SCYLLA_KEYSPACE", "ephemera")

    console.print("[dim]📡 Establishing connection to ScyllaDB node...[/]")
    await init_coodie(hosts=hosts, keyspace=keyspace)
    console.print("[dim]🔧 Synchronizing session tables...[/]")
    await Session.sync_table()
    console.print("[dim green]✓ Database ready.[/]")
    console.print()

    sessions: list[Session] = []
    victims = random.sample(VICTIMS, min(count, len(VICTIMS)))
    if count > len(victims):
        # Repeat victims if count exceeds pool
        victims = victims * (count // len(victims) + 1)
    victims = victims[:count]

    for i, victim in track(
        list(enumerate(victims, 1)),
        description=f"[cyan]👻 EPHEMERA  Stealing memories... TTL: {min_ttl}–{max_ttl}s ⏳[/]",
        console=console,
    ):
        memory = random.choice(MEMORY_FRAGMENTS)
        item_ttl = random.randint(min_ttl, max_ttl)
        session = Session(
            user_name=victim,
            memory_fragment=memory,
            ttl_seconds=item_ttl,
        )
        # Demonstrate per-record TTL override via save(ttl=...)
        await session.save(ttl=item_ttl)
        sessions.append(session)
        console.print(
            f"  [dim cyan]  Memory #{i:02d} stolen from [bold]{victim}[/bold]"
            f" — token [yellow]{str(session.token)[:8]}...[/yellow]"
            f" expires in {item_ttl}s[/]"
        )

    # --- Summary table ---
    console.print()
    table = Table(
        title="[bold]👻 EPHEMERA — Memory Vault Status[/]",
        border_style="cyan",
        title_style="bold cyan",
    )
    table.add_column("Metric", style="bold")
    table.add_column("Value", justify="right", style="green")
    table.add_column("Note", style="dim")
    table.add_row("Memories Stolen", str(len(sessions)), "✓ Stored with TTL")
    table.add_row("TTL range (seconds)", f"{min_ttl}–{max_ttl}", "✓ Randomized per row")
    table.add_row("Default TTL (model)", "300s", "✓ Settings.__default_ttl__")
    table.add_row("Victims", str(len(set(s.user_name for s in sessions))), "✓ Cataloged")
    console.print(table)
    console.print()
    console.print(f"[bold cyan]👻 {len(sessions)} memories harvested. They dissolve in {min_ttl}–{max_ttl} seconds.[/]")
    console.print("[dim]   Launch the app with: uv run uvicorn main:app --reload[/]")
    console.print()


@click.command()
@click.option("--count", default=20, help="Number of session tokens to generate")
@click.option("--min-ttl", "min_ttl", default=20, help="Minimum TTL in seconds (per-token lower bound)")
@click.option("--ttl", "max_ttl", default=120, help="Maximum TTL in seconds (per-token upper bound)")
def seed(count: int, min_ttl: int, max_ttl: int) -> None:
    """Seed the Memory Vault with stolen memories (randomized TTL sessions)."""
    asyncio.run(_seed(count, min_ttl, max_ttl))


if __name__ == "__main__":
    seed()
