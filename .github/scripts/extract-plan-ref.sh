#!/usr/bin/env bash
# extract-plan-ref.sh — Extract plan file path and phase number from
# PR body and/or branch name, merge with changed-files plan list.
#
# Usage:
#   PR_BODY="Plan: docs/plans/udt-support.md\nPhase: 2" \
#   PR_BRANCH="plan/udt-support/phase-2" \
#   CHANGED_PLANS="docs/plans/udt-support.md" \
#     source extract-plan-ref.sh
#
# Inputs (env vars):
#   PR_BODY       — PR body text
#   PR_BRANCH     — PR head branch name
#   CHANGED_PLANS — newline-separated list of plan files from changed files
#
# Outputs (env vars):
#   PLAN_FILE  — primary plan file path (from PR body or branch name)
#   PHASE      — completed phase number/letter (or empty)
#   ALL_PLANS  — deduplicated, sorted list of all plan files
#   HAS_PLAN   — "true" if any plan files found, "false" otherwise

set -euo pipefail

# Try PR body first: "Plan: docs/plans/<name>.md" (case-insensitive)
PLAN_FILE=$(echo "${PR_BODY:-}" \
  | grep -ioP '(?<=Plan:\s)docs/plans/[a-z0-9._-]+\.md' | head -1 || true)

# Fallback: branch name "plan/<name>/phase-N"
if [ -z "$PLAN_FILE" ]; then
  PLAN_NAME=$(echo "${PR_BRANCH:-}" \
    | grep -oP '(?<=^plan/)[a-z0-9-]+(?=/phase-)' || true)
  if [ -n "$PLAN_NAME" ]; then
    PLAN_FILE="docs/plans/${PLAN_NAME}.md"
  fi
fi

# Extract completed phase number if present in PR body or branch name
PHASE=$(echo "${PR_BODY:-}" | grep -ioP '(?<=Phase:\s)(\d+|[A-Za-z])' | head -1 || true)
if [ -z "$PHASE" ]; then
  PHASE=$(echo "${PR_BRANCH:-}" | grep -oP '(?<=phase-)(\d+|[A-Za-z])' || true)
fi

# Merge: combine PR body/branch plan with changed-files plans,
# deduplicate, and remove empty lines
ALL_PLANS=$(printf '%s\n%s\n' "$PLAN_FILE" "${CHANGED_PLANS:-}" \
  | grep -v '^$' | sort -u || true)

HAS_PLAN=$( [ -n "$ALL_PLANS" ] && echo true || echo false )

export PLAN_FILE
export PHASE
export ALL_PLANS
export HAS_PLAN
