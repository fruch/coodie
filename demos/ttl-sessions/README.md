# 👻 coodie FastAPI Demo — TTL Sessions

> *Dimension-4: The Memory Thief* — Race against Ephemera before stolen
> memories dissolve forever.

A runnable demo showcasing **coodie**'s TTL (Time-To-Live) support via
[FastAPI](https://fastapi.tiangolo.com/) and an HTMX server-rendered UI.

## What It Demonstrates

| Feature | How It's Used |
|---|---|
| `__default_ttl__ = 30` on `Settings` | Every row in `sessions` expires in 30 s by default |
| `session.save(ttl=N)` | Per-save TTL override — control expiry at write time |
| `TTL(column)` CQL function | Query remaining seconds for each row |
| Data auto-expiry | Seeded tokens disappear from the UI without any DELETE |

## Quick Start

```bash
cd demos/ttl-sessions
make run
```

This single command starts ScyllaDB, creates the keyspace, seeds 20 memory
tokens (each with a 30 s TTL), and launches the FastAPI app. Open the UI and
watch the tokens fade away.

## Prerequisites

* Python ≥ 3.10
* [uv](https://docs.astral.sh/uv/) (recommended) or pip
* Docker & Docker Compose (for ScyllaDB)

## Step-by-Step

### 1. Start ScyllaDB and create keyspace

```bash
make db-up
```

### 2. Seed memory tokens

```bash
make seed                          # 20 tokens, TTL=30s (default)
uv run python seed.py --count 50   # more tokens
uv run python seed.py --ttl 120    # override TTL to 2 minutes
```

### 3. Run the app

```bash
uv run uvicorn main:app --reload
```

Open <http://127.0.0.1:8000> — the vault auto-refreshes every 5 seconds.
Watch tokens disappear as their TTL expires.

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `SCYLLA_HOSTS` | `127.0.0.1` | Comma-separated ScyllaDB contact points |
| `SCYLLA_KEYSPACE` | `ephemera` | Keyspace to use |

## Makefile Targets

| Target | Description |
|---|---|
| `make db-up` | Start ScyllaDB and create the `ephemera` keyspace |
| `make db-down` | Stop ScyllaDB |
| `make seed` | Seed 20 memory tokens with TTL=30s (depends on `db-up`) |
| `make run` | Start DB, seed data, and launch the app |
| `make clean` | Stop DB and remove data volumes |

## The Model

```python
class Session(Document):
    token: Annotated[str, PrimaryKey()]
    memory: str
    dimension: str = "Dimension-4"
    stolen_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    ttl_seconds: Optional[int] = None  # stored for display; actual TTL is in Cassandra

    class Settings:
        name = "sessions"
        keyspace = "ephemera"
        __default_ttl__ = 30  # table-level default: every row expires in 30 s
```

## Querying Remaining TTL

The app uses the CQL `TTL()` function to display the remaining seconds for
each active token:

```cql
SELECT token, user_id, memory, TTL(memory) AS remaining_ttl
FROM ephemera.sessions
```

In Python via coodie's raw driver access:

```python
cql = "SELECT token, TTL(memory) AS remaining_ttl FROM ephemera.sessions"
rows = await get_driver().execute_async(cql, [])
```

## Example API Requests

The app also exposes a JSON API.

### List active sessions

```bash
curl http://127.0.0.1:8000/api/sessions
```

### Create a session (30 s TTL)

```bash
curl -X POST "http://127.0.0.1:8000/api/sessions?token=TEST1234&memory=My+secret&ttl=30"
```

### Create a session with a longer TTL (2 minutes)

```bash
curl -X POST "http://127.0.0.1:8000/api/sessions?token=LONG0001&memory=Important+memory&ttl=120"
```

### Immediately delete a session

```bash
curl -X DELETE http://127.0.0.1:8000/api/sessions/TEST1234
```

## Cleanup

```bash
make clean
```
