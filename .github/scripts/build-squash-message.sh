#!/usr/bin/env bash
# build-squash-message.sh — Build a squash commit message from Copilot CLI
# file output, falling back to the PR body, then to title-only.
#
# Usage:
#   TITLE="feat: add feature" COPILOT_OUTPUT_FILE="/tmp/copilot.txt" PR_BODY="<pr body>" \
#     source build-squash-message.sh
#   echo "$MESSAGE"
#
# Inputs (env vars):
#   TITLE              — PR title (subject line)
#   COPILOT_OUTPUT_FILE — path to file containing Copilot CLI output
#   PR_BODY            — PR body text (fallback if Copilot fails)
#
# Outputs:
#   MESSAGE   — final commit message (env var)

set -euo pipefail

# Read Copilot output from file (never from a shell variable, so stray CLI
# output cannot leak into the commit message).
BODY=""
if [ -n "${COPILOT_OUTPUT_FILE:-}" ] && [ -f "$COPILOT_OUTPUT_FILE" ]; then
  BODY=$(cat "$COPILOT_OUTPUT_FILE")
fi

# Clean copilot output: if the response is wrapped in a fenced code
# block (```...```) with tool-call / reasoning preamble before it,
# extract only the content between the first pair of ``` markers.
if [ -n "$BODY" ] && echo "$BODY" | grep -q '^```'; then
  BODY=$(echo "$BODY" | awk '/^```/{if(f){exit}else{f=1;next}} f{print}')
fi

# Strip any remaining copilot agent step-output lines
# (● action headers, $ shell commands, └ result summaries,
#  ✗/✓ check markers and their indented detail lines)
if [ -n "$BODY" ]; then
  BODY=$(echo "$BODY" | grep -vE '^\s*(●|└|\$ |✗ |✓ )') || true
fi

# Strip lines that are clearly shell artifacts or Copilot CLI noise
# (redirections like 2>/dev/null, standalone pipes like | head -5,
#  permission errors from the agent)
if [ -n "$BODY" ]; then
  BODY=$(echo "$BODY" | grep -vE '(^\s*[0-9]*>/dev/null|^\s*\|\s*(head|tail|wc|grep|sed|awk|sort|cat|cut|tr|tee|xargs|less|more|uniq)\b|Permission denied|could not request permission)') || true
fi

# Trim leading blank lines left after filtering
if [ -n "$BODY" ]; then
  BODY=$(echo "$BODY" | sed '/[^[:space:]]/,$!d')
fi

# Reject output that looks like error messages rather than real content
if [ -n "$BODY" ] && echo "$BODY" | grep -qiE '(error:|unknown option|--help|installed successfully)'; then
  BODY=""
fi

# Fallback: use PR body as description
if [ -z "$BODY" ]; then
  BODY="${PR_BODY:-}"
fi

# Build full commit message: subject + optional body
if [ -n "$BODY" ]; then
  MESSAGE=$(printf '%s\n\n%s' "$TITLE" "$BODY")
else
  MESSAGE="$TITLE"
fi

export MESSAGE
