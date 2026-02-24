# Writing Plans for coodie

Plans live in `docs/plans/` and describe significant bodies of work — feature
parity efforts, documentation strategies, architecture decisions, or other
multi-phase initiatives. They are the single source of truth for *what* needs
to be built and *why*.

See the existing plans for reference:

- [`docs/plans/cqlengine-feature-parity.md`](../../docs/plans/cqlengine-feature-parity.md) — feature gap analysis + phased implementation
- [`docs/plans/documentation-plan.md`](../../docs/plans/documentation-plan.md) — documentation strategy + content outline

---

## When to write a plan

Write a plan when:

- The work spans **multiple phases or milestones** (more than a single PR).
- A **gap analysis** is needed to map the current state against a target state.
- **Stakeholder alignment** is required before implementation begins.
- The initiative touches several modules and benefits from a single reference
  document.

Skip the plan for small, self-contained bug fixes or single-feature additions.

---

## File naming and location

```
docs/plans/<short-kebab-case-name>.md
```

Examples:

```
docs/plans/cqlengine-feature-parity.md
docs/plans/documentation-plan.md
docs/plans/async-driver-overhaul.md
```

---

## Document structure

Every plan follows this template:

```markdown
# coodie <Title>

> **Goal:** One or two sentences. State the end-state clearly.
> Optional second line with a memorable quote or constraint.

---

## Table of Contents

1. [Section One](#1-section-one)
   - [1.1 Sub-section](#11-sub-section)
2. [Section Two](#2-section-two)
   …

---

## 1. <First Section>
…

## 2. <Second Section>
…
```

An optional emoji before the title is fine for tone — `📚` for documentation
plans, none for technical feature-parity plans (see `documentation-plan.md`
vs `cqlengine-feature-parity.md`).

Sections vary by plan type, but the **goal blockquote**, **horizontal-rule
separators**, and **numbered Table of Contents with anchor links** are always
present.

---

## Required sections by plan type

### Feature-parity / gap-analysis plan

| Section | Purpose |
|---------|---------|
| **1. Feature Gap Analysis** | Status table comparing the target API against coodie's current state. |
| **2. Implementation Phases** | Numbered phases, each with a goal and a task table. |
| **3. Test Plan** | Unit tests (MockDriver) and integration tests (real ScyllaDB) mapped to phases. |
| **4. Performance Benchmarks** | Benchmark scenarios and acceptance criteria (optional but recommended). |
| **5. Migration Guide** | Side-by-side before/after for users switching from the target API. |
| **6. References** | Links to upstream docs, related issues, and prior art. |

### Documentation / content plan

| Section | Purpose |
|---------|---------|
| **1. Documentation Philosophy** | Guiding principles (examples, humor policy, progressive disclosure, dual-stack coverage). |
| **2. Target Audience** | Personas with description and expected detail level. |
| **3. Documentation Structure** | Directory tree of planned files. |
| **4. Section Breakdown & Example Sketches** | One sub-section per doc page; each includes what to cover and a code example sketch. |
| **5. README Structure** | Top-level README outline, feature comparison table. |
| **6. Contribution Guide** | How contributors add or update docs. |
| **7. Tooling & Build** | How to build, preview, and deploy the docs. |
| **8. Writing Style Guide** | Tone, vocabulary, formatting conventions. |
| **9. Milestones** | Phased delivery targets. |

For other plan types, keep the relevant sections above and omit or rename
sections that do not apply.

---

## Status legend (feature gap tables)

Use these three symbols consistently in feature gap tables:

| Symbol | Meaning |
|--------|---------|
| ✅ | **Implemented** — working in coodie today |
| 🔧 | **Partial** — infrastructure exists but not fully exposed via public API |
| ❌ | **Missing** — not yet implemented |

Include the legend at the top of every gap analysis section:

```markdown
Legend:
- ✅ **Implemented** — working in coodie today
- 🔧 **Partial** — infrastructure exists but not fully exposed via public API
- ❌ **Missing** — not yet implemented
```

---

## Gap analysis tables

Comparison tables have three columns: the upstream API, the coodie equivalent,
and the status symbol.

```markdown
| cqlengine Feature       | coodie Equivalent                  | Status |
|---|---|---|
| `columns.BigInt()`      | `Annotated[int, BigInt()]`         | ❌     |
| `columns.Text()`        | `str`                              | ✅     |
| `QuerySet.filter(**kw)` | `Document.find(**kw)`              | ✅     |
| Per-model `__connection__` | —                               | ❌     |
```

End every table group with a **Gap summary** list naming only the missing
items and the planned coodie spelling:

```markdown
**Gap summary — scalar types to add:**
- `bigint` → `Annotated[int, BigInt()]`
- `timeuuid` → `Annotated[UUID, TimeUUID()]`
```

---

## Implementation phases

Each phase has:

1. A `### Phase N: <Name> (Priority: High | Medium | Low)` heading.
2. A bold **Goal:** sentence.
3. A task table with numbered task IDs (`N.M`) and descriptions.

```markdown
### Phase 3: Partial Update API (Priority: High)

**Goal:** Allow updating individual fields without a full INSERT (upsert).

| Task | Description |
|---|---|
| 3.1 | Add `Document.update(**kwargs)` / `await Document.update(**kwargs)` |
| 3.2 | Support `ttl` and `if_conditions` parameters |
| 3.3 | Add `QuerySet.update(**kwargs)` for bulk UPDATE |
| 3.4 | Unit + integration tests |
```

Priority guidance:

- **High** — blocks common use cases or is required for basic parity.
- **Medium** — important but the library is usable without it.
- **Low** — nice-to-have; deferrable to a later milestone.

Phases are ordered by priority (High first), then by dependency order within
the same priority level.

---

## Test plan conventions

The test plan maps test cases to implementation phases. Separate subsections
for unit tests and integration tests.

### Unit tests (MockDriver — no live DB)

Group by test file, list test cases as a table:

```markdown
#### CQL Builder Tests (`tests/test_cql_builder.py`)

| Test Case | Phase |
|---|---|
| `build_counter_update()` generates `SET col = col + ?` | 2 |
| `build_update()` with `if_conditions` → `IF col = ?`   | 3/4 |
```

### Integration tests (real ScyllaDB via testcontainers)

```markdown
| Test Area          | Test Cases                            | Phase |
|---|---|---|
| **Counter tables** | Create counter table; `increment()`   | 2     |
| **Partial update** | `update(field=value)` → only one field changed | 3 |
```

Always include `Unit + integration tests` as the last task in each phase table
so tests are never deferred to a future phase.

---

## Writing style

- Use **present tense** for status and descriptions: "Schema emits type, no
  increment/decrement API."
- Use **imperative mood** for task descriptions: "Add `build_counter_update()`
  to `cql_builder.py`."
- Humor is welcome in documentation plans; keep it light in technical
  feature-parity plans.
- Code examples must be runnable (or clearly marked as sketches).
- Show both sync and async forms side by side where both exist.
- Use `---` horizontal rules between top-level sections only.
- Anchor links in the Table of Contents use lowercase kebab-case with special
  characters stripped: `[1.1 Sub-section](#11-sub-section)`.

---

## Keeping plans up to date

- Mark completed phases with a note or by updating status symbols (✅).
- Do **not** delete completed phase descriptions — they serve as a historical
  record.
- Open a follow-up issue or PR when starting a phase rather than deleting
  tasks from the plan.
- If the scope changes substantially, add an **Amendments** section at the
  bottom rather than rewriting existing sections.
