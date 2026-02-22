# 📚 coodie Documentation Plan

> **Mission:** Write documentation so good that even a mass-produced droid
> could follow it. Cover every feature, from `Document` to `QuerySet`,
> with examples that make Python devs snort-laugh into their coffee.
>
> *"There are only two hard things in Computer Science: cache invalidation,
> naming things, and off-by-one errors."* — Every CS professor ever

---

## Table of Contents

1. [Documentation Philosophy](#1-documentation-philosophy)
2. [Target Audience](#2-target-audience)
3. [Documentation Structure](#3-documentation-structure)
4. [Section Breakdown & Example Sketches](#4-section-breakdown--example-sketches)
   - [4.1 Getting Started / Installation](#41-getting-started--installation)
   - [4.2 Quick Start (Hello, Cluster!)](#42-quick-start-hello-cluster)
   - [4.3 Defining Documents (Models)](#43-defining-documents-models)
   - [4.4 Field Types & Annotations](#44-field-types--annotations)
   - [4.5 Primary Keys & Clustering Keys](#45-primary-keys--clustering-keys)
   - [4.6 Secondary Indexes](#46-secondary-indexes)
   - [4.7 Table Sync (Schema Management)](#47-table-sync-schema-management)
   - [4.8 CRUD Operations](#48-crud-operations)
   - [4.9 QuerySet & Chaining](#49-queryset--chaining)
   - [4.10 Filtering (Django-Style Lookups)](#410-filtering-django-style-lookups)
   - [4.11 Collection Operations](#411-collection-operations)
   - [4.12 Counter Tables](#412-counter-tables)
   - [4.13 TTL (Time-To-Live)](#413-ttl-time-to-live)
   - [4.14 Lightweight Transactions (LWT)](#414-lightweight-transactions-lwt)
   - [4.15 Async vs Sync API](#415-async-vs-sync-api)
   - [4.16 Drivers & Initialization](#416-drivers--initialization)
   - [4.17 Exceptions & Error Handling](#417-exceptions--error-handling)
   - [4.18 Batch Operations](#418-batch-operations)
   - [4.19 Advanced Patterns & Recipes](#419-advanced-patterns--recipes)
   - [4.20 Migration from cqlengine](#420-migration-from-cqlengine)
5. [Tooling & Build](#5-tooling--build)
6. [Writing Style Guide](#6-writing-style-guide)
7. [Milestones](#7-milestones)

---

## 1. Documentation Philosophy

```python
# The Zen of coodie Docs
import this_but_for_docs

"""
Explicit is better than implicit — show full examples.
Errors should never pass silently — document every exception.
If the implementation is hard to explain, it's a bad implementation.
If the docs are hard to read, it's bad documentation.
Readability counts — for code AND prose.
"""
```

Guiding principles:

- **Every feature gets a runnable example** — no `# left as an exercise for the reader`
- **Humor keeps attention** — but never at the cost of clarity
- **Copy-paste friendly** — examples should work as-is (assuming a live cluster or mock)
- **Progressive disclosure** — start simple, go deep only when the reader is ready
- **Dual-stack coverage** — every example shown in both sync and async forms

---

## 2. Target Audience

| Persona | Description | Humor Level Tolerance |
|---------|-------------|----------------------|
| 🐍 **Pythonista** | Knows Python, new to Cassandra | High — they get `import antigravity` jokes |
| 🗄️ **CQL Veteran** | Knows Cassandra, new to Pydantic | Medium — they've seen enough `tombstone` errors to have PTSD |
| 🔄 **cqlengine Migrator** | Switching from cqlengine to coodie | High — they deserve a laugh after all that boilerplate |
| 🚀 **Async Enthusiast** | Already using asyncio, wants async Cassandra | Maximum — they live on the event loop edge |

---

## 3. Documentation Structure

```
docs/source/
├── index.md                    # Landing page — "Welcome, traveler"
├── installation.md             # pip install coodie (the easy part)
├── quickstart.md               # From zero to first query in 60 seconds
├── guide/
│   ├── defining-documents.md   # Document classes & fields
│   ├── field-types.md          # Every type annotation explained
│   ├── keys-and-indexes.md     # PK, CK, Secondary indexes
│   ├── schema-sync.md          # sync_table() and schema evolution
│   ├── crud.md                 # save, insert, update, delete
│   ├── querying.md             # QuerySet, filter, limit, order_by
│   ├── collections.md          # list, set, map, tuple operations
│   ├── counters.md             # CounterDocument & increment/decrement
│   ├── ttl.md                  # Time-To-Live support
│   ├── lwt.md                  # Lightweight Transactions
│   ├── sync-vs-async.md        # Dual-stack API guide
│   ├── drivers.md              # CassandraDriver, AcsyllaDriver, custom
│   ├── exceptions.md           # Error handling
│   ├── batch-operations.md     # Batch CQL statements
│   └── recipes.md              # Advanced patterns & tips
├── migration/
│   └── from-cqlengine.md       # Side-by-side migration guide
├── api/                        # Auto-generated API reference
│   ├── document.md
│   ├── queryset.md
│   ├── fields.md
│   ├── types.md
│   ├── drivers.md
│   ├── exceptions.md
│   └── results.md
├── contributing.md             # How to contribute
└── changelog.md                # Release notes
```

---

## 4. Section Breakdown & Example Sketches

### 4.1 Getting Started / Installation

Cover:
- `pip install coodie` / `uv add coodie`
- Optional driver extras: `coodie[cassandra]`, `coodie[acsylla]`
- Python version requirements
- Quick verification snippet

Example sketch:

```python
# Step 1: Install coodie
# $ pip install coodie
# (That's it. No 47-step build process. We're not C++.)

# Step 2: Verify it works
import coodie
print("coodie imported successfully! Achievement unlocked! 🏆")
```

---

### 4.2 Quick Start (Hello, Cluster!)

Cover:
- Connecting to a Cassandra/ScyllaDB cluster
- Defining a simple Document
- Syncing the table
- Basic CRUD: create, read, update, delete

Example sketch:

```python
from coodie.sync import Document, init_coodie
from coodie.fields import PrimaryKey
from typing import Annotated
from uuid import UUID, uuid4

# Connect to the cluster
# (It's like saying hello, but to a distributed database)
init_coodie(hosts=["127.0.0.1"], keyspace="hello_world")

class Greeting(Document):
    id: Annotated[UUID, PrimaryKey()]
    message: str
    shouted: bool = False  # We don't judge

    class Settings:
        table_name = "greetings"

# Create the table — like CREATE TABLE but without the carpal tunnel
Greeting.sync_table()

# Insert a greeting
hello = Greeting(id=uuid4(), message="Hello, World!", shouted=False)
hello.save()

# It's in the database now. It's real. It has feelings.
found = Greeting.get(id=hello.id)
print(found.message)  # "Hello, World!"

# Update — because we changed our mind (again)
found.update(message="Hello, Cluster!", shouted=True)

# Delete — like rm -rf but for a single row (much safer)
found.delete()
```

---

### 4.3 Defining Documents (Models)

Cover:
- `Document` base class
- Pydantic v2 model integration
- `class Settings` inner class (`table_name`, `keyspace`)
- Field defaults, Optional fields, required fields
- How Document inherits from `pydantic.BaseModel`

Example sketch:

```python
from coodie.sync import Document
from coodie.fields import PrimaryKey, ClusteringKey
from typing import Annotated, Optional
from uuid import UUID
from datetime import datetime

class StackOverflowAnswer(Document):
    """A model for every developer's true mentor."""

    question_id: Annotated[UUID, PrimaryKey()]
    answered_at: Annotated[datetime, ClusteringKey(order="DESC")]
    body: str  # Just paste from the first Google result
    score: int = 0  # Starts at 0, like our confidence
    is_accepted: bool = False  # One can dream
    author: Optional[str] = None  # Anonymous heroes

    class Settings:
        table_name = "stackoverflow_answers"
```

---

### 4.4 Field Types & Annotations

Cover all supported Python-to-CQL type mappings:

| Python Type | CQL Type | When to Use |
|-------------|----------|-------------|
| `str` | `text` | For storing regrets about variable names |
| `int` | `int` | When you need a number but `BigInt` feels dramatic |
| `float` | `float` | For imprecise things, like project estimates |
| `bool` | `boolean` | `is_production_ready: bool = False` |
| `bytes` | `blob` | Binary data. Don't ask what's in it. |
| `UUID` | `uuid` | Universally Unique, unlike your variable names |
| `datetime` | `timestamp` | "It worked on my machine at this time" |
| `date` | `date` | Like datetime but without the drama of hours |
| `time` | `time` | Not to be confused with `import time; time.sleep(forever)` |
| `Decimal` | `decimal` | For money. Never use `float` for money. NEVER. |
| `IPv4Address` / `IPv6Address` | `inet` | `127.0.0.1` — there's no place like home |
| `list[X]` | `list<X>` | An ordered collection of hopes and dreams |
| `set[X]` | `set<X>` | Like list but without duplicates (if only life worked that way) |
| `dict[K, V]` | `map<K, V>` | Key-value store inside your key-value store (yo dawg) |
| `tuple[X, ...]` | `tuple<X, ...>` | Immutable, like your production config should be |

Cover type override markers:

```python
from coodie.fields import BigInt, SmallInt, TinyInt, VarInt, Double, Ascii, TimeUUID, Time, Frozen

class NerdStats(Document):
    user_id: Annotated[UUID, PrimaryKey()]

    # Integer overrides — because size matters (in databases)
    mass_of_earth_kg: Annotated[int, BigInt()]       # bigint
    age: Annotated[int, SmallInt()]                   # smallint — hopefully fits
    floor_number: Annotated[int, TinyInt()]           # tinyint — for hobbits
    digits_of_pi_memorized: Annotated[int, VarInt()]  # varint — for show-offs

    # String overrides
    ascii_art: Annotated[str, Ascii()]                # ascii — retro vibes only

    # Float override
    gpa: Annotated[float, Double()]                   # double — precision matters

    # UUID override
    created_event: Annotated[UUID, TimeUUID()]        # timeuuid — UUID with a clock

    # Frozen collections — like `tuple` but for collections
    frozen_skills: Annotated[list[str], Frozen()]     # frozen<list<text>>
```

---

### 4.5 Primary Keys & Clustering Keys

Cover:
- `PrimaryKey(partition_key_index=N)` — partition key definition
- `ClusteringKey(order="ASC"|"DESC", clustering_key_index=N)` — clustering column
- Composite partition keys (multiple `PrimaryKey` with different indices)
- Compound primary keys (partition + clustering)
- How this maps to CQL `PRIMARY KEY ((pk1, pk2), ck1, ck2)`

Example sketch:

```python
class GitCommit(Document):
    """Because every commit tells a story.
    Most of them are 'fix typo' or 'WIP DO NOT MERGE'."""

    # Composite partition key: repo + branch
    repo: Annotated[str, PrimaryKey(partition_key_index=0)]
    branch: Annotated[str, PrimaryKey(partition_key_index=1)]

    # Clustering key: ordered by timestamp descending
    committed_at: Annotated[datetime, ClusteringKey(order="DESC")]

    sha: str
    message: str  # "fixed it" — narrator: they did not fix it
    author: str

    class Settings:
        table_name = "git_commits"

# CQL equivalent:
# CREATE TABLE git_commits (
#     repo text,
#     branch text,
#     committed_at timestamp,
#     sha text,
#     message text,
#     author text,
#     PRIMARY KEY ((repo, branch), committed_at)
# ) WITH CLUSTERING ORDER BY (committed_at DESC);
```

---

### 4.6 Secondary Indexes

Cover:
- `Indexed(index_name=None)` annotation
- Auto-generated index names
- Custom index names
- When to use (and when NOT to — large cardinality warning)

Example sketch:

```python
class Developer(Document):
    id: Annotated[UUID, PrimaryKey()]
    name: str
    favorite_language: Annotated[str, Indexed()]  # Auto-named index
    coffee_preference: Annotated[str, Indexed(index_name="idx_caffeine")]
    tabs_or_spaces: str  # DO NOT index this. The war never ends.

# Now you can query by favorite_language without ALLOW FILTERING
# (which is the database equivalent of "hold my beer")
devs = Developer.find(favorite_language="Python").all()
```

---

### 4.7 Table Sync (Schema Management)

Cover:
- `Document.sync_table()` — creates table if not exists, adds new columns
- Keyspace creation via `build_create_keyspace()`
- Schema evolution: what happens when you add a field
- What sync_table does NOT do (drop columns, rename — like git, some things are forever)

Example sketch:

```python
# Sync your table — it's like terraform plan + apply, but for one table
await Greeting.sync_table()

# Added a new field to your model? Just sync again.
# coodie will ALTER TABLE to add the column.
# It's non-destructive. Unlike that one time you ran DROP DATABASE.

# ⚠️ sync_table() will NOT:
# - Drop columns (Cassandra doesn't forget, like an elephant... or your ex)
# - Rename columns (you chose that name, you live with it)
# - Change column types (that's a "start over" kind of problem)
```

---

### 4.8 CRUD Operations

Cover:
- `doc.save(ttl=None)` — upsert (INSERT with all fields)
- `doc.insert(ttl=None)` — create-only via `QuerySet.if_not_exists()`
- `doc.update(**kwargs)` — partial update
- `doc.delete()` — remove a row
- `Document.get(**pk)` — fetch one (raises `DocumentNotFound`)
- `Document.find_one(**pk)` — fetch one (returns `None`)
- `Document.find(**kwargs)` — returns `QuerySet`

Example sketch:

```python
# === CREATE ===
bug = BugReport(
    id=uuid4(),
    title="It works on my machine",
    severity="critical",  # It's always critical
    status="open",
)

# save() — upsert: if it exists, overwrite. YOLO.
bug.save()

# insert() — polite create: only if it doesn't exist
bug.insert()  # Uses IF NOT EXISTS under the hood

# === READ ===
# get() — find one or perish trying
try:
    found = BugReport.get(id=bug.id)
except DocumentNotFound:
    print("The bug is a feature now")

# find_one() — the chill version of get()
maybe_bug = BugReport.find_one(id=bug.id)  # Returns None, not exceptions

# find() — returns a QuerySet, for the indecisive
bugs = BugReport.find(severity="critical").all()
# Spoiler: they're all critical

# === UPDATE ===
found.update(status="wontfix", severity="low")
# Management has spoken

# === DELETE ===
found.delete()
# 🎵 Another one bites the dust 🎵
```

---

### 4.9 QuerySet & Chaining

Cover:
- `Document.find()` returns a `QuerySet`
- Chainable methods: `.filter()`, `.limit()`, `.order_by()`, `.allow_filtering()`
- Terminal methods: `.all()`, `.first()`, `.count()`, `.delete()`, `.create()`, `.update()`
- Async iteration (`async for doc in queryset`)
- Sync iteration (`for doc in queryset.all()`)

Example sketch:

```python
# QuerySet is like a promise — it doesn't execute until you ask it to.
# (Unlike JavaScript Promises, which are a different kind of pain.)

# Chain like you're building a LEGO set
results = (
    BugReport.find(project="coodie")
    .filter(severity="critical")
    .order_by("-created_at")  # Newest nightmares first
    .limit(10)
    .all()
)

# Count — for when you need a number to put in the Jira ticket
total = BugReport.find(project="coodie").count()
print(f"Only {total} bugs left! (don't check again tomorrow)")

# first() — just give me one, any one
one_bug = BugReport.find(severity="critical").first()

# delete() — bulk delete via QuerySet
BugReport.find(status="wontfix").delete()
# Spring cleaning 🧹

# allow_filtering() — the "I know what I'm doing" flag
# (Narrator: they did not know what they were doing)
results = (
    BugReport.find()
    .filter(status="open")
    .allow_filtering()
    .all()
)
```

---

### 4.10 Filtering (Django-Style Lookups)

Cover:
- Basic equality: `filter(name="value")`
- Comparison operators: `__gt`, `__gte`, `__lt`, `__lte`
- `__in` — membership test
- `__contains` — collection contains element
- `__contains_key` — map contains key
- How `parse_filter_kwargs()` works under the hood

Example sketch:

```python
# Django called, they want their filter syntax back.
# We said "no" and kept it because it's great.

# Greater than — find old bugs (aren't they all?)
ancient_bugs = BugReport.find(
    created_at__lt=datetime(2020, 1, 1)
).all()

# IN queries — multiple values
urgent = BugReport.find(
    severity__in=["critical", "blocker", "oh-no"]
).all()

# Collection contains — does this dev know Python?
pythonistas = Developer.find(
    skills__contains="Python"
).all()

# Map contains key — does the config have this setting?
configured = AppConfig.find(
    settings__contains_key="dark_mode"
).all()

# Range queries — the Goldilocks zone
just_right = Metric.find(
    temperature__gte=20,
    temperature__lte=25,
).all()  # Not too hot, not too cold
```

---

### 4.11 Collection Operations

Cover:
- `add__field` — add to set
- `remove__field` — remove from set/list
- `append__field` — append to list
- `prepend__field` — prepend to list
- Map updates via dict assignment
- How `parse_update_kwargs()` handles these

Example sketch:

```python
class Developer(Document):
    id: Annotated[UUID, PrimaryKey()]
    name: str
    skills: set[str] = set()          # Things we claim to know
    todo_list: list[str] = []          # Things we'll never finish
    config: dict[str, str] = {}        # Settings we forgot about

# Set operations — because skills are unique (allegedly)
dev.update(add__skills={"Rust"})       # Resume-driven development
dev.update(remove__skills={"jQuery"})  # We don't talk about jQuery

# List operations — order matters (sometimes)
dev.update(append__todo_list="Write docs")    # Added to the end (of an infinite list)
dev.update(prepend__todo_list="Fix prod bug") # Priorities! 🔥

# Map operations — key-value updates
dev.update(config={"theme": "dark", "vim_mode": "true"})
# There are two types of developers:
# Those who use dark mode, and those who are wrong.
```

---

### 4.12 Counter Tables

Cover:
- `CounterDocument` base class
- `Counter()` field annotation
- `.increment(**deltas)` and `.decrement(**deltas)` methods
- Restrictions: no `.save()`, no `.insert()`, counters are special
- All non-key columns must be `Counter` type

Example sketch:

```python
from coodie.sync import CounterDocument
from coodie.fields import PrimaryKey, Counter

class CoffeeTracker(CounterDocument):
    """Monitoring the real fuel of software development."""

    developer_id: Annotated[UUID, PrimaryKey()]
    cups_today: Annotated[int, Counter()]
    total_cups_lifetime: Annotated[int, Counter()]
    bugs_fixed_per_cup: Annotated[int, Counter()]  # Diminishing returns after cup 5

    class Settings:
        table_name = "coffee_counters"

# Increment — the only direction coffee consumption goes
tracker = CoffeeTracker(developer_id=dev_id)
tracker.increment(cups_today=1, total_cups_lifetime=1)

# Decrement — for when you realize it was decaf 😱
tracker.decrement(cups_today=1)

# ⚠️ Counter tables are special:
# tracker.save()    # ❌ TypeError! Counters can't be saved.
# tracker.insert()  # ❌ TypeError! Counters can't be inserted.
# They can only go up or down. Like my hopes during deployment.
```

---

### 4.13 TTL (Time-To-Live)

Cover:
- `doc.save(ttl=seconds)` — row expires after N seconds
- `doc.insert(ttl=seconds)` — same but with IF NOT EXISTS
- `doc.update(ttl=seconds, **kwargs)` — update with TTL
- Use cases: sessions, caches, temporary data
- Cassandra TTL mechanics (per-cell, not per-row... mostly)

Example sketch:

```python
class Session(Document):
    token: Annotated[str, PrimaryKey()]
    user_id: UUID
    created_at: datetime

# Create a session that expires in 1 hour
# Like Cinderella, but for authentication
session = Session(
    token="abc123",
    user_id=user.id,
    created_at=datetime.now(),
)
session.save(ttl=3600)  # Poof! Gone in 3600 seconds

# Update with TTL — extend the magic
session.update(ttl=7200, user_id=user.id)
# "Can I get an extension?" — every student ever

# Insert with TTL — one-time use tokens
otp = OneTimePassword(code="42", user_id=user.id)
otp.insert(ttl=300)  # 5 minutes to enter the code
# No pressure. (Total pressure.)
```

---

### 4.14 Lightweight Transactions (LWT)

Cover:
- `LWTResult` dataclass: `applied: bool`, `existing: dict | None`
- `doc.insert()` — uses IF NOT EXISTS
- `QuerySet.if_not_exists()` — conditional create
- `doc.update(if_exists=True)` — conditional update
- `QuerySet.if_exists()` — conditional delete
- `doc.update(if_conditions={"field": value})` — custom IF conditions
- Performance implications (Paxos consensus — it's not free!)

Example sketch:

```python
from coodie.results import LWTResult

# Conditional insert — "dibs!"
result: LWTResult = DeployLock.find().if_not_exists().create(
    service="coodie-api",
    locked_by="alice",
    locked_at=datetime.now(),
)

if result.applied:
    print("Lock acquired! Deploying... 🚀")
else:
    print(f"Lock held by {result.existing['locked_by']}")
    print("Guess we're waiting. Again. ☕")

# Conditional update — "only if it's still mine"
result = lock.update(if_exists=True, locked_by="bob")
if not result.applied:
    print("Someone stole our lock! This is fine. 🔥")

# Custom IF conditions — "only if the version matches"
result = config.update(
    if_conditions={"version": 42},
    value="new_value",
    version=43,
)
# Optimistic locking: because pessimism is for DBAs

# ⚠️ LWT uses Paxos consensus under the hood.
# It's like a group chat where everyone has to agree.
# Expect ~4x latency. Use sparingly.
```

---

### 4.15 Async vs Sync API

Cover:
- `coodie.aio` — async API (the default export from `coodie`)
- `coodie.sync` — sync API (for those who fear the event loop)
- Side-by-side comparison of every operation
- When to use which
- Both share the same schema, types, fields infrastructure

Example sketch:

```python
# === The Async Way (coodie.aio) ===
# For the non-blocking, event-loop-riding elite
from coodie.aio import Document, init_coodie

await init_coodie(hosts=["127.0.0.1"], keyspace="myapp")

class Pokemon(Document):
    id: Annotated[int, PrimaryKey()]
    name: str
    caught: bool = False

await Pokemon.sync_table()
pikachu = Pokemon(id=25, name="Pikachu")
await pikachu.save()
found = await Pokemon.get(id=25)

# === The Sync Way (coodie.sync) ===
# For the "I just want it to work" crowd
from coodie.sync import Document, init_coodie

init_coodie(hosts=["127.0.0.1"], keyspace="myapp")

class Pokemon(Document):
    id: Annotated[int, PrimaryKey()]
    name: str
    caught: bool = False

Pokemon.sync_table()
pikachu = Pokemon(id=25, name="Pikachu")
pikachu.save()
found = Pokemon.get(id=25)

# Same result. Same model. Just fewer `await`s.
# Choose based on your framework:
# - FastAPI / aiohttp → async
# - Flask / Django → sync
# - "I just want to script" → sync
# - "I like pain" → async in a sync context with asyncio.run()
```

---

### 4.16 Drivers & Initialization

Cover:
- `init_coodie()` / `init_coodie_async()` — bootstrap function
- `CassandraDriver` — default driver (cassandra-driver / scylla-driver)
- `AcsyllaDriver` — alternative async driver
- Driver registry: `register_driver()`, `get_driver()`
- Passing existing sessions vs. letting coodie create one
- Named drivers for multi-cluster setups

Example sketch:

```python
from coodie.sync import init_coodie

# Simple — just point at your cluster
driver = init_coodie(
    hosts=["cassandra-node-1", "cassandra-node-2"],
    keyspace="my_keyspace",
)

# With an existing session — BYOS (Bring Your Own Session)
from cassandra.cluster import Cluster
cluster = Cluster(["127.0.0.1"])
session = cluster.connect("my_keyspace")
driver = init_coodie(session=session, keyspace="my_keyspace")

# Named drivers — for when one database isn't enough
init_coodie(hosts=["analytics-cluster"], keyspace="analytics", name="analytics")
init_coodie(hosts=["production-cluster"], keyspace="prod", name="prod")

# Switch between them like TV channels
from coodie.drivers import get_driver
analytics_driver = get_driver("analytics")
prod_driver = get_driver("prod")
```

---

### 4.17 Exceptions & Error Handling

Cover:
- `CoodieError` — base exception (catch 'em all!)
- `DocumentNotFound` — `.get()` found nothing
- `MultipleDocumentsFound` — `.find_one()` / `.get()` found too many
- `ConfigurationError` — no driver registered
- `InvalidQueryError` — bad query construction
- Best practices for error handling

Example sketch:

```python
from coodie.exceptions import (
    CoodieError,
    DocumentNotFound,
    MultipleDocumentsFound,
    ConfigurationError,
    InvalidQueryError,
)

# The classic "it's not there" scenario
try:
    user = User.get(id=uuid4())  # Random UUID = guaranteed miss
except DocumentNotFound:
    print("404: User not found. Have you tried turning it off and on again?")

# The "too many results" problem
try:
    user = User.find_one(role="admin")
except MultipleDocumentsFound:
    print("Too many admins! This is how security incidents start.")

# The "forgot to initialize" mistake
try:
    User.find().all()
except ConfigurationError:
    print("Did you forget init_coodie()? Classic Monday move.")

# Catch-all — for the truly paranoid
try:
    risky_operation()
except CoodieError as e:
    print(f"Something went wrong: {e}")
    print("But at least it wasn't a segfault. 🎉")
```

---

### 4.18 Batch Operations

Cover:
- `build_batch()` — logged and unlogged batches
- When to use batches (hint: less often than you think)
- Batch ≠ bulk insert (this is not SQL, old friend)
- Anti-patterns: batching across partitions

Example sketch:

```python
# Batches in Cassandra are NOT like SQL transactions.
# They're more like "please do these things atomically on the SAME partition."
# Using them across partitions is like using a hammer on a screw.
# It works, but everyone watching is concerned.

from coodie.cql_builder import build_batch, build_insert

statements = [
    build_insert("events", "myapp", {"id": 1, "type": "login", "user": "alice"}),
    build_insert("events", "myapp", {"id": 1, "type": "page_view", "user": "alice"}),
]

cql, params = build_batch(statements, logged=True)
# All events for the same partition key — batch approved! ✅

# ⚠️ Anti-pattern: batching across partitions
# Don't do this. Cassandra will judge you silently.
# (And then send you a WARNING in the logs.)
```

---

### 4.19 Advanced Patterns & Recipes

Cover:
- Using `Frozen` for nested collections
- Per-partition limit queries
- Composite partition key patterns (time-bucketing)
- Integration with FastAPI (reference demo app)
- Integration with Flask (sync driver)
- Testing with MockDriver

Example sketch:

```python
# === Recipe: Time-Bucketed Event Log ===
# Because storing everything in one partition is how you get
# "partition too large" warnings at 3 AM

class EventLog(Document):
    service: Annotated[str, PrimaryKey(partition_key_index=0)]
    day_bucket: Annotated[date, PrimaryKey(partition_key_index=1)]
    event_time: Annotated[datetime, ClusteringKey(order="DESC")]
    event_type: str
    payload: dict[str, str] = {}

# === Recipe: Testing with MockDriver ===
# No Cassandra cluster? No problem!
# (Tests should be fast, like your git commits should be small)

from tests.conftest import MockDriver
# See the test suite for full mock setup examples
```

---

### 4.20 Migration from cqlengine

Cover:
- Side-by-side comparison table of cqlengine → coodie
- Model definition differences
- Query API differences
- Connection setup differences
- What's better in coodie (Pydantic v2, type hints, async)
- Common gotchas during migration

Example sketch:

```python
# === Before (cqlengine) — the dark ages ===
from cassandra.cqlengine import columns
from cassandra.cqlengine.models import Model

class OldUser(Model):
    id = columns.UUID(primary_key=True)
    name = columns.Text(required=True)
    age = columns.Integer()

# === After (coodie) — enlightenment ===
from coodie.sync import Document
from coodie.fields import PrimaryKey
from typing import Annotated, Optional
from uuid import UUID

class User(Document):
    id: Annotated[UUID, PrimaryKey()]
    name: str
    age: Optional[int] = None

# Look ma, no special column classes!
# Just Python types. As Guido intended. 🐍
```

---

## 5. Tooling & Build

| Tool | Purpose |
|------|---------|
| **Sphinx** | Documentation generator (already configured) |
| **MyST-Parser** | Markdown support in Sphinx (`.md` files) |
| **sphinx-autodoc** | Auto-generate API reference from docstrings |
| **Read the Docs** | Hosting (`.readthedocs.yml` exists) |
| **Mermaid** | Diagrams for architecture overview |

Build commands:
```bash
cd docs/
make html          # Build HTML docs
make clean html    # Clean build — like clearing your browser cache but useful
```

---

## 6. Writing Style Guide

### Tone
- **Conversational** but technically precise
- **Humorous** — sprinkle jokes like semicolons in JavaScript (everywhere)
- **Inclusive** — humor should be nerdy, not exclusionary
- Use emoji sparingly but effectively 🎯

### Humor Guidelines
- Reference common developer experiences (debugging at 3 AM, "works on my machine")
- Python-specific jokes (`import this`, `import antigravity`, GIL references)
- Computer science classics (off-by-one errors, naming things, cache invalidation)
- Pop culture references that age well (Star Wars, Lord of the Rings, The Matrix)
- Self-deprecating about documentation ("you're actually reading docs — respect!")
- **Avoid**: inside jokes, humor that requires specific cultural context, mean-spirited jokes

### Code Examples
- Every example should be syntactically valid Python
- Use descriptive variable names (no `foo`, `bar` — unless the joke demands it)
- Include comments that explain AND entertain
- Show expected output where possible
- Always show both sync and async versions for API examples

### Structure
- Start each section with a brief "what and why" paragraph
- Follow with a practical example
- End with tips, warnings, or "common mistakes" callouts
- Use admonitions: `.. note::`, `.. warning::`, `.. tip::`

---

## 7. Milestones

### Phase 1: Foundation (Core Docs)
- [ ] Installation & quickstart guide
- [ ] Defining Documents (models) guide
- [ ] Field types reference with all type mappings
- [ ] Primary keys & clustering keys guide
- [ ] CRUD operations guide

### Phase 2: Querying & Data (Intermediate Docs)
- [ ] QuerySet & chaining guide
- [ ] Filtering (Django-style lookups) guide
- [ ] Collection operations guide
- [ ] Counter tables guide
- [ ] TTL support guide

### Phase 3: Advanced Features
- [ ] Lightweight Transactions (LWT) guide
- [ ] Batch operations guide
- [ ] Sync vs Async API comparison guide
- [ ] Drivers & initialization guide
- [ ] Exceptions & error handling guide

### Phase 4: Reference & Migration
- [ ] Auto-generated API reference (sphinx-autodoc)
- [ ] Migration guide from cqlengine
- [ ] Advanced patterns & recipes
- [ ] Integration examples (FastAPI, Flask)

### Phase 5: Polish & Ship
- [ ] Review all examples for accuracy and humor quality
- [ ] Test all code examples against a live cluster
- [ ] Proofread for consistency and tone
- [ ] Set up Read the Docs deployment
- [ ] Announce docs release with a terrible pun

---

> *"Documentation is like pizza — when it's good, it's really good.
> When it's bad, it's still better than nothing."*
>
> Now go write some docs. The `# TODO: add docs later` comments are watching. 👀
