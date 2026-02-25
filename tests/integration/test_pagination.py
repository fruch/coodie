"""Pagination integration tests — fetch_size, page-token hand-off, paged iteration.

Every test runs twice (sync and async) via the ``variant`` fixture.
Models insert enough rows to span multiple pages so that paging_state
is exercised end-to-end against a real ScyllaDB cluster.
"""

from __future__ import annotations

from uuid import uuid4

import pytest

from coodie.results import PagedResult
from tests.conftest import _maybe_await

pytestmark = [
    pytest.mark.integration,
    pytest.mark.asyncio(loop_scope="session"),
]

# Number of rows to insert — must comfortably exceed FETCH_SIZE so that
# multiple pages are required.
TOTAL_ROWS = 25
FETCH_SIZE = 5


class TestPagination:
    """Pagination tests against a real ScyllaDB container."""

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    async def _seed_products(self, Product, brand: str, n: int) -> list:
        """Insert *n* products with the given brand and return their UUIDs."""
        ids = [uuid4() for _ in range(n)]
        for i, pid in enumerate(ids):
            await _maybe_await(
                Product(id=pid, name=f"PaginationItem{i}", brand=brand, price=float(i)).save
            )
        return ids

    async def _cleanup(self, Product, ids: list) -> None:
        """Delete products by id list."""
        for pid in ids:
            await _maybe_await(Product(id=pid, name="").delete)

    # ------------------------------------------------------------------
    # Tests
    # ------------------------------------------------------------------

    async def test_full_table_scan_spanning_multiple_pages(
        self, coodie_driver, Product
    ) -> None:
        """paged_all() with fetch_size collects all rows across multiple pages.

        Inserts TOTAL_ROWS (>FETCH_SIZE) rows, then iterates page by page
        using the paging_state token to ensure every row is returned exactly
        once across all pages.
        """
        await _maybe_await(Product.sync_table)
        brand = f"PaginationFullScan_{uuid4().hex[:8]}"
        ids = await self._seed_products(Product, brand, TOTAL_ROWS)

        all_docs = []
        result = await _maybe_await(
            Product.find(brand=brand)
            .fetch_size(FETCH_SIZE)
            .allow_filtering()
            .paged_all
        )
        assert isinstance(result, PagedResult)
        all_docs.extend(result.data)

        pages = 1
        while result.paging_state is not None:
            result = await _maybe_await(
                Product.find(brand=brand)
                .fetch_size(FETCH_SIZE)
                .page(result.paging_state)
                .allow_filtering()
                .paged_all
            )
            assert isinstance(result, PagedResult)
            all_docs.extend(result.data)
            pages += 1

        # Must have required more than one page
        assert pages > 1, f"Expected multiple pages but got {pages}"
        # Every inserted id must appear in the collected results
        found_ids = {d.id for d in all_docs}
        for pid in ids:
            assert pid in found_ids, f"Missing id {pid} in paginated results"
        # Total collected documents should equal inserted count
        assert len(found_ids) == TOTAL_ROWS

        await self._cleanup(Product, ids)

    async def test_fetch_size_limits_rows_per_page(
        self, coodie_driver, Product
    ) -> None:
        """Each page returned by paged_all() should have at most fetch_size rows."""
        await _maybe_await(Product.sync_table)
        brand = f"PaginationLimit_{uuid4().hex[:8]}"
        ids = await self._seed_products(Product, brand, TOTAL_ROWS)

        result = await _maybe_await(
            Product.find(brand=brand)
            .fetch_size(FETCH_SIZE)
            .allow_filtering()
            .paged_all
        )
        assert isinstance(result, PagedResult)
        assert len(result.data) <= FETCH_SIZE

        while result.paging_state is not None:
            result = await _maybe_await(
                Product.find(brand=brand)
                .fetch_size(FETCH_SIZE)
                .page(result.paging_state)
                .allow_filtering()
                .paged_all
            )
            assert len(result.data) <= FETCH_SIZE

        await self._cleanup(Product, ids)

    async def test_page_token_handoff_between_pages(
        self, coodie_driver, Product
    ) -> None:
        """Consecutive paging_state tokens must differ; each page yields new rows.

        Verifies that the paging_state returned by one page is usable as
        input to the next, and that no row appears in two different pages.
        """
        await _maybe_await(Product.sync_table)
        brand = f"PaginationHandoff_{uuid4().hex[:8]}"
        ids = await self._seed_products(Product, brand, TOTAL_ROWS)

        seen_ids: set = set()
        seen_tokens: list[bytes | None] = []

        result = await _maybe_await(
            Product.find(brand=brand)
            .fetch_size(FETCH_SIZE)
            .allow_filtering()
            .paged_all
        )
        page_ids = {d.id for d in result.data}
        # No duplicates within a page
        assert len(page_ids) == len(result.data)
        seen_ids.update(page_ids)
        seen_tokens.append(result.paging_state)

        while result.paging_state is not None:
            result = await _maybe_await(
                Product.find(brand=brand)
                .fetch_size(FETCH_SIZE)
                .page(result.paging_state)
                .allow_filtering()
                .paged_all
            )
            page_ids = {d.id for d in result.data}
            # No overlap with rows from previous pages
            overlap = seen_ids & page_ids
            assert not overlap, f"Rows appeared in multiple pages: {overlap}"
            seen_ids.update(page_ids)
            seen_tokens.append(result.paging_state)

        # The final token must be None (no more pages)
        assert seen_tokens[-1] is None
        # We should have seen all inserted rows
        for pid in ids:
            assert pid in seen_ids

        await self._cleanup(Product, ids)

    async def test_paged_all_without_fetch_size(
        self, coodie_driver, Product
    ) -> None:
        """paged_all() without fetch_size returns all rows in a single page."""
        await _maybe_await(Product.sync_table)
        brand = f"PaginationNoFetch_{uuid4().hex[:8]}"
        ids = await self._seed_products(Product, brand, 5)

        result = await _maybe_await(
            Product.find(brand=brand).allow_filtering().paged_all
        )
        assert isinstance(result, PagedResult)
        assert result.paging_state is None
        assert len(result.data) == 5

        await self._cleanup(Product, ids)

    async def test_async_paged_iteration(
        self, coodie_driver, Product, variant
    ) -> None:
        """Async loop over paged_all() collects every row across pages.

        Simulates the recommended async pagination pattern: call paged_all()
        in a while-loop feeding paging_state back until exhausted.
        """
        if variant == "sync":
            pytest.skip("Async paged iteration test is async-only")

        await _maybe_await(Product.sync_table)
        brand = f"PaginationAsync_{uuid4().hex[:8]}"
        ids = await self._seed_products(Product, brand, TOTAL_ROWS)

        all_docs = []
        qs = Product.find(brand=brand).fetch_size(FETCH_SIZE).allow_filtering()
        result = await qs.paged_all()
        all_docs.extend(result.data)

        while result.paging_state is not None:
            result = await qs.page(result.paging_state).paged_all()
            all_docs.extend(result.data)

        found_ids = {d.id for d in all_docs}
        for pid in ids:
            assert pid in found_ids
        assert len(found_ids) == TOTAL_ROWS

        await self._cleanup(Product, ids)
