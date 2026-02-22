from __future__ import annotations

from typing import Annotated
from uuid import UUID, uuid4

from pydantic import Field

from coodie.fields import PrimaryKey
from coodie.sync.document import Document
from coodie.sync.query import QuerySet


class Item(Document):
    id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)
    name: str = ""
    rating: int = 0

    class Settings:
        name = "items"
        keyspace = "test_ks"


def test_filter_returns_new_queryset(registered_mock_driver):
    qs = QuerySet(Item)
    qs2 = qs.filter(name="foo")
    assert qs is not qs2
    assert len(qs2._where) == 1


def test_limit_returns_new_queryset(registered_mock_driver):
    qs = QuerySet(Item).limit(5)
    assert qs._limit_val == 5


def test_order_by_returns_new_queryset(registered_mock_driver):
    qs = QuerySet(Item).order_by("-created_at")
    assert qs._order_by_val == ["-created_at"]


def test_allow_filtering_returns_new_queryset(registered_mock_driver):
    qs = QuerySet(Item).allow_filtering()
    assert qs._allow_filtering_val is True


def test_all_returns_list(registered_mock_driver):
    registered_mock_driver.set_return_rows(
        [
            {"id": uuid4(), "name": "A", "rating": 5},
        ]
    )
    results = QuerySet(Item).all()
    assert isinstance(results, list)
    assert len(results) == 1
    assert isinstance(results[0], Item)


def test_first_returns_single(registered_mock_driver):
    registered_mock_driver.set_return_rows(
        [
            {"id": uuid4(), "name": "B", "rating": 3},
        ]
    )
    result = QuerySet(Item).first()
    assert result is not None
    assert isinstance(result, Item)


def test_first_returns_none_on_empty(registered_mock_driver):
    result = QuerySet(Item).first()
    assert result is None


def test_count_returns_int(registered_mock_driver):
    registered_mock_driver.set_return_rows([{"count": 42}])
    count = QuerySet(Item).count()
    assert count == 42


def test_delete_executes(registered_mock_driver):
    QuerySet(Item).filter(name="old").delete()
    stmt, _ = registered_mock_driver.executed[0]
    assert "DELETE FROM" in stmt


def test_iter(registered_mock_driver):
    registered_mock_driver.set_return_rows(
        [
            {"id": uuid4(), "name": "C", "rating": 1},
            {"id": uuid4(), "name": "D", "rating": 2},
        ]
    )
    items = list(QuerySet(Item))
    assert len(items) == 2


def test_len(registered_mock_driver):
    registered_mock_driver.set_return_rows([{"count": 7}])
    assert len(QuerySet(Item)) == 7


def test_chaining(registered_mock_driver):
    registered_mock_driver.set_return_rows([])
    qs = (
        QuerySet(Item)
        .filter(rating__gte=3)
        .limit(10)
        .order_by("-rating")
        .allow_filtering()
    )
    qs.all()
    stmt, params = registered_mock_driver.executed[0]
    assert "LIMIT 10" in stmt
    assert "ALLOW FILTERING" in stmt
    assert params == [3]


# --- Phase 3: QuerySet.update() ---


def test_update_basic(registered_mock_driver):
    QuerySet(Item).filter(name="old").update(name="new")
    stmt, params = registered_mock_driver.executed[0]
    assert "UPDATE test_ks.items" in stmt
    assert '"name" = ?' in stmt
    assert "new" in params


def test_update_with_ttl(registered_mock_driver):
    QuerySet(Item).filter(name="old").update(ttl=300, name="new")
    stmt, _ = registered_mock_driver.executed[0]
    assert "USING TTL 300" in stmt


def test_update_with_if_conditions(registered_mock_driver):
    QuerySet(Item).filter(name="old").update(if_conditions={"rating": 5}, name="new")
    stmt, params = registered_mock_driver.executed[0]
    assert 'IF "rating" = ?' in stmt
    assert 5 in params


def test_update_collection_add(registered_mock_driver):
    class TagItem(Document):
        id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)
        tags: set[str] = set()

        class Settings:
            name = "tag_items"
            keyspace = "test_ks"

    QuerySet(TagItem).filter(id=uuid4()).update(tags__add={"x"})
    stmt, params = registered_mock_driver.executed[0]
    assert '"tags" = "tags" + ?' in stmt
    assert {"x"} in params


def test_update_noop_when_empty(registered_mock_driver):
    QuerySet(Item).filter(name="old").update()
    assert len(registered_mock_driver.executed) == 0
