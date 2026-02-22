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


# --- Phase 3: async QuerySet.update() ---


async def test_update_basic(registered_mock_driver):
    await QuerySet(AsyncItem).filter(name="old").update(name="new")
    stmt, params = registered_mock_driver.executed[0]
    assert "UPDATE test_ks.async_items" in stmt
    assert '"name" = ?' in stmt
    assert "new" in params


async def test_update_with_ttl(registered_mock_driver):
    await QuerySet(AsyncItem).filter(name="old").update(ttl=300, name="new")
    stmt, _ = registered_mock_driver.executed[0]
    assert "USING TTL 300" in stmt


async def test_update_with_if_conditions(registered_mock_driver):
    await (
        QuerySet(AsyncItem)
        .filter(name="old")
        .update(if_conditions={"rating": 5}, name="new")
    )
    stmt, params = registered_mock_driver.executed[0]
    assert 'IF "rating" = ?' in stmt
    assert 5 in params


async def test_update_collection_add(registered_mock_driver):
    class AsyncTagItem(Document):
        id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)
        tags: set[str] = set()

        class Settings:
            name = "async_tag_items"
            keyspace = "test_ks"

    await QuerySet(AsyncTagItem).filter(id=uuid4()).update(tags__add={"x"})
    stmt, params = registered_mock_driver.executed[0]
    assert '"tags" = "tags" + ?' in stmt
    assert {"x"} in params


async def test_update_noop_when_empty(registered_mock_driver):
    await QuerySet(AsyncItem).filter(name="old").update()
    assert len(registered_mock_driver.executed) == 0
