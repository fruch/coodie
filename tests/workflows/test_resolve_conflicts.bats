#!/usr/bin/env bats
# tests/workflows/test_resolve_conflicts.bats
#
# Bats unit tests for .github/scripts/resolve-conflicts.sh
#
# Each test creates a fake "bin/" directory on PATH containing mock
# implementations of `git` and `copilot`, then runs the script and asserts
# on the GITHUB_OUTPUT file and exit code.

SCRIPT="${BATS_TEST_DIRNAME}/../../.github/scripts/resolve-conflicts.sh"

setup() {
    WORK_DIR="${BATS_TEST_TMPDIR}/work"
    MOCK_BIN="${BATS_TEST_TMPDIR}/bin"
    mkdir -p "$WORK_DIR" "$MOCK_BIN"

    export GITHUB_OUTPUT="${BATS_TEST_TMPDIR}/github_output"
    export GITHUB_STEP_SUMMARY="${BATS_TEST_TMPDIR}/github_step_summary"
    touch "$GITHUB_OUTPUT" "$GITHUB_STEP_SUMMARY"

    export MAX_ROUNDS=10

    # Mock bin takes priority over real git/copilot
    export PATH="$MOCK_BIN:$PATH"

    cd "$WORK_DIR"
}

# ---------------------------------------------------------------------------
# Helper: write a mock `git` script that returns conflict list on `diff` and
# succeeds silently for `add` / `rebase`.
# ---------------------------------------------------------------------------
_mock_git_conflicts() {
    local conflict_list="$1"
    cat > "$MOCK_BIN/git" << EOF
#!/usr/bin/env bash
if [[ "\$1" == "diff" ]]; then
    printf '%s\n' "$conflict_list"
elif [[ "\$1" == "add" ]] || [[ "\$1 \$2" == "rebase --continue" ]]; then
    exit 0
fi
EOF
    chmod +x "$MOCK_BIN/git"
}

_mock_git_no_conflicts() {
    cat > "$MOCK_BIN/git" << 'EOF'
#!/usr/bin/env bash
exit 0
EOF
    chmod +x "$MOCK_BIN/git"
}

_mock_copilot() {
    local output="$1"
    cat > "$MOCK_BIN/copilot" << EOF
#!/usr/bin/env bash
printf '%s\n' "$output"
EOF
    chmod +x "$MOCK_BIN/copilot"
}

# ---------------------------------------------------------------------------
@test "no conflicts detected → status=clean written immediately" {
    _mock_git_no_conflicts

    run bash "$SCRIPT"

    [ "$status" -eq 0 ]
    grep -q "^status=clean$" "$GITHUB_OUTPUT"
}

@test "no conflicts detected → step summary written" {
    _mock_git_no_conflicts

    run bash "$SCRIPT"

    [ "$status" -eq 0 ]
    grep -q "Copilot resolved rebase conflicts" "$GITHUB_STEP_SUMMARY"
}

@test "Copilot resolves file → status=clean" {
    # Create file with conflict markers in the work dir
    cat > "${WORK_DIR}/foo.py" << 'EOF'
<<<<<<< HEAD
x = 1
=======
x = 2
>>>>>>> branch
EOF

    # git diff returns the conflicted file on first call, then empty
    local call_count_file="${BATS_TEST_TMPDIR}/git_calls"
    echo 0 > "$call_count_file"
    cat > "$MOCK_BIN/git" << EOF
#!/usr/bin/env bash
if [[ "\$1" == "diff" ]]; then
    count=\$(cat "$call_count_file")
    count=\$((count + 1))
    echo "\$count" > "$call_count_file"
    if [ "\$count" -eq 1 ]; then
        echo "foo.py"
    fi
elif [[ "\$1" == "add" ]]; then
    exit 0
elif [[ "\$1" == "rebase" ]] && [[ "\$2" == "--continue" ]]; then
    exit 0
fi
EOF
    chmod +x "$MOCK_BIN/git"

    _mock_copilot "x = 2"

    run bash "$SCRIPT"

    [ "$status" -eq 0 ]
    grep -q "^status=clean$" "$GITHUB_OUTPUT"
}

@test "Copilot resolves file → resolved content written to file" {
    cat > "${WORK_DIR}/foo.py" << 'EOF'
<<<<<<< HEAD
x = 1
=======
x = 2
>>>>>>> branch
EOF

    local call_count_file="${BATS_TEST_TMPDIR}/git_calls"
    echo 0 > "$call_count_file"
    cat > "$MOCK_BIN/git" << EOF
#!/usr/bin/env bash
if [[ "\$1" == "diff" ]]; then
    count=\$(cat "$call_count_file")
    count=\$((count + 1))
    echo "\$count" > "$call_count_file"
    if [ "\$count" -eq 1 ]; then
        echo "foo.py"
    fi
elif [[ "\$1" == "add" ]] || ([[ "\$1" == "rebase" ]] && [[ "\$2" == "--continue" ]]); then
    exit 0
fi
EOF
    chmod +x "$MOCK_BIN/git"

    _mock_copilot "x = 2"

    run bash "$SCRIPT"

    [ "$status" -eq 0 ]
    # File should have been updated with resolved content
    [ "$(cat "${WORK_DIR}/foo.py")" = "x = 2" ]
}

@test "Copilot returns empty → status=unresolved" {
    cat > "${WORK_DIR}/foo.py" << 'EOF'
<<<<<<< HEAD
x = 1
=======
x = 2
>>>>>>> branch
EOF
    _mock_git_conflicts "foo.py"
    _mock_copilot ""

    run bash "$SCRIPT"

    [ "$status" -eq 0 ]
    grep -q "^status=unresolved$" "$GITHUB_OUTPUT"
}

@test "Copilot output still contains conflict marker → status=unresolved" {
    cat > "${WORK_DIR}/foo.py" << 'EOF'
<<<<<<< HEAD
x = 1
=======
x = 2
>>>>>>> branch
EOF
    _mock_git_conflicts "foo.py"
    # Copilot returns output that still has <<<<<<< (bad resolution)
    _mock_copilot "<<<<<<< HEAD
x = 1
=======
x = 2
>>>>>>> branch"

    run bash "$SCRIPT"

    [ "$status" -eq 0 ]
    grep -q "^status=unresolved$" "$GITHUB_OUTPUT"
}

@test "Copilot returns fenced code block → stripped and accepted" {
    cat > "${WORK_DIR}/foo.py" << 'EOF'
<<<<<<< HEAD
x = 1
=======
x = 2
>>>>>>> branch
EOF

    local call_count_file="${BATS_TEST_TMPDIR}/git_calls"
    echo 0 > "$call_count_file"
    cat > "$MOCK_BIN/git" << EOF
#!/usr/bin/env bash
if [[ "\$1" == "diff" ]]; then
    count=\$(cat "$call_count_file")
    count=\$((count + 1))
    echo "\$count" > "$call_count_file"
    if [ "\$count" -eq 1 ]; then
        echo "foo.py"
    fi
elif [[ "\$1" == "add" ]] || ([[ "\$1" == "rebase" ]] && [[ "\$2" == "--continue" ]]); then
    exit 0
fi
EOF
    chmod +x "$MOCK_BIN/git"

    # Copilot wraps response in a fenced code block
    cat > "$MOCK_BIN/copilot" << 'MOCK'
#!/usr/bin/env bash
printf '```python\nx = 2\n```\n'
MOCK
    chmod +x "$MOCK_BIN/copilot"

    run bash "$SCRIPT"

    [ "$status" -eq 0 ]
    grep -q "^status=clean$" "$GITHUB_OUTPUT"
    # File should contain stripped content (no ``` markers)
    [ "$(cat "${WORK_DIR}/foo.py")" = "x = 2" ]
}

@test "multi-round: continue surfaces new conflict, resolved on second round → status=clean" {
    cat > "${WORK_DIR}/foo.py" << 'EOF'
<<<<<<< HEAD
x = 1
=======
x = 2
>>>>>>> branch
EOF
    cat > "${WORK_DIR}/bar.py" << 'EOF'
<<<<<<< HEAD
y = 1
=======
y = 2
>>>>>>> branch
EOF

    # State machine: round 1 returns foo.py, continue fails (exit 1),
    # round 2 returns bar.py, continue succeeds
    local round_file="${BATS_TEST_TMPDIR}/round"
    echo 0 > "$round_file"
    cat > "$MOCK_BIN/git" << EOF
#!/usr/bin/env bash
if [[ "\$1" == "diff" ]]; then
    r=\$(cat "$round_file")
    if [ "\$r" -eq 0 ]; then echo "foo.py"; fi
    if [ "\$r" -eq 1 ]; then echo "bar.py"; fi
    if [ "\$r" -ge 2 ]; then true; fi
elif [[ "\$1" == "add" ]]; then
    exit 0
elif [[ "\$1" == "rebase" ]] && [[ "\$2" == "--continue" ]]; then
    r=\$(cat "$round_file")
    new_r=\$((r + 1))
    echo "\$new_r" > "$round_file"
    if [ "\$r" -eq 0 ]; then exit 1; fi  # first continue: more conflicts
    exit 0                                # second continue: done
fi
EOF
    chmod +x "$MOCK_BIN/git"
    _mock_copilot "resolved content"

    run bash "$SCRIPT"

    [ "$status" -eq 0 ]
    grep -q "^status=clean$" "$GITHUB_OUTPUT"
}

@test "MAX_ROUNDS exceeded → status=unresolved" {
    export MAX_ROUNDS=2

    cat > "${WORK_DIR}/foo.py" << 'EOF'
<<<<<<< HEAD
x = 1
=======
x = 2
>>>>>>> branch
EOF

    # git diff always returns conflicts; rebase --continue always fails
    cat > "$MOCK_BIN/git" << 'EOF'
#!/usr/bin/env bash
if [[ "$1" == "diff" ]]; then
    echo "foo.py"
elif [[ "$1" == "add" ]]; then
    exit 0
elif [[ "$1" == "rebase" ]] && [[ "$2" == "--continue" ]]; then
    exit 1
fi
EOF
    chmod +x "$MOCK_BIN/git"
    _mock_copilot "resolved content"

    run bash "$SCRIPT"

    [ "$status" -eq 0 ]
    grep -q "^status=unresolved$" "$GITHUB_OUTPUT"
}

@test "Copilot times out → status=unresolved and timeout logged" {
    export COPILOT_TIMEOUT=1

    cat > "${WORK_DIR}/foo.py" << 'EOF'
<<<<<<< HEAD
x = 1
=======
x = 2
>>>>>>> branch
EOF

    _mock_git_conflicts "foo.py"

    # Slow copilot that outlasts COPILOT_TIMEOUT
    cat > "$MOCK_BIN/copilot" << 'MOCK'
#!/usr/bin/env bash
sleep 5
printf 'x = 2\n'
MOCK
    chmod +x "$MOCK_BIN/copilot"

    run bash "$SCRIPT"

    [ "$status" -eq 0 ]
    grep -q "^status=unresolved$" "$GITHUB_OUTPUT"
    [[ "$output" == *"timed out"* ]]
}

@test "Copilot returns empty → empty-output diagnostic logged" {
    cat > "${WORK_DIR}/foo.py" << 'EOF'
<<<<<<< HEAD
x = 1
=======
x = 2
>>>>>>> branch
EOF
    _mock_git_conflicts "foo.py"
    _mock_copilot ""

    run bash "$SCRIPT"

    [ "$status" -eq 0 ]
    grep -q "^status=unresolved$" "$GITHUB_OUTPUT"
    [[ "$output" == *"empty output"* ]]
}

@test "file size and conflict marker count logged before Copilot call" {
    cat > "${WORK_DIR}/foo.py" << 'EOF'
<<<<<<< HEAD
x = 1
=======
x = 2
>>>>>>> branch
EOF
    _mock_git_conflicts "foo.py"
    _mock_copilot ""

    run bash "$SCRIPT"

    [ "$status" -eq 0 ]
    [[ "$output" == *"Attempting to resolve: foo.py"* ]]
    [[ "$output" == *"bytes"* ]]
    [[ "$output" == *"conflict marker"* ]]
}
