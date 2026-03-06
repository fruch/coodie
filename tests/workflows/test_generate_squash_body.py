"""Unit tests for .github/scripts/generate-squash-body.py"""

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

_SCRIPT_PATH = Path(__file__).resolve().parents[2] / ".github" / "scripts" / "generate-squash-body.py"


def _load_script() -> ModuleType:
    spec = importlib.util.spec_from_file_location("generate_squash_body", _SCRIPT_PATH)
    mod = importlib.util.module_from_spec(spec)  # type: ignore[arg-type]
    spec.loader.exec_module(mod)  # type: ignore[union-attr]
    return mod


generate_squash_body = _load_script()


# ---------------------------------------------------------------------------
# build_payload
# ---------------------------------------------------------------------------


def test_build_payload_structure():
    payload = generate_squash_body.build_payload("abc123 fix typo", "README.md | 2 +-")
    assert payload["model"] == generate_squash_body.MODEL
    assert payload["max_tokens"] == 400
    messages = payload["messages"]
    assert messages[0]["role"] == "system"
    assert messages[1]["role"] == "user"
    assert "abc123 fix typo" in messages[1]["content"]
    assert "README.md | 2 +-" in messages[1]["content"]


def test_build_payload_custom_model():
    payload = generate_squash_body.build_payload("log", "stat", model="gpt-4o")
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


def test_call_models_api_returns_body():
    with patch("urllib.request.urlopen", return_value=_fake_response("Add REST endpoints")) as mock_open:
        result = generate_squash_body.call_models_api("token123", {"model": "gpt-4o-mini", "messages": []})
    assert result == "Add REST endpoints"
    request_obj = mock_open.call_args[0][0]
    assert "token123" in request_obj.get_header("Authorization")


def test_call_models_api_raises_on_http_error():
    import urllib.error

    with patch("urllib.request.urlopen", side_effect=urllib.error.HTTPError(None, 401, "Unauthorized", {}, None)):
        with pytest.raises(urllib.error.HTTPError):
            generate_squash_body.call_models_api("bad-token", {})


# ---------------------------------------------------------------------------
# generate_body
# ---------------------------------------------------------------------------


def test_generate_body_returns_body():
    with patch.object(generate_squash_body, "call_models_api", return_value="Add user endpoint"):
        result = generate_squash_body.generate_body("abc fix", "1 file", "tok")
    assert result == "Add user endpoint"


def test_generate_body_fallback_on_error(capsys):
    with patch.object(generate_squash_body, "call_models_api", side_effect=RuntimeError("network")):
        result = generate_squash_body.generate_body("log", "stat", "tok")
    assert result == ""
    captured = capsys.readouterr()
    assert "::warning::" in captured.err


# ---------------------------------------------------------------------------
# main (CLI)
# ---------------------------------------------------------------------------


def test_main_writes_to_output_file(tmp_path):
    out_file = tmp_path / "body.txt"
    with patch.object(generate_squash_body, "call_models_api", return_value="Generated body"):
        with patch.dict("os.environ", {"GH_TOKEN": "fake-token"}):
            generate_squash_body.main(["--log", "abc fix", "--stat", "1 file", "--output-file", str(out_file)])
    assert out_file.read_text(encoding="utf-8") == "Generated body"


def test_main_prints_to_stdout(tmp_path, capsys):
    with patch.object(generate_squash_body, "call_models_api", return_value="body text"):
        with patch.dict("os.environ", {"GH_TOKEN": "fake-token"}):
            generate_squash_body.main(["--log", "abc fix", "--stat", "1 file"])
    captured = capsys.readouterr()
    assert "body text" in captured.out


def test_main_no_token_exits_cleanly(capsys):
    """Without GH_TOKEN, the script exits 0 (no error) since token is optional for squash."""
    with patch.dict("os.environ", {"GH_TOKEN": ""}):
        with pytest.raises(SystemExit) as exc_info:
            generate_squash_body.main(["--log", "abc fix", "--stat", "1 file"])
    assert exc_info.value.code == 0
