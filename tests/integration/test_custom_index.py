"""Integration tests for custom index names (``Indexed(index_name=…)``).

Verifies that ``sync_table()`` creates a secondary index with the
user-supplied name and that the index is queryable via ``find()``.
"""

from __future__ import annotations

from uuid import uuid4

import pytest

from tests.conftest import _maybe_await
from tests.integration.conftest import _retry

pytestmark = [
    pytest.mark.integration,
    pytest.mark.asyncio(loop_scope="session"),
]


class TestCustomIndexName:
    """Verify ``Indexed(index_name="my_custom_idx")`` behaviour."""

    @pytest.fixture(autouse=True)
    def _clear_known_tables_cache(self, coodie_driver) -> None:
        """Clear the driver's cache so DDL is always executed."""
        coodie_driver._known_tables.clear()

    async def test_custom_index_created_in_schema(
        self, coodie_driver, execute_raw_fn, CustomIdxProduct, variant
    ) -> None:
        """``sync_table()`` must create an index named ``my_custom_idx``."""
        table_name = CustomIdxProduct.Settings.name

        # Drop table first so the index is created fresh
        await _maybe_await(execute_raw_fn, f"DROP TABLE IF EXISTS test_ks.{table_name}", [])

        await _maybe_await(CustomIdxProduct.sync_table)

        # Poll until the index appears in system_schema.indexes
        async def _index_visible():
            rows = await _maybe_await(
                execute_raw_fn,
                "SELECT index_name FROM system_schema.indexes WHERE keyspace_name = ? AND table_name = ?",
                ["test_ks", table_name],
            )
            names = {r["index_name"] for r in rows}
            return "my_custom_idx" in names or None

        result = await _retry(_index_visible)
        assert result, "Expected index 'my_custom_idx' in system_schema.indexes"

    async def test_custom_index_queryable(self, coodie_driver, CustomIdxProduct) -> None:
        """Rows inserted into the table are queryable via the custom-indexed column."""
        await _maybe_await(CustomIdxProduct.sync_table)

        pid = uuid4()
        brand_val = f"TestBrand_{uuid4().hex[:8]}"
        await _maybe_await(CustomIdxProduct(id=pid, name="CIdx", brand=brand_val).save)

        results = await _maybe_await(CustomIdxProduct.find(brand=brand_val).allow_filtering().all)
        assert any(r.id == pid for r in results)

        await _maybe_await(CustomIdxProduct(id=pid, name="").delete)
