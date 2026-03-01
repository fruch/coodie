#!/usr/bin/env bats
# Tests for .github/scripts/extract-plan-ref.sh

SCRIPT_DIR="$(cd "$(dirname "$BATS_TEST_FILENAME")/../../.github/scripts" && pwd)"

setup() {
  # Reset all output vars before each test
  unset PLAN_FILE PHASE ALL_PLANS HAS_PLAN CHANGED_PLANS PR_BODY PR_BRANCH
}

# ---------------------------------------------------------------------------
# PR body extraction
# ---------------------------------------------------------------------------

@test "extracts plan file from PR body 'Plan: docs/plans/udt-support.md'" {
  PR_BODY="Implements Phase 3.

Plan: docs/plans/udt-support.md
Phase: 3"
  PR_BRANCH=""
  CHANGED_PLANS=""
  export PR_BODY PR_BRANCH CHANGED_PLANS
  source "$SCRIPT_DIR/extract-plan-ref.sh"
  [ "$PLAN_FILE" = "docs/plans/udt-support.md" ]
}

@test "extracts phase number from PR body 'Phase: 3'" {
  PR_BODY="Plan: docs/plans/udt-support.md
Phase: 3"
  PR_BRANCH=""
  CHANGED_PLANS=""
  export PR_BODY PR_BRANCH CHANGED_PLANS
  source "$SCRIPT_DIR/extract-plan-ref.sh"
  [ "$PHASE" = "3" ]
}

@test "extracts letter phase from PR body 'Phase: C'" {
  PR_BODY="Plan: docs/plans/migration-strategy.md
Phase: C"
  PR_BRANCH=""
  CHANGED_PLANS=""
  export PR_BODY PR_BRANCH CHANGED_PLANS
  source "$SCRIPT_DIR/extract-plan-ref.sh"
  [ "$PHASE" = "C" ]
}

@test "plan extraction is case-insensitive for 'plan:' prefix" {
  PR_BODY="plan: docs/plans/my-plan.md
phase: 2"
  PR_BRANCH=""
  CHANGED_PLANS=""
  export PR_BODY PR_BRANCH CHANGED_PLANS
  source "$SCRIPT_DIR/extract-plan-ref.sh"
  [ "$PLAN_FILE" = "docs/plans/my-plan.md" ]
  [ "$PHASE" = "2" ]
}

# ---------------------------------------------------------------------------
# Branch name fallback
# ---------------------------------------------------------------------------

@test "extracts plan from branch name 'plan/udt-support/phase-3'" {
  PR_BODY=""
  PR_BRANCH="plan/udt-support/phase-3"
  CHANGED_PLANS=""
  export PR_BODY PR_BRANCH CHANGED_PLANS
  source "$SCRIPT_DIR/extract-plan-ref.sh"
  [ "$PLAN_FILE" = "docs/plans/udt-support.md" ]
  [ "$PHASE" = "3" ]
}

@test "extracts letter phase from branch 'plan/migration/phase-C'" {
  PR_BODY=""
  PR_BRANCH="plan/migration/phase-C"
  CHANGED_PLANS=""
  export PR_BODY PR_BRANCH CHANGED_PLANS
  source "$SCRIPT_DIR/extract-plan-ref.sh"
  [ "$PLAN_FILE" = "docs/plans/migration.md" ]
  [ "$PHASE" = "C" ]
}

@test "PR body takes priority over branch name" {
  PR_BODY="Plan: docs/plans/from-body.md
Phase: 5"
  PR_BRANCH="plan/from-branch/phase-2"
  CHANGED_PLANS=""
  export PR_BODY PR_BRANCH CHANGED_PLANS
  source "$SCRIPT_DIR/extract-plan-ref.sh"
  [ "$PLAN_FILE" = "docs/plans/from-body.md" ]
  [ "$PHASE" = "5" ]
}

# ---------------------------------------------------------------------------
# No plan reference
# ---------------------------------------------------------------------------

@test "no plan reference sets HAS_PLAN=false" {
  PR_BODY="Just a normal PR description"
  PR_BRANCH="feature/something"
  CHANGED_PLANS=""
  export PR_BODY PR_BRANCH CHANGED_PLANS
  source "$SCRIPT_DIR/extract-plan-ref.sh"
  [ "$HAS_PLAN" = "false" ]
  [ -z "$PLAN_FILE" ]
  [ -z "$PHASE" ]
}

@test "empty inputs set HAS_PLAN=false" {
  PR_BODY=""
  PR_BRANCH=""
  CHANGED_PLANS=""
  export PR_BODY PR_BRANCH CHANGED_PLANS
  source "$SCRIPT_DIR/extract-plan-ref.sh"
  [ "$HAS_PLAN" = "false" ]
}

# ---------------------------------------------------------------------------
# Changed plans merging
# ---------------------------------------------------------------------------

@test "merges CHANGED_PLANS with PR body plan" {
  PR_BODY="Plan: docs/plans/udt-support.md
Phase: 3"
  PR_BRANCH=""
  CHANGED_PLANS="docs/plans/other-plan.md"
  export PR_BODY PR_BRANCH CHANGED_PLANS
  source "$SCRIPT_DIR/extract-plan-ref.sh"
  echo "$ALL_PLANS" | grep -q "docs/plans/udt-support.md"
  echo "$ALL_PLANS" | grep -q "docs/plans/other-plan.md"
  [ "$HAS_PLAN" = "true" ]
}

@test "deduplicates when CHANGED_PLANS contains same file as PR body" {
  PR_BODY="Plan: docs/plans/udt-support.md"
  PR_BRANCH=""
  CHANGED_PLANS="docs/plans/udt-support.md"
  export PR_BODY PR_BRANCH CHANGED_PLANS
  source "$SCRIPT_DIR/extract-plan-ref.sh"
  COUNT=$(echo "$ALL_PLANS" | grep -c "docs/plans/udt-support.md")
  [ "$COUNT" -eq 1 ]
}

@test "CHANGED_PLANS alone sets HAS_PLAN=true" {
  PR_BODY=""
  PR_BRANCH=""
  CHANGED_PLANS="docs/plans/some-plan.md"
  export PR_BODY PR_BRANCH CHANGED_PLANS
  source "$SCRIPT_DIR/extract-plan-ref.sh"
  [ "$HAS_PLAN" = "true" ]
  echo "$ALL_PLANS" | grep -q "docs/plans/some-plan.md"
}

@test "multiple CHANGED_PLANS are all included" {
  PR_BODY=""
  PR_BRANCH=""
  CHANGED_PLANS="docs/plans/plan-a.md
docs/plans/plan-b.md"
  export PR_BODY PR_BRANCH CHANGED_PLANS
  source "$SCRIPT_DIR/extract-plan-ref.sh"
  echo "$ALL_PLANS" | grep -q "docs/plans/plan-a.md"
  echo "$ALL_PLANS" | grep -q "docs/plans/plan-b.md"
  [ "$HAS_PLAN" = "true" ]
}

# ---------------------------------------------------------------------------
# Edge cases
# ---------------------------------------------------------------------------

@test "plan file with dots and underscores in name" {
  PR_BODY="Plan: docs/plans/my_plan.v2.md"
  PR_BRANCH=""
  CHANGED_PLANS=""
  export PR_BODY PR_BRANCH CHANGED_PLANS
  source "$SCRIPT_DIR/extract-plan-ref.sh"
  [ "$PLAN_FILE" = "docs/plans/my_plan.v2.md" ]
}

@test "phase from branch when PR body has plan but no phase" {
  PR_BODY="Plan: docs/plans/udt-support.md"
  PR_BRANCH="plan/udt-support/phase-4"
  CHANGED_PLANS=""
  export PR_BODY PR_BRANCH CHANGED_PLANS
  source "$SCRIPT_DIR/extract-plan-ref.sh"
  [ "$PLAN_FILE" = "docs/plans/udt-support.md" ]
  [ "$PHASE" = "4" ]
}
