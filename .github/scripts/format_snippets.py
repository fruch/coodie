#!/usr/bin/env python3
"""Format failure snippets from inspect_pr_checks.py JSON output as Markdown.

Usage:
    python3 format_snippets.py /tmp/inspect_checks.json

Prints collapsible Markdown ``<details>`` blocks for each check that has a
``logSnippet``.  Output is empty when no snippets are available.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path


def format_snippets(json_path: str, max_lines: int = 60) -> str:
    """Return Markdown-formatted failure snippets from *json_path*."""
    try:
        data = json.loads(Path(json_path).read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError):
        return ""

    parts: list[str] = []
    for result in data.get("results", []):
        snippet = result.get("logSnippet", "")
        if not snippet:
            continue
        name = result.get("name", "unknown")
        lines = snippet.splitlines()[-max_lines:]
        parts.append(f"<details><summary>Log snippet: {name}</summary>\n")
        parts.append("```")
        parts.extend(lines)
        parts.append("```")
        parts.append("</details>\n")

    return "\n".join(parts)


def main() -> None:
    if len(sys.argv) < 2:
        print(f"Usage: {sys.argv[0]} <json-file>", file=sys.stderr)
        sys.exit(1)
    output = format_snippets(sys.argv[1])
    if output:
        print(output)


if __name__ == "__main__":
    main()
