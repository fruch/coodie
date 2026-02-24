# Anti-Patterns Catalog

Common mistakes in workflow-based skills. Each entry includes the symptom, why it's wrong, and a fix.

---

## Structure Anti-Patterns

### AP-1: Vague Description and Missing Scope Sections

**Symptom:** Skill has a vague `description` and no "When to Use" / "When NOT to Use" sections.

**Why it's wrong:** Claude activates skills based solely on `description`. Vague descriptions cause wrong activations or missed activations. Once active, the scope sections prevent the LLM from attempting tasks outside the skill's competence.

**Fix:** Write the description with triggering conditions ("Use when..."), third-person voice ("Analyzes X" not "I analyze X"), and specific keywords. Add When to Use (4+ concrete scenarios) and When NOT to Use (3+ scenarios naming alternatives).

See also AP-20 for the related trap of putting workflow steps in the description.

---

### AP-2: Monolithic SKILL.md

**Symptom:** SKILL.md exceeds 500 lines with everything inlined.

**Why it's wrong:** Oversized files dilute LLM attention. Critical instructions get buried in reference material.

**Fix:** SKILL.md under 500 lines with core principles and routing. Detailed reference material in `references/`. Step-by-step processes in `workflows/`.

---

### AP-3: Reference Chains

**Symptom:** SKILL.md links to file A, which links to file B, which links to file C.

**Why it's wrong:** Each hop degrades context. By the time the LLM reaches file C, context from SKILL.md has degraded.

**Fix:** All files one hop from SKILL.md. Reference files do not link to other reference files.

---

### AP-4: Hardcoded Paths

**Symptom:** File contains absolute paths like `/Users/jane/projects/skill/scripts/run.py`.

**Why it's wrong:** Breaks for any user whose filesystem differs.

**Fix:** Use `{baseDir}` for all internal paths: `uv run {baseDir}/scripts/analyze.py`

---

### AP-5: Broken File References

**Symptom:** SKILL.md references `workflows/advanced.md` but the file doesn't exist.

**Why it's wrong:** The LLM either hallucinates the content or stops. Silent failures with unpredictable behavior.

**Fix:** Before submitting, verify every path referenced in SKILL.md exists using Glob.

---

## Workflow Design Anti-Patterns

### AP-6: Unnumbered Phases

**Symptom:** Workflow uses prose paragraphs instead of numbered phases.

**Why it's wrong:** The LLM cannot reliably determine ordering from prose.

**Fix:** Number every phase. Add entry criteria, numbered actions, and exit criteria to each phase:
```markdown
### Phase 1: Setup
**Entry:** User has provided [input]
**Actions:**
1. Validate input
2. Check prerequisites
**Exit:** [Specific artifact] exists and is valid
```

---

### AP-7: Missing Exit Criteria

**Symptom:** Phases say what to do but not how to know when it's done.

**Why it's wrong:** Without exit criteria, the LLM may produce incomplete work and move on, or loop endlessly.

**Fix:** Define what "done" means for every phase. "Database exists and extracted file count > 0" not "build the database."

---

### AP-8: No Verification Step

**Symptom:** The workflow ends with "output the results" and no validation.

**Why it's wrong:** LLMs can produce plausible but incorrect output. A verification step catches errors before the user acts on bad results.

**Fix:** Add a final phase: verify all input files are represented, no placeholder text remains, all referenced paths exist.

---

### AP-9: Vague Routing Keywords

**Symptom:** Multiple workflows match the same user input because routing keywords overlap.

**Why it's wrong:** Ambiguous routing causes the LLM to pick the wrong workflow or freeze.

**Fix:** Use distinctive keywords per workflow — `"static", "scan", "lint"` vs `"dynamic", "fuzz", "runtime"`. If two workflows genuinely overlap, add a disambiguation step.

---

### AP-10: No Default/Fallback Route

**Symptom:** Routing table covers known options but has no catch-all.

**Why it's wrong:** When user input doesn't match any route, the LLM improvises unpredictably.

**Fix:** Add a fallback: `| None of the above | Ask user to clarify: "I can help with X, Y, or Z. Which would you like?" |`

---

## Tool and Agent Anti-Patterns

### AP-11: Wrong Tool for the Job

**Symptom:** Skill uses `Bash` with `grep` instead of the `Grep` tool, or `Bash` with `find` instead of `Glob`.

**Why it's wrong:** Dedicated tools handle edge cases (permissions, encoding) better. Bash equivalents are fragile and verbose.

**Fix:** Use Glob (not `find`), Grep (not `grep`), Read (not `cat`). Only use Bash for genuine shell execution (running programs, git, build tools).

---

### AP-12: Overprivileged Tool Lists

**Symptom:** Skill lists tools it never uses, or includes Write/Bash for a read-only skill.

**Why it's wrong:** Extra tools expand the attack surface. A read-only skill with Write access might create unexpected files.

**Fix:** Only list tools the skill actually needs. Audit by checking which tools appear in instructions.

---

### AP-13: Vague Subagent Instructions

**Symptom:** Spawning a subagent with "analyze this code" and no specific instructions.

**Why it's wrong:** Subagents start fresh with no context. They need explicit instructions about what to look for, what format to produce, and what tools to use.

**Fix:**
```
Spawn a Task agent (subagent_type=Explore) with prompt:
"Read the function `processInput` in `src/handler.py`. List all external
calls it makes, what validation is performed on inputs, and whether any
input reaches a shell command or SQL query without sanitization.
Return findings as a markdown list."
```

---

### AP-14: Missing Tool Justification in Agents

**Symptom:** Tool list in frontmatter, but agent body never specifies which tool to use for which operation.

**Why it's wrong:** Agents with ambiguous tool access make inconsistent choices.

**Fix:** Add a "Tool Usage" section to the agent body:
```markdown
## Tool Usage
- **Glob** to find files by pattern (`**/*.py`, `**/SKILL.md`)
- **Read** to examine file contents after finding them
- **Grep** to search for specific patterns across files
```

---

## Content Anti-Patterns

### AP-15: Reference Dump Instead of Guidance

**Symptom:** Skill pastes a full specification or API reference instead of teaching when and how to use it.

**Why it's wrong:** The LLM already has general knowledge. What it needs is judgment: when to apply technique A vs B, what tradeoffs to consider, what mistakes to avoid.

**Fix:** Teach decision criteria, not raw documentation. Show when to use X vs Y and why, with tradeoffs.

---

### AP-16: Missing Rationalizations Section

**Symptom:** Security/audit skill has no "Rationalizations to Reject" section.

**Why it's wrong:** LLMs naturally take shortcuts. Without explicit rationalization rejection, the LLM talks itself into skipping important steps. This is the #1 cause of missed findings in audit skills.

**Fix:** Add:
```markdown
## Rationalizations to Reject
| Rationalization | Why It's Wrong |
|-----------------|----------------|
| "The code looks clean, skip deep analysis" | Surface appearance doesn't indicate security. |
```

---

### AP-17: No Concrete Examples

**Symptom:** Skill describes rules in abstract terms without showing input -> output.

**Why it's wrong:** Abstract rules are ambiguous. Concrete examples anchor the LLM's understanding and reduce interpretation drift.

**Fix:** Show the exact output format with a realistic example. "Ensure the output is well-formatted" → show a sample formatted table.

---

## Scalability Anti-Patterns

### AP-18: Cartesian Product Tool Calls

**Symptom:** Skill says "find all matching files, then search each file for each pattern" — producing N files × M patterns = N×M tool calls.

**Why it's wrong:** The agent will shortcut — scanning a few files, skipping patterns, or summarizing early — and miss results silently.

**Fix:** Combine patterns into one regex. Grep once across the codebase. Filter results afterward:
```markdown
Grep the codebase for `delegatecall|selfdestruct|tx\.origin` (single combined regex).
Filter results to exclude test paths. Read matching files for context.
```

---

### AP-19: Unbounded Subagent Spawning

**Symptom:** Skill says "spawn one subagent per file" — subagent count scales with codebase size.

**Why it's wrong:** With 1000 files, that's 1000 subagents. The agent will hit context limits long before finishing.

**Fix:** Batch items into groups of 10-20. One subagent per batch, not one per item:
```markdown
Batch discovered files into groups of 10-20. For each batch, spawn a single
Task subagent. Return a markdown table with one row per file.
```

---

## Description Anti-Patterns

### AP-20: Description Summarizes Workflow

**Symptom:** The `description` field summarizes the skill's workflow steps instead of listing triggering conditions.

**Why it's wrong:** When the description contains workflow steps, Claude follows the description and shortcuts past the actual SKILL.md body. A description saying "code review between tasks" caused Claude to do ONE review, even though the SKILL.md showed TWO reviews.

**Before:**
```yaml
description: >-
  Use when executing plans — dispatches subagent per task
  with code review between tasks for quality assurance
```

**After:**
```yaml
description: >-
  Use when executing implementation plans with independent
  tasks in the current session
```

The description contains ONLY triggering conditions. Process details belong in the SKILL.md body.
