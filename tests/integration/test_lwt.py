"""Integration tests for Lightweight Transactions (LWT) across all operations.

Covers: ``Document.update(if_conditions={...})`` edge-cases (multiple
conditions, LWT result existing-value completeness),
``Document.delete(if_exists=True)``, ``QuerySet.if_not_exists().create()``,
and ``QuerySet.if_exists().delete()``.

Basic ``Document.update(if_conditions={...})`` and
``Document.update(if_exists=True)`` integration tests live in
``test_update.py``; this file adds the remaining §1.5 coverage.

Every test runs twice (sync and async) via the ``variant`` fixture.
"""

from __future__ import annotations

from uuid import uuid4

import pytest

from coodie.results import LWTResult
from tests.conftest import _maybe_await

pytestmark = [
    pytest.mark.integration,
    pytest.mark.asyncio(loop_scope="session"),
]


class TestConditionalUpdateEdgeCases:
    """Edge-case integration tests for Document.update(if_conditions={...})."""

    async def test_update_multiple_if_conditions_applied(self, coodie_driver, Product) -> None:
        """update(if_conditions={k1: v1, k2: v2}) succeeds when ALL conditions match."""
        await _maybe_await(Product.sync_table)
        pid = uuid4()
        p = Product(id=pid, name="MultiCond", brand="BrandX", price=10.0)
        await _maybe_await(p.save)

        result = await _maybe_await(
            p.update,
            if_conditions={"name": "MultiCond", "brand": "BrandX"},
            price=25.0,
        )

        assert isinstance(result, LWTResult)
        assert result.applied is True

        fetched = await _maybe_await(Product.get, id=pid)
        assert fetched.price == 25.0

        await _maybe_await(Product(id=pid, name="").delete)

    async def test_update_multiple_if_conditions_not_applied(self, coodie_driver, Product) -> None:
        """update(if_conditions={k1: v1, k2: v2}) is rejected when any condition fails."""
        await _maybe_await(Product.sync_table)
        pid = uuid4()
        p = Product(id=pid, name="MultiCond", brand="BrandY", price=10.0)
        await _maybe_await(p.save)

        # name matches but brand does NOT
        result = await _maybe_await(
            p.update,
            if_conditions={"name": "MultiCond", "brand": "WrongBrand"},
            price=999.0,
        )

        assert isinstance(result, LWTResult)
        assert result.applied is False
        assert result.existing is not None
        assert result.existing.get("brand") == "BrandY"

        # Price unchanged
        fetched = await _maybe_await(Product.get, id=pid)
        assert fetched.price == 10.0

        await _maybe_await(Product(id=pid, name="").delete)

    async def test_update_if_conditions_existing_has_conditioned_columns(self, coodie_driver, Product) -> None:
        """When a conditional update fails, result.existing carries the current column values."""
        await _maybe_await(Product.sync_table)
        pid = uuid4()
        p = Product(id=pid, name="ExistCheck", brand="BrandZ", price=42.0)
        await _maybe_await(p.save)

        result = await _maybe_await(
            p.update,
            if_conditions={"name": "Wrong"},
            price=1.0,
        )

        assert isinstance(result, LWTResult)
        assert result.applied is False
        assert result.existing is not None
        # The server should return the actual value of the conditioned column
        assert result.existing.get("name") == "ExistCheck"

        await _maybe_await(Product(id=pid, name="").delete)


class TestConditionalDelete:
    """Integration tests for Document.delete(if_exists=True)."""

    async def test_delete_if_exists_applied(self, coodie_driver, Product) -> None:
        """delete(if_exists=True) succeeds and returns applied=True when the row exists."""
        await _maybe_await(Product.sync_table)
        pid = uuid4()
        p = Product(id=pid, name="Deletable", price=5.0)
        await _maybe_await(p.save)

        result = await _maybe_await(p.delete, if_exists=True)

        assert isinstance(result, LWTResult)
        assert result.applied is True

        # Row should be gone
        fetched = await _maybe_await(Product.find_one, id=pid)
        assert fetched is None

    async def test_delete_if_exists_not_applied(self, coodie_driver, Product) -> None:
        """delete(if_exists=True) returns applied=False when the row doesn't exist."""
        await _maybe_await(Product.sync_table)
        pid = uuid4()
        # Do NOT insert — this row doesn't exist
        p = Product(id=pid, name="Ghost")

        result = await _maybe_await(p.delete, if_exists=True)

        assert isinstance(result, LWTResult)
        assert result.applied is False


class TestQuerySetConditionalCreate:
    """Integration tests for QuerySet.if_not_exists().create()."""

    async def test_queryset_create_if_not_exists_applied(self, coodie_driver, Product) -> None:
        """if_not_exists().create() succeeds when the row is absent."""
        await _maybe_await(Product.sync_table)
        pid = uuid4()

        result = await _maybe_await(
            Product.find().if_not_exists().create,
            id=pid,
            name="NewProduct",
            brand="TestBrand",
            category="testing",
            price=15.0,
        )

        assert isinstance(result, LWTResult)
        assert result.applied is True

        # Verify the row was actually created
        fetched = await _maybe_await(Product.get, id=pid)
        assert fetched.name == "NewProduct"
        assert fetched.price == 15.0

        await _maybe_await(Product(id=pid, name="").delete)

    async def test_queryset_create_if_not_exists_not_applied(self, coodie_driver, Product) -> None:
        """if_not_exists().create() is rejected when the row already exists."""
        await _maybe_await(Product.sync_table)
        pid = uuid4()
        p = Product(id=pid, name="Existing", price=10.0)
        await _maybe_await(p.save)

        result = await _maybe_await(
            Product.find().if_not_exists().create,
            id=pid,
            name="Duplicate",
            brand="DupBrand",
            category="dup",
            price=99.0,
        )

        assert isinstance(result, LWTResult)
        assert result.applied is False
        # existing should carry the server's current values
        assert result.existing is not None

        # Original row should be unchanged
        fetched = await _maybe_await(Product.get, id=pid)
        assert fetched.name == "Existing"
        assert fetched.price == 10.0

        await _maybe_await(Product(id=pid, name="").delete)


class TestQuerySetConditionalDelete:
    """Integration tests for QuerySet.if_exists().delete()."""

    async def test_queryset_delete_if_exists_applied(self, coodie_driver, Product) -> None:
        """if_exists().delete() succeeds when the row exists."""
        await _maybe_await(Product.sync_table)
        pid = uuid4()
        p = Product(id=pid, name="ToDelete", price=5.0)
        await _maybe_await(p.save)

        result = await _maybe_await(Product.find(id=pid).if_exists().delete)

        assert isinstance(result, LWTResult)
        assert result.applied is True

        # Row should be gone
        fetched = await _maybe_await(Product.find_one, id=pid)
        assert fetched is None

    async def test_queryset_delete_if_exists_not_applied(self, coodie_driver, Product) -> None:
        """if_exists().delete() returns applied=False when the row doesn't exist."""
        await _maybe_await(Product.sync_table)
        pid = uuid4()

        result = await _maybe_await(Product.find(id=pid).if_exists().delete)

        assert isinstance(result, LWTResult)
        assert result.applied is False
