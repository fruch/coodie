# Plan Templates

Full document templates for both plan types, annotated with conventions extracted from existing plans in `docs/plans/`.

---

## Feature-Parity / Gap-Analysis Plan

Use this template when tracking features against another system (e.g., coodie vs. cqlengine).

```markdown
# <project> → <target> Feature-Parity Plan

> **Goal:** <One to three sentences describing what "done" looks like.
> Include the scope: what systems are covered, what APIs are targeted,
> and what qualities the result must have.>

---

## Table of Contents

1. [Feature Gap Analysis](#1-feature-gap-analysis)
   - [1.1 Area Name](#11-area-name)
   - [1.2 Another Area](#12-another-area)
2. [Implementation Phases](#2-implementation-phases)
3. [Test Plan](#3-test-plan)
4. [Performance Benchmarks](#4-performance-benchmarks)
5. [Migration Guide](#5-migration-guide)
6. [References](#6-references)

---

## 1. Feature Gap Analysis

Legend:
- ✅ **Implemented** — working today
- 🔧 **Partial** — infrastructure exists but not fully exposed
- ❌ **Missing** — not yet implemented

### 1.1 Area Name

| Their Feature | Our Equivalent | Status |
|---|---|---|
| `their_api()` | `our_api()` | ✅ |
| `their_other()` | — | ❌ |
| `their_partial()` | `our_partial()` | 🔧 notes about what's partial |

**Gap summary — area name:**
- `feature_a` → proposed approach (e.g., "map to `Annotated[int, BigInt()]`")
- `feature_b` → proposed approach

### 1.2 Another Area

<!-- Repeat the same table + gap summary pattern for each area -->

---

## 2. Implementation Phases

### Phase 1: Title (Priority: High)

**Goal:** One-line description of the phase's objective.

| Task | Description |
|---|---|
| 1.1 | First task |
| 1.2 | Second task |
| 1.3 | Unit + integration tests |

### Phase 2: Title (Priority: Medium)

**Goal:** One-line description.

| Task | Description |
|---|---|
| 2.1 | First task |
| 2.2 | Unit + integration tests |

<!-- Continue with Phase 3, 4, ... -->

---

## 3. Test Plan

### 3.1 Unit Tests

Each phase should add unit tests alongside implementation.

#### Test File Name (`tests/test_example.py`)

| Test Case | Phase |
|---|---|
| Description of what the test validates | 1 |
| Another test case | 2 |

### 3.2 Integration Tests

Integration tests run against a real database instance.

| Test Area | Test Cases | Phase |
|---|---|---|
| **Area name** | Description of integration test | 1 |
| **Another area** | Description | 2 |

---

## 4. Performance Benchmarks

<!-- Optional section. Include when performance comparison is relevant. -->

| Benchmark | Their Operation | Our Operation | Phase |
|---|---|---|---|
| Single INSERT | `Their.create(...)` | `Our(...).save()` | 1 |

---

## 5. Migration Guide

<!-- Optional section. Include when users need to migrate from the target system. -->

### 5.1 Import Changes

| Before | After |
|---|---|
| `from their_lib import X` | `from our_lib import X` |

---

## 6. References

- [Link to their documentation](https://example.com)
- [Link to our documentation](../path/to/doc.md)
```

### Key Conventions in Feature-Parity Plans

1. **Gap tables come before implementation phases** — understand the full scope before planning work.
2. **Every gap table is followed by a gap summary list** — the table shows status; the summary proposes solutions.
3. **Phase numbering is sequential and never reused** — even if Phase 3 is completed and removed (which it shouldn't be), Phase 4 stays as Phase 4.
4. **Task numbers are scoped to their phase** — `3.2` means "Phase 3, Task 2."
5. **Test plan cross-references phases** — every test case includes a `Phase` column linking it to the implementation phase it validates.
6. **Benchmarks compare both systems** — columns for "their operation" and "our operation" side by side.

---

## Documentation / Content Plan

Use this template when planning documentation, guides, or content.

```markdown
# <Title> Plan

> **Mission:** <Two to four sentences describing the documentation goal.
> Include the target audience, scope of coverage, and quality bar.
> Humor is welcome here — it sets the tone for the documentation itself.>

---

## Table of Contents

1. [Documentation Philosophy](#1-documentation-philosophy)
2. [Target Audience](#2-target-audience)
3. [Documentation Structure](#3-documentation-structure)
4. [Section Breakdown](#4-section-breakdown)
   - [4.1 First Section](#41-first-section)
   - [4.2 Second Section](#42-second-section)
5. [Tooling & Build](#5-tooling--build)
6. [Writing Style Guide](#6-writing-style-guide)
7. [Milestones](#7-milestones)

---

## 1. Documentation Philosophy

Guiding principles for the documentation (3-5 bullet points).

---

## 2. Target Audience

| Persona | Description | Notes |
|---------|-------------|-------|
| 🐍 **Beginner** | Knows the language, new to the domain | ... |
| 🗄️ **Migrator** | Switching from another tool | ... |

---

## 3. Documentation Structure

```
docs/source/
├── index.md
├── installation.md
├── quickstart.md
├── guide/
│   ├── topic-a.md
│   └── topic-b.md
├── api/
│   └── auto-generated.md
└── changelog.md
```

---

## 4. Section Breakdown

### 4.1 First Section

Cover:
- What this section explains
- Key concepts to introduce
- Prerequisites the reader needs

Example sketch:

```python
# Runnable code example that demonstrates the concept
```

---

### 4.2 Second Section

<!-- Repeat the Cover + Example sketch pattern -->

---

## 5. Tooling & Build

| Tool | Purpose |
|------|---------|
| **Sphinx** | Documentation generator |
| **MyST-Parser** | Markdown support |

---

## 6. Writing Style Guide

Tone, humor guidelines, code example rules, and structural conventions.

---

## 7. Milestones

### Phase 1: Foundation
- [ ] First deliverable
- [ ] Second deliverable

### Phase 2: Intermediate
- [ ] Third deliverable
- [ ] Fourth deliverable

### Phase 3: Polish
- [ ] Review all content
- [ ] Deploy documentation
```

### Key Conventions in Documentation Plans

1. **Structure tree uses file-system notation** — shows the exact directory layout readers will navigate.
2. **Section breakdowns follow a "Cover + Example sketch" pattern** — list what to cover, then show a code example.
3. **Milestones use checkbox lists, not task tables** — documentation tasks are less interdependent than code tasks.
4. **Target audience table includes persona emoji** — helps writers calibrate tone per audience segment.
5. **Philosophy section appears before content sections** — sets the quality bar and tone for everything that follows.
6. **Humor is encouraged in documentation plans** — the plan's tone should match the documentation it produces.

---

## Common Patterns Across Both Plan Types

| Pattern | Where It Appears | Why It Matters |
|---------|-----------------|----------------|
| Goal blockquote | First content after `# Title` | Scopes the entire document |
| `---` separators | Between major numbered sections | Visual separation in long documents |
| Numbered headings | `## 1. Section`, `### 1.1 Subsection` | Enables ToC anchors and cross-references |
| Tables for structured data | Gap analysis, tasks, tests, benchmarks | Scannable format for status tracking |
| Gap summary lists after tables | After each gap analysis table | Tables show status; lists propose solutions |
| Cross-references | Test plan → phases, benchmarks → phases | Connects planning to implementation |
| Present tense for status | "working today" not "will work" | Keeps the plan grounded in current state |
| Imperative for tasks | "Add X" not "X should be added" | Clear, actionable instructions |
