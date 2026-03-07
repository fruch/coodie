#!/usr/bin/env python3
# resolve-conflict-file.py — Resolve git conflict markers in a file using GitHub Models API.
#
# Replaces the Copilot CLI approach that was blocked by permission restrictions
# in the CI sandbox.  Uses the same GitHub Models API pattern as
# summarize-failure.py.
#
# Usage:
#   GH_TOKEN=<token> python3 resolve-conflict-file.py \
#       --file path/to/conflicted_file.py \
#       --output-file /tmp/resolved.py
#
# Inputs (env vars):
#   GH_TOKEN — GitHub token (must have models:read permission)
#
# Inputs (arguments):
#   --file        — Path to the file containing conflict markers
#   --output-file — Path to write the resolved content
#
# Exit codes:
#   0 — resolved content written to --output-file
#   1 — resolution failed (API error, empty response, or markers remain)

from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.request
from pathlib import Path

MODELS_API_URL = "https://models.inference.ai.azure.com/chat/completions"
MODEL = "gpt-4o-mini"
# Truncation limit for the whole-file payload sent to the Models API.
# Kept in sync with CHUNK_THRESHOLD; the two are equal today but separated
# so the whole-file truncation and the chunked-mode routing can be tuned
# independently if the API limits change.
MAX_CONTENT_LENGTH = 16000
# Files larger than this use chunk-by-chunk conflict resolution
CHUNK_THRESHOLD = 16000
# Lines of context around each conflict block for chunked resolution
CONTEXT_LINES = 30
# Max chars of context to include before/after a conflict chunk
MAX_CHUNK_CONTEXT = 2000

_SYSTEM_PROMPT = (
    "You are a git merge conflict resolver. "
    "Resolve ALL git conflict markers (<<<<<<<, =======, >>>>>>>) in the file below. "
    "Output ONLY the complete resolved file content — no markdown fences, no explanations, "
    "no preamble, no reasoning steps. Produce clean, working code."
)

_CHUNK_SYSTEM_PROMPT = (
    "You are a git merge conflict resolver. "
    "Resolve the git conflict markers (<<<<<<<, =======, >>>>>>>) in the conflict section below. "
    "The context sections are for reference only — do NOT include them in your output. "
    "Output ONLY the resolved replacement for the conflict block — no markdown fences, "
    "no explanations, no context lines."
)


def build_payload(file_content: str, file_path: str, model: str = MODEL) -> dict:
    """Build the chat-completions request payload."""
    truncated = file_content[:MAX_CONTENT_LENGTH]
    user_content = f"File: {file_path}\n\nContent:\n{truncated}"
    return {
        "model": model,
        "messages": [
            {"role": "system", "content": _SYSTEM_PROMPT},
            {"role": "user", "content": user_content},
        ],
        "max_tokens": 4000,
    }


def build_chunk_payload(conflict: str, file_path: str, before: str = "", after: str = "", model: str = MODEL) -> dict:
    """Build payload for resolving a single conflict chunk with context."""
    parts = [f"File: {file_path}\n"]
    if before:
        parts.append(f"\n--- Context before (do NOT include in output) ---\n{before[-MAX_CHUNK_CONTEXT:]}")
    parts.append(f"\n--- Conflict to resolve ---\n{conflict}")
    if after:
        parts.append(f"\n--- Context after (do NOT include in output) ---\n{after[:MAX_CHUNK_CONTEXT]}")
    user_content = "".join(parts)
    return {
        "model": model,
        "messages": [
            {"role": "system", "content": _CHUNK_SYSTEM_PROMPT},
            {"role": "user", "content": user_content},
        ],
        "max_tokens": 4000,
    }


def call_models_api(token: str, payload: dict, url: str = MODELS_API_URL) -> str:
    """POST payload to the GitHub Models API and return the assistant message."""
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode(),
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
    )
    with urllib.request.urlopen(req) as resp:
        result = json.loads(resp.read())
    return result["choices"][0]["message"]["content"]


def extract_conflict_blocks(content: str, context_lines: int = CONTEXT_LINES) -> list[dict]:
    """Parse file into conflict blocks with surrounding context lines.

    Returns a list of dicts with keys:
      - start: 0-based line index of the <<<<<<< line
      - end:   0-based line index of the >>>>>>> line (inclusive)
      - before: context text before the conflict
      - conflict: the full conflict block text (<<<<<<< through >>>>>>>)
      - after: context text after the conflict
    """
    lines = content.splitlines(keepends=True)
    blocks: list[dict] = []
    i = 0
    while i < len(lines):
        if lines[i].startswith("<<<<<<<"):
            start = i
            j = i + 1
            while j < len(lines) and not lines[j].startswith(">>>>>>>"):
                j += 1
            end = j  # inclusive — the >>>>>>> line

            ctx_start = max(0, start - context_lines)
            ctx_end = min(len(lines), end + 1 + context_lines)

            blocks.append(
                {
                    "start": start,
                    "end": end,
                    "before": "".join(lines[ctx_start:start]),
                    "conflict": "".join(lines[start : end + 1]),
                    "after": "".join(lines[end + 1 : ctx_end]),
                }
            )
            i = end + 1
        else:
            i += 1
    return blocks


def resolve_file_chunked(file_content: str, file_path: str, token: str) -> str:
    """Resolve conflicts chunk-by-chunk for large files.

    Each conflict block is resolved independently with surrounding context,
    keeping API payloads small enough to avoid 413 errors.
    """
    blocks = extract_conflict_blocks(file_content)
    if not blocks:
        return file_content

    lines = file_content.splitlines(keepends=True)
    resolutions: list[str] = []

    for block in blocks:
        payload = build_chunk_payload(block["conflict"], file_path, block["before"], block["after"])
        try:
            resolved = call_models_api(token, payload)
        except Exception as exc:
            print(f"::warning::Chunk conflict resolution failed for {file_path}: {exc}", file=sys.stderr)
            return ""
        if not resolved or "<<<<<<<" in resolved:
            print(f"::warning::Chunk resolution incomplete for {file_path}", file=sys.stderr)
            return ""
        resolutions.append(resolved)

    # Reassemble file: replace each conflict block with its resolution
    result_parts: list[str] = []
    i = 0
    for idx, block in enumerate(blocks):
        # Add clean lines before this conflict
        result_parts.append("".join(lines[i : block["start"]]))
        # Add resolved content (ensure trailing newline)
        resolved_text = resolutions[idx]
        if resolved_text and not resolved_text.endswith("\n"):
            resolved_text += "\n"
        result_parts.append(resolved_text)
        i = block["end"] + 1

    # Add remaining lines after the last conflict
    result_parts.append("".join(lines[i:]))
    return "".join(result_parts)


def resolve_file(file_content: str, file_path: str, token: str) -> str:
    """Return resolved file content, or empty string on error.

    For large files (> CHUNK_THRESHOLD chars), conflicts are resolved one
    chunk at a time to avoid exceeding the Models API payload size limit.
    """
    if len(file_content) > CHUNK_THRESHOLD:
        return resolve_file_chunked(file_content, file_path, token)

    payload = build_payload(file_content, file_path)
    try:
        return call_models_api(token, payload)
    except Exception as exc:
        print(f"::warning::Conflict resolution failed for {file_path}: {exc}", file=sys.stderr)
        return ""


def main(argv: list[str] | None = None) -> None:
    parser = argparse.ArgumentParser(description="Resolve git conflict markers using GitHub Models API.")
    parser.add_argument("--file", required=True, help="Path to the conflicted file")
    parser.add_argument("--output-file", required=True, help="Path to write the resolved content")
    args = parser.parse_args(argv)

    token = os.environ.get("GH_TOKEN", "")
    if not token:
        print("::error::GH_TOKEN environment variable is required", file=sys.stderr)
        sys.exit(1)

    file_path = args.file
    try:
        file_content = Path(file_path).read_text(encoding="utf-8", errors="replace")
    except OSError as exc:
        print(f"::error::Cannot read {file_path}: {exc}", file=sys.stderr)
        sys.exit(1)

    resolved = resolve_file(file_content, file_path, token)

    if resolved:
        Path(args.output_file).write_text(resolved, encoding="utf-8")
    else:
        sys.exit(1)


if __name__ == "__main__":
    main()
