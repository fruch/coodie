from __future__ import annotations

from typing import Annotated, Optional
from uuid import UUID, uuid4

import pytest
from pydantic import Field

from coodie.fields import PrimaryKey, Indexed, Counter
from coodie.aio.document import Document, CounterDocument
from coodie.exceptions import (
    DocumentNotFound,
    MultipleDocumentsFound,
    InvalidQueryError,
)


class AsyncProduct(Document):
    id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)
    name: str
    brand: Annotated[str, Indexed()] = "Unknown"
    price: float = 0.0
    description: Optional[str] = None

    class Settings:
        name = "async_products"
        keyspace = "test_ks"


async def test_sync_table(registered_mock_driver):
    await AsyncProduct.sync_table()
    assert any("SYNC_TABLE" in stmt for stmt, _ in registered_mock_driver.executed)


async def test_save(registered_mock_driver):
    p = AsyncProduct(name="Gadget", price=19.99)
    await p.save()
    assert len(registered_mock_driver.executed) == 1
    stmt, _ = registered_mock_driver.executed[0]
    assert "INSERT INTO test_ks.async_products" in stmt


async def test_insert_if_not_exists(registered_mock_driver):
    p = AsyncProduct(name="Gadget")
    await p.insert()
    stmt, _ = registered_mock_driver.executed[0]
    assert "IF NOT EXISTS" in stmt


async def test_delete(registered_mock_driver):
    p = AsyncProduct(name="Gadget")
    await p.delete()
    stmt, _ = registered_mock_driver.executed[0]
    assert "DELETE FROM test_ks.async_products" in stmt


async def test_find_one(registered_mock_driver):
    pid = uuid4()
    registered_mock_driver.set_return_rows(
        [{"id": pid, "name": "X", "brand": "Acme", "price": 1.0, "description": None}]
    )
    doc = await AsyncProduct.find_one(brand="Acme")
    assert isinstance(doc, AsyncProduct)


async def test_find_one_none(registered_mock_driver):
    doc = await AsyncProduct.find_one(brand="None")
    assert doc is None


async def test_get_raises_not_found(registered_mock_driver):
    with pytest.raises(DocumentNotFound):
        await AsyncProduct.get(brand="Missing")


async def test_find_one_raises_multiple_found(registered_mock_driver):
    pid1, pid2 = uuid4(), uuid4()
    registered_mock_driver.set_return_rows(
        [
            {"id": pid1, "name": "A", "brand": "X", "price": 1.0, "description": None},
            {"id": pid2, "name": "B", "brand": "X", "price": 2.0, "description": None},
        ]
    )
    with pytest.raises(MultipleDocumentsFound):
        await AsyncProduct.find_one(brand="X")


# ------------------------------------------------------------------
# Async CounterDocument tests
# ------------------------------------------------------------------


class AsyncPageView(CounterDocument):
    url: Annotated[str, PrimaryKey()]
    view_count: Annotated[int, Counter()] = 0
    unique_visitors: Annotated[int, Counter()] = 0

    class Settings:
        name = "async_page_views"
        keyspace = "test_ks"


async def test_counter_save_raises(registered_mock_driver):
    pv = AsyncPageView(url="/home")
    with pytest.raises(InvalidQueryError, match="do not support save"):
        await pv.save()


async def test_counter_insert_raises(registered_mock_driver):
    pv = AsyncPageView(url="/home")
    with pytest.raises(InvalidQueryError, match="do not support insert"):
        await pv.insert()


async def test_counter_increment(registered_mock_driver):
    pv = AsyncPageView(url="/home")
    await pv.increment(view_count=1)
    assert len(registered_mock_driver.executed) == 1
    stmt, params = registered_mock_driver.executed[0]
    assert "UPDATE test_ks.async_page_views" in stmt
    assert '"view_count" = "view_count" + ?' in stmt
    assert 'WHERE "url" = ?' in stmt
    assert params == [1, "/home"]


async def test_counter_increment_multiple(registered_mock_driver):
    pv = AsyncPageView(url="/home")
    await pv.increment(view_count=5, unique_visitors=1)
    stmt, params = registered_mock_driver.executed[0]
    assert '"view_count" = "view_count" + ?' in stmt
    assert '"unique_visitors" = "unique_visitors" + ?' in stmt
    assert params == [5, 1, "/home"]


async def test_counter_decrement(registered_mock_driver):
    pv = AsyncPageView(url="/home")
    await pv.decrement(view_count=1)
    stmt, params = registered_mock_driver.executed[0]
    assert '"view_count" = "view_count" + ?' in stmt
    assert params == [-1, "/home"]
