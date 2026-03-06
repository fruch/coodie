"""Unit tests for .github/scripts/extract_log_snippet.py"""

from __future__ import annotations

import importlib.util
from pathlib import Path
from types import ModuleType

import pytest

# ---------------------------------------------------------------------------
# Load the script as a module (it lives outside the normal package tree)
# ---------------------------------------------------------------------------

_SCRIPT_PATH = Path(__file__).resolve().parents[2] / ".github" / "scripts" / "extract_log_snippet.py"


def _load_script() -> ModuleType:
    spec = importlib.util.spec_from_file_location("extract_log_snippet", _SCRIPT_PATH)
    mod = importlib.util.module_from_spec(spec)  # type: ignore[arg-type]
    spec.loader.exec_module(mod)  # type: ignore[union-attr]
    return mod


snippet_mod = _load_script()


# ---------------------------------------------------------------------------
# find_failure_index
# ---------------------------------------------------------------------------


class TestFindFailureIndex:
    def test_returns_none_for_empty(self):
        assert snippet_mod.find_failure_index([]) is None

    def test_returns_none_when_no_markers(self):
        lines = ["all good", "nothing to see here", "ok"]
        assert snippet_mod.find_failure_index(lines) is None

    def test_finds_error_marker(self):
        lines = ["step 1", "step 2", "Error: something broke", "step 4"]
        assert snippet_mod.find_failure_index(lines) == 2

    def test_finds_last_marker(self):
        lines = ["Error: first", "ok", "FAIL: second"]
        # Should return the index of the *last* marker
        assert snippet_mod.find_failure_index(lines) == 2

    def test_case_insensitive(self):
        lines = ["TRACEBACK (most recent call last)"]
        assert snippet_mod.find_failure_index(lines) == 0

    @pytest.mark.parametrize(
        "marker_line",
        [
            "##[error] Process completed with exit code 1",
            "FATAL: out of memory",
            "panic: runtime error",
            "AssertionError: expected True",
            "TimeoutError: connection timed out",
            "segmentation fault (core dumped)",
            "Exception in thread main",
            "FAILED tests/test_foo.py::test_bar",
        ],
    )
    def test_various_markers(self, marker_line: str):
        lines = ["ok line", marker_line, "trailing"]
        idx = snippet_mod.find_failure_index(lines)
        assert idx == 1


# ---------------------------------------------------------------------------
# extract_failure_snippet
# ---------------------------------------------------------------------------


class TestExtractFailureSnippet:
    def test_empty_log(self):
        assert snippet_mod.extract_failure_snippet("") == ""

    def test_no_marker_returns_tail(self):
        log = "\n".join(f"line {i}" for i in range(200))
        snippet = snippet_mod.extract_failure_snippet(log, max_lines=50)
        lines = snippet.splitlines()
        assert len(lines) == 50
        assert lines[-1] == "line 199"

    def test_marker_returns_context_window(self):
        # 100 lines, error at line 50
        log_lines = [f"line {i}" for i in range(100)]
        log_lines[50] = "Error: something went wrong"
        log = "\n".join(log_lines)

        snippet = snippet_mod.extract_failure_snippet(log, max_lines=160, context=10)
        lines = snippet.splitlines()
        # Should have lines from ~40 to ~61 (10 before + error + 10 after)
        assert "Error: something went wrong" in snippet
        assert len(lines) <= 21  # 10 + 1 + 10

    def test_marker_near_start(self):
        log_lines = ["Error: early failure"] + [f"line {i}" for i in range(50)]
        log = "\n".join(log_lines)
        snippet = snippet_mod.extract_failure_snippet(log, max_lines=160, context=10)
        assert "Error: early failure" in snippet

    def test_marker_at_end(self):
        log_lines = [f"line {i}" for i in range(50)] + ["FAIL: final"]
        log = "\n".join(log_lines)
        snippet = snippet_mod.extract_failure_snippet(log, max_lines=160, context=10)
        assert "FAIL: final" in snippet

    def test_window_capped_by_max_lines(self):
        log_lines = [f"line {i}" for i in range(500)]
        log_lines[250] = "Error: middle failure"
        log = "\n".join(log_lines)

        snippet = snippet_mod.extract_failure_snippet(log, max_lines=20, context=100)
        lines = snippet.splitlines()
        assert len(lines) <= 20
        # When max_lines < window, the tail of the window is kept.
        # The error may be clipped — this is acceptable because the
        # surrounding context often contains the cascading output.

    def test_window_preserves_error_with_adequate_max_lines(self):
        log_lines = [f"line {i}" for i in range(500)]
        log_lines[250] = "Error: middle failure"
        log = "\n".join(log_lines)

        # With enough max_lines the error is always in the snippet
        snippet = snippet_mod.extract_failure_snippet(log, max_lines=201, context=100)
        assert "Error: middle failure" in snippet

    def test_last_marker_wins(self):
        log_lines = [
            "Error: first",
            "ok line 1",
            "ok line 2",
            "FATAL: second — this is the root cause",
        ]
        log = "\n".join(log_lines)
        snippet = snippet_mod.extract_failure_snippet(log, max_lines=10, context=2)
        assert "FATAL: second" in snippet


# ---------------------------------------------------------------------------
# CLI (main)
# ---------------------------------------------------------------------------


class TestMain:
    def test_missing_file(self, capsys):
        with pytest.raises(SystemExit):
            snippet_mod.main(["--log-file", "/nonexistent/path/log.txt"])
        captured = capsys.readouterr()
        assert "not found" in captured.err or "Error" in captured.err

    def test_file_output(self, tmp_path, capsys):
        log_file = tmp_path / "build.log"
        log_file.write_text("step 1\nstep 2\nError: build failed\nstep 4\n", encoding="utf-8")
        snippet_mod.main(["--log-file", str(log_file)])
        captured = capsys.readouterr()
        assert "Error: build failed" in captured.out
