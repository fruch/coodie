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
  # Mock gh to return an empty jobs array for the run-level endpoint;
  # the log endpoint should never be reached.
  cat > "$MOCK_DIR/gh" <<'MOCK'
#!/usr/bin/env bash
# Return empty jobs list for the run-level endpoint
echo '{"jobs": []}'
MOCK
  chmod +x "$MOCK_DIR/gh"

  export REPO="owner/repo"
  export RUN_ID="12345"
  export GH_TOKEN="fake"
  source "$SCRIPT_DIR/collect-failed-logs.sh"
  [ -z "$FAILED_LOGS" ]
  [ -z "$FAILED_LINKS" ]
}

@test "one failed job — logs collected with job name header" {
  # Mock gh:
  #   • run-level jobs endpoint → full JSON with one failed job
  #   • job-level logs endpoint → log content written to stdout (then redirected to file)
  cat > "$MOCK_DIR/gh" <<'MOCK'
#!/usr/bin/env bash
if [[ "$*" == *"/actions/runs/"*"/jobs"* ]]; then
  echo '{"jobs": [{"id": 100, "conclusion": "failure", "name": "Build", "html_url": "https://example.com/jobs/100", "steps": [{"number": 1, "conclusion": "failure", "name": "Run build"}]}]}'
elif [[ "$*" == *"/actions/jobs/100/logs"* ]]; then
  echo "##[group]Run build"
  echo "Error: test failed on line 42"
  echo "##[endgroup]"
fi
MOCK
  chmod +x "$MOCK_DIR/gh"

  export REPO="owner/repo"
  export RUN_ID="12345"
  export GH_TOKEN="fake"
  source "$SCRIPT_DIR/collect-failed-logs.sh"
  [[ "$FAILED_LOGS" == *"### Job: Build"* ]]
  [[ "$FAILED_LOGS" == *"Error: test failed on line 42"* ]]
  [[ "$FAILED_LINKS" == *"**Build**"* ]]
  [[ "$FAILED_LINKS" == *"view in Actions"* ]]
}

@test "multiple failed jobs — all logs concatenated" {
  # Mock gh:
  #   • run-level jobs endpoint → two failed jobs
  #   • per-job log endpoints → distinct log content
  cat > "$MOCK_DIR/gh" <<'MOCK'
#!/usr/bin/env bash
if [[ "$*" == *"/actions/runs/"*"/jobs"* ]]; then
  echo '{"jobs": [
    {"id": 100, "conclusion": "failure", "name": "Build", "html_url": "https://example.com/jobs/100", "steps": [{"number": 1, "conclusion": "failure", "name": "Compile"}]},
    {"id": 200, "conclusion": "failure", "name": "Test",  "html_url": "https://example.com/jobs/200", "steps": [{"number": 2, "conclusion": "failure", "name": "Run tests"}]}
  ]}'
elif [[ "$*" == *"/actions/jobs/100/logs"* ]]; then
  echo "Build error log"
elif [[ "$*" == *"/actions/jobs/200/logs"* ]]; then
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
  [[ "$FAILED_LINKS" == *"**Build**"* ]]
  [[ "$FAILED_LINKS" == *"**Test**"* ]]
}
