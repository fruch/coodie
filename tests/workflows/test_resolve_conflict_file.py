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


# ---------------------------------------------------------------------------
# extract_conflict_blocks
# ---------------------------------------------------------------------------


def test_extract_conflict_blocks_single():
    content = "line1\nline2\n<<<<<<< HEAD\nx=1\n=======\nx=2\n>>>>>>> branch\nline3\n"
    blocks = resolve_conflict_file.extract_conflict_blocks(content, context_lines=1)
    assert len(blocks) == 1
    b = blocks[0]
    assert b["start"] == 2
    assert b["end"] == 6
    assert "<<<<<<< HEAD" in b["conflict"]
    assert ">>>>>>> branch" in b["conflict"]
    assert "line2" in b["before"]
    assert "line3" in b["after"]


def test_extract_conflict_blocks_multiple():
    content = "a\n<<<<<<< HEAD\nx=1\n=======\nx=2\n>>>>>>> b\nmiddle\n<<<<<<< HEAD\ny=1\n=======\ny=2\n>>>>>>> b\nz\n"
    blocks = resolve_conflict_file.extract_conflict_blocks(content, context_lines=1)
    assert len(blocks) == 2
    assert "x=1" in blocks[0]["conflict"]
    assert "y=1" in blocks[1]["conflict"]


def test_extract_conflict_blocks_no_conflicts():
    content = "line1\nline2\nline3\n"
    blocks = resolve_conflict_file.extract_conflict_blocks(content)
    assert blocks == []


# ---------------------------------------------------------------------------
# build_chunk_payload
# ---------------------------------------------------------------------------


def test_build_chunk_payload_structure():
    payload = resolve_conflict_file.build_chunk_payload(
        "<<<<<<< HEAD\nx=1\n=======\nx=2\n>>>>>>>", "foo.py", before="ctx_before\n", after="ctx_after\n"
    )
    assert payload["model"] == resolve_conflict_file.MODEL
    messages = payload["messages"]
    assert messages[0]["role"] == "system"
    assert "do NOT include" in messages[0]["content"]
    user = messages[1]["content"]
    assert "foo.py" in user
    assert "ctx_before" in user
    assert "ctx_after" in user
    assert "<<<<<<<" in user


def test_build_chunk_payload_truncates_context():
    long_before = "B" * (resolve_conflict_file.MAX_CHUNK_CONTEXT + 500)
    long_after = "A" * (resolve_conflict_file.MAX_CHUNK_CONTEXT + 500)
    payload = resolve_conflict_file.build_chunk_payload("conflict", "f.py", before=long_before, after=long_after)
    user = payload["messages"][1]["content"]
    # Context should be truncated to MAX_CHUNK_CONTEXT
    assert user.count("B") <= resolve_conflict_file.MAX_CHUNK_CONTEXT
    assert user.count("A") <= resolve_conflict_file.MAX_CHUNK_CONTEXT


# ---------------------------------------------------------------------------
# resolve_file_chunked
# ---------------------------------------------------------------------------


def test_resolve_file_chunked_single_conflict():
    content = "before\n<<<<<<< HEAD\nx=1\n=======\nx=2\n>>>>>>> b\nafter\n"
    with patch.object(resolve_conflict_file, "call_models_api", return_value="x = 2"):
        result = resolve_conflict_file.resolve_file_chunked(content, "foo.py", "tok")
    assert "x = 2" in result
    assert "<<<<<<<" not in result
    assert "before\n" in result
    assert "after\n" in result


def test_resolve_file_chunked_multiple_conflicts():
    content = "a\n<<<<<<< HEAD\nx=1\n=======\nx=2\n>>>>>>> b\nmid\n<<<<<<< HEAD\ny=1\n=======\ny=2\n>>>>>>> b\nz\n"
    call_count = 0

    def mock_api(token, payload):
        nonlocal call_count
        call_count += 1
        if call_count == 1:
            return "x = merged"
        return "y = merged"

    with patch.object(resolve_conflict_file, "call_models_api", side_effect=mock_api):
        result = resolve_conflict_file.resolve_file_chunked(content, "foo.py", "tok")
    assert "x = merged" in result
    assert "y = merged" in result
    assert "mid\n" in result
    assert "<<<<<<<" not in result


def test_resolve_file_chunked_returns_empty_on_api_error():
    content = "a\n<<<<<<< HEAD\nx=1\n=======\nx=2\n>>>>>>> b\n"
    with patch.object(resolve_conflict_file, "call_models_api", side_effect=RuntimeError("fail")):
        result = resolve_conflict_file.resolve_file_chunked(content, "foo.py", "tok")
    assert result == ""


def test_resolve_file_chunked_returns_empty_if_markers_remain():
    content = "a\n<<<<<<< HEAD\nx=1\n=======\nx=2\n>>>>>>> b\n"
    with patch.object(resolve_conflict_file, "call_models_api", return_value="<<<<<<< still conflicted"):
        result = resolve_conflict_file.resolve_file_chunked(content, "foo.py", "tok")
    assert result == ""


# ---------------------------------------------------------------------------
# resolve_file routes to chunked for large files
# ---------------------------------------------------------------------------


def test_resolve_file_uses_chunked_for_large_files():
    # Create content larger than CHUNK_THRESHOLD with a conflict
    padding = "x = 1\n" * 3000  # ~18000 chars
    content = padding + "<<<<<<< HEAD\ny=1\n=======\ny=2\n>>>>>>> b\n"
    assert len(content) > resolve_conflict_file.CHUNK_THRESHOLD

    with patch.object(resolve_conflict_file, "resolve_file_chunked", return_value="resolved") as mock_chunked:
        result = resolve_conflict_file.resolve_file(content, "big.py", "tok")
    mock_chunked.assert_called_once_with(content, "big.py", "tok")
    assert result == "resolved"


def test_resolve_file_uses_whole_file_for_small_files():
    content = "<<<<<<< HEAD\nx=1\n=======\nx=2\n>>>>>>>"
    assert len(content) <= resolve_conflict_file.CHUNK_THRESHOLD

    with patch.object(resolve_conflict_file, "call_models_api", return_value="x = 2"):
        result = resolve_conflict_file.resolve_file(content, "foo.py", "tok")
    assert result == "x = 2"
