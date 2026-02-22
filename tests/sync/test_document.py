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


# --- Phase 3: Document.update() ---


class TaggedProduct(Document):
    id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)
    name: str = ""
    price: float = 0.0
    tags: set[str] = set()
    items: list[str] = []

    class Settings:
        name = "tagged_products"
        keyspace = "test_ks"


def test_update_basic(registered_mock_driver):
    p = TaggedProduct(name="Widget", price=9.99)
    p.update(name="Gadget", price=19.99)
    assert len(registered_mock_driver.executed) == 1
    stmt, params = registered_mock_driver.executed[0]
    assert "UPDATE test_ks.tagged_products" in stmt
    assert '"name" = ?' in stmt
    assert '"price" = ?' in stmt
    assert "Gadget" in params
    assert 19.99 in params


def test_update_updates_local_fields(registered_mock_driver):
    p = TaggedProduct(name="Widget", price=9.99)
    p.update(name="Gadget")
    assert p.name == "Gadget"


def test_update_with_ttl(registered_mock_driver):
    p = TaggedProduct(name="Widget")
    p.update(ttl=600, name="Gadget")
    stmt, _ = registered_mock_driver.executed[0]
    assert "USING TTL 600" in stmt


def test_update_with_if_conditions(registered_mock_driver):
    p = TaggedProduct(name="Widget")
    p.update(if_conditions={"name": "Widget"}, name="Gadget")
    stmt, params = registered_mock_driver.executed[0]
    assert 'IF "name" = ?' in stmt
    assert "Widget" in params


def test_update_collection_add(registered_mock_driver):
    p = TaggedProduct(name="Widget")
    p.update(tags__add={"new_tag"})
    stmt, params = registered_mock_driver.executed[0]
    assert '"tags" = "tags" + ?' in stmt
    assert {"new_tag"} in params


def test_update_collection_remove(registered_mock_driver):
    p = TaggedProduct(name="Widget")
    p.update(tags__remove={"old_tag"})
    stmt, params = registered_mock_driver.executed[0]
    assert '"tags" = "tags" - ?' in stmt
    assert {"old_tag"} in params


def test_update_collection_append(registered_mock_driver):
    p = TaggedProduct(name="Widget")
    p.update(items__append=["z"])
    stmt, params = registered_mock_driver.executed[0]
    assert '"items" = "items" + ?' in stmt
    assert ["z"] in params


def test_update_collection_prepend(registered_mock_driver):
    p = TaggedProduct(name="Widget")
    p.update(items__prepend=["a"])
    stmt, params = registered_mock_driver.executed[0]
    assert '"items" = ? + "items"' in stmt
    assert ["a"] in params


def test_update_noop_when_empty(registered_mock_driver):
    p = TaggedProduct(name="Widget")
    p.update()
    assert len(registered_mock_driver.executed) == 0
    assert p.name == "Widget"


# ------------------------------------------------------------------
# LWT / update() tests
# ------------------------------------------------------------------


def test_update_generates_update_cql(registered_mock_driver):
    p = Product(name="Widget", price=9.99)
    p.update(name="NewWidget")
    assert len(registered_mock_driver.executed) == 1
    stmt, params = registered_mock_driver.executed[0]
    assert "UPDATE test_ks.products" in stmt
    assert 'SET "name" = ?' in stmt
    assert "NewWidget" in params


def test_update_with_if_conditions_not_applied(registered_mock_driver):
    registered_mock_driver.set_return_rows([{"[applied]": False, "name": "OtherName"}])
    p = Product(name="Widget", price=9.99)
    result = p.update(if_conditions={"name": "Widget"}, name="NewWidget")
    assert result is not None
    assert result.applied is False
    assert result.existing == {"name": "OtherName"}


def test_update_with_if_exists(registered_mock_driver):
    registered_mock_driver.set_return_rows([{"[applied]": True}])
    p = Product(name="Widget", price=9.99)
    result = p.update(if_exists=True, name="NewWidget")
    stmt, _ = registered_mock_driver.executed[0]
    assert "IF EXISTS" in stmt
    assert result is not None
    assert result.applied is True


def test_update_no_kwargs_noop(registered_mock_driver):
    p = Product(name="Widget", price=9.99)
    result = p.update()
    assert result is None
    assert len(registered_mock_driver.executed) == 0


def test_delete_if_exists(registered_mock_driver):
    registered_mock_driver.set_return_rows([{"[applied]": True}])
    p = Product(name="Widget")
    result = p.delete(if_exists=True)
    stmt, _ = registered_mock_driver.executed[0]
    assert "DELETE FROM test_ks.products" in stmt
    assert "IF EXISTS" in stmt
    assert result is not None
    assert result.applied is True


def test_delete_if_exists_not_applied(registered_mock_driver):
    registered_mock_driver.set_return_rows([{"[applied]": False}])
    p = Product(name="Widget")
    result = p.delete(if_exists=True)
    assert result is not None
    assert result.applied is False


def test_delete_without_if_exists_returns_none(registered_mock_driver):
    p = Product(name="Widget")
    result = p.delete()
    assert result is None


# ------------------------------------------------------------------
# Phase 5: Query Execution Options on Document
# ------------------------------------------------------------------


def test_save_with_timestamp(registered_mock_driver):
    p = Product(name="Widget", price=9.99)
    p.save(timestamp=1234567890)
    stmt, _ = registered_mock_driver.executed[0]
    assert "USING TIMESTAMP 1234567890" in stmt


def test_save_with_ttl_and_timestamp(registered_mock_driver):
    p = Product(name="Widget", price=9.99)
    p.save(ttl=60, timestamp=1234567890)
    stmt, _ = registered_mock_driver.executed[0]
    assert "USING TTL 60 AND TIMESTAMP 1234567890" in stmt


def test_save_with_consistency(registered_mock_driver):
    p = Product(name="Widget", price=9.99)
    p.save(consistency="LOCAL_QUORUM")
    assert registered_mock_driver.last_consistency == "LOCAL_QUORUM"


def test_save_with_timeout(registered_mock_driver):
    p = Product(name="Widget", price=9.99)
    p.save(timeout=5.0)
    assert registered_mock_driver.last_timeout == 5.0


def test_insert_with_timestamp(registered_mock_driver):
    p = Product(name="Widget")
    p.insert(timestamp=1234567890)
    stmt, _ = registered_mock_driver.executed[0]
    assert "USING TIMESTAMP 1234567890" in stmt


def test_insert_with_consistency(registered_mock_driver):
    p = Product(name="Widget")
    p.insert(consistency="LOCAL_QUORUM")
    assert registered_mock_driver.last_consistency == "LOCAL_QUORUM"


def test_delete_with_timestamp(registered_mock_driver):
    p = Product(name="Widget")
    p.delete(timestamp=1234567890)
    stmt, _ = registered_mock_driver.executed[0]
    assert "USING TIMESTAMP 1234567890" in stmt


def test_delete_with_consistency(registered_mock_driver):
    p = Product(name="Widget")
    p.delete(consistency="LOCAL_QUORUM")
    assert registered_mock_driver.last_consistency == "LOCAL_QUORUM"


# ------------------------------------------------------------------
# execute_raw tests
# ------------------------------------------------------------------


def test_execute_raw(registered_mock_driver):
    from coodie.sync import execute_raw

    registered_mock_driver.set_return_rows(
        [{"id": 1, "name": "Alice"}, {"id": 2, "name": "Bob"}]
    )
    rows = execute_raw("SELECT * FROM test_ks.users")
    assert len(rows) == 2
    assert rows[0]["name"] == "Alice"
    stmt, params = registered_mock_driver.executed[0]
    assert stmt == "SELECT * FROM test_ks.users"
    assert params == []


def test_execute_raw_with_params(registered_mock_driver):
    from coodie.sync import execute_raw

    registered_mock_driver.set_return_rows([{"id": 1, "name": "Alice"}])
    rows = execute_raw("SELECT * FROM test_ks.users WHERE id = ?", [1])
    assert len(rows) == 1
    stmt, params = registered_mock_driver.executed[0]
    assert stmt == "SELECT * FROM test_ks.users WHERE id = ?"
    assert params == [1]


def test_execute_raw_empty_result(registered_mock_driver):
    from coodie.sync import execute_raw

    rows = execute_raw("SELECT * FROM test_ks.users WHERE id = ?", [999])
    assert rows == []


def test_execute_raw_insert(registered_mock_driver):
    from coodie.sync import execute_raw

    execute_raw("INSERT INTO test_ks.users (id, name) VALUES (?, ?)", [1, "Alice"])
    stmt, params = registered_mock_driver.executed[0]
    assert "INSERT INTO" in stmt
    assert params == [1, "Alice"]
