"""Unit tests for .github/scripts/summarize-failure.py"""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path
from types import ModuleType
from unittest.mock import MagicMock, patch

import pytest

# ---------------------------------------------------------------------------
# Load the script as a module (hyphens prevent normal import)
# ---------------------------------------------------------------------------

_SCRIPT_PATH = Path(__file__).resolve().parents[2] / ".github" / "scripts" / "summarize-failure.py"


def _load_script() -> ModuleType:
    spec = importlib.util.spec_from_file_location("summarize_failure", _SCRIPT_PATH)
    mod = importlib.util.module_from_spec(spec)  # type: ignore[arg-type]
    spec.loader.exec_module(mod)  # type: ignore[union-attr]
    return mod


summarize_failure = _load_script()


# ---------------------------------------------------------------------------
# build_payload
# ---------------------------------------------------------------------------


def test_build_payload_structure():
    payload = summarize_failure.build_payload("some logs")
    assert payload["model"] == summarize_failure.MODEL
    assert payload["max_tokens"] == 800
    messages = payload["messages"]
    assert messages[0]["role"] == "system"
    assert messages[1]["role"] == "user"
    assert "some logs" in messages[1]["content"]


def test_build_payload_truncates_long_logs():
    long_logs = "x" * (summarize_failure.MAX_LOG_LENGTH + 5000)
    payload = summarize_failure.build_payload(long_logs)
    user_content = payload["messages"][1]["content"]
    assert len(user_content) <= summarize_failure.MAX_LOG_LENGTH + len("CI failure logs:\n\n")


def test_build_payload_custom_model():
    payload = summarize_failure.build_payload("logs", model="gpt-4o")
    assert payload["model"] == "gpt-4o"


# ---------------------------------------------------------------------------
# call_models_api
# ---------------------------------------------------------------------------


def _fake_response(content: str) -> MagicMock:
    """Return a mock that behaves like urllib.request.urlopen context manager."""
    body = json.dumps({"choices": [{"message": {"content": content}}]}).encode()
    mock_resp = MagicMock()
    mock_resp.read.return_value = body
    mock_resp.__enter__ = lambda s: s
    mock_resp.__exit__ = MagicMock(return_value=False)
    return mock_resp


def test_call_models_api_returns_summary():
    with patch("urllib.request.urlopen", return_value=_fake_response("fix the test")) as mock_open:
        result = summarize_failure.call_models_api("token123", {"model": "gpt-4o-mini", "messages": []})
    assert result == "fix the test"
    # Verify Authorization header contains the token
    request_obj = mock_open.call_args[0][0]
    assert "token123" in request_obj.get_header("Authorization")


def test_call_models_api_raises_on_http_error():
    import urllib.error

    with patch("urllib.request.urlopen", side_effect=urllib.error.HTTPError(None, 401, "Unauthorized", {}, None)):
        with pytest.raises(urllib.error.HTTPError):
            summarize_failure.call_models_api("bad-token", {})


# ---------------------------------------------------------------------------
# summarize_logs
# ---------------------------------------------------------------------------


def test_summarize_logs_returns_summary():
    with patch.object(summarize_failure, "call_models_api", return_value="root cause: missing semicolon"):
        result = summarize_failure.summarize_logs("some logs", "tok")
    assert result == "root cause: missing semicolon"


def test_summarize_logs_fallback_on_error(capsys):
    with patch.object(summarize_failure, "call_models_api", side_effect=RuntimeError("network error")):
        result = summarize_failure.summarize_logs("some logs", "tok")
    assert "unavailable" in result
    captured = capsys.readouterr()
    assert "::warning::" in captured.err
    assert "network error" in captured.err


# ---------------------------------------------------------------------------
# main (CLI)
# ---------------------------------------------------------------------------


def test_main_writes_to_output_file(tmp_path):
    logs_file = tmp_path / "logs.txt"
    logs_file.write_text("build failed at step X", encoding="utf-8")
    out_file = tmp_path / "summary.txt"

    with patch.object(summarize_failure, "call_models_api", return_value="Step X failed due to Y"):
        with patch.dict("os.environ", {"GH_TOKEN": "fake-token"}):
            summarize_failure.main(["--logs-file", str(logs_file), "--output-file", str(out_file)])

    assert out_file.read_text(encoding="utf-8") == "Step X failed due to Y"


def test_main_prints_to_stdout(tmp_path, capsys):
    logs_file = tmp_path / "logs.txt"
    logs_file.write_text("test failure output", encoding="utf-8")

    with patch.object(summarize_failure, "call_models_api", return_value="summary text"):
        with patch.dict("os.environ", {"GH_TOKEN": "fake-token"}):
            summarize_failure.main(["--logs-file", str(logs_file)])

    captured = capsys.readouterr()
    assert "summary text" in captured.out
