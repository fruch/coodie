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


# ------------------------------------------------------------------
# LWT chain methods
# ------------------------------------------------------------------


def test_if_not_exists_returns_new_queryset(registered_mock_driver):
    qs = QuerySet(Item).if_not_exists()
    assert qs._if_not_exists_val is True


def test_if_exists_returns_new_queryset(registered_mock_driver):
    qs = QuerySet(Item).if_exists()
    assert qs._if_exists_val is True


def test_if_not_exists_create(registered_mock_driver):
    registered_mock_driver.set_return_rows([{"[applied]": True}])
    result = QuerySet(Item).if_not_exists().create(id=uuid4(), name="Widget", rating=5)
    stmt, _ = registered_mock_driver.executed[0]
    assert "INSERT INTO" in stmt
    assert "IF NOT EXISTS" in stmt
    assert result is not None
    assert result.applied is True


def test_if_not_exists_create_not_applied(registered_mock_driver):
    registered_mock_driver.set_return_rows(
        [{"[applied]": False, "id": "existing-id", "name": "Old", "rating": 3}]
    )
    result = QuerySet(Item).if_not_exists().create(id=uuid4(), name="Widget", rating=5)
    assert result is not None
    assert result.applied is False
    assert result.existing is not None


def test_if_exists_delete(registered_mock_driver):
    registered_mock_driver.set_return_rows([{"[applied]": True}])
    result = QuerySet(Item).filter(name="Widget").if_exists().delete()
    stmt, _ = registered_mock_driver.executed[0]
    assert "DELETE FROM" in stmt
    assert "IF EXISTS" in stmt
    assert result is not None
    assert result.applied is True


def test_if_exists_preserved_through_chaining(registered_mock_driver):
    qs = QuerySet(Item).if_exists().filter(name="Widget").limit(5)
    assert qs._if_exists_val is True


def test_if_not_exists_preserved_through_chaining(registered_mock_driver):
    qs = QuerySet(Item).if_not_exists().filter(name="Widget").limit(5)
    assert qs._if_not_exists_val is True


# ------------------------------------------------------------------
# Phase 5: Query Execution Options
# ------------------------------------------------------------------


def test_ttl_chain(registered_mock_driver):
    qs = QuerySet(Item).ttl(300)
    assert qs._ttl_val == 300


def test_timestamp_chain(registered_mock_driver):
    qs = QuerySet(Item).timestamp(1234567890)
    assert qs._timestamp_val == 1234567890


def test_consistency_chain(registered_mock_driver):
    qs = QuerySet(Item).consistency("LOCAL_QUORUM")
    assert qs._consistency_val == "LOCAL_QUORUM"


def test_timeout_chain(registered_mock_driver):
    qs = QuerySet(Item).timeout(5.0)
    assert qs._timeout_val == 5.0


def test_using_chain(registered_mock_driver):
    qs = QuerySet(Item).using(
        ttl=60, timestamp=1234567890, consistency="ONE", timeout=10.0
    )
    assert qs._ttl_val == 60
    assert qs._timestamp_val == 1234567890
    assert qs._consistency_val == "ONE"
    assert qs._timeout_val == 10.0


def test_consistency_passed_to_driver(registered_mock_driver):
    registered_mock_driver.set_return_rows([])
    QuerySet(Item).consistency("LOCAL_QUORUM").all()
    assert registered_mock_driver.last_consistency == "LOCAL_QUORUM"


def test_timeout_passed_to_driver(registered_mock_driver):
    registered_mock_driver.set_return_rows([])
    QuerySet(Item).timeout(5.0).all()
    assert registered_mock_driver.last_timeout == 5.0


def test_timestamp_in_delete_cql(registered_mock_driver):
    QuerySet(Item).filter(name="old").timestamp(1234567890).delete()
    stmt, _ = registered_mock_driver.executed[0]
    assert "USING TIMESTAMP 1234567890" in stmt


def test_chaining_preserves_execution_options(registered_mock_driver):
    registered_mock_driver.set_return_rows([])
    qs = (
        QuerySet(Item)
        .filter(rating__gte=3)
        .consistency("LOCAL_QUORUM")
        .timeout(5.0)
        .timestamp(1234567890)
        .limit(10)
    )
    qs.all()
    assert registered_mock_driver.last_consistency == "LOCAL_QUORUM"
    assert registered_mock_driver.last_timeout == 5.0


# ------------------------------------------------------------------
# Phase 11: QuerySet Enhancements
# ------------------------------------------------------------------


def test_only_returns_new_queryset(registered_mock_driver):
    qs = QuerySet(Item).only("id", "name")
    assert qs._only_val == ["id", "name"]


def test_only_generates_column_projection(registered_mock_driver):
    registered_mock_driver.set_return_rows([])
    QuerySet(Item).only("id", "name").all()
    stmt, _ = registered_mock_driver.executed[0]
    assert 'SELECT "id", "name" FROM' in stmt


def test_defer_returns_new_queryset(registered_mock_driver):
    qs = QuerySet(Item).defer("rating")
    assert qs._defer_val == ["rating"]


def test_defer_excludes_columns(registered_mock_driver):
    registered_mock_driver.set_return_rows([])
    QuerySet(Item).defer("rating").all()
    stmt, _ = registered_mock_driver.executed[0]
    assert '"rating"' not in stmt
    assert '"id"' in stmt
    assert '"name"' in stmt


def test_values_list_returns_tuples(registered_mock_driver):
    uid = uuid4()
    registered_mock_driver.set_return_rows(
        [
            {"id": uid, "name": "A", "rating": 5},
            {"id": uuid4(), "name": "B", "rating": 3},
        ]
    )
    results = QuerySet(Item).values_list("name", "rating").all()
    assert results == [("A", 5), ("B", 3)]


def test_values_list_preserves_through_chaining(registered_mock_driver):
    qs = QuerySet(Item).values_list("name").filter(rating__gte=3).limit(5)
    assert qs._values_list_val == ["name"]


def test_per_partition_limit_returns_new_queryset(registered_mock_driver):
    qs = QuerySet(Item).per_partition_limit(5)
    assert qs._per_partition_limit_val == 5


def test_per_partition_limit_in_cql(registered_mock_driver):
    registered_mock_driver.set_return_rows([])
    QuerySet(Item).per_partition_limit(3).all()
    stmt, _ = registered_mock_driver.executed[0]
    assert "PER PARTITION LIMIT 3" in stmt


def test_like_filter(registered_mock_driver):
    registered_mock_driver.set_return_rows([])
    QuerySet(Item).filter(name__like="Al%").all()
    stmt, params = registered_mock_driver.executed[0]
    assert '"name" LIKE ?' in stmt
    assert params == ["Al%"]


def test_only_preserved_through_chaining(registered_mock_driver):
    qs = QuerySet(Item).only("id", "name").filter(rating__gte=3).limit(5)
    assert qs._only_val == ["id", "name"]


def test_defer_preserved_through_chaining(registered_mock_driver):
    qs = QuerySet(Item).defer("rating").filter(name="foo").limit(10)
    assert qs._defer_val == ["rating"]


def test_per_partition_limit_preserved_through_chaining(registered_mock_driver):
    qs = QuerySet(Item).per_partition_limit(5).filter(name="foo").limit(10)
    assert qs._per_partition_limit_val == 5
