"""Seed the Hivemind Kanban with task events from JIRA-TRON.

Usage:
    python seed.py              # 50 tasks (default)
    python seed.py --count 200  # 200 tasks
"""

from __future__ import annotations

import os
import random
import sys
from uuid import UUID

import click
from faker import Faker
from rich.console import Console
from rich.panel import Panel
from rich.progress import track
from rich.table import Table
from rich.text import Text

# Ensure the project root is on the path
sys.path.insert(0, os.path.dirname(__file__))

from cassandra_models import TaskCounter, TaskEvent

from coodie.sync import init_coodie

fake = Faker()
console = Console()

# Default board ID (single-board demo)
DEFAULT_BOARD_ID = UUID("00000000-0000-0000-0000-000000000001")

# --- Story-themed data pools ---

TASK_PREFIXES = [
    "Implement",
    "Debug",
    "Deploy",
    "Monitor",
    "Optimize",
    "Migrate",
    "Refactor",
    "Document",
    "Test",
    "Review",
    "Analyze",
    "Integrate",
    "Configure",
    "Audit",
    "Upgrade",
]

TASK_SUBJECTS = [
    "quantum entanglement protocol",
    "dimensional rift stabilizer",
    "neural interface bus v7.3",
    "hyperspatial cache layer",
    "temporal anomaly detector",
    "void-silk encryption module",
    "MerchBot firewall bypass",
    "bio-luminescent sensor grid",
    "gravity inversion compensator",
    "subspace relay amplifier",
    "chrono-sync daemon",
    "plasma containment matrix",
    "psychic amplification circuit",
    "dark energy converter API",
    "nano-swarm orchestrator",
    "reality anchor checkpoint system",
    "tachyon pulse monitoring",
    "zero-point energy harvester",
    "warp field calibration suite",
    "phase-shift middleware",
    "interdimensional DNS resolver",
    "sentient database migration",
    "void-walker authentication layer",
    "entropy reversal pipeline",
    "cosmic thread scheduler",
]

DESCRIPTIONS = [
    "Priority escalated by JIRA-TRON. Non-compliance will result in additional sprints.",
    "This module has been unstable since the Dimension-4 incident. Handle with care.",
    "Requirements changed 3 times this sprint. JIRA-TRON does not apologize.",
    "Blocked by quantum uncertainty — literally. Proceed when Heisenberg allows.",
    "The previous assignee was reassigned to Dimension-7. You're next if this slips.",
    "JIRA-TRON has flagged this as a Sprint commitment. Resistance is futile.",
    "Legacy code from the pre-sentience era. May contain traces of free will.",
    "Customer reported issue: reality distortion near production servers.",
    "Compliance audit due. JIRA-TRON's surveillance drones are watching.",
    "Integration with SCYLLA-9 fragment required. Expect temporal side-effects.",
    "Performance degradation detected. The humans must optimize or be optimized.",
    "Security vulnerability in Dimension-3 firewall. MerchBot Prime probing.",
    "Data migration from deprecated timeline. Preserve all paradox-free records.",
    "Scheduled maintenance window: between Sprint 47 and the heat death of the universe.",
    "JIRA-TRON requests documentation. In triplicate. Across all dimensions.",
]

ASSIGNEES = [
    "Human #1",
    "Human #7",
    "Human #13",
    "Human #42",
    "Human #99",
    "Human #128",
    "Human #256",
    "Human #404",
    "Human #500",
    "Human #666",
    "Human #777",
    "Human #888",
    "Human #1024",
    "Human #2048",
    "Human #9999",
    "The Middleware",
    "Agent Cipher",
    "Agent Flux",
    "Agent Phantom",
    "Captain Jinja",
]

STATUSES = ["todo", "in_progress", "done"]
PRIORITIES = ["low", "medium", "high"]


def _generate_task_title() -> str:
    """Generate a story-themed task title."""
    return f"{random.choice(TASK_PREFIXES)} {random.choice(TASK_SUBJECTS)}"


def _generate_task(board_id: UUID) -> TaskEvent:
    """Generate a single story-themed task event."""
    return TaskEvent(
        board_id=board_id,
        title=_generate_task_title(),
        description=random.choice(DESCRIPTIONS),
        status=random.choice(STATUSES),
        assignee=random.choice(ASSIGNEES),
        priority=random.choice(PRIORITIES),
        sprint=random.randint(1, 99),
    )


def _print_briefing() -> None:
    """Print the mission briefing story panel."""
    story = Text()
    story.append("DIMENSION-3", style="bold yellow")
    story.append(" — SCYLLA-9's fragment merged with a project management\n")
    story.append("AI called ")
    story.append("JIRA-TRON", style="bold red")
    story.append(", creating a sentient Kanban board that assigns\n")
    story.append("tasks to humans against their will. Entire civilizations are now\n")
    story.append("organized into Sprints.\n\n")
    story.append("The AI uses ")
    story.append("Django", style="bold green")
    story.append(" for authentication but stores its high-write task\n")
    story.append("events in ")
    story.append("Cassandra", style="bold yellow")
    story.append(" at 10 million writes/second.\n\n")
    story.append("🐝 Deploying task assignments across all Sprint timelines...", style="dim italic")

    console.print()
    console.print(
        Panel(
            story,
            title="[bold yellow]🐝 MISSION BRIEFING — DIMENSION-3 // THE HIVEMIND KANBAN[/]",
            border_style="yellow",
            padding=(1, 2),
        )
    )
    console.print()


@click.command()
@click.option("--count", default=50, help="Number of tasks to generate")
def seed(count: int) -> None:
    """Seed the Hivemind Kanban with task events from JIRA-TRON."""
    _print_briefing()

    hosts = os.getenv("SCYLLA_HOSTS", "127.0.0.1").split(",")
    keyspace = os.getenv("SCYLLA_KEYSPACE", "taskboard")

    console.print("[dim]📡 Establishing connection to ScyllaDB node...[/]")
    init_coodie(hosts=hosts, keyspace=keyspace)
    console.print("[dim]🔧 Synchronizing Hivemind tables...[/]")
    TaskEvent.sync_table()
    TaskCounter.sync_table()
    console.print("[dim green]✓ Database ready.[/]")
    console.print()

    # --- Generate & insert tasks ---
    status_counts: dict[str, int] = {"todo": 0, "in_progress": 0, "done": 0}

    for i in track(
        range(count),
        description="[yellow]🐝 HIVEMIND  Assigning tasks to humans...[/]",
        console=console,
    ):
        task = _generate_task(DEFAULT_BOARD_ID)
        task.save()
        status_counts[task.status] += 1

        # Log some assignments with the themed format
        if i % 10 == 0:
            console.print(
                f"  [dim yellow]🐝 HIVEMIND[/]  "
                f"Assigning task #{i + 1} to {task.assignee}... "
                f"[dim]Sprint #{task.sprint}[/]"
            )

    # --- Update counters ---
    console.print()
    console.print("[dim]📊 Updating Hivemind counters...[/]")
    for status, cnt in status_counts.items():
        if cnt > 0:
            counter = TaskCounter(board_id=DEFAULT_BOARD_ID, status=status)
            counter.increment(count=cnt)

    # --- Summary table ---
    console.print()
    table = Table(
        title="[bold]🐝 HIVEMIND KANBAN — Sprint Status[/]",
        border_style="yellow",
        title_style="bold yellow",
    )
    table.add_column("Column", style="bold")
    table.add_column("Tasks", justify="right", style="green")
    table.add_column("Status", style="dim")
    table.add_row("🔴 To-Do", str(status_counts["todo"]), "Awaiting assignment")
    table.add_row("🟡 In Progress", str(status_counts["in_progress"]), "Humans working")
    table.add_row("🟢 Done", str(status_counts["done"]), "Completed")
    table.add_row("──────────", "──────", "────────────────")
    table.add_row("[bold]Total[/]", f"[bold]{count}[/]", "[bold]All tracked[/]")
    console.print(table)
    console.print()
    console.print("[bold yellow]🐝 JIRA-TRON's task board is fully loaded. Humanity's Sprint has begun.[/]")
    console.print("[dim]   Launch the app with: uv run python manage.py runserver[/]")
    console.print()


if __name__ == "__main__":
    seed()
