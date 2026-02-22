from __future__ import annotations

from typing import Any

from coodie.aio.document import Document, CounterDocument
from coodie.aio.query import QuerySet
from coodie.drivers import init_coodie_async as init_coodie


async def execute_raw(
    stmt: str, params: list[Any] | None = None
) -> list[dict[str, Any]]:
    """Execute a raw CQL statement asynchronously.

    Example::

        from coodie.aio import execute_raw

        rows = await execute_raw("SELECT * FROM my_ks.users WHERE id = ?", [some_id])
        for row in rows:
            print(row["name"])
    """
    from coodie.drivers import get_driver

    return await get_driver().execute_async(stmt, params or [])


__all__ = ["Document", "CounterDocument", "QuerySet", "init_coodie", "execute_raw"]
