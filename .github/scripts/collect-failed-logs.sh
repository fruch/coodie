#!/usr/bin/env bash
# collect-failed-logs.sh — Collect logs and links from all failed jobs in a workflow run.
#
# Usage:
#   REPO="owner/repo" RUN_ID="123456" source collect-failed-logs.sh
#   echo "$FAILED_LOGS"   # log text for AI summarisation
#   echo "$FAILED_LINKS"  # markdown links for PR comment
#
# Inputs (env vars):
#   REPO      — GitHub repository (owner/repo)
#   RUN_ID    — Workflow run ID
#   GH_TOKEN  — GitHub token (used by gh CLI)
#
# Outputs (env vars):
#   FAILED_LOGS  — collected log text (for AI summarisation only, not posted to PR)
#   FAILED_LINKS — markdown bullet list of deep-links into the failing jobs/steps

set -euo pipefail

FAILED_LOGS=""
FAILED_LINKS=""

# Fetch job list once to avoid repeated API calls
jobs_response=$(gh api "repos/${REPO}/actions/runs/${RUN_ID}/jobs")

for job_id in $(echo "${jobs_response}" | jq -r '.jobs[] | select(.conclusion == "failure") | .id'); do
  job_name=$(echo "${jobs_response}" | jq -r ".jobs[] | select(.id == ${job_id}) | .name")
  job_url=$(echo "${jobs_response}"  | jq -r ".jobs[] | select(.id == ${job_id}) | .html_url")

  # Identify the first failed step (number and name) from the API
  failed_step_number=$(echo "${jobs_response}" | \
    jq -r ".jobs[] | select(.id == ${job_id}) | .steps[] | select(.conclusion == \"failure\") | .number" | \
    head -1)
  failed_step_name=$(echo "${jobs_response}" | \
    jq -r ".jobs[] | select(.id == ${job_id}) | .steps[] | select(.conclusion == \"failure\") | .name" | \
    head -1)

  # Download the full job log to a temp file (reused for both AI summary and line detection)
  job_log_file="/tmp/job_${job_id}.log"
  gh api "repos/${REPO}/actions/jobs/${job_id}/logs" > "${job_log_file}" 2>/dev/null || true

  # Extract the most relevant failure snippet for the AI summariser.
  # Uses extract_log_snippet.py (smart marker-based extraction) with a
  # fallback to plain tail when the helper is unavailable.
  snippet_script="$(dirname "${BASH_SOURCE[0]}")/extract_log_snippet.py"
  if [ -f "${snippet_script}" ]; then
    logs=$(python3 "${snippet_script}" --log-file "${job_log_file}" --max-lines 120 --context 30)
  else
    logs=$(tail -100 "${job_log_file}")
  fi
  FAILED_LOGS="${FAILED_LOGS}
### Job: ${job_name}
\`\`\`
${logs}
\`\`\`
"

  # Build a deep-link to the exact failing line when possible
  if [ -n "${failed_step_number}" ] && [ "${failed_step_number}" != "null" ]; then
    error_line=$(python3 "$(dirname "${BASH_SOURCE[0]}")/find-error-line.py" \
      --log-file "${job_log_file}" \
      --step-number "${failed_step_number}" 2>/dev/null || echo "1")
    # Ensure we got a valid number; fall back to 1
    if ! echo "${error_line}" | grep -qE '^[1-9][0-9]*$'; then
      error_line=1
    fi
    deep_link="${job_url}#step:${failed_step_number}:L${error_line}"
    FAILED_LINKS="${FAILED_LINKS}
- **${job_name}** → step \"${failed_step_name}\": [view in Actions](${deep_link})"
  else
    FAILED_LINKS="${FAILED_LINKS}
- **${job_name}**: [view in Actions](${job_url})"
  fi

  rm -f "${job_log_file}"
done

export FAILED_LOGS
export FAILED_LINKS
