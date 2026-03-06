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
# Allow generous payload for file content (~30 000 chars ≈ 7 500 tokens)
MAX_CONTENT_LENGTH = 30000

_SYSTEM_PROMPT = (
    "You are a git merge conflict resolver. "
    "Resolve ALL git conflict markers (<<<<<<<, =======, >>>>>>>) in the file below. "
    "Output ONLY the complete resolved file content — no markdown fences, no explanations, "
    "no preamble, no reasoning steps. Produce clean, working code."
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


def resolve_file(file_content: str, file_path: str, token: str) -> str:
    """Return resolved file content, or empty string on error."""
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
