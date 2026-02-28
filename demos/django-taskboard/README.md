# 🐝 coodie Django Demo — Task Board (The Hivemind Kanban)

> *Dimension-3: The Hivemind Kanban* — JIRA-TRON, a sentient Kanban board,
> assigns tasks to humans against their will. Hack the board and move every
> task to "Done" to free humanity.

A runnable demo app showcasing **coodie**'s sync API (`coodie.sync`) alongside
[Django](https://www.djangoproject.com/) in a **dual-database pattern** —
Django ORM for its own tables and coodie for high-write Cassandra task events.

## Quick Start

```bash
cd demos/django-taskboard
make run
```

This single command starts ScyllaDB, creates the keyspace, syncs Cassandra
tables, seeds 50 sample tasks, and launches the Django app.

## Prerequisites

* Python ≥ 3.10
* [uv](https://docs.astral.sh/uv/) (recommended) or pip
* Docker & Docker Compose (for ScyllaDB)

## Step-by-Step

### 1. Start ScyllaDB and create keyspace

```bash
make db-up
```

### 2. Sync Cassandra tables

```bash
make sync-tables
# or
uv run python manage.py sync_cassandra
```

### 3. Seed sample data

```bash
make seed                        # 50 tasks (default)
uv run python seed.py --count 200  # custom count
```

### 4. Run the app

```bash
uv run python manage.py runserver
```

The Kanban board will be available at <http://127.0.0.1:8000>.

### Environment variables

| Variable | Default | Description |
|---|---|---|
| `SCYLLA_HOSTS` | `127.0.0.1` | Comma-separated ScyllaDB contact points |
| `SCYLLA_KEYSPACE` | `taskboard` | Keyspace to use |

## Dual-Database Pattern

This demo demonstrates how coodie works alongside Django's built-in ORM:

| Layer | Database | ORM | Purpose |
|---|---|---|---|
| Django internals | SQLite | Django ORM | Content types, sessions |
| Task events | Cassandra/ScyllaDB | **coodie** | High-write task event log |
| Task counters | Cassandra/ScyllaDB | **coodie** | Atomic counter columns |

### Key patterns

- **Separate model files:** Django models live in `tasks/models.py` (empty in
  this demo), coodie models live in `cassandra_models.py`
- **Management command:** `manage.py sync_cassandra` syncs coodie tables to
  Cassandra, separate from Django's `migrate` command
- **Lazy initialization:** coodie is initialized on first request in views, not
  at Django startup, to avoid import-time side effects
- **Counter columns:** `TaskCounter` uses Cassandra's native counter type for
  atomic increment/decrement operations

## coodie Models

### TaskEvent

| Field | Type | Key | Description |
|---|---|---|---|
| `board_id` | UUID | Partition Key | Board identifier |
| `created_at` | datetime | Clustering (DESC) | Event timestamp |
| `id` | UUID | — | Unique task ID |
| `title` | str | — | Task title |
| `description` | str | — | Task description |
| `status` | str | Indexed | todo / in_progress / done |
| `assignee` | str | — | Assigned human |
| `priority` | str | — | low / medium / high |
| `sprint` | int | — | Sprint number |

### TaskCounter

| Field | Type | Key | Description |
|---|---|---|---|
| `board_id` | UUID | Partition Key | Board identifier |
| `status` | str | Clustering | Status column name |
| `count` | counter | — | Atomic task count |

## Makefile Targets

| Target | Description |
|---|---|
| `make db-up` | Start ScyllaDB and create the `taskboard` keyspace |
| `make db-down` | Stop ScyllaDB |
| `make sync-tables` | Sync coodie tables to Cassandra |
| `make seed` | Seed sample data (depends on `sync-tables`) |
| `make run` | Install deps, seed data, and start the app |
| `make clean` | Stop DB and remove data volumes |

## Seed Script

The `seed.py` script generates themed task data using
[Faker](https://faker.readthedocs.io/) with colorful
[rich](https://rich.readthedocs.io/) progress output styled as JIRA-TRON
assigning tasks to hapless humans.

```bash
# Generate 100 tasks
uv run python seed.py --count 100
```

## Cleanup

```bash
make clean
```
