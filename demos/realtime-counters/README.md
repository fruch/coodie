# 📊 Realtime Counters — *The Pulse Engine*

> **Part of the Coodie Demo Suite** · [← Back to demos](../README.md)

A FastAPI + HTMX page-view analytics dashboard that showcases **coodie's
CounterDocument** — Cassandra's distributed counter columns, exposed as
simple Python `increment()` / `decrement()` calls.

In *Dimension-7*, the **PULSE** analytics engine tracks every agent's movement
across the interdimensional network. Every page hit is a counter increment —
atomic, distributed, and conflict-free.

---

## Counter Patterns Demonstrated

### Pattern 1 — `CounterDocument` with `Counter()` fields

Define a counter table using `CounterDocument` as the base class and annotate
counter columns with `Annotated[int, Counter()]`:

```python
from coodie.aio import CounterDocument
from coodie.fields import ClusteringKey, Counter, PrimaryKey

class PageViewCounter(CounterDocument):
    url: Annotated[str, PrimaryKey()]
    date: Annotated[str, ClusteringKey()]
    view_count: Annotated[int, Counter()] = 0
    unique_visitors: Annotated[int, Counter()] = 0
```

Counter tables in Cassandra have special rules:
- All non-key columns **must** be counters
- `save()` and `insert()` are **forbidden** — raises `InvalidQueryError`
- Only `increment()` and `decrement()` are allowed

### Pattern 2 — `increment(**field_deltas)`

Atomically add to one or more counter columns in a single CQL `UPDATE` statement:

```python
counter = PageViewCounter(url="/dashboard", date="2026-03-03")
await counter.increment(view_count=1, unique_visitors=1)
```

This generates:

```sql
UPDATE page_view_counters SET view_count = view_count + 1,
       unique_visitors = unique_visitors + 1
WHERE url = '/dashboard' AND date = '2026-03-03'
```

### Pattern 3 — `decrement(**field_deltas)`

Atomically subtract from counter columns:

```python
await counter.decrement(view_count=2)
```

This generates:

```sql
UPDATE page_view_counters SET view_count = view_count + -2
WHERE url = '/dashboard' AND date = '2026-03-03'
```

### Pattern 4 — Reading counter values

Counter tables support standard queries — `find()`, `find_one()`, `all()`:

```python
# All counters for a URL
counters = await PageViewCounter.find(url="/dashboard").all()

# Single URL + date pair
counter = await PageViewCounter.find_one(url="/dashboard", date="2026-03-03")
print(counter.view_count)  # Current counter value
```

---

### Pattern 5 — Traffic Simulator (virtual users)

Spin up background asyncio tasks that act as virtual users, continuously
hitting counters in random patterns:

```python
# Start 5 "bursty" virtual users (very fast increments)
POST /sim/start?count=5&pattern=bursty

# Check status — how many users, total hits
GET /sim/status

# Stop a single user
POST /sim/stop?user_id=agent-abc123

# Stop all users
POST /sim/stop
```

Available traffic patterns:

| Pattern | Inc/Dec Ratio | Delay Range | Behaviour |
|---|---|---|---|
| `casual` | 90/10 | 1.0–3.0s | Slow, mostly increments |
| `power` | 70/30 | 0.3–1.0s | Fast, some decrements |
| `bursty` | 80/20 | 0.1–0.5s | Very fast, burst traffic |
| `balanced` | 50/50 | 0.5–2.0s | Equal increments and decrements |

---

## Quick Start

### 1. Start ScyllaDB

```bash
make db-up
```

### 2. Seed synthetic traffic

```bash
make seed           # 200 increments across 10 pages
make seed-short     # 50 increments across 5 pages
```

### 3. Launch the app

```bash
make run            # Seeds + starts app at http://127.0.0.1:8000
```

Or do everything at once:

```bash
make run
```

### 4. Watch counters spin in real-time

Open the dashboard at `http://127.0.0.1:8000` and click **▶ Start Users**
to launch virtual agents. The counter table auto-refreshes every 2 seconds
so you'll see numbers changing live. Mix traffic patterns — try starting
3 "bursty" users and 2 "balanced" users to see increments and decrements
racing against each other.

Stop individual users with ✕ or all at once with **■ Stop All**.

---

## API Reference

### JSON API — Counters

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/counters` | List all page-view counters |
| `GET` | `/counters/{url}?date=YYYY-MM-DD` | Get counters for a specific URL |
| `POST` | `/counters/increment` | Increment counters for a URL/date |
| `POST` | `/counters/decrement` | Decrement counters for a URL/date |

### JSON API — Traffic Simulator

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/sim/start?count=N&pattern=NAME` | Start N virtual users with a traffic pattern |
| `POST` | `/sim/stop` | Stop all virtual users |
| `POST` | `/sim/stop?user_id=ID` | Stop a single virtual user |
| `GET` | `/sim/status` | Current simulator status (users, hits, patterns) |

### HTMX UI

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Main dashboard page |
| `GET` | `/ui/counters` | Counter list partial (auto-refreshes every 2s) |
| `POST` | `/ui/counters/increment` | Increment from form and return updated list |
| `POST` | `/ui/counters/decrement` | Decrement from form and return updated list |
| `GET` | `/ui/sim/status` | Simulator status partial (polled every 2s) |
| `POST` | `/ui/sim/start` | Start users from HTMX form |
| `POST` | `/ui/sim/stop` | Stop one or all users from HTMX form |

---

## UI Features

- **Traffic Simulator** — spin up virtual agents with different traffic patterns directly from the dashboard
- **Live auto-refresh** — counter table reloads every 2 seconds via HTMX polling
- **Per-user controls** — start/stop individual virtual users, see per-user hit counts
- **Increment / Decrement forms** — click to manually update counters
- **Summary row** — shows total views and visitors across all URL/date combos
- **No-refresh updates** — HTMX swaps the counter table and sim status in place

---

## CQL Counter Semantics

Cassandra counter columns are CRDT-based distributed counters:

- **Atomic** — increment/decrement is a single CQL `UPDATE`, no read-modify-write
- **Eventually consistent** — values converge across replicas
- **No resets** — you cannot set a counter to a specific value
- **No mixing** — counter columns cannot coexist with regular columns (except keys)

coodie's `CounterDocument` enforces these rules at the Python level, raising
`InvalidQueryError` if you try to call `save()` or `insert()`.

---

## Makefile Targets

| Target | Description |
|---|---|
| `make db-up` | Start ScyllaDB and create the `analytics` keyspace |
| `make db-down` | Stop ScyllaDB |
| `make seed` | Generate 200 page-view increments across 10 pages |
| `make seed-short` | Generate 50 quick increments across 5 pages |
| `make run` | Seed + start the FastAPI app at `http://127.0.0.1:8000` |
| `make clean` | Stop DB and remove all data volumes |
| `make test` | Run smoke tests |
