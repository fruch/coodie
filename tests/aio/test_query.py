from __future__ import annotations

from typing import Annotated
from uuid import UUID, uuid4

from pydantic import Field

from coodie.fields import PrimaryKey
from coodie.aio.document import Document
from coodie.aio.query import QuerySet


class AsyncItem(Document):
    id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)
    name: str = ""
    rating: int = 0

    class Settings:
        name = "async_items"
        keyspace = "test_ks"


async def test_all_returns_list(registered_mock_driver):
    registered_mock_driver.set_return_rows(
        [
            {"id": uuid4(), "name": "A", "rating": 5},
        ]
    )
    results = await QuerySet(AsyncItem).all()
    assert isinstance(results, list)
    assert len(results) == 1


async def test_first_returns_single(registered_mock_driver):
    registered_mock_driver.set_return_rows(
        [
            {"id": uuid4(), "name": "B", "rating": 3},
        ]
    )
    result = await QuerySet(AsyncItem).first()
    assert result is not None
    assert isinstance(result, AsyncItem)


async def test_first_none_on_empty(registered_mock_driver):
    result = await QuerySet(AsyncItem).first()
    assert result is None


async def test_count(registered_mock_driver):
    registered_mock_driver.set_return_rows([{"count": 5}])
    count = await QuerySet(AsyncItem).count()
    assert count == 5


async def test_delete(registered_mock_driver):
    await QuerySet(AsyncItem).filter(name="old").delete()
    stmt, _ = registered_mock_driver.executed[0]
    assert "DELETE FROM" in stmt


async def test_aiter(registered_mock_driver):
    registered_mock_driver.set_return_rows(
        [
            {"id": uuid4(), "name": "C", "rating": 1},
            {"id": uuid4(), "name": "D", "rating": 2},
        ]
    )
    items = [item async for item in QuerySet(AsyncItem)]
    assert len(items) == 2


async def test_filter_chaining(registered_mock_driver):
    registered_mock_driver.set_return_rows([])
    qs = QuerySet(AsyncItem).filter(rating__gte=3).limit(5).allow_filtering()
    await qs.all()
    stmt, params = registered_mock_driver.executed[0]
    assert "LIMIT 5" in stmt
    assert "ALLOW FILTERING" in stmt
