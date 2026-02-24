"""Materialized view integration tests — merged sync + async.

Every test runs twice (sync and async) via the ``variant`` fixture.
"""

from __future__ import annotations

from uuid import uuid4

import pytest

from coodie.exceptions import InvalidQueryError
from tests.conftest import _maybe_await
from tests.integration.conftest import _retry

pytestmark = [
    pytest.mark.integration,
    pytest.mark.asyncio(loop_scope="session"),
]


class TestMaterializedView:
    """Materialized view integration tests."""

    async def test_sync_view_creates_view(self, coodie_driver, Product, ProductsByBrand) -> None:
        """sync_view() should create the materialized view without raising."""
        await _maybe_await(Product.sync_table)
        await _maybe_await(ProductsByBrand.sync_view)

    async def test_insert_base_row_queryable_via_view(self, coodie_driver, Product, ProductsByBrand) -> None:
        """Insert into the base table; query via the MV."""
        await _maybe_await(Product.sync_table)
        await _maybe_await(ProductsByBrand.sync_view)

        pid = uuid4()
        brand = f"mvbrand_{uuid4().hex[:6]}"
        await _maybe_await(Product(id=pid, name="MVWidget", brand=brand, price=42.0).save)

        # Materialized views are eventually consistent — retry until populated
        results = await _retry(lambda: ProductsByBrand.find(brand=brand).all())
        assert len(results) >= 1
        match = [r for r in results if r.id == pid]
        assert len(match) == 1
        assert match[0].name == "MVWidget"
        assert match[0].price == 42.0

        await _maybe_await(Product(id=pid, name="").delete)

    async def test_find_one_via_view(self, coodie_driver, Product, ProductsByBrand) -> None:
        """find_one() should work on materialized views."""
        await _maybe_await(Product.sync_table)
        await _maybe_await(ProductsByBrand.sync_view)

        pid = uuid4()
        brand = f"mvone_{uuid4().hex[:6]}"
        await _maybe_await(Product(id=pid, name="MVOne", brand=brand, price=10.0).save)

        doc = await _retry(lambda: ProductsByBrand.find_one(brand=brand))
        assert doc is not None
        assert doc.brand == brand
        assert doc.name == "MVOne"

        await _maybe_await(Product(id=pid, name="").delete)

    async def test_write_operations_raise(self, coodie_driver, ProductsByBrand) -> None:
        """save/insert/delete/update should raise on materialized views."""
        mv = ProductsByBrand(brand="test")
        with pytest.raises(InvalidQueryError, match="read-only"):
            await _maybe_await(mv.save)
        with pytest.raises(InvalidQueryError, match="read-only"):
            await _maybe_await(mv.insert)
        with pytest.raises(InvalidQueryError, match="read-only"):
            await _maybe_await(mv.delete)
        with pytest.raises(InvalidQueryError, match="read-only"):
            await _maybe_await(mv.update, name="X")

    async def test_drop_view(self, coodie_driver, Product, ProductsByBrand) -> None:
        """drop_view() should drop the materialized view without raising."""
        await _maybe_await(Product.sync_table)
        await _maybe_await(ProductsByBrand.sync_view)
        await _maybe_await(ProductsByBrand.drop_view)
        # Re-create for any subsequent tests
        await _maybe_await(ProductsByBrand.sync_view)
