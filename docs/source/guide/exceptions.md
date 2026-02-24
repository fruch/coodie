# Exceptions & Error Handling

coodie defines a small hierarchy of exceptions that make it easy to
handle errors from database operations. All exceptions inherit from
`CoodieError`, so you can catch everything with a single base class or
handle specific cases individually.

## Exception Hierarchy

```
CoodieError
├── DocumentNotFound
├── MultipleDocumentsFound
├── ConfigurationError
└── InvalidQueryError
```

All exceptions live in `coodie.exceptions`:

```python
from coodie.exceptions import (
    CoodieError,
    DocumentNotFound,
    MultipleDocumentsFound,
    ConfigurationError,
    InvalidQueryError,
)
```

## DocumentNotFound

Raised when `get()` finds no matching row:

```python
from coodie.exceptions import DocumentNotFound

try:
    user = User.get(id=some_id)              # sync
    # user = await User.get(id=some_id)      # async
except DocumentNotFound:
    print("User not found")
```

This is the most common exception you'll encounter. Use `find()` with
`.first()` if you'd rather get `None` instead of an exception:

```python
user = User.find(id=some_id).first()     # returns None if not found
```

## MultipleDocumentsFound

Raised when a single-document lookup unexpectedly returns more than one
row:

```python
from coodie.exceptions import MultipleDocumentsFound

try:
    user = User.get(role="admin")
except MultipleDocumentsFound:
    print("Expected one admin, got many")
```

## ConfigurationError

Raised when coodie is not properly configured — most commonly when you
forget to call `init_coodie()` before using models:

```python
from coodie.exceptions import ConfigurationError

try:
    User.find().all()
except ConfigurationError:
    print("Did you forget to call init_coodie()?")
```

This also triggers when requesting a named driver that hasn't been
registered:

```python
from coodie.drivers import get_driver

try:
    driver = get_driver("nonexistent")
except ConfigurationError:
    print("No driver registered with that name")
```

## InvalidQueryError

Raised when a query is constructed incorrectly — for example, filtering
on a column that doesn't exist or using an unsupported operator:

```python
from coodie.exceptions import InvalidQueryError

try:
    User.find(nonexistent_field="value").all()
except InvalidQueryError:
    print("Bad query construction")
```

## Catch-All Pattern

Use the `CoodieError` base class to catch any coodie exception:

```python
from coodie.exceptions import CoodieError

try:
    result = some_coodie_operation()
except CoodieError as e:
    print(f"coodie error: {e}")
```

## Best Practices

### Use specific exceptions

Catch the most specific exception that applies. This makes your error
handling explicit and avoids masking unexpected errors:

```python
# ✅ Good — specific
try:
    user = User.get(id=user_id)
except DocumentNotFound:
    return create_default_user(user_id)

# ❌ Avoid — too broad
try:
    user = User.get(id=user_id)
except CoodieError:
    return create_default_user(user_id)
```

### Use find().first() for optional lookups

When a missing row is a normal case (not an error), avoid exceptions
entirely:

```python
# ✅ No exception handling needed
user = User.find(id=user_id).first()
if user is None:
    user = create_default_user(user_id)
```

### Check LWTResult instead of catching exceptions

Conditional writes (LWT) don't raise exceptions when the condition
fails — they return an `LWTResult`:

```python
from coodie.results import LWTResult

result = lock.insert()
if not result.applied:
    # Handle conflict — no exception was raised
    handle_conflict(result.existing)
```

### Initialize early

Call `init_coodie()` at application startup, before any model operations.
This avoids `ConfigurationError` scattered throughout your code:

```python
# app.py
from coodie.sync import init_coodie

def main():
    init_coodie(hosts=["127.0.0.1"], keyspace="my_ks")
    # ... application logic
```

## What's Next?

- {doc}`lwt` — conditional writes with IF NOT EXISTS / IF EXISTS
- {doc}`batch-operations` — batch multiple statements into one round-trip
- {doc}`sync-vs-async` — choosing between sync and async APIs
- {doc}`drivers` — driver configuration and multi-cluster setups
