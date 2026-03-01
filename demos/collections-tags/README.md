# 📚 coodie FastAPI Demo — Collections & Tags

> *Dimension-8: The Infinite Taxonomy* — TagMind categorizes everything in
> existence using CQL collections. Use `add__`, `remove__`, `append__`, and
> `prepend__` to manage the taxonomy before reality folds in on itself.

A runnable demo app showcasing **coodie**'s CQL collection types and mutation
operations:

| Feature | coodie API | CQL Generated |
|---|---|---|
| **Set field** | `tags: set[str]` | `tags set<text>` |
| **Map field** | `metadata: dict[str, str]` | `metadata map<text, text>` |
| **List field** | `revisions: list[str]` | `revisions list<text>` |
| **Add to set/map** | `doc.update(tags__add={"new"})` | `SET tags = tags + ?` |
| **Remove from set** | `doc.update(tags__remove={"old"})` | `SET tags = tags - ?` |
| **Append to list** | `doc.update(revisions__append=["v2"])` | `SET revisions = revisions + ?` |
| **Prepend to list** | `doc.update(revisions__prepend=["v0"])` | `SET revisions = ? + revisions` |
| **Frozen collection** | `Annotated[frozenset[str], Frozen()]` | `frozen<set<text>>` |

## Quick Start

```bash
cd demos/collections-tags
make run
```

This single command starts ScyllaDB, creates the keyspace, seeds articles with
tagged collections, and launches the FastAPI app.

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
make seed                        # 30 articles (default)
uv run python seed.py --count 60 # custom count
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
| `SCYLLA_KEYSPACE` | `tagmind` | Keyspace to use |

## Makefile Targets

| Target | Description |
|---|---|
| `make db-up` | Start ScyllaDB and create the `tagmind` keyspace |
| `make db-down` | Stop ScyllaDB |
| `make seed` | Seed sample data (depends on `db-up`) |
| `make run` | Install deps, seed data, and start the app |
| `make clean` | Stop DB and remove data volumes |

## Seed Script

The `seed.py` script runs a three-phase simulation:

1. **Phase 1 — Article classification:** Creates articles with `set<text>` tags,
   `map<text, text>` metadata, and `list<text>` revision history.
2. **Phase 2 — Collection mutations:** Applies `add__tags`, `add__metadata`,
   and `append__revisions` mutations to a subset of articles.
3. **Phase 3 — Frozen snapshots:** Creates `FrozenTagSnapshot` rows with
   `frozen<set<text>>` capturing the tag state at a point in time.

```bash
uv run python seed.py --count 60
```

## Models

### `Article` — CQL collection types

```python
class Article(Document):
    article_id: Annotated[UUID, PrimaryKey()]
    title: str
    author: Annotated[str, Indexed()]
    tags: set[str]              # → CQL set<text>
    metadata: dict[str, str]    # → CQL map<text, text>
    revisions: list[str]        # → CQL list<text>
    created_at: datetime

    class Settings:
        name = "articles"
        keyspace = "tagmind"
```

Collection mutations:

```python
# Add tags (set)
await article.update(tags__add={"quantum", "stellar"})

# Remove tags (set)
await article.update(tags__remove={"obsolete"})

# Add metadata (map)
await article.update(metadata__add={"source": "field-research"})

# Remove metadata key (map)
await article.update(metadata__remove={"source"})

# Append to revisions (list)
await article.update(revisions__append=["Peer review complete"])

# Prepend to revisions (list)
await article.update(revisions__prepend=["Initial outline"])
```

### `FrozenTagSnapshot` — frozen collection example

```python
class FrozenTagSnapshot(Document):
    article_id: Annotated[UUID, PrimaryKey()]
    snapshot_at: Annotated[datetime, ClusteringKey()]
    frozen_tags: Annotated[Optional[frozenset[str]], Frozen()]  # → frozen<set<text>>
    note: str

    class Settings:
        name = "tag_snapshots"
        keyspace = "tagmind"
```

Frozen collections are immutable once written and compared by value — useful
for clustering keys and secondary indexes on collection columns.

## Example API Requests

### Create an article

```bash
curl -X POST "http://127.0.0.1:8000/api/articles?title=Quantum+Taxonomy&author=Dr.+Helix&tags=quantum,stellar,neural"
```

### Add tags (set mutation)

```bash
curl -X POST "http://127.0.0.1:8000/api/articles/<article-id>/tags/add?tags=fractal,holographic"
```

### Remove tags (set mutation)

```bash
curl -X POST "http://127.0.0.1:8000/api/articles/<article-id>/tags/remove?tags=obsolete"
```

### Add metadata (map mutation)

```bash
curl -X POST "http://127.0.0.1:8000/api/articles/<article-id>/metadata/add?key=priority&value=critical"
```

### Remove metadata key (map mutation)

```bash
curl -X POST "http://127.0.0.1:8000/api/articles/<article-id>/metadata/remove?key=priority"
```

### Append revision (list mutation)

```bash
curl -X POST "http://127.0.0.1:8000/api/articles/<article-id>/revisions/append?text=Final+review"
```

### Prepend revision (list mutation)

```bash
curl -X POST "http://127.0.0.1:8000/api/articles/<article-id>/revisions/prepend?text=Initial+outline"
```

### Create frozen tag snapshot

```bash
curl -X POST "http://127.0.0.1:8000/api/articles/<article-id>/snapshot"
```

## Cleanup

```bash
make clean
```
