"""Merged sync + async QuerySet tests.

Uses a ``variant`` fixture to parametrise every test over both the sync
and async code-paths.  Terminal methods use ``_maybe_await`` so the same
test body drives both variants.
"""

from typing import Annotated
from uuid import UUID, uuid4

import pytest
from pydantic import Field

from coodie.fields import PrimaryKey
from tests.conftest import _maybe_await
from tests.models import make_item


# ------------------------------------------------------------------
# Fixtures
# ------------------------------------------------------------------


@pytest.fixture(params=["sync", "async"])
def variant(request):
    return request.param


@pytest.fixture
def document_cls(variant):
    if variant == "sync":
        from coodie.sync.document import Document

        return Document
    from coodie.aio.document import Document

    return Document


@pytest.fixture
def queryset_cls(variant):
    if variant == "sync":
        from coodie.sync.query import QuerySet

        return QuerySet
    from coodie.aio.query import QuerySet

    return QuerySet


@pytest.fixture
def Item(document_cls):
    return make_item(document_cls)


# ------------------------------------------------------------------
# Chain method tests (no driver call needed)
# ------------------------------------------------------------------


def test_filter_returns_new_queryset(Item, queryset_cls, registered_mock_driver):
    qs = queryset_cls(Item)
    qs2 = qs.filter(name="foo")
    assert qs is not qs2
    assert len(qs2._where) == 1


def test_limit_returns_new_queryset(Item, queryset_cls, registered_mock_driver):
    qs = queryset_cls(Item).limit(5)
    assert qs._limit_val == 5


def test_order_by_returns_new_queryset(Item, queryset_cls, registered_mock_driver):
    qs = queryset_cls(Item).order_by("-created_at")
    assert qs._order_by_val == ["-created_at"]


def test_allow_filtering_returns_new_queryset(Item, queryset_cls, registered_mock_driver):
    qs = queryset_cls(Item).allow_filtering()
    assert qs._allow_filtering_val is True


# ------------------------------------------------------------------
# Terminal method tests (use _maybe_await)
# ------------------------------------------------------------------


async def test_all_returns_list(Item, queryset_cls, registered_mock_driver):
    registered_mock_driver.set_return_rows([{"id": uuid4(), "name": "A", "rating": 5}])
    results = await _maybe_await(queryset_cls(Item).all)
    assert isinstance(results, list)
    assert len(results) == 1
    assert isinstance(results[0], Item)


async def test_first_returns_single(Item, queryset_cls, registered_mock_driver):
    registered_mock_driver.set_return_rows([{"id": uuid4(), "name": "B", "rating": 3}])
    result = await _maybe_await(queryset_cls(Item).first)
    assert result is not None
    assert isinstance(result, Item)


async def test_first_returns_none_on_empty(Item, queryset_cls, registered_mock_driver):
    result = await _maybe_await(queryset_cls(Item).first)
    assert result is None


async def test_count_returns_int(Item, queryset_cls, registered_mock_driver):
    registered_mock_driver.set_return_rows([{"count": 42}])
    count = await _maybe_await(queryset_cls(Item).count)
    assert count == 42


async def test_delete_executes(Item, queryset_cls, registered_mock_driver):
    await _maybe_await(queryset_cls(Item).filter(name="old").delete)
    stmt, _ = registered_mock_driver.executed[0]
    assert "DELETE FROM" in stmt


async def test_iter(variant, Item, queryset_cls, registered_mock_driver):
    if variant == "async":
        pytest.skip("__iter__ is sync-only")
    registered_mock_driver.set_return_rows(
        [
            {"id": uuid4(), "name": "C", "rating": 1},
            {"id": uuid4(), "name": "D", "rating": 2},
        ]
    )
    items = list(queryset_cls(Item))
    assert len(items) == 2


async def test_aiter(variant, Item, queryset_cls, registered_mock_driver):
    if variant == "sync":
        pytest.skip("__aiter__ is async-only")
    registered_mock_driver.set_return_rows(
        [
            {"id": uuid4(), "name": "C", "rating": 1},
            {"id": uuid4(), "name": "D", "rating": 2},
        ]
    )
    items = [item async for item in queryset_cls(Item)]
    assert len(items) == 2


async def test_len(variant, Item, queryset_cls, registered_mock_driver):
    if variant == "async":
        pytest.skip("__len__ is sync-only")
    registered_mock_driver.set_return_rows([{"count": 7}])
    assert len(queryset_cls(Item)) == 7


async def test_chaining(Item, queryset_cls, registered_mock_driver):
    registered_mock_driver.set_return_rows([])
    qs = queryset_cls(Item).filter(rating__gte=3).limit(10).order_by("-rating").allow_filtering()
    await _maybe_await(qs.all)
    stmt, params = registered_mock_driver.executed[0]
    assert "LIMIT 10" in stmt
    assert "ALLOW FILTERING" in stmt
    assert params == [3]


# ------------------------------------------------------------------
# Phase 3: QuerySet.update()
# ------------------------------------------------------------------


async def test_update_basic(Item, queryset_cls, registered_mock_driver):
    await _maybe_await(queryset_cls(Item).filter(name="old").update, name="new")
    stmt, params = registered_mock_driver.executed[0]
    assert "UPDATE test_ks.items" in stmt
    assert '"name" = ?' in stmt
    assert "new" in params


async def test_update_with_ttl(Item, queryset_cls, registered_mock_driver):
    await _maybe_await(queryset_cls(Item).filter(name="old").update, ttl=300, name="new")
    stmt, _ = registered_mock_driver.executed[0]
    assert "USING TTL 300" in stmt


async def test_update_with_if_conditions(Item, queryset_cls, registered_mock_driver):
    await _maybe_await(queryset_cls(Item).filter(name="old").update, if_conditions={"rating": 5}, name="new")
    stmt, params = registered_mock_driver.executed[0]
    assert 'IF "rating" = ?' in stmt
    assert 5 in params


async def test_update_collection_add(document_cls, queryset_cls, registered_mock_driver):
    class TagItem(document_cls):
        id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)
        tags: set[str] = set()

        class Settings:
            name = "tag_items"
            keyspace = "test_ks"

    await _maybe_await(queryset_cls(TagItem).filter(id=uuid4()).update, tags__add={"x"})
    stmt, params = registered_mock_driver.executed[0]
    assert '"tags" = "tags" + ?' in stmt
    assert {"x"} in params


async def test_update_noop_when_empty(Item, queryset_cls, registered_mock_driver):
    await _maybe_await(queryset_cls(Item).filter(name="old").update)
    assert len(registered_mock_driver.executed) == 0


# ------------------------------------------------------------------
# LWT chain methods
# ------------------------------------------------------------------


def test_if_not_exists_returns_new_queryset(Item, queryset_cls, registered_mock_driver):
    qs = queryset_cls(Item).if_not_exists()
    assert qs._if_not_exists_val is True


def test_if_exists_returns_new_queryset(Item, queryset_cls, registered_mock_driver):
    qs = queryset_cls(Item).if_exists()
    assert qs._if_exists_val is True


async def test_if_not_exists_create(Item, queryset_cls, registered_mock_driver):
    registered_mock_driver.set_return_rows([{"[applied]": True}])
    result = await _maybe_await(queryset_cls(Item).if_not_exists().create, id=uuid4(), name="Widget", rating=5)
    stmt, _ = registered_mock_driver.executed[0]
    assert "INSERT INTO" in stmt
    assert "IF NOT EXISTS" in stmt
    assert result is not None
    assert result.applied is True


async def test_if_not_exists_create_not_applied(Item, queryset_cls, registered_mock_driver):
    registered_mock_driver.set_return_rows([{"[applied]": False, "id": "existing-id", "name": "Old", "rating": 3}])
    result = await _maybe_await(queryset_cls(Item).if_not_exists().create, id=uuid4(), name="Widget", rating=5)
    assert result is not None
    assert result.applied is False
    assert result.existing is not None


async def test_if_exists_delete(Item, queryset_cls, registered_mock_driver):
    registered_mock_driver.set_return_rows([{"[applied]": True}])
    result = await _maybe_await(queryset_cls(Item).filter(name="Widget").if_exists().delete)
    stmt, _ = registered_mock_driver.executed[0]
    assert "DELETE FROM" in stmt
    assert "IF EXISTS" in stmt
    assert result is not None
    assert result.applied is True


def test_if_exists_preserved_through_chaining(Item, queryset_cls, registered_mock_driver):
    qs = queryset_cls(Item).if_exists().filter(name="Widget").limit(5)
    assert qs._if_exists_val is True


def test_if_not_exists_preserved_through_chaining(Item, queryset_cls, registered_mock_driver):
    qs = queryset_cls(Item).if_not_exists().filter(name="Widget").limit(5)
    assert qs._if_not_exists_val is True


# ------------------------------------------------------------------
# Phase 5: Query Execution Options
# ------------------------------------------------------------------


def test_ttl_chain(Item, queryset_cls, registered_mock_driver):
    qs = queryset_cls(Item).ttl(300)
    assert qs._ttl_val == 300


def test_timestamp_chain(Item, queryset_cls, registered_mock_driver):
    qs = queryset_cls(Item).timestamp(1234567890)
    assert qs._timestamp_val == 1234567890


def test_consistency_chain(Item, queryset_cls, registered_mock_driver):
    qs = queryset_cls(Item).consistency("LOCAL_QUORUM")
    assert qs._consistency_val == "LOCAL_QUORUM"


def test_timeout_chain(Item, queryset_cls, registered_mock_driver):
    qs = queryset_cls(Item).timeout(5.0)
    assert qs._timeout_val == 5.0


def test_using_chain(Item, queryset_cls, registered_mock_driver):
    qs = queryset_cls(Item).using(ttl=60, timestamp=1234567890, consistency="ONE", timeout=10.0)
    assert qs._ttl_val == 60
    assert qs._timestamp_val == 1234567890
    assert qs._consistency_val == "ONE"
    assert qs._timeout_val == 10.0


async def test_consistency_passed_to_driver(Item, queryset_cls, registered_mock_driver):
    registered_mock_driver.set_return_rows([])
    await _maybe_await(queryset_cls(Item).consistency("LOCAL_QUORUM").all)
    assert registered_mock_driver.last_consistency == "LOCAL_QUORUM"


async def test_timeout_passed_to_driver(Item, queryset_cls, registered_mock_driver):
    registered_mock_driver.set_return_rows([])
    await _maybe_await(queryset_cls(Item).timeout(5.0).all)
    assert registered_mock_driver.last_timeout == 5.0


async def test_timestamp_in_delete_cql(Item, queryset_cls, registered_mock_driver):
    await _maybe_await(queryset_cls(Item).filter(name="old").timestamp(1234567890).delete)
    stmt, _ = registered_mock_driver.executed[0]
    assert "USING TIMESTAMP 1234567890" in stmt


async def test_chaining_preserves_execution_options(Item, queryset_cls, registered_mock_driver):
    registered_mock_driver.set_return_rows([])
    qs = (
        queryset_cls(Item)
        .filter(rating__gte=3)
        .consistency("LOCAL_QUORUM")
        .timeout(5.0)
        .timestamp(1234567890)
        .limit(10)
    )
    await _maybe_await(qs.all)
    assert registered_mock_driver.last_consistency == "LOCAL_QUORUM"
    assert registered_mock_driver.last_timeout == 5.0


# ------------------------------------------------------------------
# Phase 11: QuerySet Enhancements
# ------------------------------------------------------------------


def test_only_returns_new_queryset(Item, queryset_cls, registered_mock_driver):
    qs = queryset_cls(Item).only("id", "name")
    assert qs._only_val == ["id", "name"]


async def test_only_generates_column_projection(Item, queryset_cls, registered_mock_driver):
    registered_mock_driver.set_return_rows([])
    await _maybe_await(queryset_cls(Item).only("id", "name").all)
    stmt, _ = registered_mock_driver.executed[0]
    assert 'SELECT "id", "name" FROM' in stmt


def test_defer_returns_new_queryset(Item, queryset_cls, registered_mock_driver):
    qs = queryset_cls(Item).defer("rating")
    assert qs._defer_val == ["rating"]


async def test_defer_excludes_columns(Item, queryset_cls, registered_mock_driver):
    registered_mock_driver.set_return_rows([])
    await _maybe_await(queryset_cls(Item).defer("rating").all)
    stmt, _ = registered_mock_driver.executed[0]
    assert '"rating"' not in stmt
    assert '"id"' in stmt
    assert '"name"' in stmt


async def test_values_list_returns_tuples(Item, queryset_cls, registered_mock_driver):
    registered_mock_driver.set_return_rows(
        [
            {"id": uuid4(), "name": "A", "rating": 5},
            {"id": uuid4(), "name": "B", "rating": 3},
        ]
    )
    results = await _maybe_await(queryset_cls(Item).values_list("name", "rating").all)
    assert results == [("A", 5), ("B", 3)]


def test_values_list_preserves_through_chaining(Item, queryset_cls, registered_mock_driver):
    qs = queryset_cls(Item).values_list("name").filter(rating__gte=3).limit(5)
    assert qs._values_list_val == ["name"]


def test_per_partition_limit_returns_new_queryset(Item, queryset_cls, registered_mock_driver):
    qs = queryset_cls(Item).per_partition_limit(5)
    assert qs._per_partition_limit_val == 5


async def test_per_partition_limit_in_cql(Item, queryset_cls, registered_mock_driver):
    registered_mock_driver.set_return_rows([])
    await _maybe_await(queryset_cls(Item).per_partition_limit(3).all)
    stmt, _ = registered_mock_driver.executed[0]
    assert "PER PARTITION LIMIT 3" in stmt


async def test_like_filter(Item, queryset_cls, registered_mock_driver):
    registered_mock_driver.set_return_rows([])
    await _maybe_await(queryset_cls(Item).filter(name__like="Al%").all)
    stmt, params = registered_mock_driver.executed[0]
    assert '"name" LIKE ?' in stmt
    assert params == ["Al%"]


def test_only_preserved_through_chaining(Item, queryset_cls, registered_mock_driver):
    qs = queryset_cls(Item).only("id", "name").filter(rating__gte=3).limit(5)
    assert qs._only_val == ["id", "name"]


def test_defer_preserved_through_chaining(Item, queryset_cls, registered_mock_driver):
    qs = queryset_cls(Item).defer("rating").filter(name="foo").limit(10)
    assert qs._defer_val == ["rating"]


def test_per_partition_limit_preserved_through_chaining(Item, queryset_cls, registered_mock_driver):
    qs = queryset_cls(Item).per_partition_limit(5).filter(name="foo").limit(10)
    assert qs._per_partition_limit_val == 5


# ------------------------------------------------------------------
# Phase 10: Pagination & Token Queries
# ------------------------------------------------------------------


def test_fetch_size_chain(Item, queryset_cls, registered_mock_driver):
    qs = queryset_cls(Item).fetch_size(100)
    assert qs._fetch_size_val == 100


def test_page_chain(Item, queryset_cls, registered_mock_driver):
    state = b"\x00\x01\x02"
    qs = queryset_cls(Item).page(state)
    assert qs._paging_state_val == state


def test_page_none_resets(Item, queryset_cls, registered_mock_driver):
    qs = queryset_cls(Item).page(b"\x00").page(None)
    assert qs._paging_state_val is None


async def test_fetch_size_passed_to_driver(Item, queryset_cls, registered_mock_driver):
    registered_mock_driver.set_return_rows([])
    await _maybe_await(queryset_cls(Item).fetch_size(50).paged_all)
    assert registered_mock_driver.last_fetch_size == 50


async def test_paging_state_passed_to_driver(Item, queryset_cls, registered_mock_driver):
    registered_mock_driver.set_return_rows([])
    state = b"\x00\x01\x02"
    await _maybe_await(queryset_cls(Item).page(state).paged_all)
    assert registered_mock_driver.last_paging_state == state


def test_fetch_size_preserved_through_chaining(Item, queryset_cls, registered_mock_driver):
    qs = queryset_cls(Item).fetch_size(100).filter(rating__gte=3).limit(10)
    assert qs._fetch_size_val == 100


async def test_paged_all_returns_paged_result(Item, queryset_cls, registered_mock_driver):
    from coodie.results import PagedResult

    registered_mock_driver.set_return_rows([{"id": uuid4(), "name": "A", "rating": 5}])
    registered_mock_driver.set_paging_state(b"\xab\xcd")
    result = await _maybe_await(queryset_cls(Item).fetch_size(1).paged_all)
    assert isinstance(result, PagedResult)
    assert len(result.data) == 1
    assert isinstance(result.data[0], Item)
    assert result.paging_state == b"\xab\xcd"


async def test_paged_all_none_paging_state_when_exhausted(Item, queryset_cls, registered_mock_driver):
    from coodie.results import PagedResult

    registered_mock_driver.set_return_rows([{"id": uuid4(), "name": "A", "rating": 5}])
    result = await _maybe_await(queryset_cls(Item).fetch_size(100).paged_all)
    assert isinstance(result, PagedResult)
    assert result.paging_state is None


async def test_token_filter_generates_correct_cql(Item, queryset_cls, registered_mock_driver):
    registered_mock_driver.set_return_rows([])
    await _maybe_await(queryset_cls(Item).filter(id__token__gt=100).allow_filtering().all)
    stmt, params = registered_mock_driver.executed[0]
    assert 'TOKEN("id") > ?' in stmt
    assert 100 in params


# -- _rows_to_docs optimization (Phase 3: Task 3.7) --------------------------


async def test_rows_to_docs_no_collection_fields(Item, queryset_cls, registered_mock_driver):
    """Non-collection model skips coercion entirely."""
    pid = uuid4()
    registered_mock_driver.set_return_rows([{"id": pid, "name": "A", "rating": 5}])
    results = await _maybe_await(queryset_cls(Item).all)
    assert len(results) == 1
    assert results[0].name == "A"
    assert results[0].rating == 5


async def test_rows_to_docs_none_collection_coerced(variant, queryset_cls, registered_mock_driver):
    """None collection fields are coerced to empty containers."""
    if variant == "sync":
        from coodie.sync.document import Document
    else:
        from coodie.aio.document import Document

    class TagDoc(Document):
        id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)
        tags: list[str] = []

        class Settings:
            name = "tag_docs"
            keyspace = "test_ks"

    pid = uuid4()
    registered_mock_driver.set_return_rows([{"id": pid, "tags": None}])
    results = await _maybe_await(queryset_cls(TagDoc).all)
    assert len(results) == 1
    assert results[0].tags == []


# -- _clone() optimization (Phase 4: Task 3.10) ------------------------------


def test_clone_preserves_all_state(Item, queryset_cls, registered_mock_driver):
    """_clone() without overrides copies all slot values."""
    qs = queryset_cls(Item)
    qs = qs.filter(name="foo").limit(10).allow_filtering()
    cloned = qs._clone()
    assert cloned is not qs
    assert cloned._where == qs._where
    assert cloned._limit_val == qs._limit_val
    assert cloned._allow_filtering_val is True
    assert cloned._doc_cls is qs._doc_cls


def test_clone_applies_single_override(Item, queryset_cls, registered_mock_driver):
    """_clone() with a single override changes only that field."""
    qs = queryset_cls(Item).filter(name="bar").limit(5)
    cloned = qs._clone(limit_val=20)
    assert cloned._limit_val == 20
    assert cloned._where == qs._where  # unchanged


def test_clone_is_fast_path(Item, queryset_cls, registered_mock_driver):
    """_clone() uses object.__new__() — the new QS is a QuerySet instance."""
    qs = queryset_cls(Item)
    cloned = qs._clone(limit_val=1)
    assert isinstance(cloned, queryset_cls)
    assert cloned._limit_val == 1


# -- QuerySet.all(lazy=True) (Phase 4: Task 7.4) -----------------------------


async def test_all_lazy_returns_lazy_documents(Item, queryset_cls, registered_mock_driver):
    """all(lazy=True) returns LazyDocument instances."""
    from coodie.lazy import LazyDocument

    pid = uuid4()
    registered_mock_driver.set_return_rows([{"id": pid, "name": "A", "rating": 5}])
    results = await _maybe_await(queryset_cls(Item).all, lazy=True)
    assert len(results) == 1
    assert isinstance(results[0], LazyDocument)
    assert results[0].name == "A"
    assert results[0].id == pid


async def test_all_lazy_defers_parsing(Item, queryset_cls, registered_mock_driver):
    """LazyDocument does not parse until field access."""

    pid = uuid4()
    registered_mock_driver.set_return_rows([{"id": pid, "name": "B", "rating": 3}])
    results = await _maybe_await(queryset_cls(Item).all, lazy=True)
    lazy = results[0]
    assert lazy._parsed is None
    _ = lazy.name
    assert lazy._parsed is not None
