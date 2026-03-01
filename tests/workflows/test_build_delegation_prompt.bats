#!/usr/bin/env bats
# Tests for .github/scripts/build-delegation-prompt.sh

SCRIPT_DIR="$(cd "$(dirname "$BATS_TEST_FILENAME")/../../.github/scripts" && pwd)"

setup() {
  unset PROMPT PLAN_FILE PHASE TITLE PHASE_CONTENT
}

@test "builds prompt with all fields" {
  PLAN_FILE="docs/plans/udt-support.md"
  PHASE="3"
  TITLE="Core Framework"
  PHASE_CONTENT="| Task | Description |
|---|---|
| 3.1 | Implement X |"
  export PLAN_FILE PHASE TITLE PHASE_CONTENT
  source "$SCRIPT_DIR/build-delegation-prompt.sh"
  [[ "$PROMPT" == *"Continue to phase 3 of plan docs/plans/udt-support.md"* ]]
  [[ "$PROMPT" == *"Phase title: Core Framework"* ]]
  [[ "$PROMPT" == *"Implement X"* ]]
  [[ "$PROMPT" == *"Read the full plan at docs/plans/udt-support.md"* ]]
  [[ "$PROMPT" == *"Implement all tasks listed above for Phase 3"* ]]
}

@test "prompt includes phase content section" {
  PLAN_FILE="docs/plans/my-plan.md"
  PHASE="1"
  TITLE="Foundation"
  PHASE_CONTENT="- [ ] Task A
- [ ] Task B"
  export PLAN_FILE PHASE TITLE PHASE_CONTENT
  source "$SCRIPT_DIR/build-delegation-prompt.sh"
  [[ "$PROMPT" == *"## Tasks"* ]]
  [[ "$PROMPT" == *"Task A"* ]]
  [[ "$PROMPT" == *"Task B"* ]]
}

@test "prompt works with letter phase" {
  PLAN_FILE="docs/plans/migration-strategy.md"
  PHASE="C"
  TITLE="Auto-Generation"
  PHASE_CONTENT="Build the diff engine."
  export PLAN_FILE PHASE TITLE PHASE_CONTENT
  source "$SCRIPT_DIR/build-delegation-prompt.sh"
  [[ "$PROMPT" == *"Continue to phase C of plan docs/plans/migration-strategy.md"* ]]
  [[ "$PROMPT" == *"Implement all tasks listed above for Phase C"* ]]
}

@test "prompt handles empty phase content" {
  PLAN_FILE="docs/plans/test.md"
  PHASE="1"
  TITLE="Setup"
  PHASE_CONTENT=""
  export PLAN_FILE PHASE TITLE PHASE_CONTENT
  source "$SCRIPT_DIR/build-delegation-prompt.sh"
  [[ "$PROMPT" == *"Continue to phase 1"* ]]
  [[ "$PROMPT" == *"## Tasks"* ]]
}

@test "prompt is non-empty" {
  PLAN_FILE="docs/plans/test.md"
  PHASE="2"
  TITLE="Build"
  PHASE_CONTENT="Do things."
  export PLAN_FILE PHASE TITLE PHASE_CONTENT
  source "$SCRIPT_DIR/build-delegation-prompt.sh"
  [ -n "$PROMPT" ]
}
