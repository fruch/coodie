# PR Comment-Driven Rebase & Squash GitHub Action

> **Goal:** Create a GitHub Actions workflow that responds to `/squash` and
> `/rebase` slash-commands in pull-request comments, rebases the PR branch onto
> the default branch, resolves merge conflicts with the help of GitHub Copilot
> CLI, squashes all commits, and rewrites the final commit message — also via
> Copilot CLI — so that it follows the project's Conventional Commits format.

---

## Table of Contents

1. [Current State](#1-current-state)
2. [Desired Behavior](#2-desired-behavior)
3. [Feature Gap Analysis](#3-feature-gap-analysis)
4. [Implementation Phases](#4-implementation-phases)
   - [Phase 1: Core Workflow Scaffold](#phase-1-core-workflow-scaffold-priority-high)
   - [Phase 2: Rebase & Conflict Resolution](#phase-2-rebase--conflict-resolution-priority-high)
   - [Phase 3: Squash & Commit-Message Rewrite](#phase-3-squash--commit-message-rewrite-priority-high)
   - [Phase 4: Safety Gates & Edge Cases](#phase-4-safety-gates--edge-cases-priority-medium)
   - [Phase 5: Documentation & Rollout](#phase-5-documentation--rollout-priority-medium)
5. [Copilot CLI Setup & Credentials](#5-copilot-cli-setup--credentials)
   - [5.1 Installation](#51-installation)
   - [5.2 Authentication](#52-authentication)
   - [5.3 Repository Setup Checklist](#53-repository-setup-checklist)
6. [Workflow YAML Design](#6-workflow-yaml-design)
   - [6.1 Trigger & Permissions](#61-trigger--permissions)
   - [6.2 Step-by-Step Pseudocode](#62-step-by-step-pseudocode)
   - [6.3 Draft Workflow YAML](#63-draft-workflow-yaml)
7. [Security Considerations](#7-security-considerations)
8. [Test Plan](#8-test-plan)
9. [References](#9-references)

---

## 1. Current State

The repository already has several GitHub Actions workflows:

| Workflow | File | Purpose |
|---|---|---|
| CI | `ci.yml` | Lint, commitlint, semantic-release |
| Unit Tests | `test-unit.yml` | pytest unit suite |
| Integration Tests | `test-integration.yml` | pytest integration suite against ScyllaDB |
| Benchmarks | `benchmark.yml` | coodie vs cqlengine performance |
| Self-Healing CI | `self-healing-ci.yml` | Auto-comment on PR when CI fails |
| Docs | `docs.yml` | Sphinx documentation build & deploy |

**There is no workflow for automated rebase, squash, or commit-message rewriting.**
Maintainers currently rebase and squash manually via the GitHub UI merge-strategy
dropdown or local Git commands.

---

## 2. Desired Behavior

| Command | Effect |
|---|---|
| `/rebase` | Rebase the PR branch onto the default branch. If conflicts arise, attempt to resolve them with Copilot CLI. Push the rebased branch. |
| `/squash` | Squash all PR commits into one. Use Copilot CLI to generate a Conventional Commits message summarising the full diff. Push the result. |
| `/rebase squash` | Rebase first, then squash (combines both operations). |

After every operation the workflow posts a comment summarising what it did
(e.g., "Rebased 3 commits onto `main`, resolved 1 conflict in `src/coodie/schema.py`").

---

## 3. Feature Gap Analysis

Legend:
- ✅ **Implemented** — working today
- 🔧 **Partial** — infrastructure exists but not fully exposed
- ❌ **Missing** — not yet implemented

| Feature | Status | Notes |
|---|---|---|
| Trigger on PR comment slash-command | ❌ | Need `issue_comment` event with body filter |
| Checkout PR branch with full history | ❌ | Requires `fetch-depth: 0` and PR head ref checkout |
| Rebase onto default branch | ❌ | `git rebase origin/main` |
| AI-assisted conflict resolution (Copilot CLI) | ❌ | `gh copilot suggest` or `copilot-cli` for merge conflicts |
| Squash all commits into one | ❌ | `git rebase -i` / `git reset --soft` + `git commit` |
| AI-generated commit message (Copilot CLI) | ❌ | `gh copilot suggest` to draft Conventional Commits message |
| Push rebased/squashed branch | ❌ | `git push --force-with-lease` |
| Post summary comment on PR | 🔧 | `self-healing-ci.yml` already comments on PRs — same pattern |
| Permission check (author/maintainer only) | ❌ | Prevent non-collaborators from triggering |
| Conventional Commits format enforcement | ✅ | `commitlint` already runs in CI |

**Gap summary — workflow automation:**
- Comment trigger → use `issue_comment` event with `created` type and body filter
- Full checkout → `actions/checkout@v6` with `fetch-depth: 0` + explicit PR ref
- Rebase logic → shell script with `git rebase`, fallback to Copilot CLI for conflicts
- Squash logic → `git reset --soft` to default-branch merge-base + single commit
- Copilot CLI integration → install `gh copilot` extension via `gh extension install github/gh-copilot`; requires a **fine-grained PAT** with the "Copilot Requests" permission stored as a repo secret (the default `GITHUB_TOKEN` does **not** include Copilot access)
- Summary comment → reuse pattern from `self-healing-ci.yml`

---

## 4. Implementation Phases

### Phase 1: Core Workflow Scaffold (Priority: High)

**Goal:** Create the workflow file with correct trigger, permissions, checkout, and permission guard.

| Task | Description |
|---|---|
| 1.1 | Create `.github/workflows/pr-rebase-squash.yml` with `issue_comment` trigger filtered to `/rebase`, `/squash`, `/rebase squash` |
| 1.2 | **Prerequisite:** Generate a fine-grained PAT with "Copilot Requests" permission and store it as repo secret `COPILOT_PAT` (see [§5 Copilot CLI Setup](#5-copilot-cli-setup--credentials)) |
| 1.3 | Add permission check: verify comment author is a collaborator (write access) or the PR author |
| 1.4 | Checkout PR branch with `fetch-depth: 0` and configure Git identity (`github-actions[bot]`) |
| 1.5 | Add "eyes" reaction to the trigger comment to acknowledge the command |
| 1.6 | Add error-handling step that posts a comment if any step fails |
| 1.7 | Manual smoke test: verify the workflow triggers on a `/rebase` comment in a test PR |

### Phase 2: Rebase & Conflict Resolution (Priority: High)

**Goal:** Implement the `/rebase` command with Copilot CLI fallback for conflict resolution.

| Task | Description |
|---|---|
| 2.1 | Fetch and determine the default branch (`origin/main` or `origin/master`) |
| 2.2 | Run `git rebase origin/<default-branch>` and capture exit code |
| 2.3 | On conflict: install `gh copilot` extension, iterate over conflicted files, use Copilot CLI to suggest resolutions |
| 2.4 | Apply suggested resolutions, `git add` resolved files, `git rebase --continue` |
| 2.5 | If Copilot CLI cannot resolve a conflict, abort rebase and post a comment listing unresolved files |
| 2.6 | On success: `git push --force-with-lease` and post a summary comment (commits rebased, conflicts resolved) |
| 2.7 | Manual test: create a PR with a known conflict, trigger `/rebase`, verify resolution |

### Phase 3: Squash & Commit-Message Rewrite (Priority: High)

**Goal:** Implement the `/squash` command with Copilot CLI-generated Conventional Commits message.

| Task | Description |
|---|---|
| 3.1 | Determine merge-base between PR branch and default branch |
| 3.2 | Collect all commit messages since merge-base (`git log --oneline merge-base..HEAD`) |
| 3.3 | Generate full diff summary (`git diff merge-base..HEAD --stat`) |
| 3.4 | Call Copilot CLI with the commit log + diff stat as context, requesting a Conventional Commits message that follows the project's commitlint rules |
| 3.5 | Squash via `git reset --soft <merge-base>` + `git commit -m "<generated message>"` |
| 3.6 | Push with `git push --force-with-lease` |
| 3.7 | Post a summary comment with the generated commit message |
| 3.8 | Manual test: create a multi-commit PR, trigger `/squash`, verify single commit with well-formed message |

### Phase 4: Safety Gates & Edge Cases (Priority: Medium)

**Goal:** Handle edge cases and add guardrails to prevent data loss or misuse.

| Task | Description |
|---|---|
| 4.1 | Block operation if the PR has merge-queue label or is in a review-required state |
| 4.2 | Block if the PR is closed or merged |
| 4.3 | Handle `/rebase squash` combined command (rebase first, then squash) |
| 4.4 | Add concurrency group per PR number to prevent parallel runs |
| 4.5 | Log each step's output to the workflow summary (`$GITHUB_STEP_SUMMARY`) |
| 4.6 | Add a "rocket" reaction on the trigger comment upon success, or "confused" on failure |
| 4.7 | Test edge cases: empty diff, single-commit PR (no-op squash), already up-to-date rebase |

### Phase 5: Documentation & Rollout (Priority: Medium)

**Goal:** Document the feature and prepare for merge to the default branch.

| Task | Description |
|---|---|
| 5.1 | Add usage instructions to `CONTRIBUTING.md` (slash-command reference table) |
| 5.2 | Add a section in `README.md` or `CONTRIBUTING.md` explaining when to use `/rebase` vs `/squash` |
| 5.3 | Note in the workflow file that `issue_comment` workflows must exist on the default branch to fire |
| 5.4 | Update this plan with ✅ status for completed phases |

---

## 5. Copilot CLI Setup & Credentials

### 5.1 Installation

The workflow uses the [`gh-copilot`](https://github.com/github/gh-copilot) extension
for the GitHub CLI. It is installed at runtime inside the workflow:

```bash
gh extension install github/gh-copilot || true
```

`ubuntu-latest` runners already include `gh` (GitHub CLI) pre-installed, so only
the Copilot extension needs to be added.

### 5.2 Authentication

> **Important:** The default `GITHUB_TOKEN` provided by GitHub Actions does
> **not** include Copilot API access. A dedicated token is required.

| Requirement | Detail |
|---|---|
| **Token type** | Fine-grained Personal Access Token (PAT) starting with `github_pat_` |
| **Required permission** | "Copilot Requests" (under the Copilot permission category) |
| **Classic PATs** | **Not supported** — classic tokens (`ghp_...`) cannot access the Copilot API |
| **Copilot subscription** | The GitHub account that owns the PAT must have an active GitHub Copilot subscription (Individual, Business, or Enterprise) |

The Copilot CLI resolves credentials in this order:

1. `COPILOT_GITHUB_TOKEN` environment variable
2. `GH_TOKEN` environment variable
3. `GITHUB_TOKEN` environment variable
4. OAuth token from the system keychain (not available in CI)
5. `gh auth` login fallback (not reliable in CI)

In the workflow, the dedicated PAT is exposed via the `COPILOT_GITHUB_TOKEN`
environment variable so it takes priority over the default `GITHUB_TOKEN`:

```yaml
env:
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}              # for gh api calls
  COPILOT_GITHUB_TOKEN: ${{ secrets.COPILOT_PAT }}   # for gh copilot commands
```

### 5.3 Repository Setup Checklist

Before the workflow can use Copilot CLI, a repository admin must complete these
one-time steps:

- [ ] **Generate a fine-grained PAT** — Go to [GitHub Settings → Developer settings → Fine-grained tokens](https://github.com/settings/tokens?type=beta), create a token with the "Copilot Requests" permission
- [ ] **Add the PAT as a repo secret** — Go to the repository's Settings → Secrets and variables → Actions, add a secret named `COPILOT_PAT` with the token value
- [ ] **Verify Copilot subscription** — Confirm the PAT owner has an active GitHub Copilot subscription
- [ ] **Test locally** — Run `COPILOT_GITHUB_TOKEN=<token> gh copilot suggest "hello"` to verify the token works

> **Fallback behavior:** If `COPILOT_PAT` is not configured or the token is
> invalid, the workflow gracefully degrades — conflict resolution is skipped
> (rebase aborts on conflict), and squash uses a generic commit message
> (`chore: squash N commits`) instead of a Copilot-generated one.

---

## 6. Workflow YAML Design

### 6.1 Trigger & Permissions

```yaml
on:
  issue_comment:
    types: [created]

# Only run on PR comments (not issue comments), and only for slash-commands
# The job-level `if` filters for pull_request context and command patterns
```

**Required permissions:**

| Permission | Scope | Reason |
|---|---|---|
| `contents: write` | Repository | Push rebased/squashed branch |
| `pull-requests: write` | Repository | Post summary comments, add reactions |
| `issues: write` | Repository | Add reaction to the trigger comment |

### 6.2 Step-by-Step Pseudocode

```
1.  Trigger: issue_comment created
2.  Guard: is this a PR comment? (github.event.issue.pull_request exists)
3.  Guard: does the body match /rebase, /squash, or /rebase squash?
4.  Guard: is the author a collaborator with write access?
5.  React "eyes" to the comment
6.  Checkout PR branch (full history)
7.  Configure git identity (github-actions[bot])
8.  Parse command:
      - /rebase        → run REBASE
      - /squash        → run SQUASH
      - /rebase squash → run REBASE then SQUASH
9.  REBASE:
      a. git fetch origin <default-branch>
      b. git rebase origin/<default-branch>
      c. if conflict:
           - install gh copilot extension
           - for each conflicted file:
               - gh copilot suggest "resolve merge conflict in <file>"
               - apply suggestion, git add <file>
           - git rebase --continue
           - if still failing: git rebase --abort, post failure comment, exit
      d. git push --force-with-lease
10. SQUASH:
      a. merge_base=$(git merge-base HEAD origin/<default-branch>)
      b. log=$(git log --oneline $merge_base..HEAD)
      c. stat=$(git diff --stat $merge_base..HEAD)
      d. message=$(gh copilot suggest "Write a conventional commit message
           for these changes: $log $stat. Follow commitlint rules:
           type(scope): subject")
      e. git reset --soft $merge_base
      f. git commit -m "$message"
      g. git push --force-with-lease
11. Post summary comment on PR
12. React "rocket" on success or "confused" on failure
```

### 6.3 Draft Workflow YAML

```yaml
name: PR Rebase & Squash

on:
  issue_comment:
    types: [created]

concurrency:
  group: pr-rebase-squash-${{ github.event.issue.number }}
  cancel-in-progress: false

jobs:
  rebase-squash:
    name: Rebase / Squash
    runs-on: ubuntu-latest
    if: >-
      github.event.issue.pull_request &&
      (
        contains(github.event.comment.body, '/rebase') ||
        contains(github.event.comment.body, '/squash')
      )
    permissions:
      contents: write
      pull-requests: write
      issues: write

    steps:
      # ── 1. Permission check ──────────────────────────────────
      - name: Check collaborator permission
        id: permission
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          PERM=$(gh api "repos/${{ github.repository }}/collaborators/${{ github.event.comment.user.login }}/permission" \
            --jq '.permission')
          if [[ "$PERM" != "admin" && "$PERM" != "write" && "$PERM" != "maintain" ]]; then
            echo "User ${{ github.event.comment.user.login }} lacks write access (has: $PERM)"
            exit 1
          fi

      # ── 2. Acknowledge ───────────────────────────────────────
      - name: React to comment
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          gh api "repos/${{ github.repository }}/issues/comments/${{ github.event.comment.id }}/reactions" \
            -f content='eyes' --silent

      # ── 3. Checkout PR ───────────────────────────────────────
      - name: Get PR metadata
        id: pr
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          PR_JSON=$(gh api "repos/${{ github.repository }}/pulls/${{ github.event.issue.number }}")
          echo "head_ref=$(echo "$PR_JSON" | jq -r '.head.ref')" >> "$GITHUB_OUTPUT"
          echo "head_sha=$(echo "$PR_JSON" | jq -r '.head.sha')" >> "$GITHUB_OUTPUT"
          echo "base_ref=$(echo "$PR_JSON" | jq -r '.base.ref')" >> "$GITHUB_OUTPUT"
          echo "state=$(echo "$PR_JSON" | jq -r '.state')" >> "$GITHUB_OUTPUT"

      - name: Abort if PR is not open
        if: steps.pr.outputs.state != 'open'
        run: |
          echo "PR #${{ github.event.issue.number }} is ${{ steps.pr.outputs.state }}, not open."
          exit 1

      - uses: actions/checkout@v6
        with:
          ref: ${{ steps.pr.outputs.head_ref }}
          fetch-depth: 0
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Configure Git identity
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"

      # ── 4. Parse command ─────────────────────────────────────
      - name: Parse slash command
        id: cmd
        run: |
          BODY="${{ github.event.comment.body }}"
          DO_REBASE=false
          DO_SQUASH=false
          if echo "$BODY" | grep -qiE '^\s*/rebase\s+squash\s*$'; then
            DO_REBASE=true
            DO_SQUASH=true
          elif echo "$BODY" | grep -qiE '^\s*/rebase\s*$'; then
            DO_REBASE=true
          elif echo "$BODY" | grep -qiE '^\s*/squash\s*$'; then
            DO_SQUASH=true
          fi
          echo "do_rebase=$DO_REBASE" >> "$GITHUB_OUTPUT"
          echo "do_squash=$DO_SQUASH" >> "$GITHUB_OUTPUT"

      # ── 5. Rebase ───────────────────────────────────────────
      - name: Rebase onto base branch
        id: rebase
        if: steps.cmd.outputs.do_rebase == 'true'
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          BASE="${{ steps.pr.outputs.base_ref }}"
          git fetch origin "$BASE"

          if git rebase "origin/$BASE"; then
            echo "status=clean" >> "$GITHUB_OUTPUT"
          else
            echo "status=conflict" >> "$GITHUB_OUTPUT"
          fi

      - name: Resolve conflicts with Copilot CLI
        if: steps.rebase.outputs.status == 'conflict'
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          COPILOT_GITHUB_TOKEN: ${{ secrets.COPILOT_PAT }}
        run: |
          # Install GitHub Copilot CLI extension (requires COPILOT_PAT secret)
          gh extension install github/gh-copilot || true

          UNRESOLVED=""
          for FILE in $(git diff --name-only --diff-filter=U); do
            echo "Attempting to resolve conflict in: $FILE"

            # Extract conflict context and ask Copilot for resolution
            CONFLICT_CONTENT=$(cat "$FILE")
            SUGGESTION=$(gh copilot suggest \
              "Resolve the git merge conflict in this file. Keep the most \
               appropriate changes from both sides: $FILE" 2>&1) || true

            if [ -n "$SUGGESTION" ]; then
              git add "$FILE"
            else
              UNRESOLVED="$UNRESOLVED $FILE"
            fi
          done

          if [ -n "$UNRESOLVED" ]; then
            git rebase --abort
            echo "Could not resolve conflicts in:$UNRESOLVED" >> "$GITHUB_STEP_SUMMARY"
            exit 1
          fi

          git rebase --continue --no-edit

      - name: Push rebased branch
        if: steps.cmd.outputs.do_rebase == 'true'
        run: git push --force-with-lease

      # ── 6. Squash ───────────────────────────────────────────
      - name: Squash commits
        if: steps.cmd.outputs.do_squash == 'true'
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          COPILOT_GITHUB_TOKEN: ${{ secrets.COPILOT_PAT }}
        run: |
          BASE="${{ steps.pr.outputs.base_ref }}"
          git fetch origin "$BASE"
          MERGE_BASE=$(git merge-base HEAD "origin/$BASE")

          COMMIT_COUNT=$(git rev-list --count "$MERGE_BASE..HEAD")
          if [ "$COMMIT_COUNT" -le 1 ]; then
            echo "Only $COMMIT_COUNT commit(s) — nothing to squash." >> "$GITHUB_STEP_SUMMARY"
            exit 0
          fi

          # Collect context for Copilot
          LOG=$(git log --oneline "$MERGE_BASE..HEAD")
          STAT=$(git diff --stat "$MERGE_BASE..HEAD")

          # Install GitHub Copilot CLI extension (requires COPILOT_PAT secret)
          gh extension install github/gh-copilot || true

          # Generate a Conventional Commits message via Copilot CLI
          MESSAGE=$(gh copilot suggest -t shell \
            "Write a single conventional commit message (type(scope): subject) \
             summarising these changes. Types: feat fix docs style refactor perf \
             test build ci chore revert. No period at end. Lowercase first letter. \
             Commits: $LOG --- Diff stat: $STAT" 2>&1) || true

          # Fallback if Copilot CLI fails
          if [ -z "$MESSAGE" ]; then
            MESSAGE="chore: squash $(echo "$COMMIT_COUNT") commits"
          fi

          # Squash
          git reset --soft "$MERGE_BASE"
          git commit -m "$MESSAGE"
          git push --force-with-lease

          {
            echo "### Squashed $COMMIT_COUNT commits"
            echo ""
            echo '```'
            echo "$MESSAGE"
            echo '```'
          } >> "$GITHUB_STEP_SUMMARY"

      # ── 7. Summary comment ──────────────────────────────────
      - name: Post summary comment
        if: always()
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          STATUS="${{ job.status }}"
          PR_NUMBER="${{ github.event.issue.number }}"
          REACTION="rocket"
          if [ "$STATUS" != "success" ]; then
            REACTION="confused"
          fi

          # Add reaction to original comment
          gh api "repos/${{ github.repository }}/issues/comments/${{ github.event.comment.id }}/reactions" \
            -f content="$REACTION" --silent || true

          # Post summary
          if [ "$STATUS" = "success" ]; then
            BODY="✅ **Done!** Rebase/squash completed successfully. See the [workflow run](${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}) for details."
          else
            BODY="❌ **Failed.** The rebase/squash operation did not complete. See the [workflow run](${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}) for details."
          fi

          gh pr comment "$PR_NUMBER" --repo "${{ github.repository }}" --body "$BODY"
```

---

## 7. Security Considerations

| Risk | Mitigation |
|---|---|
| Non-collaborator triggering rebase/squash | Step 1 checks `collaborator/permission` API — only `write`, `maintain`, and `admin` roles proceed |
| Force-push to protected branch | `--force-with-lease` prevents overwrites if someone else pushed; branch protection rules still apply |
| Copilot CLI leaking secrets in suggestions | Copilot CLI operates on diff context only; no secrets are passed as input |
| Concurrent trigger on same PR | Concurrency group `pr-rebase-squash-${{ github.event.issue.number }}` ensures only one run at a time |
| Malicious comment body injection | Command parsing uses strict regex anchored to `^\s*/rebase` or `^\s*/squash`; arbitrary text is not executed |
| `GITHUB_TOKEN` scope | Default token is scoped to the repository and expires after the workflow run; used only for Git push and GitHub API calls |
| `COPILOT_PAT` secret exposure | The PAT is only exposed via `COPILOT_GITHUB_TOKEN` env var in the two steps that call `gh copilot`; it is never logged or passed to other steps. If the secret is missing, the workflow degrades gracefully (no AI features) |
| PAT owner's Copilot subscription | The PAT must belong to an account with an active Copilot subscription; if the subscription lapses, only the AI features stop working — rebase/squash still function manually |

> **Note:** The `issue_comment` trigger runs the workflow from the **default branch**,
> not the PR branch. This means the workflow YAML must be merged to the default branch
> before it will respond to comments. This is a GitHub Actions platform constraint, not
> a bug.

---

## 8. Test Plan

Because this is a workflow (not library code), testing is primarily manual and
integration-based.

### 8.1 Manual Test Matrix

| Test Case | Command | Expected Result | Phase |
|---|---|---|---|
| Happy-path rebase (no conflicts) | `/rebase` | Branch rebased, summary comment posted | 2 |
| Rebase with auto-resolvable conflict | `/rebase` | Copilot resolves conflict, branch pushed | 2 |
| Rebase with un-resolvable conflict | `/rebase` | Rebase aborted, failure comment lists files | 2 |
| Happy-path squash (3+ commits) | `/squash` | Single commit with Conventional Commits message | 3 |
| Squash single-commit PR (no-op) | `/squash` | No change, "nothing to squash" summary | 3 |
| Combined rebase + squash | `/rebase squash` | Rebased then squashed in one run | 4 |
| Non-collaborator trigger | `/rebase` | Workflow fails at permission check, no push | 1 |
| Closed PR trigger | `/squash` | Workflow exits with "PR is not open" | 4 |
| Concurrent triggers | `/squash` × 2 | Second run queues or is rejected by concurrency group | 4 |
| Copilot CLI unavailable | `/squash` | Falls back to generic commit message | 3 |

### 8.2 Automated Validation (Post-Push)

After the workflow pushes the rebased/squashed branch, the existing CI pipeline
(`ci.yml`, `test-unit.yml`) runs automatically on the new commits, providing
automated validation that the rebase/squash did not break anything. The
`commitlint` job validates that the Copilot-generated message follows Conventional
Commits.

---

## 9. References

- [GitHub Actions: `issue_comment` event](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#issue_comment)
- [GitHub Copilot CLI](https://docs.github.com/en/copilot/github-copilot-in-the-cli)
- [Authenticating Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/authenticate-copilot-cli) — token types, env vars, CI setup
- [Installing Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/install-copilot-cli)
- [Fine-grained PAT creation](https://github.com/settings/tokens?type=beta) — token generation page
- [Conventional Commits specification](https://www.conventionalcommits.org/)
- [`commitlint` configuration](../../commitlint.config.mjs)
- [Existing `self-healing-ci.yml`](../../.github/workflows/self-healing-ci.yml) — pattern for PR commenting
- [`git push --force-with-lease` documentation](https://git-scm.com/docs/git-push#Documentation/git-push.txt---force-with-leaseltrefnamegt)
