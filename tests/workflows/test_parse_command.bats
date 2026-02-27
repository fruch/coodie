#!/usr/bin/env bats
# Tests for .github/scripts/parse-command.sh

SCRIPT_DIR="$(cd "$(dirname "$BATS_TEST_FILENAME")/../../.github/scripts" && pwd)"

@test "/rebase sets do_rebase=true, do_squash=false" {
  COMMAND="/rebase"
  export COMMAND
  source "$SCRIPT_DIR/parse-command.sh"
  [ "$DO_REBASE" = "true" ]
  [ "$DO_SQUASH" = "false" ]
}

@test "/squash sets do_rebase=false, do_squash=true" {
  COMMAND="/squash"
  export COMMAND
  source "$SCRIPT_DIR/parse-command.sh"
  [ "$DO_REBASE" = "false" ]
  [ "$DO_SQUASH" = "true" ]
}

@test "/rebase squash sets both true" {
  COMMAND="/rebase squash"
  export COMMAND
  source "$SCRIPT_DIR/parse-command.sh"
  [ "$DO_REBASE" = "true" ]
  [ "$DO_SQUASH" = "true" ]
}

@test "/REBASE (uppercase) sets do_rebase=true (case-insensitive)" {
  COMMAND="/REBASE"
  export COMMAND
  source "$SCRIPT_DIR/parse-command.sh"
  [ "$DO_REBASE" = "true" ]
  [ "$DO_SQUASH" = "false" ]
}

@test "  /rebase   (whitespace) sets do_rebase=true" {
  COMMAND="  /rebase  "
  export COMMAND
  source "$SCRIPT_DIR/parse-command.sh"
  [ "$DO_REBASE" = "true" ]
  [ "$DO_SQUASH" = "false" ]
}

@test "rebase (workflow_dispatch, no leading /) sets do_rebase=true" {
  COMMAND="rebase"
  export COMMAND
  source "$SCRIPT_DIR/parse-command.sh"
  [ "$DO_REBASE" = "true" ]
  [ "$DO_SQUASH" = "false" ]
}

@test "rebase squash (workflow_dispatch) sets both true" {
  COMMAND="rebase squash"
  export COMMAND
  source "$SCRIPT_DIR/parse-command.sh"
  [ "$DO_REBASE" = "true" ]
  [ "$DO_SQUASH" = "true" ]
}

@test "hello world (no command) sets both false" {
  COMMAND="hello world"
  export COMMAND
  source "$SCRIPT_DIR/parse-command.sh"
  [ "$DO_REBASE" = "false" ]
  [ "$DO_SQUASH" = "false" ]
}

@test "empty string sets both false" {
  COMMAND=""
  export COMMAND
  source "$SCRIPT_DIR/parse-command.sh"
  [ "$DO_REBASE" = "false" ]
  [ "$DO_SQUASH" = "false" ]
}
