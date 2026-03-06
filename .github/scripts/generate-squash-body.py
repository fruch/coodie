#!/usr/bin/env python3
# generate-squash-body.py — Generate a squash commit body using GitHub Models API.
#
# Replaces the Copilot CLI approach that was blocked by permission restrictions
# in the CI sandbox.  Uses the same GitHub Models API pattern as
# summarize-failure.py.
#
# Usage:
#   GH_TOKEN=<token> python3 generate-squash-body.py \
#       --log "commit log text" \
#       --stat "diff stat text" \
#       --output-file /tmp/squash_body.txt
#
# Inputs (env vars):
#   GH_TOKEN — GitHub token (must have models:read permission)
#
# Inputs (arguments):
#   --log         — Git log (oneline) of commits being squashed
#   --stat        — Git diff --stat output
#   --output-file — Path to write the generated body (default: stdout)
#
# Outputs:
#   Commit body text written to --output-file (or printed to stdout)

from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.request
from pathlib import Path

MODELS_API_URL = "https://models.inference.ai.azure.com/chat/completions"
MODEL = "gpt-4o-mini"

_SYSTEM_PROMPT = (
    "You are a git commit message writer. "
    "Given a list of commits and a diff stat, write ONLY a concise git commit body "
    "(no subject line). Plain text only — no markdown fences, no code blocks, no "
    "preamble, no reasoning steps. Summarise what changed and why."
)


def build_payload(log: str, stat: str, model: str = MODEL) -> dict:
    """Build the chat-completions request payload."""
    user_content = f"Commits:\n{log}\n\nDiff stat:\n{stat}"
    return {
        "model": model,
        "messages": [
            {"role": "system", "content": _SYSTEM_PROMPT},
            {"role": "user", "content": user_content},
        ],
        "max_tokens": 400,
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


def generate_body(log: str, stat: str, token: str) -> str:
    """Return an AI-generated commit body, or empty string on error."""
    payload = build_payload(log, stat)
    try:
        return call_models_api(token, payload)
    except Exception as exc:
        print(f"::warning::Squash body generation failed: {exc}", file=sys.stderr)
        return ""


def main(argv: list[str] | None = None) -> None:
    parser = argparse.ArgumentParser(description="Generate squash commit body using GitHub Models API.")
    parser.add_argument("--log", required=True, help="Git log (oneline) of commits being squashed")
    parser.add_argument("--stat", required=True, help="Git diff --stat output")
    parser.add_argument("--output-file", default=None, help="Path to write the body (default: stdout)")
    args = parser.parse_args(argv)

    token = os.environ.get("GH_TOKEN", "")
    if not token:
        print("::warning::GH_TOKEN not set — cannot generate squash body", file=sys.stderr)
        sys.exit(0)

    body = generate_body(args.log, args.stat, token)

    if args.output_file:
        Path(args.output_file).write_text(body, encoding="utf-8")
    else:
        print(body)


if __name__ == "__main__":
    main()
