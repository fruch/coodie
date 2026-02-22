<table><tr>
  <td valign="top" width="170">
    <img src="https://github.com/user-attachments/assets/424bb6ee-3cd3-49e3-a29b-f6615193f4c7" alt="coodie logo" width="150">
  </td>
  <td valign="middle">
    <h1>coodie</h1>
    <a href="https://github.com/fruch/coodie/actions/workflows/ci.yml">
      <img src="https://img.shields.io/github/actions/workflow/status/fruch/coodie/ci.yml?branch=main&label=CI&logo=github&style=flat-square" alt="CI Status">
    </a>
    <a href="https://coodie.readthedocs.io">
      <img src="https://img.shields.io/readthedocs/coodie.svg?logo=read-the-docs&logoColor=fff&style=flat-square" alt="Documentation Status">
    </a>
    <a href="https://codecov.io/gh/fruch/coodie">
      <img src="https://img.shields.io/codecov/c/github/fruch/coodie.svg?logo=codecov&logoColor=fff&style=flat-square" alt="Test coverage percentage">
    </a>
    <br>
    <a href="https://github.com/astral-sh/uv">
      <img src="https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/astral-sh/uv/main/assets/badge/v0.json&style=flat-square" alt="uv">
    </a>
    <a href="https://github.com/astral-sh/ruff">
      <img src="https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/astral-sh/ruff/main/assets/badge/v2.json&style=flat-square" alt="Ruff">
    </a>
    <a href="https://github.com/pre-commit/pre-commit">
      <img src="https://img.shields.io/badge/pre--commit-enabled-brightgreen?logo=pre-commit&logoColor=white&style=flat-square" alt="pre-commit">
    </a>
    <br>
    <a href="https://pypi.org/project/coodie/">
      <img src="https://img.shields.io/pypi/v/coodie.svg?logo=python&logoColor=fff&style=flat-square" alt="PyPI Version">
    </a>
    <img src="https://img.shields.io/pypi/pyversions/coodie.svg?style=flat-square&logo=python&amp;logoColor=fff" alt="Supported Python versions">
    <img src="https://img.shields.io/pypi/l/coodie.svg?style=flat-square" alt="License">
  </td>
</tr></table>

**coodie** = Cassandra / ScyllaDB + Beanie (hoodie) — a Pydantic-based ODM for Cassandra and ScyllaDB,
inspired by [Beanie](https://github.com/BeanieODM/beanie). Define your data models as Python classes,
and coodie handles schema synchronisation, serialisation, and query building.

## Features

- **Pydantic v2** model definitions with full type-checking support
- **Sync and async APIs** — use `coodie.sync` for blocking code or `coodie` / `coodie.aio` for `asyncio`
- **Declarative schema** — annotate fields with `PrimaryKey`, `ClusteringKey`, `Indexed`, or `Counter`
- **Chainable `QuerySet`** — `.filter()`, `.limit()`, `.order_by()`, `.allow_filtering()`
- **Automatic table management** — `sync_table()` creates or evolves the table idempotently
- **ScyllaDB & Cassandra** — backed by `scylla-driver`

## Installation

Install this via pip (or your favourite package manager):

```bash
pip install coodie
```

## Quickstart

### Define a document

```python
from typing import Annotated
from uuid import UUID, uuid4
from pydantic import Field
from coodie import Document, init_coodie, PrimaryKey, ClusteringKey, Indexed

class Product(Document):
    id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)
    category: Annotated[str, ClusteringKey()] = "general"
    name: str
    brand: Annotated[str, Indexed()] = "Unknown"
    price: float = 0.0

    class Settings:
        name = "products"      # table name (defaults to snake_case class name)
        keyspace = "my_ks"
```

### Async usage (`coodie` / `coodie.aio`)

```python
import asyncio
from coodie import init_coodie
# Product is defined in the section above

async def main():
    await init_coodie(hosts=["127.0.0.1"], keyspace="my_ks")

    # Create / evolve the table
    await Product.sync_table()

    # Insert a document
    p = Product(name="Gadget", brand="Acme", price=9.99)
    await p.save()

    # Query
    results = await Product.find(brand="Acme").limit(10).all()
    for product in results:
        print(product.name, product.price)

    # Fetch a single document by primary key (raises DocumentNotFound if missing)
    gadget = await Product.get(id=p.id)

    # Delete
    await gadget.delete()

asyncio.run(main())
```

### Sync usage (`coodie.sync`)

```python
from coodie.sync import Document, init_coodie

class Product(Document):
    ...  # same field definitions as above

init_coodie(hosts=["127.0.0.1"], keyspace="my_ks")

Product.sync_table()

p = Product(name="Widget", price=4.99)
p.save()

results = Product.find(brand="Acme").allow_filtering().all()
one = Product.find_one(name="Widget")
```

### QuerySet chaining

```python
# async
products = (
    await Product.find()
    .filter(brand="Acme")
    .order_by("price")
    .limit(20)
    .all()
)

# count
n = await Product.find(brand="Acme").allow_filtering().count()

# async iteration
async for p in Product.find(brand="Acme"):
    print(p)

# delete matching rows
await Product.find(brand="Discontinued").allow_filtering().delete()
```

### Field annotations

| Annotation | Purpose |
|---|---|
| `PrimaryKey(partition_key_index=0)` | Partition key column (use `partition_key_index` for composite keys) |
| `ClusteringKey(order="ASC", clustering_key_index=0)` | Clustering column |
| `Indexed(index_name=None)` | Secondary index |
| `Counter()` | Counter column |

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- prettier-ignore-start -->
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://fruch.github.io/"><img src="https://avatars.githubusercontent.com/u/340979?v=4?s=80" width="80px;" alt=""/><br /><sub><b>Israel Fruchter</b></sub></a><br /><a href="https://github.com/fruch/coodie/commits?author=fruch" title="Code">💻</a> <a href="#ideas-fruch" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/fruch/coodie/commits?author=fruch" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
<!-- prettier-ignore-end -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## Credits

This package was created with
[Cookiecutter](https://github.com/audreyr/cookiecutter) and the
[browniebroke/cookiecutter-pypackage](https://github.com/browniebroke/cookiecutter-pypackage)
project template.
