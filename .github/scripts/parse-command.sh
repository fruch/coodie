#!/usr/bin/env bash
# parse-command.sh — Parse a slash-command (or workflow_dispatch command)
# and set do_rebase / do_squash flags.
#
# Usage:
#   COMMAND="/rebase squash" source parse-command.sh
#   echo "$DO_REBASE $DO_SQUASH"
#
# Inputs:  COMMAND (env var)
# Outputs: DO_REBASE, DO_SQUASH (env vars, "true" or "false")

set -euo pipefail

DO_REBASE=false
DO_SQUASH=false

if echo "$COMMAND" | grep -qiE '(^\s*/)?rebase\s+squash\s*$'; then
  DO_REBASE=true
  DO_SQUASH=true
elif echo "$COMMAND" | grep -qiE '(^\s*/)?rebase\s*$'; then
  DO_REBASE=true
elif echo "$COMMAND" | grep -qiE '(^\s*/)?squash\s*$'; then
  DO_SQUASH=true
fi

export DO_REBASE
export DO_SQUASH
