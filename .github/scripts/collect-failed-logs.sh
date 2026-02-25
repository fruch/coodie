#!/usr/bin/env bash
# collect-failed-logs.sh — Collect logs from all failed jobs in a workflow run.
#
# Usage:
#   REPO="owner/repo" RUN_ID="123456" source collect-failed-logs.sh
#   echo "$FAILED_LOGS"
#
# Inputs (env vars):
#   REPO      — GitHub repository (owner/repo)
#   RUN_ID    — Workflow run ID
#   GH_TOKEN  — GitHub token (used by gh CLI)
#
# Outputs:
#   FAILED_LOGS — collected log text (env var)

set -euo pipefail

FAILED_LOGS=""

for job_id in $(gh api "repos/${REPO}/actions/runs/${RUN_ID}/jobs" \
  --jq '.jobs[] | select(.conclusion == "failure") | .id'); do
  job_name=$(gh api "repos/${REPO}/actions/runs/${RUN_ID}/jobs" \
    --jq ".jobs[] | select(.id == ${job_id}) | .name")
  logs=$(gh api "repos/${REPO}/actions/jobs/${job_id}/logs" 2>&1 | tail -100)
  FAILED_LOGS="${FAILED_LOGS}
### Job: ${job_name}
\`\`\`
${logs}
\`\`\`
"
done

export FAILED_LOGS
