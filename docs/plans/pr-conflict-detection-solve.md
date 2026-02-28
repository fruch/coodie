# PR Conflict Detection & `/solve` Slash-Command

> **Goal:** Add two GitHub Actions workflows: (1) automatically label pull
> requests with a `conflict` label when merge conflicts are detected against
> the base branch, and (2) respond to a `/solve` slash-command in PR comments
> by using Copilot CLI to resolve the conflict and push a merge commit.

---

## Table of Contents

1. [Current State](#1-current-state)
2. [Desired Behavior](#2-desired-behavior)
3. [Feature Gap Analysis](#3-feature-gap-analysis)
4. [Implementation Phases](#4-implementation-phases)
   - [Phase 1: `conflict` Label & Detection Workflow](#phase-1-conflict-label--detection-workflow-priority-high)
   - [Phase 2: `/solve` Slash-Command Workflow](#phase-2-solve-slash-command-workflow-priority-high)
   - [Phase 3: Shared Conflict-Resolution Script](#phase-3-shared-conflict-resolution-script-priority-medium)
   - [Phase 4: Safety Gates & Edge Cases](#phase-4-safety-gates--edge-cases-priority-medium)
   - [Phase 5: Testing & Documentation](#phase-5-testing--documentation-priority-medium)
5. [Workflow YAML Design](#5-workflow-yaml-design)
   - [5.1 Conflict Detection Workflow](#51-conflict-detection-workflow)
   - [5.2 `/solve` Command Workflow](#52-solve-command-workflow)
6. [Security Considerations](#6-security-considerations)
7. [Test Plan](#7-test-plan)
8. [References](#8-references)

---

## 1. Current State

The repository already has conflict-resolution infrastructure in place:

| Component | File | Purpose |
|---|---|---|
| PR Rebase & Squash workflow | `pr-rebase-squash.yml` | `/rebase` and `/squash` slash-commands with Copilot CLI conflict resolution during rebase |
| `resolve-conflicts.sh` | `.github/scripts/resolve-conflicts.sh` | Iterative Copilot CLI conflict resolution script (used by rebase workflow) |
| Label sync | `labels.yml` + `.github/labels.toml` | Syncs GitHub labels from TOML config to the repository |
| Self-Healing CI | `self-healing-ci.yml` | Auto-comments on PRs when CI fails — pattern for PR commenting |
| `parse-command.sh` | `.github/scripts/parse-command.sh` | Parses `/rebase`, `/squash` slash-commands from comment bodies |

**What is missing:**

- No workflow detects merge conflicts on open PRs and labels them automatically.
- No `/solve` slash-command exists to resolve conflicts without a full rebase.
- The `conflict` label does not exist in `.github/labels.toml`.

---

## 2. Desired Behavior

### Workflow 1: Conflict Detection & Labeling

| Trigger | Effect |
|---|---|
| Push to default branch (`main`) | Check all open PRs for merge conflicts. Add `conflict` label to PRs that are not mergeable. Remove `conflict` label from PRs that are clean. |
| `pull_request` `synchronize` / `opened` / `reopened` | Check the triggering PR for merge conflicts. Add or remove the `conflict` label accordingly. |

The `conflict` label is applied and removed automatically — maintainers never
need to manage it manually. This gives immediate visual feedback in the PR list.

### Workflow 2: `/solve` Slash-Command

| Command | Effect |
|---|---|
| `/solve` | Attempt to resolve merge conflicts in the PR branch using Copilot CLI. Merge the base branch into the PR branch (merge strategy, not rebase), resolve any conflicts with Copilot, and push the result. Post a summary comment. |

> **Why merge instead of rebase?** The existing `/rebase` command already
> handles the rebase-with-conflict-resolution flow. `/solve` uses a merge
> strategy so that existing commit history is preserved and the operation is
> less destructive. This gives maintainers a choice between the two approaches.

---

## 3. Feature Gap Analysis

Legend:
- ✅ **Implemented** — working today
- 🔧 **Partial** — infrastructure exists but not fully exposed
- ❌ **Missing** — not yet implemented

| Feature | Status | Notes |
|---|---|---|
| `conflict` label in `.github/labels.toml` | ❌ | Must be added to label config |
| Workflow: detect merge conflicts on push to default branch | ❌ | Need `push` trigger scoped to default branch |
| Workflow: detect merge conflicts on PR events | ❌ | Need `pull_request` trigger for `opened`, `synchronize`, `reopened` |
| GitHub API: check PR mergeability | 🔧 | `gh api /pulls/:number` returns `mergeable` field; may need retry due to GitHub's async calculation |
| Add/remove labels via API | ✅ | `gh pr edit --add-label` / `--remove-label` works today |
| `/solve` slash-command trigger | ❌ | Need `issue_comment` event with `/solve` filter |
| Merge base branch into PR branch | ❌ | `git merge origin/<base>` instead of rebase |
| Copilot CLI conflict resolution | ✅ | `resolve-conflicts.sh` already handles this for rebase — can reuse |
| Permission check for slash-commands | ✅ | Pattern exists in `pr-rebase-squash.yml` |
| Post summary comment | ✅ | Pattern exists in `pr-rebase-squash.yml` and `self-healing-ci.yml` |
| Concurrency control | ✅ | Concurrency group pattern exists in `pr-rebase-squash.yml` |

**Gap summary — conflict detection:**
- Add `conflict` label to `.github/labels.toml` (red color, descriptive text)
- Create `.github/workflows/pr-conflict-label.yml` with dual triggers: `push` to default branch (batch-check all open PRs) and `pull_request` events (check the single PR)
- Use `gh api /pulls/:number` with retry loop for GitHub's async `mergeable` calculation
- Add/remove label with `gh pr edit`

**Gap summary — `/solve` command:**
- Extend `.github/scripts/parse-command.sh` to recognize `/solve`, or create a dedicated workflow
- Create `.github/workflows/pr-solve-conflicts.yml` triggered by `issue_comment`
- Merge base branch into PR branch (`git merge`), invoke `resolve-conflicts.sh` on conflicts
- Push result, post summary comment

---

## 4. Implementation Phases

### Phase 1: `conflict` Label & Detection Workflow (Priority: High)

**Goal:** Automatically label PRs with `conflict` when merge conflicts are detected.

| Task | Description |
|---|---|
| 1.1 | Add `conflict` label to `.github/labels.toml` (color: `e11d48`, description: "PR has merge conflicts with the base branch") |
| 1.2 | Create `.github/workflows/pr-conflict-label.yml` with `push` trigger on default branch and `pull_request` triggers (`opened`, `synchronize`, `reopened`) |
| 1.3 | On `push` to default branch: list all open PRs (`gh pr list --state open`), check mergeability of each via `gh api /pulls/:number`, add/remove `conflict` label accordingly |
| 1.4 | On `pull_request` events: check mergeability of the triggering PR, add/remove `conflict` label |
| 1.5 | Handle GitHub's async mergeability calculation: retry `gh api /pulls/:number` up to 5 times with 2-second backoff until `mergeable` is non-null |
| 1.6 | Add Bats tests for the mergeability-check logic if extracted to a script |

### Phase 2: `/solve` Slash-Command Workflow (Priority: High)

**Goal:** Allow maintainers to resolve merge conflicts via a `/solve` PR comment.

| Task | Description |
|---|---|
| 2.1 | Create `.github/workflows/pr-solve-conflicts.yml` with `issue_comment` trigger filtered to `/solve` |
| 2.2 | Add `workflow_dispatch` trigger with `pr_number` input for manual testing from the Actions tab |
| 2.3 | Reuse permission-check pattern from `pr-rebase-squash.yml` (collaborator with write access) |
| 2.4 | React "eyes" to the trigger comment to acknowledge the command |
| 2.5 | Checkout PR branch with `fetch-depth: 0`, configure Git identity (comment author) |
| 2.6 | Fetch base branch and run `git merge origin/<base>` — if clean, push and post success comment |
| 2.7 | On conflict: install Copilot CLI, invoke `resolve-conflicts.sh` (adapted for merge instead of rebase), push merge commit |
| 2.8 | On unresolved conflicts: abort merge, post failure comment listing unresolved files |
| 2.9 | Post summary comment with "rocket" reaction on success, "confused" on failure |

### Phase 3: Shared Conflict-Resolution Script (Priority: Medium)

**Goal:** Refactor `resolve-conflicts.sh` to work for both rebase and merge flows.

| Task | Description |
|---|---|
| 3.1 | Audit `resolve-conflicts.sh` — currently uses `git rebase --continue`; generalize to accept a `--mode` flag (`rebase` or `merge`) |
| 3.2 | In `merge` mode: after resolving all conflicts in a round, run `git commit --no-edit` instead of `git rebase --continue` |
| 3.3 | In `rebase` mode: preserve existing `git rebase --continue` behavior (no breaking changes) |
| 3.4 | Update `pr-rebase-squash.yml` to pass `--mode rebase` (or set `RESOLVE_MODE=rebase` env var) |
| 3.5 | Update Bats tests in `tests/workflows/test_resolve_conflicts.bats` to cover merge mode |

### Phase 4: Safety Gates & Edge Cases (Priority: Medium)

**Goal:** Handle edge cases and prevent unintended behavior.

| Task | Description |
|---|---|
| 4.1 | Conflict detection: skip PRs from forks (cannot add labels to cross-repo PRs without additional permissions) |
| 4.2 | Conflict detection: add concurrency group to prevent overlapping label updates |
| 4.3 | `/solve` command: block if PR is closed or merged |
| 4.4 | `/solve` command: add concurrency group per PR number |
| 4.5 | `/solve` command: handle case where PR already has no conflicts (no-op with informative comment) |
| 4.6 | `/solve` command: if `COPILOT_PAT` secret is missing, fall back to `git merge --abort` and post a comment asking the user to resolve manually |
| 4.7 | Remove `conflict` label after a successful `/solve` run (label is already removed on next `synchronize` event, but explicit removal is faster feedback) |

### Phase 5: Testing & Documentation (Priority: Medium)

**Goal:** Add tests, update documentation, and ensure discoverability.

| Task | Description |
|---|---|
| 5.1 | Add workflow-convention tests in `tests/test_workflow_conventions.py` for the new workflow files (actions pinned, `GH_TOKEN` env, `fetch-depth: 0`, concurrency groups) |
| 5.2 | Add Bats tests for any new scripts or script changes (mergeability check, parse-command extension) |
| 5.3 | Update `CONTRIBUTING.md` with `/solve` command documentation in the slash-command reference table |
| 5.4 | Add a note to the `pr-rebase-squash.yml` header comment cross-referencing `/solve` |
| 5.5 | Update this plan with ✅ status for completed phases |

---

## 5. Workflow YAML Design

### 5.1 Conflict Detection Workflow

**File:** `.github/workflows/pr-conflict-label.yml`

**Triggers:**

```yaml
on:
  push:
    branches: [main]
  pull_request:
    types: [opened, synchronize, reopened]
```

**Permissions:**

| Permission | Scope | Reason |
|---|---|---|
| `contents: read` | Repository | Read repository to check mergeability |
| `pull-requests: write` | Repository | Add/remove labels on PRs |

**Pseudocode:**

```
on push to main:
  1. List all open PRs (gh pr list --state open --json number)
  2. For each PR:
     a. GET /repos/:owner/:repo/pulls/:number → check "mergeable" field
     b. Retry up to 5 times if "mergeable" is null (GitHub calculates async)
     c. If mergeable == false → gh pr edit --add-label "conflict"
     d. If mergeable == true  → gh pr edit --remove-label "conflict"

on pull_request (opened/synchronize/reopened):
  1. GET /repos/:owner/:repo/pulls/:number → check "mergeable" field
  2. Retry up to 5 times if "mergeable" is null
  3. If mergeable == false → gh pr edit --add-label "conflict"
  4. If mergeable == true  → gh pr edit --remove-label "conflict"
```

> **Note:** The `mergeable` field in the GitHub API is computed asynchronously.
> After a push, it may be `null` for a few seconds. The workflow must retry
> with a short backoff before giving up.

### 5.2 `/solve` Command Workflow

**File:** `.github/workflows/pr-solve-conflicts.yml`

**Triggers:**

```yaml
on:
  issue_comment:
    types: [created]
  workflow_dispatch:
    inputs:
      pr_number:
        description: 'Pull request number to operate on'
        required: true
        type: number
```

**Permissions:**

| Permission | Scope | Reason |
|---|---|---|
| `contents: write` | Repository | Push merge commit to PR branch |
| `pull-requests: write` | Repository | Post summary comments, remove `conflict` label |
| `issues: write` | Repository | Add reaction to trigger comment |

**Pseudocode:**

```
1.  Trigger: issue_comment created
2.  Guard: is this a PR comment? (github.event.issue.pull_request exists)
3.  Guard: does the body match /solve?
4.  Guard: is the author a collaborator with write access?
5.  React "eyes" to the comment
6.  Checkout PR branch (full history)
7.  Configure git identity (comment author)
8.  Fetch base branch
9.  git merge origin/<base-branch>
10. If clean merge:
      a. git push
      b. gh pr edit --remove-label "conflict"
      c. Post success comment
11. If conflict:
      a. Install Copilot CLI (npm install -g @github/copilot)
      b. Run resolve-conflicts.sh (merge mode)
      c. If resolved:
           - git commit --no-edit
           - git push
           - gh pr edit --remove-label "conflict"
           - Post success comment (list resolved files)
      d. If unresolved:
           - git merge --abort
           - Post failure comment (list unresolved files)
12. React "rocket" on success or "confused" on failure
```

---

## 6. Security Considerations

| Risk | Mitigation |
|---|---|
| Non-collaborator triggering `/solve` | Permission check: only `write`, `maintain`, and `admin` roles proceed (same pattern as `pr-rebase-squash.yml`) |
| Force-push risk | `/solve` uses `git merge` + `git push` (no force-push needed); existing commit history is preserved |
| Copilot CLI leaking code via API | Copilot CLI sends only the conflicted file content; no secrets or env vars are included in prompts |
| Label manipulation by forks | Conflict detection skips fork PRs where the workflow lacks label-write permissions |
| `COPILOT_PAT` secret exposure | PAT is exposed only via `COPILOT_GITHUB_TOKEN` env var in the Copilot step; never logged or passed to other steps |
| Concurrent `/solve` runs on same PR | Concurrency group `pr-solve-${{ PR_NUMBER }}` ensures only one run at a time |
| Malicious comment body injection | Command parsing uses strict regex anchored to `^\s*/solve\s*$`; arbitrary text is not executed |
| GitHub mergeability race condition | Retry loop with backoff handles the async `mergeable` field; avoids false-positive labeling |

> **Note:** Like `pr-rebase-squash.yml`, the `issue_comment` trigger runs from
> the **default branch**. The `/solve` workflow YAML must be merged to the
> default branch before it will respond to comments.

---

## 7. Test Plan

### 7.1 Automated Tests

| Test Case | File | Phase |
|---|---|---|
| New workflow files pass actionlint static analysis | Pre-commit hook (actionlint) | 5 |
| `pr-conflict-label.yml` has correct structure (pinned actions, `GH_TOKEN`, concurrency) | `tests/test_workflow_conventions.py` | 5 |
| `pr-solve-conflicts.yml` has correct structure (pinned actions, `GH_TOKEN`, `fetch-depth: 0`, concurrency) | `tests/test_workflow_conventions.py` | 5 |
| `resolve-conflicts.sh` merge mode: resolves conflicts and commits | `tests/workflows/test_resolve_conflicts.bats` | 3 |
| `resolve-conflicts.sh` merge mode: reports unresolved files | `tests/workflows/test_resolve_conflicts.bats` | 3 |
| `resolve-conflicts.sh` rebase mode: existing tests still pass (no regression) | `tests/workflows/test_resolve_conflicts.bats` | 3 |

### 7.2 Manual Test Matrix

| Test Case | Trigger | Expected Result | Phase |
|---|---|---|---|
| Push to `main` labels conflicting PRs | `git push` to `main` | Open PRs with conflicts get `conflict` label | 1 |
| Push to `main` removes label from clean PRs | `git push` to `main` | Clean PRs have `conflict` label removed | 1 |
| PR sync event adds label on conflict | Push to PR branch that creates conflict | PR gets `conflict` label | 1 |
| PR sync event removes label when clean | Push to PR branch that resolves conflict | `conflict` label removed | 1 |
| `/solve` with auto-resolvable conflict | `/solve` comment | Copilot resolves conflict, merge commit pushed, label removed | 2 |
| `/solve` with un-resolvable conflict | `/solve` comment | Merge aborted, failure comment lists files | 2 |
| `/solve` on PR with no conflicts (no-op) | `/solve` comment | Informative comment: "No conflicts to resolve" | 4 |
| `/solve` by non-collaborator | `/solve` comment | Workflow fails at permission check | 2 |
| `/solve` on closed PR | `/solve` comment | Workflow exits with "PR is not open" | 4 |
| `/solve` without `COPILOT_PAT` | `/solve` comment | Merge aborted, comment asks user to resolve manually | 4 |
| `workflow_dispatch` trigger for `/solve` | Actions tab | Same behavior as comment trigger | 2 |

---

## 8. References

- [GitHub Actions: `pull_request` event](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#pull_request)
- [GitHub Actions: `issue_comment` event](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#issue_comment)
- [GitHub REST API: Get a pull request](https://docs.github.com/en/rest/pulls/pulls#get-a-pull-request) — `mergeable` field
- [GitHub REST API: Labels](https://docs.github.com/en/rest/issues/labels)
- [GitHub Copilot CLI](https://docs.github.com/en/copilot/github-copilot-in-the-cli)
- [Existing `pr-rebase-squash.yml`](../../.github/workflows/pr-rebase-squash.yml) — pattern for slash-commands, permissions, Copilot CLI
- [Existing `resolve-conflicts.sh`](../../.github/scripts/resolve-conflicts.sh) — reusable conflict resolution script
- [Existing `labels.yml`](../../.github/workflows/labels.yml) + [`.github/labels.toml`](../../.github/labels.toml) — label sync infrastructure
- [Existing `self-healing-ci.yml`](../../.github/workflows/self-healing-ci.yml) — pattern for PR commenting
- [Conventional Commits specification](https://www.conventionalcommits.org/)
