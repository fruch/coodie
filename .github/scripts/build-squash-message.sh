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
#   MESSAGE        — final commit message (env var)
#   MESSAGE_SOURCE — "copilot" | "pr-body" | "title-only" (env var)

set -euo pipefail

_log() { echo "[build-squash-message] $*" >&2; }

# Read Copilot output from file (Copilot writes here directly via its
# file-writing tool; stdout is discarded, so agent noise never reaches
# this file).
BODY=""
if [ -z "${COPILOT_OUTPUT_FILE:-}" ]; then
  _log "COPILOT_OUTPUT_FILE is not set"
elif [ ! -f "$COPILOT_OUTPUT_FILE" ]; then
  _log "COPILOT_OUTPUT_FILE='$COPILOT_OUTPUT_FILE' does not exist"
elif [ ! -s "$COPILOT_OUTPUT_FILE" ]; then
  _log "COPILOT_OUTPUT_FILE='$COPILOT_OUTPUT_FILE' exists but is empty (0 bytes)"
else
  BODY=$(cat "$COPILOT_OUTPUT_FILE")
  _log "Read ${#BODY} bytes from COPILOT_OUTPUT_FILE='$COPILOT_OUTPUT_FILE'"
fi

# Safety net: strip fenced code blocks (``` ... ```) — Copilot may still
# wrap its response even when writing to a file.
if [ -n "$BODY" ] && echo "$BODY" | grep -q '^```'; then
  BODY=$(echo "$BODY" | awk '/^```/{if(f){exit}else{f=1;next}} f{print}')
  _log "Stripped fenced code block from Copilot output"
fi

# Trim leading blank lines
if [ -n "$BODY" ]; then
  BODY=$(echo "$BODY" | sed '/[^[:space:]]/,$!d')
fi

# Reject output that looks like error messages rather than real content
if [ -n "$BODY" ] && echo "$BODY" | grep -qiE '(error:|unknown option|--help|installed successfully)'; then
  _log "Rejected Copilot output — matched error pattern: $(echo "$BODY" | head -1)"
  BODY=""
fi

# Fallback: use PR body as description
if [ -z "$BODY" ]; then
  if [ -n "${PR_BODY:-}" ]; then
    _log "Copilot produced no usable output; falling back to PR body"
    BODY="${PR_BODY}"
    MESSAGE_SOURCE="pr-body"
  else
    _log "Copilot produced no usable output and PR body is empty; using title only"
    MESSAGE_SOURCE="title-only"
  fi
else
  MESSAGE_SOURCE="copilot"
  _log "Using Copilot-generated commit body (${#BODY} bytes)"
fi

# Build full commit message: subject + optional body
if [ -n "$BODY" ]; then
  MESSAGE=$(printf '%s\n\n%s' "$TITLE" "$BODY")
else
  MESSAGE="$TITLE"
fi

_log "MESSAGE_SOURCE=$MESSAGE_SOURCE"
export MESSAGE MESSAGE_SOURCE
