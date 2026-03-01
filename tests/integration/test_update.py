"""Integration tests for partial UPDATE via ``Document.update(**kwargs)``.

Covers: partial field update (upsert), UPDATE with TTL, UPDATE with
IF conditions / IF EXISTS (LWT), and collection mutation operators
(``column__add``, ``column__remove``, ``column__append``, ``column__prepend``).

Every test runs twice (sync and async) via the ``variant`` fixture.
"""

from __future__ import annotations

import asyncio
from uuid import uuid4

import pytest

from tests.conftest import _maybe_await

pytestmark = [
    pytest.mark.integration,
    pytest.mark.asyncio(loop_scope="session"),
]


class TestPartialUpdate:
    """Tests for Document.update(**kwargs) against a real ScyllaDB instance."""

    # ------------------------------------------------------------------
    # Basic partial field update
    # ------------------------------------------------------------------

    async def test_update_individual_fields(self, coodie_driver, Product) -> None:
        """update() modifies only the specified fields without a full INSERT."""
        await _maybe_await(Product.sync_table)
        pid = uuid4()
        p = Product(id=pid, name="Original", brand="BrandA", price=10.0)
        await _maybe_await(p.save)

        await _maybe_await(p.update, name="Updated")

        fetched = await _maybe_await(Product.get, id=pid)
        assert fetched.name == "Updated"
        assert fetched.brand == "BrandA"  # unchanged
        assert fetched.price == 10.0  # unchanged

        await _maybe_await(Product(id=pid, name="").delete)

    async def test_update_multiple_fields(self, coodie_driver, Product) -> None:
        """update() can set multiple fields at once."""
        await _maybe_await(Product.sync_table)
        pid = uuid4()
        p = Product(id=pid, name="Multi", brand="BrandB", price=5.0)
        await _maybe_await(p.save)

        await _maybe_await(p.update, name="MultiUpdated", price=99.0)

        fetched = await _maybe_await(Product.get, id=pid)
        assert fetched.name == "MultiUpdated"
        assert fetched.price == 99.0
        assert fetched.brand == "BrandB"  # unchanged

        await _maybe_await(Product(id=pid, name="").delete)

    async def test_update_in_memory_model(self, coodie_driver, Product) -> None:
        """update() also patches the in-memory model object."""
        await _maybe_await(Product.sync_table)
        pid = uuid4()
        p = Product(id=pid, name="InMem", price=1.0)
        await _maybe_await(p.save)

        await _maybe_await(p.update, name="Patched", price=42.0)

        # In-memory model should reflect the update
        assert p.name == "Patched"
        assert p.price == 42.0

        await _maybe_await(Product(id=pid, name="").delete)

    # ------------------------------------------------------------------
    # UPDATE with TTL
    # ------------------------------------------------------------------

    async def test_update_with_ttl(self, coodie_driver, Product) -> None:
        """update(ttl=N) applies a TTL — the updated column expires."""
        await _maybe_await(Product.sync_table)
        pid = uuid4()
        p = Product(id=pid, name="TTLUpdate", description="permanent")
        await _maybe_await(p.save)

        # Update the Optional description field with a short TTL
        await _maybe_await(p.update, ttl=2, description="temporary")

        fetched = await _maybe_await(Product.get, id=pid)
        assert fetched.description == "temporary"

        # Wait for TTL to expire — the updated column reverts to null
        await asyncio.sleep(3)
        fetched2 = await _maybe_await(Product.find_one, id=pid)
        assert fetched2 is not None
        # After TTL the description column should be null (expired)
        assert fetched2.description is None

        await _maybe_await(Product(id=pid, name="").delete)

    # ------------------------------------------------------------------
    # UPDATE with IF conditions (LWT)
    # ------------------------------------------------------------------

    async def test_update_if_conditions_applied(self, coodie_driver, Product) -> None:
        """update(if_conditions={...}) succeeds when the condition matches."""
        await _maybe_await(Product.sync_table)
        pid = uuid4()
        p = Product(id=pid, name="Conditional", price=10.0)
        await _maybe_await(p.save)

        result = await _maybe_await(p.update, if_conditions={"name": "Conditional"}, price=20.0)

        assert result is not None
        assert result.applied is True

        fetched = await _maybe_await(Product.get, id=pid)
        assert fetched.price == 20.0

        await _maybe_await(Product(id=pid, name="").delete)

    async def test_update_if_conditions_not_applied(self, coodie_driver, Product) -> None:
        """update(if_conditions={...}) is rejected when the condition doesn't match."""
        await _maybe_await(Product.sync_table)
        pid = uuid4()
        p = Product(id=pid, name="Original", price=10.0)
        await _maybe_await(p.save)

        result = await _maybe_await(p.update, if_conditions={"name": "WrongName"}, price=999.0)

        assert result is not None
        assert result.applied is False

        # Price should remain unchanged
        fetched = await _maybe_await(Product.get, id=pid)
        assert fetched.price == 10.0

        await _maybe_await(Product(id=pid, name="").delete)

    async def test_update_if_exists_applied(self, coodie_driver, Product) -> None:
        """update(if_exists=True) succeeds when the row exists."""
        await _maybe_await(Product.sync_table)
        pid = uuid4()
        p = Product(id=pid, name="Exists", price=5.0)
        await _maybe_await(p.save)

        result = await _maybe_await(p.update, if_exists=True, price=50.0)

        assert result is not None
        assert result.applied is True

        fetched = await _maybe_await(Product.get, id=pid)
        assert fetched.price == 50.0

        await _maybe_await(Product(id=pid, name="").delete)

    async def test_update_if_exists_not_applied(self, coodie_driver, Product) -> None:
        """update(if_exists=True) is rejected when the row doesn't exist."""
        await _maybe_await(Product.sync_table)
        pid = uuid4()
        # Do NOT insert — this row doesn't exist
        p = Product(id=pid, name="Ghost")

        result = await _maybe_await(p.update, if_exists=True, name="ShouldFail")

        assert result is not None
        assert result.applied is False

    # ------------------------------------------------------------------
    # Collection mutation operators — set
    # ------------------------------------------------------------------

    async def test_update_set_add(self, coodie_driver, AllTypes) -> None:
        """tags_set__add adds elements to a set column."""
        await _maybe_await(AllTypes.sync_table)
        rid = uuid4()
        row = AllTypes(id=rid, tags_set={"alpha"})
        await _maybe_await(row.save)

        await _maybe_await(row.update, tags_set__add={"beta", "gamma"})

        fetched = await _maybe_await(AllTypes.get, id=rid)
        assert {"alpha", "beta", "gamma"}.issubset(fetched.tags_set)

        await _maybe_await(AllTypes(id=rid).delete)

    async def test_update_set_remove(self, coodie_driver, AllTypes) -> None:
        """tags_set__remove removes elements from a set column."""
        await _maybe_await(AllTypes.sync_table)
        rid = uuid4()
        row = AllTypes(id=rid, tags_set={"a", "b", "c"})
        await _maybe_await(row.save)

        await _maybe_await(row.update, tags_set__remove={"b"})

        fetched = await _maybe_await(AllTypes.get, id=rid)
        assert "b" not in fetched.tags_set
        assert "a" in fetched.tags_set
        assert "c" in fetched.tags_set

        await _maybe_await(AllTypes(id=rid).delete)

    # ------------------------------------------------------------------
    # Collection mutation operators — list
    # ------------------------------------------------------------------

    async def test_update_list_append(self, coodie_driver, Product) -> None:
        """tags__append appends elements to a list column."""
        await _maybe_await(Product.sync_table)
        pid = uuid4()
        p = Product(id=pid, name="ListAppend", tags=["first"])
        await _maybe_await(p.save)

        await _maybe_await(p.update, tags__append=["second", "third"])

        fetched = await _maybe_await(Product.get, id=pid)
        assert fetched.tags == ["first", "second", "third"]

        await _maybe_await(Product(id=pid, name="").delete)

    async def test_update_list_prepend(self, coodie_driver, Product) -> None:
        """tags__prepend prepends elements to a list column."""
        await _maybe_await(Product.sync_table)
        pid = uuid4()
        p = Product(id=pid, name="ListPrepend", tags=["last"])
        await _maybe_await(p.save)

        await _maybe_await(p.update, tags__prepend=["first", "second"])

        fetched = await _maybe_await(Product.get, id=pid)
        assert fetched.tags == ["first", "second", "last"]

        await _maybe_await(Product(id=pid, name="").delete)

    # ------------------------------------------------------------------
    # Collection mutation operators — map
    # ------------------------------------------------------------------

    async def test_update_map_add(self, coodie_driver, AllTypes) -> None:
        """scores_map__add merges entries into a map column."""
        await _maybe_await(AllTypes.sync_table)
        rid = uuid4()
        row = AllTypes(id=rid, scores_map={"x": 1})
        await _maybe_await(row.save)

        await _maybe_await(row.update, scores_map__add={"y": 2, "z": 3})

        fetched = await _maybe_await(AllTypes.get, id=rid)
        assert fetched.scores_map["x"] == 1
        assert fetched.scores_map["y"] == 2
        assert fetched.scores_map["z"] == 3

        await _maybe_await(AllTypes(id=rid).delete)
