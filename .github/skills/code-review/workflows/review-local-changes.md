# Review Local Changes Workflow

Review uncommitted local changes using specialist agents with
confidence-based filtering.

## Phase 1: Preparation

**Entry criteria:** User asked for a local code review.

### Steps

1. **Check for changes:**
   ```bash
   git status --short
   git diff --name-only
   git diff --stat
   ```
   If no changes exist, inform the user and stop.

2. **Gather project context:**
   Locate and note paths to (do not read contents yet):
   - `AGENTS.md` (commit message guidelines)
   - `pyproject.toml` (ruff config, project settings)
   - `README.md` (project overview)
   - Any `README.md` in directories containing changed files
   - `.pre-commit-config.yaml` (linting setup)

3. **Summarise changes:**
   Use a lightweight agent to produce:
   - Full list of changed files with types (`.py`, `.md`, `.yml`, etc.)
   - Additions/deletions per file
   - Overall scope classification (feature, bugfix, refactor, docs, test)

**Exit criteria:** Change summary produced, or user informed of no changes.

## Phase 2: Agent Review

**Entry criteria:** Change summary available from Phase 1.

### Select Applicable Agents

Based on the change summary, select which agents to run:

| Condition | Agents |
|-----------|--------|
| Any `.py` code changes | bug-hunter, security-auditor, code-quality |
| Test files changed (`test_*.py`, `conftest.py`) | + test-coverage |
| Types/models/API endpoints changed | + contracts |
| Complex or risky changes (>200 lines, core modules) | + historical-context |
| Default (all) | All six agents |

### Launch Agents

Launch selected agents sequentially via the Task tool. Provide each agent with:

- Full list of changed files and the diff
- Change summary from Phase 1
- Paths to project guidelines (AGENTS.md, pyproject.toml)

Each agent follows its reference document:

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
- Source (which agent found it and why)
- Suggested fix

**Exit criteria:** All launched agents have returned results.

## Phase 3: Confidence Scoring & Report

**Entry criteria:** All agent results collected.

### Score Each Issue

For each issue, evaluate:

1. **Confidence (0–100):** How certain is this a real issue?
   - 0: False positive
   - 25: Might be real
   - 50: Real but minor/unlikely
   - 75: Verified real, will be hit in practice
   - 100: Certain, evidence confirms it

2. **Impact (0–100):** How bad if unfixed?
   - 0–20: Minor code smell
   - 21–40: Maintainability/readability
   - 41–60: Edge-case errors, performance
   - 61–80: Breaks core features, data corruption
   - 81–100: Runtime crash, data loss, security breach

### Filter

Apply thresholds from SKILL.md:

| Impact | Min Confidence |
|--------|---------------|
| 81–100 | 50 |
| 61–80 | 65 |
| 41–60 | 75 |
| 21–40 | 85 |
| 0–20 | 95 |

Discard issues below threshold.

### False Positive Checklist

Remove issues that are:
- Pre-existing in unchanged code
- Caught by ruff/ty/pytest in CI
- Pedantic nitpicks
- Intentional changes related to the broader task
- Silenced by `# noqa`, `type: ignore`, etc.

### Generate Report

Use this template:

```markdown
# 📋 Local Changes Review Report

## 🎯 Quality Assessment

**Quality Gate**: ⬜ READY TO COMMIT / ⬜ NEEDS FIXES
**Blocking Issues:** X

### Scores
- **Security**: X/Y
- **Test Coverage**: X/Y
- **Code Quality**: X/Y

---

## 🚫 Must Fix Before Commit

1. [Critical/High issues with file:line and fix]

## ⚠️ Should Fix Before Commit

1. [Medium issues]

## 💡 Consider for Future

1. [Low-priority suggestions]

---

## 🐛 Issues Found

| File:Line | Issue | Evidence | Impact |
|-----------|-------|----------|--------|
| `file.py:42` | [description] | [evidence] | Critical/High/Medium/Low |

## 🔒 Security Issues

| Severity | File:Line | Type | Risk | Fix |
|----------|-----------|------|------|-----|
| | | | | |

## ✨ Improvements

1. **[Description]**
   - **File:** `path/to/file.py:line`
   - **Reasoning:** [why]
   - **Effort:** Low/Medium/High
```

If no issues found:

```markdown
# 📋 Local Changes Review Report

## ✅ All Clear!

No critical issues found. Code changes look good.

**Checked:** Bugs ✓ | Security ✓ | Quality ✓ | Tests ✓ | Conventions ✓

**Quality Gate**: ✅ READY TO COMMIT
```

**Exit criteria:** Report displayed to user.
