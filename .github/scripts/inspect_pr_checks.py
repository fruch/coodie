#!/usr/bin/env python3
"""Inspect failing GitHub PR checks, fetch logs, and extract failure snippets.

A standalone diagnostic tool for investigating CI failures — can be run locally
by developers or by Copilot when triaging ``@copilot`` mentions posted by the
Self-Healing CI workflow.

Adapted from the OpenAI ``gh-fix-ci`` skill
(https://github.com/openai/skills/tree/main/skills/.curated/gh-fix-ci).

Prerequisites:
    gh auth login   (repo + workflow scopes)

Usage:
    python3 inspect_pr_checks.py                        # current branch PR
    python3 inspect_pr_checks.py --pr 123               # specific PR
    python3 inspect_pr_checks.py --pr 123 --json        # machine-readable
    python3 inspect_pr_checks.py --max-lines 200 --context 40
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path
from shutil import which
from typing import Any, Sequence

# Re-use the snippet extraction logic from the sibling script.
try:
    from extract_log_snippet import (
        DEFAULT_CONTEXT_LINES,
        DEFAULT_MAX_LINES,
        extract_failure_snippet,
    )
except ImportError:
    # Fallback when run from a directory without the sibling on sys.path.
    _script_dir = Path(__file__).resolve().parent
    sys.path.insert(0, str(_script_dir))
    from extract_log_snippet import (  # type: ignore[no-redef]
        DEFAULT_CONTEXT_LINES,
        DEFAULT_MAX_LINES,
        extract_failure_snippet,
    )

FAILURE_CONCLUSIONS = {"failure", "cancelled", "timed_out", "action_required"}
FAILURE_STATES = {"failure", "error", "cancelled", "timed_out", "action_required"}
FAILURE_BUCKETS = {"fail"}

PENDING_LOG_MARKERS = (
    "still in progress",
    "log will be available when it is complete",
)


# ----------------------------------------------------------------- helpers --


class GhResult:
    """Thin wrapper around a ``subprocess.run`` result."""

    __slots__ = ("returncode", "stdout", "stderr")

    def __init__(self, returncode: int, stdout: str, stderr: str) -> None:
        self.returncode = returncode
        self.stdout = stdout
        self.stderr = stderr


def _run_gh(args: Sequence[str], cwd: Path) -> GhResult:
    proc = subprocess.run(["gh", *args], cwd=cwd, text=True, capture_output=True)
    return GhResult(proc.returncode, proc.stdout, proc.stderr)


def _run_gh_raw(args: Sequence[str], cwd: Path) -> tuple[int, bytes, str]:
    proc = subprocess.run(["gh", *args], cwd=cwd, capture_output=True)
    return proc.returncode, proc.stdout, proc.stderr.decode(errors="replace")


def _normalize(value: Any) -> str:
    return str(value).strip().lower() if value is not None else ""


def _is_log_pending(message: str) -> bool:
    low = message.lower()
    return any(m in low for m in PENDING_LOG_MARKERS)


# --------------------------------------------------------------- git root --


def find_git_root(start: Path) -> Path | None:
    proc = subprocess.run(
        ["git", "rev-parse", "--show-toplevel"],
        cwd=start,
        text=True,
        capture_output=True,
    )
    return Path(proc.stdout.strip()) if proc.returncode == 0 else None


# ----------------------------------------------------------- gh utilities --


def ensure_gh(repo_root: Path) -> bool:
    if which("gh") is None:
        print("Error: `gh` CLI is not installed or not on PATH.", file=sys.stderr)
        return False
    res = _run_gh(["auth", "status"], cwd=repo_root)
    if res.returncode == 0:
        return True
    print((res.stderr or res.stdout or "Error: gh not authenticated.").strip(), file=sys.stderr)
    return False


def resolve_pr(pr_value: str | None, repo_root: Path) -> str | None:
    if pr_value:
        return pr_value
    res = _run_gh(["pr", "view", "--json", "number"], cwd=repo_root)
    if res.returncode != 0:
        print((res.stderr or res.stdout or "Error: unable to resolve PR.").strip(), file=sys.stderr)
        return None
    try:
        return str(json.loads(res.stdout or "{}").get("number", ""))
    except (json.JSONDecodeError, AttributeError):
        print("Error: unable to parse PR JSON.", file=sys.stderr)
        return None


# ----------------------------------------------------- check inspection --


def _parse_available_fields(message: str) -> list[str]:
    """Parse the ``Available fields:`` hint from a ``gh pr checks`` error."""
    fields: list[str] = []
    collecting = False
    for line in message.splitlines():
        if "Available fields:" in line:
            collecting = True
            continue
        if not collecting:
            continue
        field = line.strip()
        if field:
            fields.append(field)
    return fields


def fetch_checks(pr_value: str, repo_root: Path) -> list[dict[str, Any]] | None:
    primary = ["name", "state", "conclusion", "detailsUrl", "startedAt", "completedAt"]
    res = _run_gh(["pr", "checks", pr_value, "--json", ",".join(primary)], cwd=repo_root)
    if res.returncode != 0:
        msg = "\n".join(filter(None, [res.stderr, res.stdout])).strip()
        available = _parse_available_fields(msg)
        if available:
            fallback = ["name", "state", "bucket", "link", "startedAt", "completedAt", "workflow"]
            selected = [f for f in fallback if f in available]
            if not selected:
                print("Error: no usable fields for gh pr checks.", file=sys.stderr)
                return None
            res = _run_gh(["pr", "checks", pr_value, "--json", ",".join(selected)], cwd=repo_root)
            if res.returncode != 0:
                print((res.stderr or res.stdout or "Error: gh pr checks failed.").strip(), file=sys.stderr)
                return None
        else:
            print(msg or "Error: gh pr checks failed.", file=sys.stderr)
            return None
    try:
        data = json.loads(res.stdout or "[]")
    except json.JSONDecodeError:
        print("Error: unable to parse checks JSON.", file=sys.stderr)
        return None
    return data if isinstance(data, list) else None


def is_failing(check: dict[str, Any]) -> bool:
    conclusion = _normalize(check.get("conclusion"))
    if conclusion in FAILURE_CONCLUSIONS:
        return True
    state = _normalize(check.get("state") or check.get("status"))
    if state in FAILURE_STATES:
        return True
    bucket = _normalize(check.get("bucket"))
    return bucket in FAILURE_BUCKETS


# ---------------------------------------------------------- run metadata --


def _extract_run_id(url: str) -> str | None:
    for pat in (r"/actions/runs/(\d+)", r"/runs/(\d+)"):
        m = re.search(pat, url)
        if m:
            return m.group(1)
    return None


def _extract_job_id(url: str) -> str | None:
    m = re.search(r"/actions/runs/\d+/job/(\d+)", url)
    if m:
        return m.group(1)
    m = re.search(r"/job/(\d+)", url)
    return m.group(1) if m else None


def fetch_run_metadata(run_id: str, repo_root: Path) -> dict[str, Any] | None:
    fields = ["conclusion", "status", "workflowName", "name", "event", "headBranch", "headSha", "url"]
    res = _run_gh(["run", "view", run_id, "--json", ",".join(fields)], cwd=repo_root)
    if res.returncode != 0:
        return None
    try:
        data = json.loads(res.stdout or "{}")
    except json.JSONDecodeError:
        return None
    return data if isinstance(data, dict) else None


# --------------------------------------------------------------- log I/O --


def _fetch_run_log(run_id: str, repo_root: Path) -> tuple[str, str]:
    res = _run_gh(["run", "view", run_id, "--log"], cwd=repo_root)
    if res.returncode != 0:
        return "", (res.stderr or res.stdout or "gh run view failed").strip()
    return res.stdout, ""


def _fetch_job_log(job_id: str, repo_root: Path) -> tuple[str, str]:
    slug = _fetch_repo_slug(repo_root)
    if not slug:
        return "", "Unable to resolve repository name for job logs."
    rc, out, err = _run_gh_raw(["api", f"/repos/{slug}/actions/jobs/{job_id}/logs"], cwd=repo_root)
    if rc != 0:
        return "", (err or out.decode(errors="replace") or "gh api job logs failed").strip()
    if out.startswith(b"PK"):
        return "", "Job logs returned a zip archive; unable to parse."
    return out.decode(errors="replace"), ""


def _fetch_repo_slug(repo_root: Path) -> str | None:
    res = _run_gh(["repo", "view", "--json", "nameWithOwner"], cwd=repo_root)
    if res.returncode != 0:
        return None
    try:
        return json.loads(res.stdout or "{}").get("nameWithOwner")
    except (json.JSONDecodeError, AttributeError):
        return None


def fetch_check_log(
    run_id: str,
    job_id: str | None,
    repo_root: Path,
) -> tuple[str, str, str]:
    """Return ``(log_text, error_message, status)`` for a single check."""
    log_text, err = _fetch_run_log(run_id, repo_root)
    if not err:
        return log_text, "", "ok"

    if _is_log_pending(err) and job_id:
        jlog, jerr = _fetch_job_log(job_id, repo_root)
        if jlog:
            return jlog, "", "ok"
        if jerr and _is_log_pending(jerr):
            return "", jerr, "pending"
        if jerr:
            return "", jerr, "error"
        return "", err, "pending"

    return "", err, "pending" if _is_log_pending(err) else "error"


# -------------------------------------------------------------- analysis --


def analyze_check(
    check: dict[str, Any],
    repo_root: Path,
    max_lines: int,
    context: int,
) -> dict[str, Any]:
    url = check.get("detailsUrl") or check.get("link") or ""
    run_id = _extract_run_id(url)
    job_id = _extract_job_id(url)
    base: dict[str, Any] = {
        "name": check.get("name", ""),
        "detailsUrl": url,
        "runId": run_id,
        "jobId": job_id,
    }

    if run_id is None:
        base["status"] = "external"
        base["note"] = "Not a GitHub Actions run — only the URL is available."
        return base

    metadata = fetch_run_metadata(run_id, repo_root)
    log_text, log_error, log_status = fetch_check_log(run_id, job_id, repo_root)

    if log_status == "pending":
        base["status"] = "log_pending"
        base["note"] = log_error or "Logs are not available yet."
        if metadata:
            base["run"] = metadata
        return base

    if log_error:
        base["status"] = "log_unavailable"
        base["error"] = log_error
        if metadata:
            base["run"] = metadata
        return base

    snippet = extract_failure_snippet(log_text, max_lines=max_lines, context=context)
    base["status"] = "ok"
    base["run"] = metadata or {}
    base["logSnippet"] = snippet
    return base


# ---------------------------------------------------------------- render --


def render_results(pr_number: str, results: list[dict[str, Any]]) -> None:
    print(f"PR #{pr_number}: {len(results)} failing check(s) analyzed.\n")
    for res in results:
        print("-" * 60)
        print(f"Check : {res.get('name', '')}")
        if res.get("detailsUrl"):
            print(f"URL   : {res['detailsUrl']}")
        if res.get("runId"):
            print(f"Run ID: {res['runId']}")

        run = res.get("run", {})
        if run:
            wf = run.get("workflowName") or run.get("name") or ""
            conclusion = run.get("conclusion") or run.get("status") or ""
            branch = run.get("headBranch", "")
            sha = (run.get("headSha") or "")[:12]
            print(f"Workflow: {wf} ({conclusion})")
            if branch or sha:
                print(f"Branch  : {branch}  SHA: {sha}")

        status = res.get("status", "unknown")
        print(f"Status : {status}")

        if res.get("note"):
            print(f"Note   : {res['note']}")
        if res.get("error"):
            print(f"Error  : {res['error']}")

        snippet = res.get("logSnippet")
        if snippet:
            print("\nFailure snippet:")
            for line in snippet.splitlines():
                print(f"  {line}")
        print()
    print("-" * 60)


# ------------------------------------------------------------------ main --


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Inspect failing GitHub PR checks and extract failure snippets.",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument("--repo", default=".", help="Path inside the target Git repository.")
    parser.add_argument("--pr", default=None, help="PR number or URL (defaults to current branch PR).")
    parser.add_argument("--max-lines", type=int, default=DEFAULT_MAX_LINES)
    parser.add_argument("--context", type=int, default=DEFAULT_CONTEXT_LINES)
    parser.add_argument("--json", action="store_true", help="Emit JSON instead of human-readable text.")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    repo_root = find_git_root(Path(args.repo))
    if repo_root is None:
        print("Error: not inside a Git repository.", file=sys.stderr)
        return 1

    if not ensure_gh(repo_root):
        return 1

    pr_value = resolve_pr(args.pr, repo_root)
    if not pr_value:
        return 1

    checks = fetch_checks(pr_value, repo_root)
    if checks is None:
        return 1

    failing = [c for c in checks if is_failing(c)]
    if not failing:
        print(f"PR #{pr_value}: no failing checks detected.")
        return 0

    results = []
    for check in failing:
        results.append(
            analyze_check(
                check,
                repo_root=repo_root,
                max_lines=max(1, args.max_lines),
                context=max(1, args.context),
            )
        )

    if args.json:
        print(json.dumps({"pr": pr_value, "results": results}, indent=2))
    else:
        render_results(pr_value, results)

    # Exit non-zero when failures remain (useful in automation).
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
