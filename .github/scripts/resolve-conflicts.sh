#!/usr/bin/env bash
# resolve-conflicts.sh — Attempt to resolve git rebase merge conflicts using
# Copilot CLI.  Called by the "Resolve conflicts with Copilot CLI" step in
# .github/workflows/pr-rebase-squash.yml after a failed `git rebase`.
#
# Required environment variables (set by the calling workflow step):
#   GITHUB_OUTPUT       — path to GitHub Actions output file
#   GITHUB_STEP_SUMMARY — path to GitHub Actions step summary file
#
# Optional environment variables:
#   MAX_ROUNDS          — maximum rebase-continue cycles (default: 10)
#   COPILOT_TIMEOUT     — seconds to wait for a single Copilot CLI call (default: 120)
#
# Outputs written to GITHUB_OUTPUT:
#   status=clean        — all conflicts resolved; rebase completed
#   status=unresolved   — one or more conflicts could not be resolved
#
# Exit code is always 0 (status is communicated via GITHUB_OUTPUT so the
# caller can decide whether to abort).

set -euo pipefail

: "${GITHUB_OUTPUT:=/dev/null}"
: "${GITHUB_STEP_SUMMARY:=/dev/null}"
: "${MAX_ROUNDS:=10}"
: "${COPILOT_TIMEOUT:=120}"

ROUND=0
RESOLVED_FILES=""

_write_summary() {
    {
        echo "### 🤖 Copilot resolved rebase conflicts"
        echo ""
        echo "Files resolved automatically:"
        # shellcheck disable=SC2086
        for F in $RESOLVED_FILES; do echo "- \`$F\`"; done
    } >> "$GITHUB_STEP_SUMMARY"
}

while [ "$ROUND" -lt "$MAX_ROUNDS" ]; do
    ROUND=$((ROUND + 1))
    CONFLICTS=$(git diff --name-only --diff-filter=U 2>/dev/null || true)

    if [ -z "$CONFLICTS" ]; then
        # No conflict markers remain — rebase has completed cleanly
        echo "status=clean" >> "$GITHUB_OUTPUT"
        _write_summary
        exit 0
    fi

    echo "Conflict resolution round $ROUND for: $CONFLICTS"
    ALL_RESOLVED=true

    while IFS= read -r FILE; do
        [ -z "$FILE" ] && continue
        CONFLICT_CONTENT=$(cat "$FILE")
        FILE_SIZE=$(wc -c < "$FILE")
        MARKER_COUNT=$(grep -c '^<<<<<<<' "$FILE" || true)
        echo "Attempting to resolve: $FILE (${FILE_SIZE} bytes, ${MARKER_COUNT} conflict marker(s))"

        COPILOT_RC=0
        RESOLVED=$(timeout "$COPILOT_TIMEOUT" copilot -p \
            "Resolve ALL git conflict markers (<<<<<<<, =======, >>>>>>>) in the file \
             below. Output ONLY the complete resolved file content — no markdown fences, \
             no explanations, no preamble. File: $FILE --- Content: $CONFLICT_CONTENT" \
            2>/dev/null) || COPILOT_RC=$?

        if [ "$COPILOT_RC" -eq 124 ]; then
            echo "Copilot timed out after ${COPILOT_TIMEOUT}s for file: $FILE"
        fi

        # Strip fenced code blocks if Copilot wrapped the output in ``` markers
        if [ -n "$RESOLVED" ] && echo "$RESOLVED" | grep -q '^```'; then
            RESOLVED=$(echo "$RESOLVED" | awk '/^```/{if(f){exit}else{f=1;next}} f{print}')
        fi

        # Accept only if non-empty and all conflict markers are gone
        if [ -n "$RESOLVED" ] && ! echo "$RESOLVED" | grep -qF '<<<<<<<'; then
            printf '%s\n' "$RESOLVED" > "$FILE"
            git add "$FILE"
            RESOLVED_FILES="$RESOLVED_FILES $FILE"
        else
            ALL_RESOLVED=false
            echo "Copilot could not resolve conflicts in: $FILE"
            if [ -z "$RESOLVED" ]; then
                echo "  (Copilot returned empty output)"
            else
                RESOLVED_LINES=$(echo "$RESOLVED" | wc -l)
                echo "  (Copilot output: ${RESOLVED_LINES} lines; still contains conflict markers)"
                echo "  First 5 lines of Copilot output:"
                echo "$RESOLVED" | head -5 | sed 's/^/    /'
            fi
        fi
    done <<< "$CONFLICTS"

    if [ "$ALL_RESOLVED" = "false" ]; then
        echo "status=unresolved" >> "$GITHUB_OUTPUT"
        exit 0
    fi

    # All conflicts in this round resolved — advance the rebase
    if GIT_EDITOR=true git rebase --continue; then
        echo "status=clean" >> "$GITHUB_OUTPUT"
        _write_summary
        exit 0
    fi
    # git rebase --continue stopped at the next commit's conflicts — loop again
done

# Reached MAX_ROUNDS without completing
echo "status=unresolved" >> "$GITHUB_OUTPUT"
