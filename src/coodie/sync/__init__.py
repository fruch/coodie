from __future__ import annotations

from typing import Any

from coodie.sync.document import Document, CounterDocument, MaterializedView
from coodie.sync.query import QuerySet
from coodie.batch import BatchQuery
from coodie.drivers import init_coodie


def execute_raw(stmt: str, params: list[Any] | None = None) -> list[dict[str, Any]]:
    """Execute a raw CQL statement synchronously.

    Example::

        from coodie.sync import execute_raw

        rows = execute_raw("SELECT * FROM my_ks.users WHERE id = ?", [some_id])
        for row in rows:
            print(row["name"])
    """
    from coodie.drivers import get_driver

    return get_driver().execute(stmt, params or [])


__all__ = [
    "Document",
    "CounterDocument",
    "MaterializedView",
    "QuerySet",
    "BatchQuery",
    "init_coodie",
    "execute_raw",
]
