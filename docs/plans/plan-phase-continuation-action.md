# Plan Phase Continuation GitHub Action

> **Goal:** Create a GitHub Actions workflow that detects when a merged PR
> completes a phase of a multi-phase plan in `docs/plans/`, identifies the
> next incomplete phase, and uses the GitHub Copilot coding agent to
> automatically open a new issue containing the next phase's tasks — so that
> multi-phase plans advance continuously without manual handoff.

---

## Table of Contents

1. [Current State](#1-current-state)
2. [Desired Behavior](#2-desired-behavior)
3. [Feature Gap Analysis](#3-feature-gap-analysis)
4. [Implementation Phases](#4-implementation-phases)
   - [Phase 1: Plan Parsing Library](#phase-1-plan-parsing-library-priority-high)
   - [Phase 2: PR-to-Plan Linking Convention](#phase-2-pr-to-plan-linking-convention-priority-high)
   - [Phase 3: Core Workflow — Detect & Trigger](#phase-3-core-workflow--detect--trigger-priority-high)
   - [Phase 4: Copilot Agent Integration](#phase-4-copilot-agent-integration-priority-high)
   - [Phase 5: Safety Gates & Edge Cases](#phase-5-safety-gates--edge-cases-priority-medium)
   - [Phase 6: Documentation & Rollout](#phase-6-documentation--rollout-priority-medium)
5. [Plan File Format Assumptions](#5-plan-file-format-assumptions)
6. [Workflow YAML Design](#6-workflow-yaml-design)
   - [6.1 Trigger & Permissions](#61-trigger--permissions)
   - [6.2 Step-by-Step Pseudocode](#62-step-by-step-pseudocode)
   - [6.3 Draft Workflow YAML](#63-draft-workflow-yaml)
7. [Security Considerations](#7-security-considerations)
8. [Test Plan](#8-test-plan)
9. [References](#9-references)

---

## 1. Current State

The repository has 15 plan documents in `docs/plans/`, several with multiple
implementation phases:

| Plan | Phases | Status |
|---|---|---|
| `udt-support.md` | 7 phases | Mixed (some ✅, some ⏳) |
| `documentation-plan.md` | 6 phases | Mixed (checkboxes in milestones) |
| `performance-improvement.md` | 5 phases | Multiple completed |
| `pr-comment-rebase-squash-action.md` | 5 phases | All ✅ |
| `github-actions-testing-plan.md` | 4 phases | Partial |
| `python-rs-driver-support.md` | Multiple phases | Partial |

**Current workflow for advancing plans:**

1. A developer manually reads the plan to find the next incomplete phase
2. They manually create a PR implementing that phase
3. After merge they manually check if more phases remain
4. If yes, they repeat — or forget, and the plan stalls

**No automation exists to detect plan completion or trigger the next phase.**

The repository already has patterns for post-merge automation:

| Workflow | Pattern |
|---|---|
| `self-healing-ci.yml` | `workflow_run` trigger → react to completed workflows |
| `pr-rebase-squash.yml` | `issue_comment` trigger → Copilot CLI integration |
| `ci.yml` | `push` to master → semantic-release |

---

## 2. Desired Behavior

When a PR is merged to the default branch:

1. The workflow checks if the PR references a plan file (via PR body, title,
   or branch name convention)
2. If a plan is referenced, the workflow reads and parses the plan file
3. It identifies which phase was just completed and whether a next phase exists
4. If a next incomplete phase is found, the workflow opens a **new GitHub issue**
   containing:
   - The plan name and link
   - The next phase title, goal, and task table
   - A mention of `@copilot` to allow the Copilot coding agent to pick up the
     work (if Copilot is configured for the repo)

| Scenario | Result |
|---|---|
| PR merged, references plan, next phase exists | New issue opened with next phase tasks |
| PR merged, references plan, all phases complete | Comment on PR: "🎉 All phases of \<plan\> are complete!" |
| PR merged, no plan reference | No action taken |
| PR merged, plan file not found | Warning comment on PR |
| PR closed without merge | No action taken |

---

## 3. Feature Gap Analysis

Legend:
- ✅ **Implemented** — working today
- 🔧 **Partial** — infrastructure exists but not fully exposed
- ❌ **Missing** — not yet implemented

| Feature | Status | Notes |
|---|---|---|
| Detect PR merge event | 🔧 | `push` to master triggers exist; need `pull_request: closed` with merge check |
| Parse plan reference from PR | ❌ | No convention for linking PRs to plans |
| Read plan file from repo | 🔧 | `actions/checkout` already used in other workflows |
| Parse plan markdown for phases | ❌ | Need to extract phase headers and status markers |
| Identify next incomplete phase | ❌ | Need logic to scan phases for first non-✅ phase |
| Extract phase tasks into issue body | ❌ | Need to extract task table from plan markdown |
| Open GitHub issue via API | 🔧 | `gh` CLI available in all workflows; pattern used in `self-healing-ci.yml` |
| Mention `@copilot` in issue | ❌ | Simple text inclusion in issue body |
| Label the created issue | ❌ | Need a `plan-continuation` label |
| Handle "all phases complete" | ❌ | Post a congratulatory comment on the merged PR |
| Conventional plan-reference format | ❌ | Need a convention: `Plan: docs/plans/<name>.md` in PR body |

**Gap summary — automation pipeline:**
- PR-to-plan linking → define a convention (`Plan: <path>` in PR body or
  branch name `plan/<plan-name>/phase-N`)
- Plan parsing → shell script or Python script that reads markdown, extracts
  `### Phase N:` headers and their ✅/❌ status
- Next-phase detection → find first phase header without ✅ in the header text
- Issue creation → `gh issue create` with formatted body including task table
- Copilot trigger → include `@copilot` mention in the issue body so the
  Copilot coding agent can pick up the issue automatically

---

## 4. Implementation Phases

### Phase 1: Plan Parsing Library (Priority: High)

**Goal:** Create a reusable script that reads a plan markdown file and extracts
phase structure, status, and task tables.

| Task | Description | Status |
|---|---|---|
| 1.1 | Create `.github/scripts/parse-plan.py` — Python script that reads a plan `.md` file and outputs JSON with phase titles, status (complete/incomplete), and task content | ❌ |
| 1.2 | Support phase header formats: `### Phase N: Title ✅`, `### Phase N: Title (Priority: X)`, and `### Phase N: Title` | ❌ |
| 1.3 | Detect phase completion via ✅ in phase header **or** all tasks in the phase table having ✅ status | ❌ |
| 1.4 | Extract the task table (markdown) for each phase so it can be included in the issue body | ❌ |
| 1.5 | Add unit tests for the parser in `.github/scripts/test_parse_plan.py` using `pytest` | ❌ |
| 1.6 | Test against real plan files: `udt-support.md`, `documentation-plan.md`, `pr-comment-rebase-squash-action.md` | ❌ |

### Phase 2: PR-to-Plan Linking Convention (Priority: High)

**Goal:** Define and document the convention for linking a PR to a specific plan
and phase.

| Task | Description | Status |
|---|---|---|
| 2.1 | Define the linking convention: PR body must contain a line matching `Plan: docs/plans/<name>.md` (case-insensitive) | ❌ |
| 2.2 | Optionally support `Phase: N` in the PR body to indicate which phase this PR completes | ❌ |
| 2.3 | Support branch-name convention as fallback: `plan/<plan-name>/phase-N` (e.g., `plan/udt-support/phase-3`) | ❌ |
| 2.4 | Add a PR template snippet (`.github/PULL_REQUEST_TEMPLATE.md` or amendment) documenting the convention | ❌ |
| 2.5 | Update `CONTRIBUTING.md` with the plan-linking convention | ❌ |

### Phase 3: Core Workflow — Detect & Trigger (Priority: High)

**Goal:** Create the GitHub Actions workflow that triggers on PR merge, detects
plan references, parses the plan, and identifies the next phase.

| Task | Description | Status |
|---|---|---|
| 3.1 | Create `.github/workflows/plan-continuation.yml` with `pull_request: types: [closed]` trigger | ❌ |
| 3.2 | Add merge guard: `if: github.event.pull_request.merged == true` | ❌ |
| 3.3 | Extract plan reference from PR body (`Plan: docs/plans/<name>.md`) and optionally from branch name | ❌ |
| 3.4 | Checkout the repo and run `parse-plan.py` on the referenced plan file | ❌ |
| 3.5 | Determine which phase was completed (from `Phase: N` in PR body, or infer from latest ✅ phase) | ❌ |
| 3.6 | Identify next incomplete phase from parser output | ❌ |
| 3.7 | If no plan reference found, exit silently (success, no-op) | ❌ |

### Phase 4: Copilot Agent Integration (Priority: High)

**Goal:** When a next phase is identified, open a GitHub issue with the phase
details and mention `@copilot` to trigger automated implementation.

| Task | Description | Status |
|---|---|---|
| 4.1 | Format the issue title: `[Plan Continuation] <plan-name> — Phase N: <title>` | ❌ |
| 4.2 | Format the issue body with: plan link, phase goal, full task table (markdown), and link to the merged PR that completed the previous phase | ❌ |
| 4.3 | Include `@copilot` mention in the issue body to trigger Copilot coding agent | ❌ |
| 4.4 | Add labels to the issue: `plan-continuation`, `automated`, and optionally the plan name | ❌ |
| 4.5 | If all phases are complete, post a comment on the merged PR: "🎉 All phases of \<plan\> are now complete!" | ❌ |
| 4.6 | Create the `plan-continuation` and `automated` labels in `.github/labels.toml` | ❌ |
| 4.7 | Check for existing open issues with the same plan+phase to avoid duplicates | ❌ |

### Phase 5: Safety Gates & Edge Cases (Priority: Medium)

**Goal:** Handle edge cases and prevent undesired behavior.

| Task | Description | Status |
|---|---|---|
| 5.1 | Skip if the plan file does not exist (post warning comment on PR) | ❌ |
| 5.2 | Skip if the plan has no recognizable phase structure | ❌ |
| 5.3 | Handle plans where phase status is tracked only in task tables (not in headers) | ❌ |
| 5.4 | Add a `skip-continuation` label that, when present on the PR, prevents the workflow from running | ❌ |
| 5.5 | Add concurrency group per plan file to prevent parallel issue creation | ❌ |
| 5.6 | Rate-limit: do not create more than one continuation issue per plan per day | ❌ |
| 5.7 | Log all decisions to `$GITHUB_STEP_SUMMARY` for auditability | ❌ |

### Phase 6: Documentation & Rollout (Priority: Medium)

**Goal:** Document the feature and prepare for merge to the default branch.

| Task | Description | Status |
|---|---|---|
| 6.1 | Add usage instructions to `CONTRIBUTING.md` (plan-linking convention) | ❌ |
| 6.2 | Add inline comments in the workflow YAML explaining each step | ❌ |
| 6.3 | Note that `pull_request` workflows must exist on the default branch to trigger on merge | ❌ |
| 6.4 | Update this plan with ✅ status for completed phases | ❌ |
| 6.5 | Add a section to the writing-plans skill referencing this automation | ❌ |

---

## 5. Plan File Format Assumptions

The parser must handle the plan formats used in this repository. Based on
analysis of all 15 plan files, the following patterns exist:

### Phase Header Formats

```markdown
### Phase 1: Core Workflow Scaffold ✅           ← status in header (rebase-squash)
### Phase N: Title (Priority: High)              ← priority in header (most plans)
### Phase 1 — Quick wins                         ← dash separator (performance)
```

### Phase Completion Indicators

| Indicator | Location | Example |
|---|---|---|
| ✅ in phase header | Header line | `### Phase 1: Title ✅` |
| All tasks ✅ in table | Task table | Every row has `✅` in Status column |
| Checkbox `[x]` | Milestone section | `- [x] Task description` |

### Task Table Formats

```markdown
| Task | Description | Status |
|---|---|---|
| 1.1 | Create the workflow file | ✅ |
| 1.2 | Add permission check | ❌ |
```

The parser will use a priority order:
1. ✅ in phase header → phase is complete
2. All task rows contain ✅ → phase is complete
3. Otherwise → phase is incomplete

---

## 6. Workflow YAML Design

### 6.1 Trigger & Permissions

```yaml
on:
  pull_request:
    types: [closed]
    branches: [master]
```

The workflow runs on every PR close targeting master, but immediately exits
if the PR was not merged (`github.event.pull_request.merged != true`) or
has no plan reference.

**Required permissions:**

| Permission | Scope | Reason |
|---|---|---|
| `contents: read` | Repository | Read plan files from the repo |
| `issues: write` | Repository | Create continuation issues |
| `pull-requests: write` | Repository | Post comments on the merged PR |

### 6.2 Step-by-Step Pseudocode

```
1.  Trigger: pull_request closed (targeting master)
2.  Guard: was the PR actually merged? (github.event.pull_request.merged)
3.  Guard: does the PR have `skip-continuation` label? → exit
4.  Extract plan reference from PR body (regex: Plan: docs/plans/<name>.md)
5.  Fallback: extract from branch name (plan/<name>/phase-N)
6.  If no plan reference found → exit silently (success)
7.  Checkout repository at merge commit
8.  Run parse-plan.py on the referenced plan file
9.  If plan file not found → post warning comment, exit
10. Parse JSON output: list of phases with status
11. Determine completed phase:
      a. From PR body "Phase: N" if present
      b. Otherwise: latest phase marked complete in the plan
12. Find next incomplete phase (first phase after completed that is not ✅)
13. If no next phase → post "all phases complete" comment, exit
14. Check for existing open issue with same plan+phase → skip if exists
15. Create GitHub issue:
      - Title: [Plan Continuation] <plan-name> — Phase N: <title>
      - Body: plan link + phase goal + task table + @copilot mention
      - Labels: plan-continuation, automated
16. Post comment on merged PR linking to the new issue
17. Log summary to $GITHUB_STEP_SUMMARY
```

### 6.3 Draft Workflow YAML

```yaml
name: Plan Phase Continuation

# See docs/plans/plan-phase-continuation-action.md for full design details.
on:
  pull_request:
    types: [closed]
    branches: [master]

concurrency:
  group: plan-continuation-${{ github.event.pull_request.number }}
  cancel-in-progress: false

jobs:
  continue-plan:
    name: Continue Plan Phase
    runs-on: ubuntu-latest
    if: github.event.pull_request.merged == true
    permissions:
      contents: read
      issues: write
      pull-requests: write

    steps:
      # ── 1. Extract plan reference ────────────────────────────
      - name: Extract plan reference from PR
        id: plan-ref
        env:
          PR_BODY: ${{ github.event.pull_request.body }}
          PR_BRANCH: ${{ github.event.pull_request.head.ref }}
        run: |
          # Try PR body first: "Plan: docs/plans/<name>.md"
          PLAN_FILE=$(echo "$PR_BODY" | grep -ioP '(?<=Plan:\s)docs/plans/[a-z0-9._-]+\.md' | head -1)

          # Fallback: branch name "plan/<name>/phase-N"
          if [ -z "$PLAN_FILE" ]; then
            PLAN_NAME=$(echo "$PR_BRANCH" | grep -oP '(?<=^plan/)[a-z0-9-]+(?=/phase-)' || true)
            if [ -n "$PLAN_NAME" ]; then
              PLAN_FILE="docs/plans/${PLAN_NAME}.md"
            fi
          fi

          # Extract phase number if present
          PHASE=$(echo "$PR_BODY" | grep -ioP '(?<=Phase:\s)\d+' | head -1)
          if [ -z "$PHASE" ]; then
            PHASE=$(echo "$PR_BRANCH" | grep -oP '(?<=phase-)\d+' || true)
          fi

          echo "plan_file=${PLAN_FILE}" >> "$GITHUB_OUTPUT"
          echo "phase=${PHASE}" >> "$GITHUB_OUTPUT"
          echo "has_plan=$( [ -n \"$PLAN_FILE\" ] && echo true || echo false )" >> "$GITHUB_OUTPUT"

      # ── 2. Exit if no plan reference ─────────────────────────
      - name: Skip if no plan reference
        if: steps.plan-ref.outputs.has_plan != 'true'
        run: echo "No plan reference found in PR — skipping."

      # ── 3. Checkout repo ─────────────────────────────────────
      - uses: actions/checkout@v4
        if: steps.plan-ref.outputs.has_plan == 'true'

      # ── 4. Set up Python ─────────────────────────────────────
      - uses: actions/setup-python@v5
        if: steps.plan-ref.outputs.has_plan == 'true'
        with:
          python-version: "3.12"

      # ── 5. Parse plan file ───────────────────────────────────
      - name: Parse plan and find next phase
        if: steps.plan-ref.outputs.has_plan == 'true'
        id: parse
        run: |
          PLAN_FILE="${{ steps.plan-ref.outputs.plan_file }}"
          COMPLETED_PHASE="${{ steps.plan-ref.outputs.phase }}"

          if [ ! -f "$PLAN_FILE" ]; then
            echo "plan_exists=false" >> "$GITHUB_OUTPUT"
            exit 0
          fi

          echo "plan_exists=true" >> "$GITHUB_OUTPUT"

          # Run the plan parser
          RESULT=$(python .github/scripts/parse-plan.py \
            --plan-file "$PLAN_FILE" \
            --completed-phase "${COMPLETED_PHASE:-auto}")

          echo "next_phase_number=$(echo "$RESULT" | jq -r '.next_phase.number // empty')" >> "$GITHUB_OUTPUT"
          echo "next_phase_title=$(echo "$RESULT" | jq -r '.next_phase.title // empty')" >> "$GITHUB_OUTPUT"
          echo "all_complete=$(echo "$RESULT" | jq -r '.all_complete')" >> "$GITHUB_OUTPUT"

          # Store full phase content for issue body
          echo "$RESULT" | jq -r '.next_phase.content // empty' > /tmp/next-phase-content.md

      # ── 6. Handle missing plan file ──────────────────────────
      - name: Warn if plan file not found
        if: >-
          steps.plan-ref.outputs.has_plan == 'true' &&
          steps.parse.outputs.plan_exists == 'false'
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          PLAN_FILE="${{ steps.plan-ref.outputs.plan_file }}"
          gh pr comment "${{ github.event.pull_request.number }}" \
            --repo "${{ github.repository }}" \
            --body "⚠️ **Plan file not found:** \`${PLAN_FILE}\` referenced in this PR does not exist."

      # ── 7. All phases complete ───────────────────────────────
      - name: Celebrate completion
        if: >-
          steps.parse.outputs.plan_exists == 'true' &&
          steps.parse.outputs.all_complete == 'true'
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          PLAN_FILE="${{ steps.plan-ref.outputs.plan_file }}"
          gh pr comment "${{ github.event.pull_request.number }}" \
            --repo "${{ github.repository }}" \
            --body "🎉 **All phases complete!** Every phase in [\`${PLAN_FILE}\`](${PLAN_FILE}) is now marked as done. Great work!"

      # ── 8. Check for duplicate issue ─────────────────────────
      - name: Check for existing continuation issue
        if: >-
          steps.parse.outputs.plan_exists == 'true' &&
          steps.parse.outputs.all_complete != 'true' &&
          steps.parse.outputs.next_phase_number != ''
        id: dedup
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          PLAN_FILE="${{ steps.plan-ref.outputs.plan_file }}"
          PHASE="${{ steps.parse.outputs.next_phase_number }}"
          PLAN_NAME=$(basename "$PLAN_FILE" .md)

          EXISTING=$(gh issue list \
            --repo "${{ github.repository }}" \
            --label "plan-continuation" \
            --search "[Plan Continuation] ${PLAN_NAME} — Phase ${PHASE}" \
            --state open \
            --json number \
            --jq '.[0].number // empty')

          if [ -n "$EXISTING" ]; then
            echo "exists=true" >> "$GITHUB_OUTPUT"
            echo "issue_number=${EXISTING}" >> "$GITHUB_OUTPUT"
          else
            echo "exists=false" >> "$GITHUB_OUTPUT"
          fi

      # ── 9. Create continuation issue ─────────────────────────
      - name: Create next-phase issue
        if: >-
          steps.parse.outputs.plan_exists == 'true' &&
          steps.parse.outputs.all_complete != 'true' &&
          steps.parse.outputs.next_phase_number != '' &&
          steps.dedup.outputs.exists != 'true'
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          PLAN_FILE="${{ steps.plan-ref.outputs.plan_file }}"
          PHASE="${{ steps.parse.outputs.next_phase_number }}"
          TITLE="${{ steps.parse.outputs.next_phase_title }}"
          PLAN_NAME=$(basename "$PLAN_FILE" .md)
          PR_NUMBER="${{ github.event.pull_request.number }}"
          PR_TITLE="${{ github.event.pull_request.title }}"
          PHASE_CONTENT=$(cat /tmp/next-phase-content.md)

          ISSUE_TITLE="[Plan Continuation] ${PLAN_NAME} — Phase ${PHASE}: ${TITLE}"

          cat > /tmp/issue-body.md <<EOF
          ## Plan Phase Continuation

          **Plan:** [\`${PLAN_FILE}\`](https://github.com/${{ github.repository }}/blob/master/${PLAN_FILE})
          **Phase:** ${PHASE} — ${TITLE}
          **Previous PR:** #${PR_NUMBER} (${PR_TITLE})

          ---

          ### Phase Details

          ${PHASE_CONTENT}

          ---

          > This issue was automatically created by the
          > [Plan Phase Continuation](${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }})
          > workflow after PR #${PR_NUMBER} was merged.

          @copilot Please implement Phase ${PHASE} of this plan. Read the full plan
          at \`${PLAN_FILE}\` for context. The tasks above describe what needs to be done.
          EOF

          ISSUE_URL=$(gh issue create \
            --repo "${{ github.repository }}" \
            --title "$ISSUE_TITLE" \
            --body-file /tmp/issue-body.md \
            --label "plan-continuation,automated")

          echo "Created continuation issue: $ISSUE_URL"

          # Comment on the merged PR linking to the new issue
          gh pr comment "${PR_NUMBER}" \
            --repo "${{ github.repository }}" \
            --body "🔄 **Next phase started!** Created ${ISSUE_URL} for Phase ${PHASE}: ${TITLE} of [\`${PLAN_FILE}\`](${PLAN_FILE})."

          # Step summary
          {
            echo "### Plan Phase Continuation"
            echo ""
            echo "- **Plan:** \`${PLAN_FILE}\`"
            echo "- **Next phase:** ${PHASE} — ${TITLE}"
            echo "- **Issue:** ${ISSUE_URL}"
          } >> "$GITHUB_STEP_SUMMARY"

      # ── 10. Report duplicate ─────────────────────────────────
      - name: Report existing issue
        if: steps.dedup.outputs.exists == 'true'
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          EXISTING="${{ steps.dedup.outputs.issue_number }}"
          gh pr comment "${{ github.event.pull_request.number }}" \
            --repo "${{ github.repository }}" \
            --body "ℹ️ **Continuation issue already exists:** #${EXISTING} — skipping duplicate creation."
```

---

## 7. Security Considerations

| Risk | Mitigation |
|---|---|
| Arbitrary file read via plan reference | Plan path is validated against `docs/plans/*.md` pattern; no path traversal possible |
| Issue spam from rapid merges | Concurrency group per PR + duplicate issue check prevents spam |
| Injection via PR body/title into issue | PR title and body are passed through GitHub API (not shell-interpolated); `--body-file` avoids injection |
| Unauthorized plan continuation | Only merged PRs trigger the workflow; merge permissions are governed by branch protection rules |
| Copilot acting on malicious issue content | The `@copilot` mention is informational; Copilot's own guardrails apply to any actions it takes |
| `GITHUB_TOKEN` scope | Token is limited to `contents: read`, `issues: write`, `pull-requests: write` — minimum required permissions |

> **Note:** The `pull_request: closed` trigger runs the workflow from the
> **PR's head branch** for the workflow file, but the `actions/checkout` step
> checks out the **default branch** (post-merge). The workflow YAML must be
> merged to master before it will trigger on subsequent PR merges.

---

## 8. Test Plan

### 8.1 Plan Parser Unit Tests (Phase 1)

| Test Case | Input | Expected Output |
|---|---|---|
| Parse phase with ✅ in header | `### Phase 1: Title ✅` | Phase 1 marked complete |
| Parse phase with priority tag | `### Phase 2: Title (Priority: High)` | Phase 2 marked incomplete |
| Parse phase with all ✅ tasks | Task table where every row has ✅ | Phase marked complete |
| Parse phase with mixed tasks | Task table with ✅ and ❌ | Phase marked incomplete |
| Parse phase with dash separator | `### Phase 1 — Quick wins` | Phase 1 parsed correctly |
| Multiple phases, find next | Phases 1-2 ✅, Phase 3 ❌ | Next phase = 3 |
| All phases complete | All phases have ✅ | `all_complete = true` |
| No phases found | Plan with no `### Phase` headers | Empty phase list |
| Real plan: `udt-support.md` | Actual file | Correctly identifies incomplete phases |
| Real plan: `pr-comment-rebase-squash-action.md` | Actual file | All phases complete |

### 8.2 Workflow Integration Tests (Phase 3)

Because this is a workflow, integration testing is primarily manual:

| Test Case | Setup | Expected Result | Phase |
|---|---|---|---|
| PR with plan reference, next phase exists | PR body contains `Plan: docs/plans/udt-support.md` | Issue created for next incomplete phase | 3, 4 |
| PR with plan reference, all phases done | PR body contains `Plan: docs/plans/pr-comment-rebase-squash-action.md` | "All phases complete" comment | 3, 4 |
| PR with no plan reference | Normal PR body | Workflow exits silently | 3 |
| PR with invalid plan path | `Plan: docs/plans/nonexistent.md` | Warning comment posted | 5 |
| PR closed without merge | PR closed via "Close" button | Workflow does not run | 3 |
| Duplicate issue prevention | Two PRs merged for same plan | Only one issue created | 4, 5 |
| Branch name convention | Branch `plan/udt-support/phase-3` | Plan detected from branch name | 3 |
| `skip-continuation` label | PR has the label | Workflow does not create issue | 5 |

### 8.3 Static Analysis

| Check | Tool | Phase |
|---|---|---|
| Workflow YAML validity | `actionlint` | 3 |
| Python script lint | `ruff` | 1 |
| Python script type check | `ty` / `mypy` | 1 |

---

## 9. References

- [GitHub Actions: `pull_request` event](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#pull_request)
- [GitHub Copilot coding agent](https://docs.github.com/en/copilot/using-github-copilot/using-copilot-coding-agent)
- [GitHub CLI: `gh issue create`](https://cli.github.com/manual/gh_issue_create)
- [Existing `self-healing-ci.yml`](../../.github/workflows/self-healing-ci.yml) — pattern for PR commenting
- [Existing `pr-rebase-squash.yml`](../../.github/workflows/pr-rebase-squash.yml) — Copilot CLI integration pattern
- [Plan writing conventions](../../.github/skills/writing-plans/SKILL.md)
- [Conventional Commits specification](https://www.conventionalcommits.org/)
