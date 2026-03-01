#!/usr/bin/env bats
# Tests for .github/scripts/build-squash-message.sh

SCRIPT_DIR="$(cd "$(dirname "$BATS_TEST_FILENAME")/../../.github/scripts" && pwd)"

setup() {
  COPILOT_OUTPUT_FILE=$(mktemp)
  export COPILOT_OUTPUT_FILE
}

teardown() {
  rm -f "$COPILOT_OUTPUT_FILE"
}

@test "Copilot CLI returns valid body via file — message = title + body" {
  export TITLE="feat: add feature"
  echo "Added new endpoint for user management" > "$COPILOT_OUTPUT_FILE"
  export PR_BODY=""
  source "$SCRIPT_DIR/build-squash-message.sh"
  [[ "$MESSAGE" == "feat: add feature"* ]]
  [[ "$MESSAGE" == *"Added new endpoint for user management"* ]]
}

@test "Copilot output file is empty — fallback to PR body" {
  export TITLE="feat: add feature"
  : > "$COPILOT_OUTPUT_FILE"
  export PR_BODY="This PR adds a user management endpoint"
  source "$SCRIPT_DIR/build-squash-message.sh"
  [[ "$MESSAGE" == *"This PR adds a user management endpoint"* ]]
}

@test "Copilot output file missing — fallback to PR body" {
  export TITLE="feat: add feature"
  rm -f "$COPILOT_OUTPUT_FILE"
  export COPILOT_OUTPUT_FILE="/nonexistent/path"
  export PR_BODY="Fallback body text"
  source "$SCRIPT_DIR/build-squash-message.sh"
  [[ "$MESSAGE" == *"Fallback body text"* ]]
}

@test "Copilot CLI returns error text in file — rejected, falls back to PR body" {
  export TITLE="feat: add feature"
  echo "error: unknown option --foobar" > "$COPILOT_OUTPUT_FILE"
  export PR_BODY="Fallback body text"
  source "$SCRIPT_DIR/build-squash-message.sh"
  [[ "$MESSAGE" == *"Fallback body text"* ]]
  [[ "$MESSAGE" != *"error:"* ]]
}

@test "PR body is also empty — message = title only" {
  export TITLE="feat: add feature"
  : > "$COPILOT_OUTPUT_FILE"
  export PR_BODY=""
  source "$SCRIPT_DIR/build-squash-message.sh"
  [ "$MESSAGE" = "feat: add feature" ]
}

@test "Copilot output wrapped in fenced code block — extracts content" {
  export TITLE="fix: correct typo"
  printf '```\nFixed the typo in README\n```\n' > "$COPILOT_OUTPUT_FILE"
  export PR_BODY=""
  source "$SCRIPT_DIR/build-squash-message.sh"
  [[ "$MESSAGE" == *"Fixed the typo in README"* ]]
}

@test "Copilot output has agent step lines — stripped out" {
  export TITLE="feat: new api"
  printf '● Running tool\n$ npm install\nActual commit body here\n└ Done\n' > "$COPILOT_OUTPUT_FILE"
  export PR_BODY=""
  source "$SCRIPT_DIR/build-squash-message.sh"
  [[ "$MESSAGE" == *"Actual commit body here"* ]]
  [[ "$MESSAGE" != *"● Running tool"* ]]
  [[ "$MESSAGE" != *"└ Done"* ]]
  [[ "$MESSAGE" != *'$ npm'* ]]
}

@test "Copilot output has check-failure markers and permission errors — stripped out" {
  export TITLE="test: add counter tests"
  printf '✗ Check commit details\n  2>/dev/null | head -20\n  Permission denied and could not request permission from user\n\nAdd integration tests for counter operations.\n' > "$COPILOT_OUTPUT_FILE"
  export PR_BODY=""
  source "$SCRIPT_DIR/build-squash-message.sh"
  [[ "$MESSAGE" == *"Add integration tests for counter operations."* ]]
  [[ "$MESSAGE" != *"✗ Check commit details"* ]]
  [[ "$MESSAGE" != *"2>/dev/null"* ]]
  [[ "$MESSAGE" != *"Permission denied"* ]]
}

@test "Copilot output has standalone pipe commands — stripped out" {
  export TITLE="feat(demos): add ttl-sessions demo"
  printf '  | head -5\n\nAdd a ttl-sessions demo with FastAPI.\n' > "$COPILOT_OUTPUT_FILE"
  export PR_BODY=""
  source "$SCRIPT_DIR/build-squash-message.sh"
  [[ "$MESSAGE" == *"Add a ttl-sessions demo with FastAPI."* ]]
  [[ "$MESSAGE" != *"| head"* ]]
}

@test "Copilot output has check-success markers — stripped out" {
  export TITLE="fix: typo"
  printf '✓ Verified changes\nFixed typo in README\n' > "$COPILOT_OUTPUT_FILE"
  export PR_BODY=""
  source "$SCRIPT_DIR/build-squash-message.sh"
  [[ "$MESSAGE" == *"Fixed typo in README"* ]]
  [[ "$MESSAGE" != *"✓ Verified"* ]]
}

@test "All Copilot noise stripped — falls back to PR body" {
  export TITLE="feat: new feature"
  printf '✗ Check commit details\n  2>/dev/null | head -20\n  Permission denied and could not request permission from user\n' > "$COPILOT_OUTPUT_FILE"
  export PR_BODY="Fallback body"
  source "$SCRIPT_DIR/build-squash-message.sh"
  [[ "$MESSAGE" == *"Fallback body"* ]]
  [[ "$MESSAGE" != *"✗"* ]]
  [[ "$MESSAGE" != *"Permission denied"* ]]
}
