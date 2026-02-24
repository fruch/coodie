# Tool Assignment Guide

How to choose the right tools for skills and subagents.

---

## Skills vs Subagents

| Component | What it is | When to use | How it's triggered |
|-----------|-----------|-------------|-------------------|
| **Skill** | Knowledge/guidance (SKILL.md) | Teaching patterns, providing domain expertise, guiding decisions | Auto-activated when frontmatter `description` matches user intent |
| **Subagent** | Agent spawned within a workflow | Delegating subtasks within a larger workflow | Parent skill uses Task tool |

**Decision:** If it should trigger automatically based on context, make it a skill. If a workflow needs to delegate variable subtasks at runtime, use the Task tool.

---

## Skill Frontmatter Reference

| Field | Required | Description |
|-------|----------|-------------|
| `name` | No | Display name (kebab-case, max 64 chars). Defaults to directory name. |
| `description` | Recommended | What it does and when to use it. **Controls skill activation.** |
| `allowed-tools` | No | Tools Claude can use without asking when skill is active. |

---

## Tool Inventory

| Tool | Purpose | Use for |
|------|---------|---------|
| **Read** | Read file contents | Examining specific files by path |
| **Glob** | Find files by pattern | Discovering files (`**/*.py`, `**/SKILL.md`) |
| **Grep** | Search file contents | Finding patterns across files |
| **Write** | Create/overwrite files | Generating output files |
| **Edit** | Modify existing files | Targeted changes to existing files |
| **Bash** | Execute shell commands | Running tools, scripts, git operations |
| **AskUserQuestion** | Get user input | Disambiguation, confirmation, preferences |
| **Task** | Spawn subagents | Delegating complex subtasks |
| **TaskCreate/TaskUpdate/TaskList** | Track progress | Multi-step workflows with dependencies |
| **TodoRead/TodoWrite** | Track progress via todo list | Most skills — enables progress tracking during execution |
| **WebFetch** | Fetch URL content | Reading web pages |
| **WebSearch** | Search the web | Finding current information |

---

## Tool Selection Matrix

Map the operation you need to the correct tool:

| Operation | Correct Tool | NOT this |
|-----------|-------------|----------|
| Find files by name/pattern | **Glob** | `find` via Bash |
| Search file contents | **Grep** | `grep`/`rg` via Bash |
| Read a file | **Read** | `cat`/`head`/`tail` via Bash |
| Write a new file | **Write** | `echo`/`cat <<EOF` via Bash |
| Edit an existing file | **Edit** | `sed`/`awk` via Bash |
| Run a shell command | **Bash** | — |
| Run a Python script | **Bash** (`uv run`) | — |
| Get user confirmation | **AskUserQuestion** | Printing and hoping |
| Delegate analysis | **Task** (subagent) | Doing everything inline |

**Rule:** If a dedicated tool exists for the operation, use it. Only use Bash for operations that genuinely require shell execution (running programs, git commands, build tools).

---

## Assigning Tools to Components

### Read-Only Analysis Skills

Skills that examine code without modifying it:

```yaml
allowed-tools:
  - Read
  - Glob
  - Grep
  - TodoRead
  - TodoWrite
```

### Interactive Analysis Skills

Skills that need user input during execution:

```yaml
allowed-tools:
  - Read
  - Glob
  - Grep
  - AskUserQuestion
  - TodoRead
  - TodoWrite
```

### Code Generation Skills

Skills that produce output files:

```yaml
allowed-tools:
  - Read
  - Glob
  - Grep
  - Write
  - Bash
  - TodoRead
  - TodoWrite
```

### Pipeline Skills (Multi-Step)

Skills that orchestrate complex workflows:

```yaml
allowed-tools:
  - Bash
  - Read
  - Write
  - Glob
  - Grep
  - AskUserQuestion
  - Task
  - TaskCreate
  - TaskList
  - TaskUpdate
  - TodoRead
  - TodoWrite
```

---

## Subagent Context Passing

When spawning a subagent via the Task tool, include:

1. **What to analyze** — specific file paths, function names, or patterns
2. **What to look for** — explicit criteria, not vague "analyze this"
3. **What format to return** — markdown structure, JSON schema, or checklist

**Good prompt:**
```
Read all files in .github/skills/my-skill/. Check that:
1. SKILL.md has valid YAML frontmatter with name and description
2. All file paths referenced in SKILL.md exist
3. SKILL.md is under 500 lines
4. No hardcoded paths (/Users/, /home/)
Return a pass/fail checklist with details for each failure.
```

**Bad prompt:**
```
Review the skill and tell me if it's good.
```

---

## Common Tool Assignment Mistakes

| Mistake | Problem | Fix |
|---------|---------|-----|
| Listing `Bash` for file operations | Fragile, verbose, permission issues | Use Read/Write/Glob/Grep |
| Listing `Write` on a read-only skill | Principle of least privilege violation | Remove Write if skill never creates files |
| Listing `Task` without using subagents | Unused tools clutter the permission model | Only list tools you actually use |
| No `AskUserQuestion` on interactive skill | Skill can't get user confirmation | Add AskUserQuestion if any gate/confirmation exists |
| Missing `TaskCreate`/`TaskUpdate` on pipeline | Can't track multi-step progress | Add task tools for pipeline patterns |
| Grep per-file per-pattern | N×M tool calls | Combine into single regex, grep once, filter afterward |
