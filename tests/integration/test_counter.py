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
        url = f"/test-inc-{__import__('uuid').uuid4().hex[:6]}"
        pv = PageView(url=url)
        await _maybe_await(pv.increment, view_count=1)

        fetched = await _maybe_await(PageView.find_one, url=url)
        assert fetched is not None
        assert fetched.view_count == 1

    async def test_counter_decrement(self, coodie_driver, PageView) -> None:
        """Decrementing a counter column reduces the value."""
        await _maybe_await(PageView.sync_table)
        url = f"/test-dec-{__import__('uuid').uuid4().hex[:6]}"
        pv = PageView(url=url)
        await _maybe_await(pv.increment, view_count=5)
        await _maybe_await(pv.decrement, view_count=2)

        fetched = await _maybe_await(PageView.find_one, url=url)
        assert fetched is not None
        assert fetched.view_count == 3

    async def test_counter_read_value(self, coodie_driver, PageView) -> None:
        """Counter values can be read back via find_one."""
        await _maybe_await(PageView.sync_table)
        url = f"/test-read-{__import__('uuid').uuid4().hex[:6]}"
        pv = PageView(url=url)
        await _maybe_await(pv.increment, view_count=10, unique_visitors=3)

        fetched = await _maybe_await(PageView.find_one, url=url)
        assert fetched is not None
        assert fetched.view_count == 10
        assert fetched.unique_visitors == 3

    async def test_counter_multiple_increments_accumulate(self, coodie_driver, PageView) -> None:
        """Multiple increments on the same row accumulate."""
        await _maybe_await(PageView.sync_table)
        url = f"/test-accum-{__import__('uuid').uuid4().hex[:6]}"
        pv = PageView(url=url)
        await _maybe_await(pv.increment, view_count=1)
        await _maybe_await(pv.increment, view_count=1)
        await _maybe_await(pv.increment, view_count=1)

        fetched = await _maybe_await(PageView.find_one, url=url)
        assert fetched is not None
        assert fetched.view_count == 3

    async def test_counter_multiple_fields(self, coodie_driver, PageView) -> None:
        """Incrementing multiple counter fields in one call works correctly."""
        await _maybe_await(PageView.sync_table)
        url = f"/test-multi-{__import__('uuid').uuid4().hex[:6]}"
        pv = PageView(url=url)
        await _maybe_await(pv.increment, view_count=2, unique_visitors=1)

        fetched = await _maybe_await(PageView.find_one, url=url)
        assert fetched is not None
        assert fetched.view_count == 2
        assert fetched.unique_visitors == 1

    async def test_counter_save_raises(self, coodie_driver, PageView) -> None:
        """save() is forbidden on counter tables."""
        await _maybe_await(PageView.sync_table)
        url = f"/test-save-{__import__('uuid').uuid4().hex[:6]}"
        pv = PageView(url=url)
        with pytest.raises(InvalidQueryError, match="do not support save"):
            await _maybe_await(pv.save)

    async def test_counter_insert_raises(self, coodie_driver, PageView) -> None:
        """insert() is forbidden on counter tables."""
        await _maybe_await(PageView.sync_table)
        url = f"/test-insert-{__import__('uuid').uuid4().hex[:6]}"
        pv = PageView(url=url)
        with pytest.raises(InvalidQueryError, match="do not support insert"):
            await _maybe_await(pv.insert)
