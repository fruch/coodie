#!/usr/bin/env bash
# build-delegation-prompt.sh — Build a Copilot delegation prompt from
# plan file, phase number, title, and phase content.
#
# Usage:
#   PLAN_FILE="docs/plans/udt-support.md" \
#   PHASE="3" \
#   TITLE="Core Framework" \
#   PHASE_CONTENT="$(cat /tmp/next-phase-content.md)" \
#     source build-delegation-prompt.sh
#   echo "$PROMPT"
#
# Inputs (env vars):
#   PLAN_FILE      — path to the plan file
#   PHASE          — phase number/letter to delegate
#   TITLE          — phase title
#   PHASE_CONTENT  — full content of the phase section
#
# Outputs (env vars):
#   PROMPT  — the constructed delegation prompt string

set -euo pipefail

PROMPT="Continue to phase ${PHASE:-} of plan ${PLAN_FILE:-}.
Phase title: ${TITLE:-}.

## Tasks

${PHASE_CONTENT:-}

---
Read the full plan at ${PLAN_FILE:-} for context.
Implement all tasks listed above for Phase ${PHASE:-}."

export PROMPT
