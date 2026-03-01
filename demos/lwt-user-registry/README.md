# 🛡️ coodie FastAPI Demo — LWT User Registry

> *Dimension-6: The Identity Wars* — Doppel-9 clones identities at petabyte
> scale. The only defense: `IF NOT EXISTS` enforced at the database level.

A runnable demo app showcasing **coodie**'s Lightweight Transaction (LWT) API:

| Feature | coodie API | CQL Generated |
|---|---|---|
| **Uniqueness guarantee** | `INSERT IF NOT EXISTS` | `INSERT … IF NOT EXISTS` |
| **Safe delete** | `doc.delete(if_exists=True)` | `DELETE … IF EXISTS` |
| **Optimistic locking** | `doc.update(if_conditions={"version": n})` | `UPDATE … IF version = n` |

## Quick Start

```bash
cd demos/lwt-user-registry
make run
```

This single command starts ScyllaDB, creates the keyspace, seeds hero
identities (including Doppel-9 clone attacks), and launches the FastAPI app.

## Prerequisites

* Python ≥ 3.10
* [uv](https://docs.astral.sh/uv/) (recommended) or pip
* Docker & Docker Compose (for ScyllaDB)

## Step-by-Step

### 1. Start ScyllaDB and create keyspace

```bash
make db-up
```

### 2. Seed sample data

```bash
make seed                        # 40 heroes + 10 clone attacks (default)
uv run python seed.py --count 80 # custom count
```

### 3. Run the app

```bash
uv run uvicorn main:app --reload
```

The app will be available at <http://127.0.0.1:8000>.

### Environment variables

| Variable | Default | Description |
|---|---|---|
| `SCYLLA_HOSTS` | `127.0.0.1` | Comma-separated ScyllaDB contact points |
| `SCYLLA_KEYSPACE` | `registry` | Keyspace to use |

## Makefile Targets

| Target | Description |
|---|---|
| `make db-up` | Start ScyllaDB and create the `registry` keyspace |
| `make db-down` | Stop ScyllaDB |
| `make seed` | Seed sample data (depends on `db-up`) |
| `make run` | Install deps, seed data, and start the app |
| `make clean` | Stop DB and remove data volumes |

## Seed Script

The `seed.py` script runs a two-phase simulation:

1. **Phase 1 — Hero registration:** Registers unique identities with
   `INSERT IF NOT EXISTS`. Successful inserts flash green; collisions are
   counted.
2. **Phase 2 — Doppel-9 clone attack:** Attempts to re-register the same
   usernames. Every attempt is rejected by the LWT guarantee and shown in a
   two-column race panel (IF-NOT-EXISTS hero vs Doppel-9 cloner).
3. **Phase 3 — Profile seeding:** Creates `UserProfile` rows with
   `version=1` ready for optimistic-lock updates.

```bash
uv run python seed.py --count 80
```

## Models

### `UserRegistration` — uniqueness via `INSERT IF NOT EXISTS`

```python
class UserRegistration(Document):
    username: Annotated[str, PrimaryKey()]   # partition key
    email: Annotated[str, Indexed()]
    display_name: str
    dimension: Annotated[str, Indexed()]
    registered_at: datetime = ...
    user_id: UUID = ...

    class Settings:
        name = "user_registrations"
        keyspace = "registry"
```

Register a new user (returns `LWTResult`):

```python
cql, params = build_insert_from_columns(..., if_not_exists=True)
rows = await driver.execute_async(cql, params)
result = _parse_lwt_result(rows)
# result.applied → True if registered, False if username already taken
# result.existing → existing row data when rejected
```

### `UserProfile` — optimistic locking via `UPDATE IF conditions`

```python
class UserProfile(Document):
    user_id: Annotated[UUID, PrimaryKey()]
    username: str
    bio: Optional[str] = None
    status: str = "active"
    version: int = 1            # incremented on each update
    updated_at: datetime = ...
```

Update with optimistic lock:

```python
result = await profile.update(
    if_conditions={"version": expected_version},
    bio="new bio",
    status="active",
    version=expected_version + 1,
)
if not result.applied:
    # Conflict — result.existing contains the current row
    ...
```

Safe delete:

```python
result = await reg.delete(if_exists=True)
# result.applied → True if deleted, False if already gone
```

## Example API Requests

### Register a user (IF NOT EXISTS)

```bash
curl -X POST "http://127.0.0.1:8000/api/users?username=Agent-Cipher-007&email=cipher@registry.galaxy&display_name=Agent+Cipher&dimension=Dimension-6"
```

Response on success (`201 Created`):
```json
{"applied": true, "username": "Agent-Cipher-007"}
```

Response on duplicate (`409 Conflict`):
```json
{
  "detail": {
    "error": "username_taken",
    "existing": {
      "username": "Agent-Cipher-007",
      "email": "cipher@registry.galaxy",
      ...
    }
  }
}
```

### List all users

```bash
curl "http://127.0.0.1:8000/api/users"
curl "http://127.0.0.1:8000/api/users?dimension=Dimension-6"
```

### Update profile with optimistic lock

```bash
curl -X PUT "http://127.0.0.1:8000/api/profiles/<user-id>?bio=Counter-clone+specialist&expected_version=1"
```

Response on conflict (`409 Conflict`):
```json
{
  "detail": {
    "error": "version_conflict",
    "existing": {"version": 2, ...}
  }
}
```

### Delete a user (IF EXISTS)

```bash
curl -X DELETE "http://127.0.0.1:8000/api/users/Agent-Cipher-007"
```

## Cleanup

```bash
make clean
```
