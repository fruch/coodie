#!/usr/bin/env python3
"""Extract the most relevant failure snippet from a GitHub Actions job log.

Searches for well-known failure markers (error, traceback, assert, panic, …)
and returns a window of context lines around the *last* match — which is
typically the root cause rather than cascading noise.  Falls back to the tail
of the log when no marker is found.

Ideas adapted from the OpenAI ``gh-fix-ci`` skill
(https://github.com/openai/skills/tree/main/skills/.curated/gh-fix-ci).

Usage (standalone):
    python3 extract_log_snippet.py --log-file /tmp/job.log
    python3 extract_log_snippet.py --log-file /tmp/job.log --max-lines 200 --context 40

Usage (as a library):
    from extract_log_snippet import extract_failure_snippet
    snippet = extract_failure_snippet(log_text)
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path
from typing import Sequence

# Markers that indicate a failure in CI logs.  Searched case-insensitively.
# The list intentionally casts a wide net — it is better to include a few
# irrelevant lines than to miss the actual root cause.
FAILURE_MARKERS: tuple[str, ...] = (
    "error",
    "fail",
    "failed",
    "traceback",
    "exception",
    "assert",
    "panic",
    "fatal",
    "timeout",
    "segmentation fault",
    "##[error]",
)

DEFAULT_MAX_LINES = 160
DEFAULT_CONTEXT_LINES = 30


def find_failure_index(lines: Sequence[str]) -> int | None:
    """Return the index of the *last* line containing a failure marker.

    Searching from the end biases toward the root-cause error rather than
    earlier cascading failures.  Returns ``None`` when no marker is found.
    """
    for idx in range(len(lines) - 1, -1, -1):
        lowered = lines[idx].lower()
        if any(marker in lowered for marker in FAILURE_MARKERS):
            return idx
    return None


def extract_failure_snippet(
    log_text: str,
    *,
    max_lines: int = DEFAULT_MAX_LINES,
    context: int = DEFAULT_CONTEXT_LINES,
) -> str:
    """Return the most relevant failure snippet from *log_text*.

    When a failure marker is detected the snippet centres a window of
    ``2 × context`` lines around it.  If the window exceeds *max_lines*
    the tail of the window is returned.

    When no marker is found the last *max_lines* of the log are returned
    (equivalent to ``tail -<max_lines>``).
    """
    lines = log_text.splitlines()
    if not lines:
        return ""

    marker_index = find_failure_index(lines)
    if marker_index is None:
        # No marker → fall back to tail
        return "\n".join(lines[-max_lines:])

    start = max(0, marker_index - context)
    end = min(len(lines), marker_index + context + 1)
    window = lines[start:end]
    if len(window) > max_lines:
        window = window[-max_lines:]
    return "\n".join(window)


# ---------------------------------------------------------------------- CLI --


def main(argv: list[str] | None = None) -> None:
    parser = argparse.ArgumentParser(
        description="Extract the most relevant failure snippet from a GitHub Actions job log.",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument("--log-file", required=True, help="Path to the job log file")
    parser.add_argument(
        "--max-lines",
        type=int,
        default=DEFAULT_MAX_LINES,
        help="Maximum number of lines to return",
    )
    parser.add_argument(
        "--context",
        type=int,
        default=DEFAULT_CONTEXT_LINES,
        help="Lines of context before/after the failure marker",
    )
    args = parser.parse_args(argv)

    try:
        log_text = Path(args.log_file).read_text(encoding="utf-8", errors="replace")
    except FileNotFoundError:
        print(f"Error: file not found: {args.log_file}", file=sys.stderr)
        sys.exit(1)

    snippet = extract_failure_snippet(log_text, max_lines=args.max_lines, context=args.context)
    print(snippet)


if __name__ == "__main__":
    main()
