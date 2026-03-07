"""Unit tests for .github/scripts/resolve-conflict-file.py"""

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

_SCRIPT_PATH = Path(__file__).resolve().parents[2] / ".github" / "scripts" / "resolve-conflict-file.py"


def _load_script() -> ModuleType:
    spec = importlib.util.spec_from_file_location("resolve_conflict_file", _SCRIPT_PATH)
    mod = importlib.util.module_from_spec(spec)  # type: ignore[arg-type]
    spec.loader.exec_module(mod)  # type: ignore[union-attr]
    return mod


resolve_conflict_file = _load_script()


# ---------------------------------------------------------------------------
# build_payload
# ---------------------------------------------------------------------------


def test_build_payload_structure():
    payload = resolve_conflict_file.build_payload("<<<<<<< HEAD\nx=1\n=======\nx=2\n>>>>>>> b", "foo.py")
    assert payload["model"] == resolve_conflict_file.MODEL
    assert payload["max_tokens"] == 4000
    messages = payload["messages"]
    assert messages[0]["role"] == "system"
    assert messages[1]["role"] == "user"
    assert "foo.py" in messages[1]["content"]
    assert "<<<<<<<" in messages[1]["content"]


def test_build_payload_truncates_long_content():
    long_content = "x" * (resolve_conflict_file.MAX_CONTENT_LENGTH + 5000)
    payload = resolve_conflict_file.build_payload(long_content, "big.py")
    user_content = payload["messages"][1]["content"]
    # Content should be truncated (prefix "File: big.py\n\nContent:\n" + truncated content)
    assert len(user_content) <= resolve_conflict_file.MAX_CONTENT_LENGTH + 100


# ---------------------------------------------------------------------------
# call_models_api
# ---------------------------------------------------------------------------


def _fake_response(content: str) -> MagicMock:
    body = json.dumps({"choices": [{"message": {"content": content}}]}).encode()
    mock_resp = MagicMock()
    mock_resp.read.return_value = body
    mock_resp.__enter__ = lambda s: s
    mock_resp.__exit__ = MagicMock(return_value=False)
    return mock_resp


def test_call_models_api_returns_resolved():
    with patch("urllib.request.urlopen", return_value=_fake_response("x = 2")) as mock_open:
        result = resolve_conflict_file.call_models_api("token123", {"model": "gpt-4o-mini", "messages": []})
    assert result == "x = 2"
    request_obj = mock_open.call_args[0][0]
    assert "token123" in request_obj.get_header("Authorization")


# ---------------------------------------------------------------------------
# resolve_file
# ---------------------------------------------------------------------------


def test_resolve_file_returns_resolved():
    with patch.object(resolve_conflict_file, "call_models_api", return_value="x = 2"):
        result = resolve_conflict_file.resolve_file("<<<<<<< HEAD\nx=1\n=======\nx=2\n>>>>>>>", "foo.py", "tok")
    assert result == "x = 2"


def test_resolve_file_fallback_on_error(capsys):
    with patch.object(resolve_conflict_file, "call_models_api", side_effect=RuntimeError("api error")):
        result = resolve_conflict_file.resolve_file("content", "foo.py", "tok")
    assert result == ""
    captured = capsys.readouterr()
    assert "::warning::" in captured.err


# ---------------------------------------------------------------------------
# main (CLI)
# ---------------------------------------------------------------------------


def test_main_writes_resolved_to_output(tmp_path):
    conflict_file = tmp_path / "foo.py"
    conflict_file.write_text("<<<<<<< HEAD\nx=1\n=======\nx=2\n>>>>>>>", encoding="utf-8")
    out_file = tmp_path / "resolved.py"

    with patch.object(resolve_conflict_file, "call_models_api", return_value="x = 2"):
        with patch.dict("os.environ", {"GH_TOKEN": "fake-token"}):
            resolve_conflict_file.main(["--file", str(conflict_file), "--output-file", str(out_file)])

    assert out_file.read_text(encoding="utf-8") == "x = 2"


def test_main_exits_1_on_empty_resolution(tmp_path):
    conflict_file = tmp_path / "foo.py"
    conflict_file.write_text("<<<<<<< HEAD\nx=1\n=======\nx=2\n>>>>>>>", encoding="utf-8")
    out_file = tmp_path / "resolved.py"

    with patch.object(resolve_conflict_file, "call_models_api", side_effect=RuntimeError("fail")):
        with patch.dict("os.environ", {"GH_TOKEN": "fake-token"}):
            with pytest.raises(SystemExit) as exc_info:
                resolve_conflict_file.main(["--file", str(conflict_file), "--output-file", str(out_file)])
    assert exc_info.value.code == 1


def test_main_exits_1_without_token(tmp_path):
    conflict_file = tmp_path / "foo.py"
    conflict_file.write_text("content", encoding="utf-8")
    out_file = tmp_path / "resolved.py"

    with patch.dict("os.environ", {"GH_TOKEN": ""}):
        with pytest.raises(SystemExit) as exc_info:
            resolve_conflict_file.main(["--file", str(conflict_file), "--output-file", str(out_file)])
    assert exc_info.value.code == 1
