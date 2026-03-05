#!/usr/bin/env python3
"""Find the 1-based line number of the first error within a step in a GitHub Actions job log.

GitHub Actions job logs contain all steps concatenated, with each step delimited by
``##[group]`` / ``##[endgroup]`` markers.  The deep-link anchor
``#step:{N}:L{line}`` refers to the Nth group section and the Lth line *within* that
section (not counting the ``##[group]`` header line itself).

Usage:
    python3 find-error-line.py --log-file /tmp/job.log --step-number 3

Exits 0 and prints the line number.  On any error it prints ``1`` (fall-back to the
start of the step) so that callers can always use the result safely.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

TIMESTAMP_RE = re.compile(r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z ")
# Match GitHub Actions error annotation OR any line that contains the word "error"
# (case-insensitive, as a whole word to avoid false positives like "stderr").
ERROR_RE = re.compile(r"##\[error\]|\berror\b", re.IGNORECASE)


def find_error_line(log_text: str, step_number: int) -> int:
    """Return the 1-based line number within *step_number* where the first error occurs.

    Falls back to ``1`` if the step cannot be located or no error line is found.
    """
    lines = log_text.splitlines()
    group_count = 0
    step_start = -1
    step_end = len(lines)

    for i, line in enumerate(lines):
        content = TIMESTAMP_RE.sub("", line)
        if "##[group]" in content:
            group_count += 1
            if group_count == step_number:
                step_start = i + 1  # first content line after the ##[group] header
        elif "##[endgroup]" in content and group_count == step_number and step_start >= 0:
            step_end = i
            break

    if step_start < 0:
        return 1

    for idx, line in enumerate(lines[step_start:step_end], start=1):
        content = TIMESTAMP_RE.sub("", line)
        if ERROR_RE.search(content):
            return idx

    return 1


def main(argv: list[str] | None = None) -> None:
    parser = argparse.ArgumentParser(description="Find error line in a GitHub Actions job log step.")
    parser.add_argument("--log-file", required=True, help="Path to the job log file")
    parser.add_argument("--step-number", required=True, type=int, help="Step number (1-based)")
    args = parser.parse_args(argv)

    try:
        log_text = Path(args.log_file).read_text(encoding="utf-8", errors="replace")
        print(find_error_line(log_text, args.step_number))
    except Exception as exc:  # noqa: BLE001
        print(f"::warning::find-error-line failed: {exc}", file=sys.stderr)
        print(1)


if __name__ == "__main__":
    main()
