# Review PR Workflow

Review a pull request using specialist agents with
confidence-based filtering. Post findings as inline PR comments.

## Phase 1: Preparation

**Entry criteria:** User provided a PR number or the PR context is available.

### Steps

1. **Check PR eligibility:**
   ```bash
   gh pr view <number> --json state,isDraft,title,body
   ```
   - If PR is closed or a draft, inform user and stop.

2. **Gather changes:**
   ```bash
   git diff --stat origin/main...HEAD
   gh pr diff <number> --name-only
   gh pr view <number> --json files
   ```

3. **Gather project context:**
   Locate paths to (do not read contents yet):
   - `AGENTS.md`
   - `pyproject.toml`
   - `README.md`
   - Any `README.md` in directories containing changed files

4. **Summarise changes:**
   For each changed file, produce:
   - File type and purpose
   - Number of additions/deletions
   - Complexity assessment (Low/Medium/High)
   - Affected classes/functions/modules

5. **Check PR description:**
   If the PR has no body/description, add a concise summary using:
   ```bash
   gh pr edit <number> --body "<summary>"
   ```

**Exit criteria:** Change summary produced and PR is eligible.

## Phase 2: Agent Review

**Entry criteria:** Change summary available from Phase 1.

### Select Applicable Agents

| Condition | Agents |
|-----------|--------|
| Code or config changes (not purely cosmetic) | bug-hunter, security-auditor |
| Code changes (business/infra logic) | + code-quality |
| Test files changed | + test-coverage |
| Types, models, or API changes | + contracts |
| Complex changes or historical context needed | + historical-context |

### Launch Agents

Launch selected agents sequentially via the Task tool. Provide each agent with:

- Full list of modified files and the PR diff
- Change summary from Phase 1
- PR title and description
- Paths to project guidelines (AGENTS.md, pyproject.toml)

Each agent follows its reference:

| Agent | Reference |
|-------|-----------|
| Bug Hunter | [bug-hunter.md](../references/bug-hunter.md) |
| Security Auditor | [security-auditor.md](../references/security-auditor.md) |
| Test Coverage | [test-coverage-reviewer.md](../references/test-coverage-reviewer.md) |
| Code Quality | [code-quality-reviewer.md](../references/code-quality-reviewer.md) |
| Contracts | [contracts-reviewer.md](../references/contracts-reviewer.md) |
| Historical Context | [historical-context-reviewer.md](../references/historical-context-reviewer.md) |

Agents return a list of issues, each with:
- File path and line number(s)
- Issue description
- Source (agent + reason)
- Suggested fix

**Exit criteria:** All launched agents have returned results.

## Phase 3: Confidence Scoring & Inline Comments

**Entry criteria:** All agent results collected.

### Score Each Issue

For each issue, evaluate two scores:

1. **Confidence (0–100):** How certain is this real?
   - 0: False positive
   - 25: Might be real
   - 50: Real but minor/unlikely
   - 75: Verified real, will be hit in practice
   - 100: Certain with evidence

2. **Impact (0–100):** How bad if unfixed?
   - 0–20: Minor code smell
   - 21–40: Maintainability/readability
   - 41–60: Edge-case errors, performance
   - 61–80: Breaks core features, data corruption
   - 81–100: Runtime crash, data loss, security breach

### Filter

Apply thresholds:

| Impact | Min Confidence |
|--------|---------------|
| 81–100 | 50 |
| 61–80 | 65 |
| 41–60 | 75 |
| 21–40 | 85 |
| 0–20 | 95 |

Discard issues below threshold.

**Do NOT post inline comments for:**
- Low-impact issues (0–20) — even with high confidence, they add noise
- Issues below confidence threshold for their impact level
- Issues on lines the PR author did not modify

Focus on Medium (41+) and higher impact issues.

### False Positive Checklist

Remove issues that are:
- Pre-existing in unchanged code
- Caught by ruff/ty/pytest in CI
- Pedantic nitpicks
- Intentional changes related to the broader PR goal
- Silenced by `# noqa`, `type: ignore`, etc.
- On lines the user did not modify

### Re-check Eligibility

Verify the PR is still open and not converted to draft since Phase 1.

### Post Inline Comments

If issues remain after filtering, post them as inline PR comments.

**Comment template:**

```markdown
🔴/🟠/🟡 [Critical/High/Medium]: [Brief description]

[Evidence: What was observed and consequence if unfixed]

```suggestion
[code fix if applicable]
```
```

**Posting methods (in order of preference):**

1. **MCP GitHub tools** (if available):
   Use `mcp__github_inline_comment__create_inline_comment` for each issue.

2. **GitHub API** (fallback):
   - Multiple issues:
     ```bash
     gh api repos/{owner}/{repo}/pulls/{pr_number}/reviews \
       --input review.json
     ```
   - Single issue:
     ```bash
     gh api repos/{owner}/{repo}/pulls/{pr_number}/comments \
       --input comment.json
     ```

**Comment guidelines:**
- Keep comments brief and actionable
- Use severity emojis: 🔴 Critical, 🟠 High, 🟡 Medium
- Include `suggestion` blocks with code fixes where possible
- Link to specific lines using full SHA URLs

### No Issues Found

If no issues pass filtering, do not post any comments. Report to the
user that the review found no significant issues.

**Exit criteria:** Inline comments posted (or user informed of clean review).
