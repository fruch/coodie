---
name: writing-plans
description: >-
  Guides the creation and structuring of project plans in docs/plans/.
  Use when writing feature-parity plans, gap analyses, documentation plans,
  or implementation roadmaps. Covers plan templates, status tracking
  conventions, phase numbering, task tables, and test plan sections.
---

# Writing Plans

Create well-structured project plans in `docs/plans/` that track feature gaps, implementation phases, and milestones using the conventions established in this repository.

## Essential Principles

<essential_principles>

<principle name="goal-blockquote-first">
**Every plan starts with a goal blockquote.**

The first content after the title is a `>` blockquote stating the plan's goal. This tells readers immediately what the plan aims to achieve and scopes every section that follows. Without it, contributors read the plan without knowing what "done" looks like.
</principle>

<principle name="numbered-toc-with-anchors">
**Use a numbered Table of Contents with anchor links.**

Plans are long documents (500–1200 lines). Without a ToC with anchors, readers scroll blindly. Number every top-level section (`## 1. ...`, `## 2. ...`) and every subsection (`### 1.1 ...`) and link them from the ToC. This also enables cross-references from other documents.
</principle>

<principle name="status-emoji-legend">
**Track status with emoji, and always define the legend.**

Use ✅ (implemented), 🔧 (partial), ❌ (missing) for feature-gap tables. Use `- [ ]` / `- [x]` for milestone checklists. Always include a "Legend" block before the first table that uses status markers — readers who skip the legend misread 🔧 as "done."
</principle>

<principle name="phases-have-structure">
**Implementation phases use `### Phase N: Title (Priority: …)` with a bold goal and task table.**

Unnumbered or unstructured phases cause implementers to miss dependencies and work out of order. Every phase needs: a number, a title, a priority level, a one-line bold goal, and a task table with `N.M` numbered tasks. This format lets contributors pick up any phase independently.
</principle>

<principle name="never-delete-completed-work">
**Never delete completed phases or sections — use amendments.**

Plans are living documents. Completed phases (✅) stay in the plan as a record. If scope changes, add an "Amendments" section at the end rather than rewriting history. This preserves context for anyone reading the plan later.
</principle>

<principle name="pr-body-must-link-plan">
**Every PR that implements a plan phase must include `Plan:` and `Phase:` lines in its body.**

When creating a PR that implements one or more phases of a plan in `docs/plans/`, always add:

```
Plan: docs/plans/<plan-name>.md
Phase: N
```

The Plan Phase Continuation workflow reads these lines on merge to automatically delegate the next phase to Copilot. Without them the workflow silently skips the PR and no follow-up phase is triggered. Letter phases (e.g. `Phase: C`) are also supported.
</principle>

</essential_principles>

## When to Use

- Planning a new feature set or feature-parity effort with gap analysis
- Creating a documentation or content plan with milestones
- Organizing an implementation roadmap with phased task breakdowns
- Tracking status across multiple features with emoji-based progress markers
- Structuring a test plan tied to implementation phases

## When NOT to Use

- **Quick bug fixes** — use a GitHub issue with reproduction steps instead
- **Single-feature implementation** — use a PR description or issue body instead
- **Architecture Decision Records** — use ADR format (`docs/adr/NNNN-title.md`) instead
- **Meeting notes or status updates** — use GitHub discussions or wiki instead
- **Skill documentation** — use the `designing-workflow-skills` skill instead

## Plan Type Selection

```
What kind of plan are you writing?
│
├─ Tracking features to match another system?
│   └─ Feature-Parity / Gap-Analysis Plan
│       (gap tables + implementation phases + test plan + benchmarks)
│
├─ Planning documentation, content, or guides?
│   └─ Documentation / Content Plan
│       (structure tree + section breakdowns + milestones)
│
└─ Unsure?
    └─ Start with the feature-parity template — it's the more complete
       structure and sections can be removed if not needed.
```

## Quick Reference: File Naming

| Convention | Example |
|-----------|---------|
| Location | `docs/plans/<name>.md` |
| Name format | Kebab-case, descriptive |
| Feature parity | `cqlengine-feature-parity.md` |
| Documentation | `documentation-plan.md` |

## Quick Reference: Status Legend

Always include this legend before the first table that uses status markers:

```markdown
Legend:
- ✅ **Implemented** — working today
- 🔧 **Partial** — infrastructure exists but not fully exposed via public API
- ❌ **Missing** — not yet implemented
```

## Quick Reference: Required Sections by Plan Type

| Section | Feature-Parity | Documentation |
|---------|:-:|:-:|
| Goal blockquote | ✅ | ✅ |
| Numbered ToC with anchors | ✅ | ✅ |
| Feature gap analysis tables | ✅ | — |
| Gap summary lists | ✅ | — |
| Documentation structure (file tree) | — | ✅ |
| Section breakdowns with examples | — | ✅ |
| Implementation phases | ✅ | — |
| Test plan (unit + integration) | ✅ | — |
| Performance benchmarks | ✅ (optional) | — |
| Migration guide | ✅ (optional) | — |
| Milestones with checkboxes | — | ✅ |
| Writing style guide | — | ✅ (optional) |
| References | ✅ | ✅ |

## Quick Reference: Phase Format

Every implementation phase follows this exact structure:

```markdown
### Phase N: Title (Priority: High|Medium|Low)

**Goal:** One-line description of what this phase achieves.

| Task | Description |
|---|---|
| N.1 | First task description |
| N.2 | Second task description |
| N.3 | Unit + integration tests |
```

**Rules:**
- Tasks use `N.M` numbering (phase number `.` task number)
- The last task in every phase should be testing
- Priority is one of: `High`, `Medium`, `Low`
- Goal is bold and on its own line after the heading

## Quick Reference: Gap Analysis Table

```markdown
| Feature | Equivalent | Status |
|---|---|---|
| `their_api()` | `our_api()` | ✅ |
| `their_other()` | — | ❌ |
| `their_partial()` | `our_partial()` | 🔧 notes |
```

After each gap table, include a **Gap summary** list:

```markdown
**Gap summary — area name:**
- `feature_a` → proposed implementation approach
- `feature_b` → proposed implementation approach
```

## Quick Reference: Test Plan Table

```markdown
| Test Case | Phase |
|---|---|
| Description of what the test validates | N |
| Another test case | N |
```

Group test cases by file (`tests/test_types.py`, `tests/test_cql_builder.py`, etc.) and cross-reference each test to the implementation phase it covers.

## Writing Style

| Rule | Example |
|------|---------|
| Present tense for status | "working today" not "will work" |
| Imperative for tasks | "Add type annotation markers" not "Type annotation markers should be added" |
| Use emoji only for status markers | ✅🔧❌ in tables, not in prose |
| Keep table cells concise | One line per cell; use gap summary lists for detail |
| Horizontal rules (`---`) between major sections | Separates ToC from content, content from references |

## Reference Index

| File | Content |
|------|---------|
| [plan-templates.md](references/plan-templates.md) | Full document templates for both plan types with annotated examples |

| Workflow | Purpose |
|----------|---------|
| [create-a-plan.md](workflows/create-a-plan.md) | Step-by-step process for creating a new plan from scratch |
| [Plan Phase Continuation](../../workflows/plan-continuation.yml) | GitHub Actions workflow — automatically delegates the next phase to Copilot when a PR merges a plan file or references one via `Plan: docs/plans/<name>.md` in the PR body |

## Success Criteria

A well-written plan:

- [ ] Lives in `docs/plans/<kebab-case-name>.md`
- [ ] Starts with a goal blockquote immediately after the title
- [ ] Has a numbered Table of Contents with working anchor links
- [ ] Includes a status legend before the first status-marked table
- [ ] Uses ✅/🔧/❌ consistently in gap tables (feature-parity plans)
- [ ] Uses `- [ ]`/`- [x]` for milestones (documentation plans)
- [ ] Numbers implementation phases as `### Phase N: Title (Priority: …)`
- [ ] Includes a bold **Goal:** line under each phase heading
- [ ] Numbers tasks as `N.M` within each phase
- [ ] Ends every phase with a testing task
- [ ] Cross-references test cases to implementation phases
- [ ] Uses `---` horizontal rules between major sections
- [ ] Has no empty sections or TODOs without context

## Automation: Plan Phase Continuation

When a PR **introduces a new plan file** or **references an existing plan** via
`Plan: docs/plans/<name>.md` in the PR body, the
[Plan Phase Continuation](../../workflows/plan-continuation.yml) workflow
triggers automatically on merge to master and delegates the next incomplete
phase to Copilot CLI.

**Phase status markers the automation recognises:**

| Marker | Location | Effect |
|--------|----------|--------|
| `✅` in `### Phase N:` header | Phase header line | Phase is complete |
| All task rows contain `✅` | Task table Status column | Phase is complete |
| All checkboxes are `- [x]` | Milestone/checkbox list | Phase is complete |

**PR body convention to link a PR to a plan:**

```
Plan: docs/plans/<plan-name>.md
Phase: N        ← optional: the phase number this PR completes
```

See [CONTRIBUTING.md](../../../CONTRIBUTING.md#plan-linking-convention) for
details and branch-name fallback convention.
