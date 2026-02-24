# Creating a Plan

A step-by-step process for creating a new plan in `docs/plans/`.

---

## Phase 1: Determine Plan Type

**Entry:** You have a project or effort that needs a plan.

**Actions:**

1. **Decide if a plan is needed.** Plans are for multi-phase efforts with many tasks. Single-feature work belongs in a GitHub issue or PR description.

2. **Choose the plan type** using this decision:
   - Tracking features against another system? → **Feature-Parity Plan**
   - Planning documentation, content, or guides? → **Documentation Plan**
   - Unsure? → Start with feature-parity (more structured; sections can be removed).

3. **Choose a file name.** Use kebab-case: `docs/plans/<descriptive-name>.md`. The name should describe the effort, not the document type (e.g., `cqlengine-feature-parity.md` not `plan-v2.md`).

**Exit:** Plan type selected, file name chosen.

---

## Phase 2: Write the Goal and Structure

**Entry:** Phase 1 complete. Plan type and file name chosen.

**Actions:**

1. **Write the title.** Use `# Title` format. Be specific: "coodie → cqlengine Feature-Parity Plan" not "Plan."

2. **Write the goal blockquote.** This is the first content after the title. Use `>` blockquote format. State what "done" looks like in 1-3 sentences. Include scope and quality bar.

3. **Draft the Table of Contents.** Number every top-level section. Use anchor links. For feature-parity plans, follow the standard section order:
   - Feature Gap Analysis → Implementation Phases → Test Plan → Benchmarks → Migration Guide → References

   For documentation plans:
   - Philosophy → Audience → Structure → Section Breakdown → Tooling → Style Guide → Milestones

4. **Add `---` separators** between the goal blockquote and ToC, and between each major section.

**Exit:** File created with title, goal blockquote, and ToC with anchor links.

---

## Phase 3: Fill in Content Sections

**Entry:** Phase 2 complete. Document skeleton exists.

**Actions:**

1. **For feature-parity plans:**

   a. **Write the status legend** before the first gap table:
      ```
      Legend:
      - ✅ **Implemented** — working today
      - 🔧 **Partial** — infrastructure exists but not fully exposed
      - ❌ **Missing** — not yet implemented
      ```

   b. **Build gap analysis tables** for each area. One table per subsection. Columns: feature name, equivalent in your project, status emoji.

   c. **Write gap summary lists** after each table. The table shows status; the summary proposes implementation approaches.

   d. **Define implementation phases.** Use `### Phase N: Title (Priority: High|Medium|Low)` format. Add a bold `**Goal:**` line. Create a task table with `N.M` numbering. End every phase with a testing task.

   e. **Write the test plan.** Group by test file. Cross-reference each test case to its implementation phase with a `Phase` column.

   f. **Add benchmarks** (optional). Compare both systems side by side with columns for each system's operation.

   g. **Write the migration guide** (optional). Show before/after code for common migration patterns.

2. **For documentation plans:**

   a. **Write the philosophy section.** 3-5 guiding principles as bullet points.

   b. **Define target audience** in a table with personas, descriptions, and notes.

   c. **Draw the documentation structure** as a file-system tree showing the exact directory layout.

   d. **Write section breakdowns.** Follow the "Cover + Example sketch" pattern: list what to cover, then show a runnable code example.

   e. **Define milestones** using checkbox lists grouped into phases (Phase 1: Foundation, Phase 2: Intermediate, etc.).

3. **Add a References section** at the end linking to relevant external documentation and internal documents.

**Exit:** All content sections filled in with tables, lists, and examples.

---

## Phase 4: Verify the Plan

**Entry:** Phase 3 complete. All content sections written.

**Actions:**

1. **Check the ToC.** Every anchor link must resolve to an actual heading. Click each one (or search for the heading text).

2. **Check status consistency.** Every ✅/🔧/❌ in gap tables must reflect the actual current state. No optimistic ✅ for unfinished work.

3. **Check phase numbering.** Phases must be sequential (1, 2, 3...). Task numbers must match their phase (`2.1`, `2.2`, not `1.1` inside Phase 2).

4. **Check cross-references.** Every test case's `Phase` column must reference an existing phase. Every benchmark's `Phase` column must reference an existing phase.

5. **Check for empty sections.** No sections with just a heading and no content. Either fill them in or remove them from the ToC.

6. **Check writing style.** Present tense for status ("working today"), imperative for tasks ("Add X"), emoji only in status columns.

7. **Read the goal blockquote one more time.** Does the plan, as written, achieve the stated goal? If not, either update the plan or update the goal.

**Exit:** All checks pass. Plan is ready for review.
