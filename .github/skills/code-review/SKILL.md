---
name: code-review
description: >-
  Multi-agent code review for Python projects. Use when reviewing local
  uncommitted changes, pull request diffs, or when asked to do a code
  review. Dispatches specialist agents (bug-hunter, security-auditor,
  test-coverage, code-quality, contracts, historical context) and
  aggregates results with confidence scoring.
---

# Code Review

Comprehensive multi-agent code review adapted for Python codebases.
Six specialist agents examine code from different angles — bugs, security,
test coverage, code quality, contracts, and historical context — then a
confidence-scoring phase filters out false positives before reporting.

## Essential Principles

<essential_principles>

<principle name="independent-specialists">
**Run each specialist agent independently.**

Each agent examines a different dimension. Agents run one at a time via
the Task tool (Copilot does not support parallel sub-agents). Keep agents
independent so their findings are not influenced by each other's results.
</principle>

<principle name="confidence-over-volume">
**Filter by confidence × impact, not by count.**

A review that reports 50 low-confidence nitpicks is worse than one that
reports 3 high-confidence critical issues. Every finding goes through a
confidence-scoring phase; only issues above threshold survive.
</principle>

<principle name="python-idiomatic">
**Apply Python-specific knowledge, not generic rules.**

Check for Python-specific pitfalls: mutable default arguments, late-binding
closures, `except Exception` swallowing, unsafe `pickle`/`yaml.load`,
missing `async`/`await`, Pydantic validation gaps, and Django/FastAPI
framework patterns. Skip checks that don't apply to Python.
</principle>

<principle name="respect-project-conventions">
**Read AGENTS.md, pyproject.toml, and ruff config before flagging style issues.**

This project uses ruff for linting/formatting (line-length 120), pytest for
tests, uv for dependency management, and Conventional Commits. Don't flag
issues the existing toolchain already catches.
</principle>

<principle name="actionable-output">
**Every finding must include file path, line number, and a concrete fix.**

Vague advice ("consider improving error handling") wastes reviewer time.
Cite the exact location, explain the consequence, and show a code fix.
</principle>

</essential_principles>

## When to Use

- Reviewing local uncommitted changes before committing
- Reviewing a pull request for bugs, security, and quality
- Running a pre-merge quality gate
- Investigating a specific file or module for issues
- When asked to "review", "audit", or "check" code

## When NOT to Use

- Running linters or formatters — use `uv run pre-commit run --all-files` directly
- Writing new tests — use the `test-refactoring` skill or write them manually
- Performance benchmarking — use the `benchmarks` skill
- Planning new features — use the `writing-plans` skill

## Review Mode Selection

```
What are you reviewing?
│
├─ Local uncommitted changes (git diff)
│  └─ Follow: workflows/review-local-changes.md
│
├─ A pull request (PR number given)
│  └─ Follow: workflows/review-pr.md
│
└─ Specific files (paths given)
   └─ Treat as local changes review scoped to those files
```

## Agent Architecture

Six specialist agents run independently during Phase 2 of each workflow:

| Agent | Focus | Reference |
|-------|-------|-----------|
| **Bug Hunter** | Runtime errors, None/null issues, race conditions, resource leaks | [bug-hunter.md](references/bug-hunter.md) |
| **Security Auditor** | Injection, auth bypass, secrets exposure, unsafe deserialization | [security-auditor.md](references/security-auditor.md) |
| **Test Coverage** | Missing tests, weak assertions, untested error paths | [test-coverage-reviewer.md](references/test-coverage-reviewer.md) |
| **Code Quality** | PEP 8, complexity, naming, SOLID, DRY, project conventions | [code-quality-reviewer.md](references/code-quality-reviewer.md) |
| **Contracts** | Pydantic models, type hints, API schemas, breaking changes | [contracts-reviewer.md](references/contracts-reviewer.md) |
| **Historical Context** | Git blame, past bugs, hotspot files, architectural drift | [historical-context-reviewer.md](references/historical-context-reviewer.md) |

### Agent Applicability

Not every agent needs to run on every review. Select based on what changed:

| Condition | Agents to Run |
|-----------|---------------|
| Any code changes | bug-hunter, security-auditor, code-quality |
| Test files changed | + test-coverage |
| Types/models/API changed | + contracts |
| Complex or high-risk changes | + historical-context |
| All (default) | All six agents |

## Confidence Scoring

After agents report findings, each issue is scored on two axes:

**Confidence (0–100):** How certain is this a real issue?

| Score | Meaning |
|-------|---------|
| 0 | False positive — doesn't survive scrutiny |
| 25 | Might be real, might be false positive |
| 50 | Real issue, but minor or unlikely in practice |
| 75 | Verified real issue, will be hit in practice |
| 100 | Certain — evidence directly confirms it |

**Impact (0–100):** How bad is it if left unfixed?

| Score | Meaning |
|-------|---------|
| 0–20 | Minor code smell, no functional impact |
| 21–40 | Hurts maintainability or readability |
| 41–60 | Causes errors in edge cases or degrades performance |
| 61–80 | Breaks core features or corrupts data |
| 81–100 | Runtime crash, data loss, or security breach |

### Filtering Thresholds

Higher-impact issues require less confidence to pass:

| Impact | Min Confidence | Rationale |
|--------|---------------|-----------|
| 81–100 (Critical) | 50 | Critical issues warrant investigation even with moderate confidence |
| 61–80 (High) | 65 | High-impact issues need good confidence |
| 41–60 (Medium) | 75 | Medium issues need high confidence |
| 21–40 (Low-Medium) | 85 | Low-medium issues need very high confidence |
| 0–20 (Low) | 95 | Minor issues only if nearly certain |

### False Positive Examples

These should be filtered out:

- Pre-existing issues in unchanged code
- Issues that ruff, ty, or pytest would catch (CI handles those)
- Pedantic nitpicks a senior engineer wouldn't flag
- Intentional functionality changes related to the broader change
- Issues silenced by `# noqa`, `type: ignore`, or similar comments
- General suggestions without specific evidence ("consider adding more tests")

## Quick Reference: Python-Specific Checks

| Category | What to Look For |
|----------|-----------------|
| **Mutable defaults** | `def f(items=[])` — use `None` + conditional |
| **Broad except** | `except Exception` / bare `except:` swallowing errors |
| **Async pitfalls** | Missing `await`, blocking calls in async functions |
| **Pydantic** | Missing validators, wrong `model_config`, mutable defaults in models |
| **Type hints** | Missing return types on public functions, `Any` overuse |
| **Imports** | Circular imports, unused imports, inline imports |
| **Resource leaks** | Files/connections not using context managers |
| **Security** | `pickle.load`, `yaml.load` (not `safe_load`), `eval()`, f-string SQL |
| **Testing** | Assertions without messages, `assert True`, missing parametrize IDs |

## Reference Index

| File | Content |
|------|---------|
| [bug-hunter.md](references/bug-hunter.md) | Bug detection agent instructions — root cause analysis, Python-specific patterns |
| [security-auditor.md](references/security-auditor.md) | Security audit agent — OWASP, Python-specific vulnerabilities |
| [test-coverage-reviewer.md](references/test-coverage-reviewer.md) | Test coverage agent — pytest patterns, behavioral coverage |
| [code-quality-reviewer.md](references/code-quality-reviewer.md) | Code quality agent — PEP 8, SOLID, complexity, project conventions |
| [contracts-reviewer.md](references/contracts-reviewer.md) | Contracts agent — Pydantic, typing, API design, breaking changes |
| [historical-context-reviewer.md](references/historical-context-reviewer.md) | Historical context agent — git archaeology, hotspots, past patterns |

| Workflow | Purpose |
|----------|---------|
| [review-local-changes.md](workflows/review-local-changes.md) | 3-phase workflow for reviewing uncommitted local changes |
| [review-pr.md](workflows/review-pr.md) | 3-phase workflow for reviewing a pull request |

## Success Criteria

A well-executed code review:

- [ ] Ran all applicable specialist agents
- [ ] Every finding includes file path, line number, and concrete fix
- [ ] Confidence scoring filtered out false positives (threshold applied)
- [ ] No issues flagged that ruff/ty/pytest would already catch
- [ ] Python-specific patterns checked (mutable defaults, async, Pydantic)
- [ ] Project conventions (AGENTS.md, pyproject.toml) respected
- [ ] Critical/High issues clearly separated from suggestions
- [ ] Output follows the structured report template
