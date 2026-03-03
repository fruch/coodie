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

# Read Copilot output from file (Copilot writes here directly via its
# file-writing tool; stdout is discarded, so agent noise never reaches
# this file).
BODY=""
if [ -n "${COPILOT_OUTPUT_FILE:-}" ] && [ -f "$COPILOT_OUTPUT_FILE" ]; then
  BODY=$(cat "$COPILOT_OUTPUT_FILE")
fi

# Safety net: strip fenced code blocks (``` ... ```) — Copilot may still
# wrap its response even when writing to a file.
if [ -n "$BODY" ] && echo "$BODY" | grep -q '^```'; then
  BODY=$(echo "$BODY" | awk '/^```/{if(f){exit}else{f=1;next}} f{print}')
fi

# Trim leading blank lines
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
