#!/usr/bin/env bats
# Smoke test to verify the pytest-bats plugin collects and runs .bats files.

@test "true always succeeds" {
    true
}

@test "echo produces output" {
    run echo "hello from bats"
    [ "$status" -eq 0 ]
    [ "$output" = "hello from bats" ]
}
