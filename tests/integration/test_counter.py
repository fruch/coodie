"""Integration tests for CounterDocument — increment, decrement, read.

Every test runs twice (sync and async) via the ``variant`` fixture.
"""

from __future__ import annotations

import pytest

from coodie.exceptions import InvalidQueryError
from tests.conftest import _maybe_await

pytestmark = [
    pytest.mark.integration,
    pytest.mark.asyncio(loop_scope="session"),
]


class TestCounterColumn:
    """CounterDocument integration tests against a real ScyllaDB instance."""

    async def test_counter_sync_table(self, coodie_driver, PageView) -> None:
        """sync_table creates the counter table without raising."""
        await _maybe_await(PageView.sync_table)

    async def test_counter_increment(self, coodie_driver, PageView) -> None:
        """Incrementing a counter column persists the value."""
        await _maybe_await(PageView.sync_table)
        pv = PageView(url="/test-inc")
        await _maybe_await(pv.increment, view_count=1)

        fetched = await _maybe_await(PageView.find_one, url="/test-inc")
        assert fetched is not None
        assert fetched.view_count == 1

    async def test_counter_decrement(self, coodie_driver, PageView) -> None:
        """Decrementing a counter column reduces the value."""
        await _maybe_await(PageView.sync_table)
        pv = PageView(url="/test-dec")
        # Start with an increment so we have a positive value
        await _maybe_await(pv.increment, view_count=5)
        await _maybe_await(pv.decrement, view_count=2)

        fetched = await _maybe_await(PageView.find_one, url="/test-dec")
        assert fetched is not None
        assert fetched.view_count == 3

    async def test_counter_read_value(self, coodie_driver, PageView) -> None:
        """Counter values can be read back via find_one."""
        await _maybe_await(PageView.sync_table)
        pv = PageView(url="/test-read")
        await _maybe_await(pv.increment, view_count=10, unique_visitors=3)

        fetched = await _maybe_await(PageView.find_one, url="/test-read")
        assert fetched is not None
        assert fetched.view_count == 10
        assert fetched.unique_visitors == 3

    async def test_counter_multiple_increments_accumulate(self, coodie_driver, PageView) -> None:
        """Multiple increments on the same row accumulate."""
        await _maybe_await(PageView.sync_table)
        pv = PageView(url="/test-accum")
        await _maybe_await(pv.increment, view_count=1)
        await _maybe_await(pv.increment, view_count=1)
        await _maybe_await(pv.increment, view_count=1)

        fetched = await _maybe_await(PageView.find_one, url="/test-accum")
        assert fetched is not None
        assert fetched.view_count == 3

    async def test_counter_save_raises(self, coodie_driver, PageView) -> None:
        """save() is forbidden on counter tables."""
        await _maybe_await(PageView.sync_table)
        pv = PageView(url="/test-save")
        with pytest.raises(InvalidQueryError, match="do not support save"):
            await _maybe_await(pv.save)

    async def test_counter_insert_raises(self, coodie_driver, PageView) -> None:
        """insert() is forbidden on counter tables."""
        await _maybe_await(PageView.sync_table)
        pv = PageView(url="/test-insert")
        with pytest.raises(InvalidQueryError, match="do not support insert"):
            await _maybe_await(pv.insert)
