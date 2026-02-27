# 📝 coodie Flask Demo — Blog

> *Dimension-2: The Propaganda Engine* — Counter Editor-X's mind-controlling
> blog posts before three more planetary governments become fan clubs.

A runnable demo app showcasing **coodie**'s sync API (`coodie.sync`) with
[Flask](https://flask.palletsprojects.com/) and Jinja2 server-rendered
templates.

## Quick Start

```bash
cd demos/flask-blog
make run
```

This single command starts ScyllaDB, creates the keyspace, seeds 30 sample
posts with comments, and launches the Flask app.

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
make seed                  # 30 posts (default)
uv run python seed.py --count 100   # custom count
```

### 3. Run the app

```bash
uv run flask --app app run --debug
```

The app will be available at <http://127.0.0.1:5000>.

### Environment variables

| Variable | Default | Description |
|---|---|---|
| `SCYLLA_HOSTS` | `127.0.0.1` | Comma-separated ScyllaDB contact points |
| `SCYLLA_KEYSPACE` | `blog` | Keyspace to use |

## Makefile Targets

| Target | Description |
|---|---|
| `make db-up` | Start ScyllaDB and create the `blog` keyspace |
| `make db-down` | Stop ScyllaDB |
| `make seed` | Seed sample data (depends on `db-up`) |
| `make run` | Install deps, seed data, and start the app |
| `make clean` | Stop DB and remove data volumes |

## Seed Script

The `seed.py` script generates story-themed blog posts and comments using
[Faker](https://faker.readthedocs.io/) with colorful
[rich](https://rich.readthedocs.io/) progress output.

```bash
# Generate 100 posts with comments
uv run python seed.py --count 100
```

## Example API Requests

The app exposes both a web UI and a JSON API.

### Create a post

```bash
curl -X POST http://127.0.0.1:5000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Counter-Propaganda Alert",
    "author": "Captain Jinja",
    "category": "counter-intel",
    "content": "Editor-X influence detected in sector 7.",
    "tags": ["truth", "resistance"]
  }'
```

### List posts (with optional filters)

```bash
curl "http://127.0.0.1:5000/api/posts?category=counter-intel&author=Captain+Jinja"
```

### Get a post by ID

```bash
curl http://127.0.0.1:5000/api/posts/<post-id>
```

### Add a comment

```bash
curl -X POST http://127.0.0.1:5000/api/posts/<post-id>/comments \
  -H "Content-Type: application/json" \
  -d '{
    "author": "Agent Cipher",
    "content": "Confirmed — psionic shields are holding."
  }'
```

### List comments (newest-first)

```bash
curl "http://127.0.0.1:5000/api/posts/<post-id>/comments"
```

### Delete a post

```bash
curl -X DELETE http://127.0.0.1:5000/api/posts/<post-id>
```

## Cleanup

```bash
make clean
```
