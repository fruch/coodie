#!/usr/bin/env bats
# Tests for .github/scripts/collect-failed-logs.sh
#
# These tests mock `gh` to avoid real API calls.

SCRIPT_DIR="$(cd "$(dirname "$BATS_TEST_FILENAME")/../../.github/scripts" && pwd)"

setup() {
  # Create a temp directory for mock scripts
  MOCK_DIR="$(mktemp -d)"
  export PATH="$MOCK_DIR:$PATH"
}

teardown() {
  rm -rf "$MOCK_DIR"
}

@test "no failed jobs — empty output" {
  # Mock gh to return empty result for the failure query
  cat > "$MOCK_DIR/gh" <<'MOCK'
#!/usr/bin/env bash
# No failed jobs: return empty for the jq query
echo ""
MOCK
  chmod +x "$MOCK_DIR/gh"

  export REPO="owner/repo"
  export RUN_ID="12345"
  export GH_TOKEN="fake"
  source "$SCRIPT_DIR/collect-failed-logs.sh"
  [ -z "$FAILED_LOGS" ]
}

@test "one failed job — logs collected with job name header" {
  # Mock gh to return one failed job then its name and logs
  cat > "$MOCK_DIR/gh" <<'MOCK'
#!/usr/bin/env bash
if [[ "$*" == *"/jobs"* && "$*" == *"select(.conclusion"* ]]; then
  echo "100"
elif [[ "$*" == *"/jobs"* && "$*" == *"select(.id"* ]]; then
  echo "Build"
elif [[ "$*" == *"/logs"* ]]; then
  echo "Error: test failed on line 42"
else
  echo '{"jobs": [{"id": 100, "conclusion": "failure", "name": "Build"}]}'
fi
MOCK
  chmod +x "$MOCK_DIR/gh"

  export REPO="owner/repo"
  export RUN_ID="12345"
  export GH_TOKEN="fake"
  source "$SCRIPT_DIR/collect-failed-logs.sh"
  [[ "$FAILED_LOGS" == *"### Job: Build"* ]]
  [[ "$FAILED_LOGS" == *"Error: test failed on line 42"* ]]
}

@test "multiple failed jobs — all logs concatenated" {
  # Mock gh to return two failed jobs
  cat > "$MOCK_DIR/gh" <<'MOCK'
#!/usr/bin/env bash
if [[ "$*" == *"/jobs"* && "$*" == *"select(.conclusion"* ]]; then
  printf "100\n200\n"
elif [[ "$*" == *"/jobs"* && "$*" == *"select(.id == 100"* ]]; then
  echo "Build"
elif [[ "$*" == *"/jobs"* && "$*" == *"select(.id == 200"* ]]; then
  echo "Test"
elif [[ "$*" == *"jobs/100/logs"* ]]; then
  echo "Build error log"
elif [[ "$*" == *"jobs/200/logs"* ]]; then
  echo "Test error log"
fi
MOCK
  chmod +x "$MOCK_DIR/gh"

  export REPO="owner/repo"
  export RUN_ID="12345"
  export GH_TOKEN="fake"
  source "$SCRIPT_DIR/collect-failed-logs.sh"
  [[ "$FAILED_LOGS" == *"### Job: Build"* ]]
  [[ "$FAILED_LOGS" == *"### Job: Test"* ]]
}
