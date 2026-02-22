from __future__ import annotations

from typing import Annotated, Optional
from uuid import UUID, uuid4

import pytest
from pydantic import Field

from coodie.fields import PrimaryKey, Indexed, Counter
from coodie.sync.document import Document, CounterDocument
from coodie.exceptions import (
    DocumentNotFound,
    MultipleDocumentsFound,
    InvalidQueryError,
)


class Product(Document):
    id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)
    name: str
    brand: Annotated[str, Indexed()] = "Unknown"
    price: float = 0.0
    description: Optional[str] = None

    class Settings:
        name = "products"
        keyspace = "test_ks"


def test_sync_table(registered_mock_driver):
    Product.sync_table()
    assert any("SYNC_TABLE" in stmt for stmt, _ in registered_mock_driver.executed)


def test_save(registered_mock_driver):
    p = Product(name="Widget", price=9.99)
    p.save()
    assert len(registered_mock_driver.executed) == 1
    stmt, params = registered_mock_driver.executed[0]
    assert "INSERT INTO test_ks.products" in stmt


def test_insert_if_not_exists(registered_mock_driver):
    p = Product(name="Widget")
    p.insert()
    stmt, _ = registered_mock_driver.executed[0]
    assert "IF NOT EXISTS" in stmt


def test_delete(registered_mock_driver):
    p = Product(name="Widget")
    p.delete()
    stmt, _ = registered_mock_driver.executed[0]
    assert "DELETE FROM test_ks.products" in stmt


def test_find_returns_queryset(registered_mock_driver):
    from coodie.sync.query import QuerySet

    qs = Product.find(brand="Acme")
    assert isinstance(qs, QuerySet)


def test_find_one_returns_document(registered_mock_driver):
    pid = uuid4()
    registered_mock_driver.set_return_rows(
        [{"id": pid, "name": "X", "brand": "Acme", "price": 1.0, "description": None}]
    )
    doc = Product.find_one(brand="Acme")
    assert isinstance(doc, Product)
    assert doc.brand == "Acme"


def test_find_one_returns_none_when_empty(registered_mock_driver):
    doc = Product.find_one(brand="NoSuch")
    assert doc is None


def test_get_raises_document_not_found(registered_mock_driver):
    with pytest.raises(DocumentNotFound):
        Product.get(brand="NoSuch")


def test_find_one_raises_multiple_found(registered_mock_driver):
    pid1, pid2 = uuid4(), uuid4()
    registered_mock_driver.set_return_rows(
        [
            {
                "id": pid1,
                "name": "A",
                "brand": "Acme",
                "price": 1.0,
                "description": None,
            },
            {
                "id": pid2,
                "name": "B",
                "brand": "Acme",
                "price": 2.0,
                "description": None,
            },
        ]
    )
    with pytest.raises(MultipleDocumentsFound):
        Product.find_one(brand="Acme")


def test_get_table_name():
    assert Product._get_table() == "products"


def test_snake_case_default_table_name():
    class MyDocument(Document):
        id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)

        class Settings:
            name = ""
            keyspace = "test_ks"

    assert MyDocument._get_table() == "my_document"


# ------------------------------------------------------------------
# CounterDocument tests
# ------------------------------------------------------------------


class PageView(CounterDocument):
    url: Annotated[str, PrimaryKey()]
    view_count: Annotated[int, Counter()] = 0
    unique_visitors: Annotated[int, Counter()] = 0

    class Settings:
        name = "page_views"
        keyspace = "test_ks"


def test_counter_save_raises(registered_mock_driver):
    pv = PageView(url="/home")
    with pytest.raises(InvalidQueryError, match="do not support save"):
        pv.save()


def test_counter_insert_raises(registered_mock_driver):
    pv = PageView(url="/home")
    with pytest.raises(InvalidQueryError, match="do not support insert"):
        pv.insert()


def test_counter_increment(registered_mock_driver):
    pv = PageView(url="/home")
    pv.increment(view_count=1)
    assert len(registered_mock_driver.executed) == 1
    stmt, params = registered_mock_driver.executed[0]
    assert "UPDATE test_ks.page_views" in stmt
    assert '"view_count" = "view_count" + ?' in stmt
    assert 'WHERE "url" = ?' in stmt
    assert params == [1, "/home"]


def test_counter_increment_multiple(registered_mock_driver):
    pv = PageView(url="/home")
    pv.increment(view_count=5, unique_visitors=1)
    stmt, params = registered_mock_driver.executed[0]
    assert '"view_count" = "view_count" + ?' in stmt
    assert '"unique_visitors" = "unique_visitors" + ?' in stmt
    assert params == [5, 1, "/home"]


def test_counter_decrement(registered_mock_driver):
    pv = PageView(url="/home")
    pv.decrement(view_count=1)
    stmt, params = registered_mock_driver.executed[0]
    assert '"view_count" = "view_count" + ?' in stmt
    assert params == [-1, "/home"]
