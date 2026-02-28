#!/usr/bin/env python3
# summarize-failure.py — Summarize CI failure logs using GitHub Models API.
#
# Usage:
#   GH_TOKEN=<token> python3 summarize-failure.py \
#       --logs-file /tmp/failed_logs.txt \
#       --output-file /tmp/copilot_summary.txt
#
# Inputs (env vars):
#   GH_TOKEN        — GitHub token (must have models:read permission)
#
# Inputs (arguments):
#   --logs-file     — Path to file containing the raw failure logs
#   --output-file   — Path to write the summary (default: stdout)
#
# Outputs:
#   Summary text written to --output-file (or printed to stdout)

from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.request
from pathlib import Path

MODELS_API_URL = "https://models.inference.ai.azure.com/chat/completions"
MODEL = "gpt-4o-mini"
# Truncate logs to stay within safe API payload limits (~12 000 chars ≈ 3 000 tokens)
MAX_LOG_LENGTH = 12000

_SYSTEM_PROMPT = (
    "You are a CI failure analyst. "
    "Analyze the provided GitHub Actions failure logs and produce a concise summary with:\n"
    "1. What failed (job/step name)\n"
    "2. The exact error message(s)\n"
    "3. The likely root cause\n"
    "4. A suggested fix\n"
    "Be brief and technical."
)


def build_payload(logs: str, model: str = MODEL) -> dict:
    """Build the chat-completions request payload for the given logs."""
    return {
        "model": model,
        "messages": [
            {"role": "system", "content": _SYSTEM_PROMPT},
            {"role": "user", "content": f"CI failure logs:\n\n{logs[:MAX_LOG_LENGTH]}"},
        ],
        "max_tokens": 800,
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


def summarize_logs(logs: str, token: str) -> str:
    """Return an AI summary of *logs*, or a fallback message on API error."""
    payload = build_payload(logs)
    try:
        return call_models_api(token, payload)
    except Exception as exc:
        print(f"::warning::Copilot summarization failed: {exc}", file=sys.stderr)
        return "_(Copilot summary unavailable due to API error — see workflow logs for details.)_"


def main(argv: list[str] | None = None) -> None:
    parser = argparse.ArgumentParser(description="Summarize CI failure logs using the GitHub Models API.")
    parser.add_argument("--logs-file", required=True, help="Path to the failure log file")
    parser.add_argument("--output-file", default=None, help="Path to write the summary (default: stdout)")
    args = parser.parse_args(argv)

    token = os.environ.get("GH_TOKEN", "")
    if not token:
        print("::error::GH_TOKEN environment variable is required", file=sys.stderr)
        sys.exit(1)
    logs = Path(args.logs_file).read_text(encoding="utf-8")
    summary = summarize_logs(logs, token)

    if args.output_file:
        Path(args.output_file).write_text(summary, encoding="utf-8")
    else:
        print(summary)


if __name__ == "__main__":
    main()
