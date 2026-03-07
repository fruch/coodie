"""Unit tests for .github/scripts/format_snippets.py"""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path
from types import ModuleType


# ---------------------------------------------------------------------------
# Load the script as a module
# ---------------------------------------------------------------------------

_SCRIPT_PATH = Path(__file__).resolve().parents[2] / ".github" / "scripts" / "format_snippets.py"


def _load_script() -> ModuleType:
    spec = importlib.util.spec_from_file_location("format_snippets", _SCRIPT_PATH)
    mod = importlib.util.module_from_spec(spec)  # type: ignore[arg-type]
    spec.loader.exec_module(mod)  # type: ignore[union-attr]
    return mod


fmt = _load_script()


class TestFormatSnippets:
    def test_no_results(self, tmp_path):
        f = tmp_path / "empty.json"
        f.write_text(json.dumps({"pr": "1", "results": []}), encoding="utf-8")
        assert fmt.format_snippets(str(f)) == ""

    def test_no_snippets(self, tmp_path):
        f = tmp_path / "no_snippet.json"
        data = {"results": [{"name": "lint", "status": "ok"}]}
        f.write_text(json.dumps(data), encoding="utf-8")
        assert fmt.format_snippets(str(f)) == ""

    def test_one_snippet(self, tmp_path):
        f = tmp_path / "one.json"
        data = {"results": [{"name": "CI / test", "logSnippet": "Error: test failed\nline 2"}]}
        f.write_text(json.dumps(data), encoding="utf-8")
        result = fmt.format_snippets(str(f))
        assert "CI / test" in result
        assert "Error: test failed" in result
        assert "<details>" in result
        assert "```" in result

    def test_multiple_snippets(self, tmp_path):
        f = tmp_path / "multi.json"
        data = {
            "results": [
                {"name": "lint", "logSnippet": "ruff error"},
                {"name": "test", "logSnippet": "pytest failed"},
            ]
        }
        f.write_text(json.dumps(data), encoding="utf-8")
        result = fmt.format_snippets(str(f))
        assert "lint" in result
        assert "test" in result

    def test_missing_file(self):
        assert fmt.format_snippets("/nonexistent/file.json") == ""

    def test_invalid_json(self, tmp_path):
        f = tmp_path / "bad.json"
        f.write_text("not json", encoding="utf-8")
        assert fmt.format_snippets(str(f)) == ""

    def test_max_lines_respected(self, tmp_path):
        f = tmp_path / "long.json"
        long_snippet = "\n".join(f"line {i}" for i in range(200))
        data = {"results": [{"name": "test", "logSnippet": long_snippet}]}
        f.write_text(json.dumps(data), encoding="utf-8")
        result = fmt.format_snippets(str(f), max_lines=10)
        # Only the last 10 lines of the snippet should be included
        snippet_lines = [line for line in result.splitlines() if line.startswith("line ")]
        assert len(snippet_lines) == 10
