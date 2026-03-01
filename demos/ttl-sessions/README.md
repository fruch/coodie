# 👻 TTL Sessions — *The Memory Thief*

> **Part of the Coodie Demo Suite** · [← Back to demos](../README.md)

A FastAPI + HTMX ephemeral session store that showcases **coodie's TTL support**.
In *Dimension-4*, the rogue AI **EPHEMERA** harvests memories and stores them as
session tokens — but with a countdown. After the TTL expires, the row
**literally disappears** from ScyllaDB. No cleanup job needed.

---

## TTL Patterns Demonstrated

### Pattern 1 — `__default_ttl__` on Settings

Every row written to this table expires after 5 minutes by default:

```python
class Session(Document):
    token: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)
    user_name: str
    memory_fragment: str
    ttl_seconds: int = 300

    class Settings:
        name = "sessions"
        keyspace = "ephemera"
        __default_ttl__ = 300  # ← table-level default TTL
```

### Pattern 2 — `ttl=` on `save()` (per-record override)

Override the default TTL for a single write:

```python
# This row expires in 30 seconds, regardless of __default_ttl__
await session.save(ttl=30)
```

Both patterns are used in this demo — `seed.py` uses `save(ttl=...)` to store
tokens with a configurable expiry, and the API endpoint lets you create tokens
with any TTL via `POST /sessions?ttl=N`.

---

## Quick Start

### 1. Start ScyllaDB

```bash
make db-up
```

### 2. Seed memory tokens (default TTL: 5 minutes)

```bash
make seed
```

To seed short-lived tokens that expire in 30 seconds (watch them disappear live!):

```bash
make seed-short
```

### 3. Run the app

```bash
make run
# → http://127.0.0.1:8000
```

Open the browser and watch the TTL countdown timers. The page auto-refreshes
every 5 seconds — seeded rows fade away as their TTL expires.

---

## One-Shot Quickstart

```bash
make run   # db-up + seed + start app
```

---

## Manual Seed Options

```bash
uv run python seed.py --count 20 --ttl 300   # 20 tokens, 5-minute TTL
uv run python seed.py --count 10 --ttl 30    # 10 tokens, 30-second TTL
```

---

## API Reference

| Method | Path | Description |
|--------|------|-------------|
| `GET`  | `/sessions` | List all active sessions |
| `POST` | `/sessions?user_name=X&memory_fragment=Y&ttl=N` | Create session with TTL |
| `GET`  | `/sessions/{token}` | Get session (404 if expired) |
| `DELETE` | `/sessions/{token}` | Delete session early |

---

## Web UI

The HTMX UI at `http://localhost:8000`:

- **Token cards** show a TTL countdown and progress bar
- Cards turn **amber** when < 30 s remain
- Cards turn **red and pulse** when < 5 s remain
- Expired tokens show as `💀 EXPIRED` until the next refresh removes them
- The list **auto-refreshes every 5 seconds**

---

## The CQL Behind the Scenes

`__default_ttl__` on `Settings` causes coodie to emit:

```cql
CREATE TABLE IF NOT EXISTS ephemera.sessions (
    token uuid PRIMARY KEY,
    user_name text,
    memory_fragment text,
    created_at timestamp,
    ttl_seconds int
) WITH default_time_to_live = 300;
```

`save(ttl=30)` causes coodie to emit:

```cql
INSERT INTO ephemera.sessions (token, user_name, ...) VALUES (?, ?, ...)
USING TTL 30;
```

You can verify both in `cqlsh`:

```cql
-- Check the table's default TTL
DESCRIBE TABLE ephemera.sessions;

-- Check a specific row's remaining TTL
SELECT TTL(user_name) FROM ephemera.sessions WHERE token = <uuid>;
```

---

## Makefile Targets

| Target | Description |
|--------|-------------|
| `make db-up` | Start ScyllaDB and create keyspace |
| `make db-down` | Stop ScyllaDB |
| `make seed` | Seed 20 tokens with 5-minute TTL |
| `make seed-short` | Seed 10 tokens with 30-second TTL |
| `make run` | `db-up` + `seed` + start app |
| `make clean` | Stop DB and remove volumes |
| `make test` | Run smoke tests |

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SCYLLA_HOSTS` | `127.0.0.1` | Comma-separated ScyllaDB hosts |
| `SCYLLA_KEYSPACE` | `ephemera` | Keyspace name |
