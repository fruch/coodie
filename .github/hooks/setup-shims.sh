#!/usr/bin/env bash
set -euo pipefail

# Prepend the shims directory to PATH so that bare python/pip/pipx/uv-pip
# invocations are intercepted with uv suggestions.
#
# Supported environments:
#   - Claude Code (SessionStart hook): uses CLAUDE_ENV_FILE
#   - GitHub Actions / Copilot coding agent: uses GITHUB_PATH
#
# Exits cleanly (no-op) in any other environment.
#
# `uv run` is unaffected because it prepends its managed virtualenv's
# bin/ to PATH, shadowing the shims.

# Guard: only activate when uv is available
command -v uv &>/dev/null || exit 0

shims_dir="$(cd "$(dirname "$0")/shims" && pwd)" || {
  echo "modern-python: shims directory not found" >&2
  exit 1
}

# GitHub Actions / Copilot coding agent: prepend to PATH via $GITHUB_PATH
if [[ -n "${GITHUB_PATH:-}" ]]; then
  echo "${shims_dir}" >>"$GITHUB_PATH"
  exit 0
fi

# Claude Code SessionStart hook: export PATH via $CLAUDE_ENV_FILE
if [[ -n "${CLAUDE_ENV_FILE:-}" ]]; then
  echo "export PATH=\"${shims_dir}:\${PATH}\"" >>"$CLAUDE_ENV_FILE"
  exit 0
fi

echo "modern-python: neither GITHUB_PATH nor CLAUDE_ENV_FILE set; shims will not be installed" >&2
exit 0
