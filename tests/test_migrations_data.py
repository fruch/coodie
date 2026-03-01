"""Unit tests for data migration helpers (Phase D — D.1–D.4)."""

from __future__ import annotations

import logging
from unittest.mock import AsyncMock

import pytest

from coodie.migrations.base import MigrationContext, _TOKEN_MAX, _TOKEN_MIN


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _make_mock_driver(*, pk_columns: list[dict] | None = None, scan_rows: list[dict] | None = None) -> AsyncMock:
    """Build a mock driver for scan_table tests.

    Parameters
    ----------
    pk_columns:
        Rows returned by the ``system_schema.columns`` query (partition key discovery).
    scan_rows:
        Rows returned by each token-range ``SELECT`` query.
    """
    driver = AsyncMock()

    if pk_columns is None:
        pk_columns = [{"column_name": "id", "position": 0}]
    if scan_rows is None:
        scan_rows = []

    async def _execute_side_effect(cql: str, params: list | None = None, **kwargs):
        if "system_schema.columns" in cql:
            return list(pk_columns)
        if "SELECT * FROM" in cql:
            return list(scan_rows)
        return []

    driver.execute_async.side_effect = _execute_side_effect
    return driver


# ---------------------------------------------------------------------------
# D.1 — scan_table: token-range batched iteration
# ---------------------------------------------------------------------------


class TestScanTable:
    """Tests for ``ctx.scan_table()`` (D.1)."""

    async def test_scan_table_yields_rows(self):
        """scan_table yields rows returned by driver."""
        rows = [{"id": 1, "name": "Alice"}, {"id": 2, "name": "Bob"}]
        driver = _make_mock_driver(scan_rows=rows)
        ctx = MigrationContext(driver, dry_run=False)

        collected = []
        async for row in ctx.scan_table("ks", "tbl", num_ranges=3):
            collected.append(row)

        # Each of the 3 ranges returns 2 rows → 6 total
        assert len(collected) == 6
        assert all(r["name"] in ("Alice", "Bob") for r in collected)

    async def test_scan_table_uses_token_queries(self):
        """scan_table issues token-range CQL queries."""
        driver = _make_mock_driver()
        ctx = MigrationContext(driver, dry_run=False)

        async for _ in ctx.scan_table("myks", "users", num_ranges=2):
            pass

        # Should have executed 1 PK discovery query + 2 token-range queries
        token_calls = [c for c in driver.execute_async.call_args_list if "SELECT * FROM" in str(c)]
        assert len(token_calls) == 2
        # Verify CQL contains token()
        for call in token_calls:
            cql = call[0][0]
            assert "token(id)" in cql
            assert "LIMIT" in cql

    async def test_scan_table_composite_pk(self):
        """scan_table handles composite partition keys."""
        pk_cols = [
            {"column_name": "region", "position": 0},
            {"column_name": "user_id", "position": 1},
        ]
        driver = _make_mock_driver(pk_columns=pk_cols)
        ctx = MigrationContext(driver, dry_run=False)

        async for _ in ctx.scan_table("ks", "tbl", num_ranges=1):
            pass

        token_calls = [c for c in driver.execute_async.call_args_list if "SELECT * FROM" in str(c)]
        assert len(token_calls) == 1
        cql = token_calls[0][0][0]
        assert "token(region, user_id)" in cql

    async def test_scan_table_page_size(self):
        """page_size is reflected in the LIMIT clause."""
        driver = _make_mock_driver()
        ctx = MigrationContext(driver, dry_run=False)

        async for _ in ctx.scan_table("ks", "tbl", page_size=500, num_ranges=1):
            pass

        token_calls = [c for c in driver.execute_async.call_args_list if "SELECT * FROM" in str(c)]
        cql = token_calls[0][0][0]
        assert "LIMIT 500" in cql

    async def test_scan_table_dry_run(self):
        """In dry-run mode, scan_table yields a placeholder and does not call driver."""
        driver = AsyncMock()
        ctx = MigrationContext(driver, dry_run=True)

        collected = []
        async for row in ctx.scan_table("ks", "tbl"):
            collected.append(row)

        assert len(collected) == 1
        assert collected[0] == {"__dry_run__": True}
        driver.execute_async.assert_not_called()
        assert any("dry-run" in cql for cql in ctx.planned_cql)

    async def test_scan_table_records_cql(self):
        """scan_table records executed CQL in planned_cql."""
        driver = _make_mock_driver()
        ctx = MigrationContext(driver, dry_run=False)

        async for _ in ctx.scan_table("ks", "tbl", num_ranges=2):
            pass

        token_cqls = [c for c in ctx.planned_cql if "SELECT * FROM" in c]
        assert len(token_cqls) == 2

    async def test_scan_table_no_pk_raises(self):
        """scan_table raises ValueError if table has no partition key columns."""
        driver = _make_mock_driver(pk_columns=[])
        ctx = MigrationContext(driver, dry_run=False)

        with pytest.raises(ValueError, match="No partition key columns"):
            async for _ in ctx.scan_table("ks", "tbl"):
                pass

    async def test_scan_table_covers_full_token_range(self):
        """Token ranges cover from _TOKEN_MIN to _TOKEN_MAX."""
        driver = _make_mock_driver()
        ctx = MigrationContext(driver, dry_run=False)

        async for _ in ctx.scan_table("ks", "tbl", num_ranges=4):
            pass

        token_calls = [c for c in driver.execute_async.call_args_list if "SELECT * FROM" in str(c)]
        # First range starts at _TOKEN_MIN, last range ends at _TOKEN_MAX
        first_params = token_calls[0][0][1]
        last_params = token_calls[-1][0][1]
        assert first_params[0] == _TOKEN_MIN
        assert last_params[1] == _TOKEN_MAX


# ---------------------------------------------------------------------------
# D.2 — Progress reporting
# ---------------------------------------------------------------------------


class TestScanTableProgress:
    """Tests for progress logging (D.2)."""

    async def test_progress_logged(self, caplog):
        """scan_table logs progress at ~10% intervals."""
        driver = _make_mock_driver()
        ctx = MigrationContext(driver, dry_run=False)

        with caplog.at_level(logging.INFO, logger="coodie"):
            async for _ in ctx.scan_table("ks", "tbl", num_ranges=10):
                pass

        progress_msgs = [r for r in caplog.records if "scan_table" in r.message and "ranges" in r.message]
        # With 10 ranges, log every 1 range (10//10=1) → should have multiple log messages
        assert len(progress_msgs) >= 1
        # Final message should report 100%
        assert "100.0%" in progress_msgs[-1].message

    async def test_progress_includes_last_token(self, caplog):
        """Progress log messages include the last_token value."""
        driver = _make_mock_driver()
        ctx = MigrationContext(driver, dry_run=False)

        with caplog.at_level(logging.INFO, logger="coodie"):
            async for _ in ctx.scan_table("ks", "tbl", num_ranges=5):
                pass

        progress_msgs = [r for r in caplog.records if "last_token=" in r.message]
        assert len(progress_msgs) >= 1


# ---------------------------------------------------------------------------
# D.3 — Resume-from-token
# ---------------------------------------------------------------------------


class TestScanTableResume:
    """Tests for resume-from-token support (D.3)."""

    async def test_resume_skips_processed_ranges(self):
        """resume_token causes ranges with start <= resume_token to be skipped."""
        driver = _make_mock_driver(scan_rows=[{"id": 1}])
        ctx = MigrationContext(driver, dry_run=False)

        # Use 4 ranges, resume from a token past the first range
        range_size = (_TOKEN_MAX - _TOKEN_MIN) // 4
        # resume_token is set to the start of the 2nd range, so first 2 ranges are skipped
        resume_at = _TOKEN_MIN + range_size

        collected = []
        async for row in ctx.scan_table("ks", "tbl", num_ranges=4, resume_token=resume_at):
            collected.append(row)

        # Only ranges whose start > resume_at are processed
        token_calls = [c for c in driver.execute_async.call_args_list if "SELECT * FROM" in str(c)]
        # Ranges: [_TOKEN_MIN, _TOKEN_MIN+range_size, _TOKEN_MIN+2*range_size, _TOKEN_MIN+3*range_size]
        # resume_token = _TOKEN_MIN + range_size → skip ranges starting at _TOKEN_MIN (<=) and _TOKEN_MIN+range_size (<=)
        # Process: ranges starting at _TOKEN_MIN+2*range_size and _TOKEN_MIN+3*range_size
        assert len(token_calls) == 2

    async def test_resume_none_processes_all(self):
        """resume_token=None processes all ranges."""
        driver = _make_mock_driver(scan_rows=[{"id": 1}])
        ctx = MigrationContext(driver, dry_run=False)

        collected = []
        async for row in ctx.scan_table("ks", "tbl", num_ranges=3, resume_token=None):
            collected.append(row)

        token_calls = [c for c in driver.execute_async.call_args_list if "SELECT * FROM" in str(c)]
        assert len(token_calls) == 3

    async def test_resume_past_all_ranges(self):
        """resume_token past all ranges yields nothing."""
        driver = _make_mock_driver(scan_rows=[{"id": 1}])
        ctx = MigrationContext(driver, dry_run=False)

        collected = []
        async for row in ctx.scan_table("ks", "tbl", num_ranges=3, resume_token=_TOKEN_MAX):
            collected.append(row)

        assert len(collected) == 0


# ---------------------------------------------------------------------------
# D.4 — Rate limiting / throttle
# ---------------------------------------------------------------------------


class TestScanTableThrottle:
    """Tests for rate limiting / throttle support (D.4)."""

    async def test_throttle_zero_no_sleep(self, monkeypatch):
        """throttle_seconds=0 does not call asyncio.sleep."""
        import coodie.migrations.base as base_mod

        sleep_calls: list[float] = []

        async def _mock_sleep(seconds: float):
            sleep_calls.append(seconds)

        monkeypatch.setattr(base_mod.asyncio, "sleep", _mock_sleep)

        driver = _make_mock_driver()
        ctx = MigrationContext(driver, dry_run=False)

        async for _ in ctx.scan_table("ks", "tbl", num_ranges=3, throttle_seconds=0.0):
            pass

        assert len(sleep_calls) == 0

    async def test_throttle_positive_sleeps(self, monkeypatch):
        """throttle_seconds > 0 sleeps between each range query."""
        import coodie.migrations.base as base_mod

        sleep_calls: list[float] = []

        async def _mock_sleep(seconds: float):
            sleep_calls.append(seconds)

        monkeypatch.setattr(base_mod.asyncio, "sleep", _mock_sleep)

        driver = _make_mock_driver()
        ctx = MigrationContext(driver, dry_run=False)

        async for _ in ctx.scan_table("ks", "tbl", num_ranges=5, throttle_seconds=0.1):
            pass

        assert len(sleep_calls) == 5
        assert all(s == 0.1 for s in sleep_calls)
