#!/usr/bin/env bash
# resolve-conflicts.sh — Attempt to resolve git merge/rebase conflicts using
# the GitHub Models API (via resolve-conflict-file.py).  Called by the
# "Resolve conflicts" step used in rebase (rebase mode) and merge (merge mode)
# workflows.
#
# This script replaces the previous Copilot CLI approach, which was blocked by
# the CLI's permission sandbox in CI environments.  The Models API is called
# directly and does not have these restrictions.
#
# Required environment variables (set by the calling workflow step):
#   GH_TOKEN            — GitHub token (must have models:read permission)
#   GITHUB_OUTPUT       — path to GitHub Actions output file
#   GITHUB_STEP_SUMMARY — path to GitHub Actions step summary file
#
# Optional environment variables:
#   RESOLVE_MODE        — "rebase" (default) or "merge"
#   MAX_ROUNDS          — maximum rebase-continue cycles (default: 10)
#   RESOLVE_TIMEOUT     — seconds to wait for a single resolve call (default: 120)
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
: "${RESOLVE_MODE:=rebase}"
: "${MAX_ROUNDS:=10}"
: "${RESOLVE_TIMEOUT:=120}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

ROUND=0
RESOLVED_FILES=""

_elapsed() {
    local now
    now=$(date +%s)
    echo $(( now - SCRIPT_START ))
}
SCRIPT_START=$(date +%s)

_write_summary() {
    {
        echo "### 🤖 AI resolved rebase conflicts"
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
        echo "[+$(_elapsed)s] All conflicts resolved — operation complete"
        echo "status=clean" >> "$GITHUB_OUTPUT"
        _write_summary
        exit 0
    fi

    echo "[+$(_elapsed)s] Conflict resolution round $ROUND for: $CONFLICTS"
    ALL_RESOLVED=true

    while IFS= read -r FILE; do
        [ -z "$FILE" ] && continue
        FILE_SIZE=$(wc -c < "$FILE")
        MARKER_COUNT=$(grep -c '^<<<<<<<' "$FILE" || true)
        echo "[+$(_elapsed)s] Attempting to resolve: $FILE (${FILE_SIZE} bytes, ${MARKER_COUNT} conflict marker(s))"

        # Have the Models API resolve the conflict and write to a temp file
        RESOLVE_OUTFILE=$(mktemp)

        RESOLVE_RC=0
        echo "::group::Models API conflict resolution for $FILE (timeout: ${RESOLVE_TIMEOUT}s)"
        timeout "$RESOLVE_TIMEOUT" python3 "$SCRIPT_DIR/resolve-conflict-file.py" \
            --file "$FILE" \
            --output-file "$RESOLVE_OUTFILE" \
            2>&1 || RESOLVE_RC=$?
        echo "::endgroup::"

        if [ "$RESOLVE_RC" -eq 124 ]; then
            echo "::warning::Conflict resolution timed out after ${RESOLVE_TIMEOUT}s for file: $FILE"
        elif [ "$RESOLVE_RC" -ne 0 ]; then
            echo "::warning::Conflict resolution exited with code $RESOLVE_RC for file: $FILE"
        fi

        RESOLVED=""
        if [ -f "$RESOLVE_OUTFILE" ] && [ -s "$RESOLVE_OUTFILE" ]; then
            RESOLVED=$(cat "$RESOLVE_OUTFILE")
        fi
        rm -f "$RESOLVE_OUTFILE"

        # Accept only if non-empty and all conflict markers are gone
        if [ -n "$RESOLVED" ] && ! echo "$RESOLVED" | grep -qF '<<<<<<<'; then
            printf '%s\n' "$RESOLVED" > "$FILE"
            git add "$FILE"
            RESOLVED_FILES="$RESOLVED_FILES $FILE"
            echo "[+$(_elapsed)s] ✅ Resolved: $FILE"
        else
            ALL_RESOLVED=false
            echo "[+$(_elapsed)s] ❌ Could not resolve conflicts in: $FILE"
            if [ -z "$RESOLVED" ]; then
                echo "  (Models API returned empty output)"
            else
                RESOLVED_LINES=$(echo "$RESOLVED" | wc -l)
                echo "  (Models API output: ${RESOLVED_LINES} lines; still contains conflict markers)"
                echo "::group::First 20 lines of resolved output for $FILE"
                echo "$RESOLVED" | head -20
                echo "::endgroup::"
            fi
        fi
    done <<< "$CONFLICTS"

    if [ "$ALL_RESOLVED" = "false" ]; then
        echo "[+$(_elapsed)s] Round $ROUND: some conflicts unresolved — giving up"
        echo "status=unresolved" >> "$GITHUB_OUTPUT"
        exit 0
    fi

    # All conflicts in this round resolved — advance the operation
    if [ "$RESOLVE_MODE" = "merge" ]; then
        # Merge mode: commit the merge and we are done
        if git commit --no-edit; then
            echo "[+$(_elapsed)s] Merge commit created"
            echo "status=clean" >> "$GITHUB_OUTPUT"
            _write_summary
            exit 0
        fi
    else
        # Rebase mode: continue the rebase (may surface next commit's conflicts)
        if GIT_EDITOR=true git rebase --continue; then
            echo "[+$(_elapsed)s] Rebase complete"
            echo "status=clean" >> "$GITHUB_OUTPUT"
            _write_summary
            exit 0
        fi
        # git rebase --continue stopped at the next commit's conflicts — loop again
    fi
done

# Reached MAX_ROUNDS without completing
echo "[+$(_elapsed)s] Reached maximum rounds ($MAX_ROUNDS) without completing"
echo "status=unresolved" >> "$GITHUB_OUTPUT"
