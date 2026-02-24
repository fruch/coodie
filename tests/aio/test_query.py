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
    await QuerySet(AsyncItem).filter(name="old").update(if_conditions={"rating": 5}, name="new")
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


# ------------------------------------------------------------------
# LWT chain methods
# ------------------------------------------------------------------


async def test_if_not_exists_returns_new_queryset(registered_mock_driver):
    qs = QuerySet(AsyncItem).if_not_exists()
    assert qs._if_not_exists_val is True


async def test_if_exists_returns_new_queryset(registered_mock_driver):
    qs = QuerySet(AsyncItem).if_exists()
    assert qs._if_exists_val is True


async def test_if_not_exists_create(registered_mock_driver):
    registered_mock_driver.set_return_rows([{"[applied]": True}])
    result = await QuerySet(AsyncItem).if_not_exists().create(id=uuid4(), name="Widget", rating=5)
    stmt, _ = registered_mock_driver.executed[0]
    assert "INSERT INTO" in stmt
    assert "IF NOT EXISTS" in stmt
    assert result is not None
    assert result.applied is True


async def test_if_not_exists_create_not_applied(registered_mock_driver):
    registered_mock_driver.set_return_rows([{"[applied]": False, "id": "existing-id", "name": "Old", "rating": 3}])
    result = await QuerySet(AsyncItem).if_not_exists().create(id=uuid4(), name="Widget", rating=5)
    assert result is not None
    assert result.applied is False
    assert result.existing is not None


async def test_if_exists_delete(registered_mock_driver):
    registered_mock_driver.set_return_rows([{"[applied]": True}])
    result = await QuerySet(AsyncItem).filter(name="Widget").if_exists().delete()
    stmt, _ = registered_mock_driver.executed[0]
    assert "DELETE FROM" in stmt
    assert "IF EXISTS" in stmt
    assert result is not None
    assert result.applied is True


async def test_if_exists_preserved_through_chaining(registered_mock_driver):
    qs = QuerySet(AsyncItem).if_exists().filter(name="Widget").limit(5)
    assert qs._if_exists_val is True


async def test_if_not_exists_preserved_through_chaining(registered_mock_driver):
    qs = QuerySet(AsyncItem).if_not_exists().filter(name="Widget").limit(5)
    assert qs._if_not_exists_val is True


# ------------------------------------------------------------------
# Phase 5: Query Execution Options (async)
# ------------------------------------------------------------------


def test_ttl_chain(registered_mock_driver):
    qs = QuerySet(AsyncItem).ttl(300)
    assert qs._ttl_val == 300


def test_timestamp_chain(registered_mock_driver):
    qs = QuerySet(AsyncItem).timestamp(1234567890)
    assert qs._timestamp_val == 1234567890


def test_consistency_chain(registered_mock_driver):
    qs = QuerySet(AsyncItem).consistency("LOCAL_QUORUM")
    assert qs._consistency_val == "LOCAL_QUORUM"


def test_timeout_chain(registered_mock_driver):
    qs = QuerySet(AsyncItem).timeout(5.0)
    assert qs._timeout_val == 5.0


def test_using_chain(registered_mock_driver):
    qs = QuerySet(AsyncItem).using(ttl=60, timestamp=1234567890, consistency="ONE", timeout=10.0)
    assert qs._ttl_val == 60
    assert qs._timestamp_val == 1234567890
    assert qs._consistency_val == "ONE"
    assert qs._timeout_val == 10.0


async def test_consistency_passed_to_driver(registered_mock_driver):
    registered_mock_driver.set_return_rows([])
    await QuerySet(AsyncItem).consistency("LOCAL_QUORUM").all()
    assert registered_mock_driver.last_consistency == "LOCAL_QUORUM"


async def test_timeout_passed_to_driver(registered_mock_driver):
    registered_mock_driver.set_return_rows([])
    await QuerySet(AsyncItem).timeout(5.0).all()
    assert registered_mock_driver.last_timeout == 5.0


async def test_timestamp_in_delete_cql(registered_mock_driver):
    await QuerySet(AsyncItem).filter(name="old").timestamp(1234567890).delete()
    stmt, _ = registered_mock_driver.executed[0]
    assert "USING TIMESTAMP 1234567890" in stmt


async def test_chaining_preserves_execution_options(registered_mock_driver):
    registered_mock_driver.set_return_rows([])
    qs = (
        QuerySet(AsyncItem)
        .filter(rating__gte=3)
        .consistency("LOCAL_QUORUM")
        .timeout(5.0)
        .timestamp(1234567890)
        .limit(10)
    )
    await qs.all()
    assert registered_mock_driver.last_consistency == "LOCAL_QUORUM"
    assert registered_mock_driver.last_timeout == 5.0


# ------------------------------------------------------------------
# Phase 11: QuerySet Enhancements (async)
# ------------------------------------------------------------------


def test_only_returns_new_queryset(registered_mock_driver):
    qs = QuerySet(AsyncItem).only("id", "name")
    assert qs._only_val == ["id", "name"]


async def test_only_generates_column_projection(registered_mock_driver):
    registered_mock_driver.set_return_rows([])
    await QuerySet(AsyncItem).only("id", "name").all()
    stmt, _ = registered_mock_driver.executed[0]
    assert 'SELECT "id", "name" FROM' in stmt


def test_defer_returns_new_queryset(registered_mock_driver):
    qs = QuerySet(AsyncItem).defer("rating")
    assert qs._defer_val == ["rating"]


async def test_defer_excludes_columns(registered_mock_driver):
    registered_mock_driver.set_return_rows([])
    await QuerySet(AsyncItem).defer("rating").all()
    stmt, _ = registered_mock_driver.executed[0]
    assert '"rating"' not in stmt
    assert '"id"' in stmt
    assert '"name"' in stmt


async def test_values_list_returns_tuples(registered_mock_driver):
    registered_mock_driver.set_return_rows(
        [
            {"id": uuid4(), "name": "A", "rating": 5},
            {"id": uuid4(), "name": "B", "rating": 3},
        ]
    )
    results = await QuerySet(AsyncItem).values_list("name", "rating").all()
    assert results == [("A", 5), ("B", 3)]


def test_values_list_preserves_through_chaining(registered_mock_driver):
    qs = QuerySet(AsyncItem).values_list("name").filter(rating__gte=3).limit(5)
    assert qs._values_list_val == ["name"]


def test_per_partition_limit_returns_new_queryset(registered_mock_driver):
    qs = QuerySet(AsyncItem).per_partition_limit(5)
    assert qs._per_partition_limit_val == 5


async def test_per_partition_limit_in_cql(registered_mock_driver):
    registered_mock_driver.set_return_rows([])
    await QuerySet(AsyncItem).per_partition_limit(3).all()
    stmt, _ = registered_mock_driver.executed[0]
    assert "PER PARTITION LIMIT 3" in stmt


async def test_like_filter(registered_mock_driver):
    registered_mock_driver.set_return_rows([])
    await QuerySet(AsyncItem).filter(name__like="Al%").all()
    stmt, params = registered_mock_driver.executed[0]
    assert '"name" LIKE ?' in stmt
    assert params == ["Al%"]


def test_only_preserved_through_chaining(registered_mock_driver):
    qs = QuerySet(AsyncItem).only("id", "name").filter(rating__gte=3).limit(5)
    assert qs._only_val == ["id", "name"]


def test_defer_preserved_through_chaining(registered_mock_driver):
    qs = QuerySet(AsyncItem).defer("rating").filter(name="foo").limit(10)
    assert qs._defer_val == ["rating"]


def test_per_partition_limit_preserved_through_chaining(registered_mock_driver):
    qs = QuerySet(AsyncItem).per_partition_limit(5).filter(name="foo").limit(10)
    assert qs._per_partition_limit_val == 5


# ------------------------------------------------------------------
# Phase 10: Pagination & Token Queries (async)
# ------------------------------------------------------------------


def test_fetch_size_chain(registered_mock_driver):
    qs = QuerySet(AsyncItem).fetch_size(100)
    assert qs._fetch_size_val == 100


def test_page_chain(registered_mock_driver):
    state = b"\x00\x01\x02"
    qs = QuerySet(AsyncItem).page(state)
    assert qs._paging_state_val == state


def test_page_none_resets(registered_mock_driver):
    qs = QuerySet(AsyncItem).page(b"\x00").page(None)
    assert qs._paging_state_val is None


async def test_fetch_size_passed_to_driver(registered_mock_driver):
    registered_mock_driver.set_return_rows([])
    await QuerySet(AsyncItem).fetch_size(50).paged_all()
    assert registered_mock_driver.last_fetch_size == 50


async def test_paging_state_passed_to_driver(registered_mock_driver):
    registered_mock_driver.set_return_rows([])
    state = b"\x00\x01\x02"
    await QuerySet(AsyncItem).page(state).paged_all()
    assert registered_mock_driver.last_paging_state == state


def test_fetch_size_preserved_through_chaining(registered_mock_driver):
    qs = QuerySet(AsyncItem).fetch_size(100).filter(rating__gte=3).limit(10)
    assert qs._fetch_size_val == 100


async def test_paged_all_returns_paged_result(registered_mock_driver):
    from coodie.results import PagedResult

    registered_mock_driver.set_return_rows([{"id": uuid4(), "name": "A", "rating": 5}])
    registered_mock_driver.set_paging_state(b"\xab\xcd")
    result = await QuerySet(AsyncItem).fetch_size(1).paged_all()
    assert isinstance(result, PagedResult)
    assert len(result.data) == 1
    assert isinstance(result.data[0], AsyncItem)
    assert result.paging_state == b"\xab\xcd"


async def test_paged_all_none_paging_state_when_exhausted(registered_mock_driver):
    from coodie.results import PagedResult

    registered_mock_driver.set_return_rows([{"id": uuid4(), "name": "A", "rating": 5}])
    result = await QuerySet(AsyncItem).fetch_size(100).paged_all()
    assert isinstance(result, PagedResult)
    assert result.paging_state is None


async def test_token_filter_generates_correct_cql(registered_mock_driver):
    registered_mock_driver.set_return_rows([])
    await QuerySet(AsyncItem).filter(id__token__gt=100).allow_filtering().all()
    stmt, params = registered_mock_driver.executed[0]
    assert 'TOKEN("id") > ?' in stmt
    assert 100 in params
