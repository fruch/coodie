"""Unit tests for .github/scripts/inspect_pr_checks.py

These tests exercise the pure-logic helpers (is_failing, _extract_run_id, etc.)
without calling the gh CLI.  Network-dependent functions are mocked.
"""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path
from types import ModuleType
from unittest.mock import patch

import pytest

# ---------------------------------------------------------------------------
# Load the script as a module
# ---------------------------------------------------------------------------

_SCRIPT_PATH = Path(__file__).resolve().parents[2] / ".github" / "scripts" / "inspect_pr_checks.py"


def _load_script() -> ModuleType:
    spec = importlib.util.spec_from_file_location("inspect_pr_checks", _SCRIPT_PATH)
    mod = importlib.util.module_from_spec(spec)  # type: ignore[arg-type]
    spec.loader.exec_module(mod)  # type: ignore[union-attr]
    return mod


ipc = _load_script()


# ---------------------------------------------------------------------------
# is_failing
# ---------------------------------------------------------------------------


class TestIsFailing:
    @pytest.mark.parametrize(
        "check",
        [
            {"conclusion": "failure"},
            {"conclusion": "cancelled"},
            {"conclusion": "timed_out"},
            {"conclusion": "action_required"},
            {"state": "failure"},
            {"state": "error"},
            {"bucket": "fail"},
        ],
    )
    def test_failing_checks(self, check: dict):
        assert ipc.is_failing(check) is True

    @pytest.mark.parametrize(
        "check",
        [
            {"conclusion": "success"},
            {"state": "completed"},
            {"bucket": "pass"},
            {"conclusion": "neutral"},
            {},
        ],
    )
    def test_passing_checks(self, check: dict):
        assert ipc.is_failing(check) is False

    def test_case_insensitive(self):
        assert ipc.is_failing({"conclusion": "FAILURE"}) is True
        assert ipc.is_failing({"state": "Error"}) is True


# ---------------------------------------------------------------------------
# _extract_run_id / _extract_job_id
# ---------------------------------------------------------------------------


class TestExtractIds:
    def test_run_id_from_actions_url(self):
        url = "https://github.com/owner/repo/actions/runs/12345/job/67890"
        assert ipc._extract_run_id(url) == "12345"

    def test_run_id_from_short_url(self):
        url = "https://example.com/runs/99999"
        assert ipc._extract_run_id(url) == "99999"

    def test_run_id_none_for_empty(self):
        assert ipc._extract_run_id("") is None
        assert ipc._extract_run_id("https://example.com/check/abc") is None

    def test_job_id_from_actions_url(self):
        url = "https://github.com/owner/repo/actions/runs/111/job/222"
        assert ipc._extract_job_id(url) == "222"

    def test_job_id_from_short_url(self):
        url = "https://example.com/job/333"
        assert ipc._extract_job_id(url) == "333"

    def test_job_id_none_for_empty(self):
        assert ipc._extract_job_id("") is None


# ---------------------------------------------------------------------------
# _normalize
# ---------------------------------------------------------------------------


class TestNormalize:
    def test_none(self):
        assert ipc._normalize(None) == ""

    def test_string(self):
        assert ipc._normalize("  Failure  ") == "failure"

    def test_int(self):
        assert ipc._normalize(42) == "42"


# ---------------------------------------------------------------------------
# _is_log_pending
# ---------------------------------------------------------------------------


class TestIsLogPending:
    def test_pending_message(self):
        assert ipc._is_log_pending("Run still in progress — try again later") is True

    def test_log_available_message(self):
        assert ipc._is_log_pending("Log will be available when it is complete") is True

    def test_normal_error(self):
        assert ipc._is_log_pending("HTTP 404: Not Found") is False


# ---------------------------------------------------------------------------
# _parse_available_fields
# ---------------------------------------------------------------------------


class TestParseAvailableFields:
    def test_no_fields_hint(self):
        assert ipc._parse_available_fields("some random error") == []

    def test_parses_field_list(self):
        msg = "Error: invalid field 'conclusion'\nAvailable fields:\n  name\n  state\n  bucket\n  link\n"
        fields = ipc._parse_available_fields(msg)
        assert "name" in fields
        assert "state" in fields
        assert "bucket" in fields
        assert "link" in fields


# ---------------------------------------------------------------------------
# analyze_check — mocked
# ---------------------------------------------------------------------------


class TestAnalyzeCheck:
    def test_external_check(self):
        check = {"name": "Buildkite", "detailsUrl": "https://buildkite.com/org/pipe/builds/42"}
        result = ipc.analyze_check(check, repo_root=Path("."), max_lines=10, context=5)
        assert result["status"] == "external"
        assert result["runId"] is None

    def test_ok_check_with_logs(self):
        check = {
            "name": "CI / lint",
            "detailsUrl": "https://github.com/o/r/actions/runs/1001/job/2002",
        }
        metadata = {"workflowName": "CI", "conclusion": "failure", "headBranch": "fix-it", "headSha": "abc123"}
        log_text = "step 1\nstep 2\nError: linting failed\nstep 4\n"

        with (
            patch.object(ipc, "fetch_run_metadata", return_value=metadata),
            patch.object(ipc, "fetch_check_log", return_value=(log_text, "", "ok")),
        ):
            result = ipc.analyze_check(check, repo_root=Path("."), max_lines=100, context=10)

        assert result["status"] == "ok"
        assert result["runId"] == "1001"
        assert result["jobId"] == "2002"
        assert "Error: linting failed" in result["logSnippet"]
        assert result["run"]["workflowName"] == "CI"

    def test_pending_log(self):
        check = {
            "name": "CI / test",
            "detailsUrl": "https://github.com/o/r/actions/runs/1001",
        }
        with (
            patch.object(ipc, "fetch_run_metadata", return_value=None),
            patch.object(ipc, "fetch_check_log", return_value=("", "still in progress", "pending")),
        ):
            result = ipc.analyze_check(check, repo_root=Path("."), max_lines=100, context=10)

        assert result["status"] == "log_pending"


# ---------------------------------------------------------------------------
# render_results — smoke test (just ensure it doesn't crash)
# ---------------------------------------------------------------------------


class TestRenderResults:
    def test_renders_without_error(self, capsys):
        results = [
            {
                "name": "CI / lint",
                "detailsUrl": "https://example.com/runs/1",
                "runId": "1",
                "status": "ok",
                "run": {"workflowName": "CI", "conclusion": "failure", "headBranch": "main", "headSha": "abc"},
                "logSnippet": "Error: bad code",
            },
            {
                "name": "External",
                "detailsUrl": "https://buildkite.com/x",
                "runId": None,
                "status": "external",
                "note": "Not a GitHub Actions run.",
            },
        ]
        ipc.render_results("42", results)
        out = capsys.readouterr().out
        assert "PR #42" in out
        assert "CI / lint" in out
        assert "Error: bad code" in out
        assert "External" in out


# ---------------------------------------------------------------------------
# main — integration-level test with everything mocked
# ---------------------------------------------------------------------------


class TestMain:
    def test_no_failing_checks(self, capsys):
        with (
            patch.object(ipc, "find_git_root", return_value=Path(".")),
            patch.object(ipc, "ensure_gh", return_value=True),
            patch.object(ipc, "resolve_pr", return_value="99"),
            patch.object(ipc, "fetch_checks", return_value=[{"conclusion": "success", "name": "lint"}]),
        ):
            rc = ipc.main(["--pr", "99"])
        assert rc == 0
        assert "no failing checks" in capsys.readouterr().out

    def test_json_output(self, capsys):
        checks = [{"name": "CI / test", "conclusion": "failure", "detailsUrl": "https://github.com/o/r/actions/runs/1"}]
        with (
            patch.object(ipc, "find_git_root", return_value=Path(".")),
            patch.object(ipc, "ensure_gh", return_value=True),
            patch.object(ipc, "resolve_pr", return_value="99"),
            patch.object(ipc, "fetch_checks", return_value=checks),
            patch.object(ipc, "fetch_run_metadata", return_value=None),
            patch.object(ipc, "fetch_check_log", return_value=("Error: test failed", "", "ok")),
        ):
            rc = ipc.main(["--pr", "99", "--json"])
        assert rc == 1  # failures exist
        data = json.loads(capsys.readouterr().out)
        assert data["pr"] == "99"
        assert len(data["results"]) == 1
        assert "Error: test failed" in data["results"][0]["logSnippet"]
