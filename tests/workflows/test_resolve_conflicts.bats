#!/usr/bin/env bats
# tests/workflows/test_resolve_conflicts.bats
#
# Bats unit tests for .github/scripts/resolve-conflicts.sh
#
# Each test creates a fake "bin/" directory on PATH containing mock
# implementations of `git` and `python3`, then runs the script and asserts
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

    # Mock bin takes priority over real git/python3
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

_mock_resolver() {
    local output="$1"
    cat > "$MOCK_BIN/python3" << EOF
#!/usr/bin/env bash
# Mock python3 that intercepts resolve-conflict-file.py calls
if echo "\$1" | grep -q "resolve-conflict-file.py"; then
    # Parse --output-file argument
    outfile=""
    while [ \$# -gt 0 ]; do
        if [ "\$1" = "--output-file" ]; then
            outfile="\$2"
            shift 2
        else
            shift
        fi
    done
    if [ -n "\$outfile" ] && [ -n "$output" ]; then
        printf '%s\n' "$output" > "\$outfile"
    fi
    exit 0
else
    # Fall through to real python3 for other scripts
    exec /usr/bin/python3 "\$@"
fi
EOF
    chmod +x "$MOCK_BIN/python3"
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
    grep -q "AI resolved rebase conflicts" "$GITHUB_STEP_SUMMARY"
}

@test "Resolver resolves file → status=clean" {
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

    _mock_resolver "x = 2"

    run bash "$SCRIPT"

    [ "$status" -eq 0 ]
    grep -q "^status=clean$" "$GITHUB_OUTPUT"
}

@test "Resolver resolves file → resolved content written to file" {
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

    _mock_resolver "x = 2"

    run bash "$SCRIPT"

    [ "$status" -eq 0 ]
    # File should have been updated with resolved content
    [ "$(cat "${WORK_DIR}/foo.py")" = "x = 2" ]
}

@test "Resolver returns empty → status=unresolved" {
    cat > "${WORK_DIR}/foo.py" << 'EOF'
<<<<<<< HEAD
x = 1
=======
x = 2
>>>>>>> branch
EOF
    _mock_git_conflicts "foo.py"
    _mock_resolver ""

    run bash "$SCRIPT"

    [ "$status" -eq 0 ]
    grep -q "^status=unresolved$" "$GITHUB_OUTPUT"
}

@test "Resolver output still contains conflict marker → status=unresolved" {
    cat > "${WORK_DIR}/foo.py" << 'EOF'
<<<<<<< HEAD
x = 1
=======
x = 2
>>>>>>> branch
EOF
    _mock_git_conflicts "foo.py"
    # Resolver returns output that still has <<<<<<< (bad resolution)
    _mock_resolver "<<<<<<< HEAD
x = 1
=======
x = 2
>>>>>>> branch"

    run bash "$SCRIPT"

    [ "$status" -eq 0 ]
    grep -q "^status=unresolved$" "$GITHUB_OUTPUT"
}

@test "Resolver writes resolved content to file → accepted" {
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

    # Mock python3 to write resolved content to the output file
    cat > "$MOCK_BIN/python3" << 'MOCK'
#!/usr/bin/env bash
if echo "$1" | grep -q "resolve-conflict-file.py"; then
    outfile=""
    while [ $# -gt 0 ]; do
        if [ "$1" = "--output-file" ]; then
            outfile="$2"
            shift 2
        else
            shift
        fi
    done
    if [ -n "$outfile" ]; then
        printf 'x = 2\n' > "$outfile"
    fi
    exit 0
else
    exec /usr/bin/python3 "$@"
fi
MOCK
    chmod +x "$MOCK_BIN/python3"

    run bash "$SCRIPT"

    [ "$status" -eq 0 ]
    grep -q "^status=clean$" "$GITHUB_OUTPUT"
    # File should contain the resolved content written by resolver
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
    _mock_resolver "resolved content"

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
    _mock_resolver "resolved content"

    run bash "$SCRIPT"

    [ "$status" -eq 0 ]
    grep -q "^status=unresolved$" "$GITHUB_OUTPUT"
}

@test "Resolver times out → status=unresolved and timeout logged" {
    export RESOLVE_TIMEOUT=1

    cat > "${WORK_DIR}/foo.py" << 'EOF'
<<<<<<< HEAD
x = 1
=======
x = 2
>>>>>>> branch
EOF

    _mock_git_conflicts "foo.py"

    # Slow python3 that outlasts RESOLVE_TIMEOUT (never writes to file)
    cat > "$MOCK_BIN/python3" << 'MOCK'
#!/usr/bin/env bash
if echo "$1" | grep -q "resolve-conflict-file.py"; then
    sleep 5
else
    exec /usr/bin/python3 "$@"
fi
MOCK
    chmod +x "$MOCK_BIN/python3"

    run bash "$SCRIPT"

    [ "$status" -eq 0 ]
    grep -q "^status=unresolved$" "$GITHUB_OUTPUT"
    [[ "$output" == *"timed out"* ]]
}

@test "Resolver returns empty → empty-output diagnostic logged" {
    cat > "${WORK_DIR}/foo.py" << 'EOF'
<<<<<<< HEAD
x = 1
=======
x = 2
>>>>>>> branch
EOF
    _mock_git_conflicts "foo.py"
    _mock_resolver ""

    run bash "$SCRIPT"

    [ "$status" -eq 0 ]
    grep -q "^status=unresolved$" "$GITHUB_OUTPUT"
    [[ "$output" == *"empty output"* ]]
}

@test "file size and conflict marker count logged before resolver call" {
    cat > "${WORK_DIR}/foo.py" << 'EOF'
<<<<<<< HEAD
x = 1
=======
x = 2
>>>>>>> branch
EOF
    _mock_git_conflicts "foo.py"
    _mock_resolver ""

    run bash "$SCRIPT"

    [ "$status" -eq 0 ]
    [[ "$output" == *"Attempting to resolve: foo.py"* ]]
    [[ "$output" == *"bytes"* ]]
    [[ "$output" == *"conflict marker"* ]]
}

# ---------------------------------------------------------------------------
# Merge mode tests
# ---------------------------------------------------------------------------

_mock_git_merge_conflicts() {
    local conflict_list="$1"
    cat > "$MOCK_BIN/git" << EOF
#!/usr/bin/env bash
if [[ "\$1" == "diff" ]]; then
    printf '%s\n' "$conflict_list"
elif [[ "\$1" == "add" ]]; then
    exit 0
elif [[ "\$1" == "commit" ]]; then
    exit 0
fi
EOF
    chmod +x "$MOCK_BIN/git"
}

@test "merge mode: Resolver resolves file → git commit --no-edit → status=clean" {
    export RESOLVE_MODE=merge

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
elif [[ "\$1" == "add" ]]; then
    exit 0
elif [[ "\$1" == "commit" ]]; then
    exit 0
fi
EOF
    chmod +x "$MOCK_BIN/git"

    _mock_resolver "x = 2"

    run bash "$SCRIPT"

    [ "$status" -eq 0 ]
    grep -q "^status=clean$" "$GITHUB_OUTPUT"
}

@test "merge mode: no conflicts → status=clean" {
    export RESOLVE_MODE=merge

    _mock_git_no_conflicts

    run bash "$SCRIPT"

    [ "$status" -eq 0 ]
    grep -q "^status=clean$" "$GITHUB_OUTPUT"
}

@test "merge mode: Resolver returns empty → status=unresolved" {
    export RESOLVE_MODE=merge

    cat > "${WORK_DIR}/foo.py" << 'EOF'
<<<<<<< HEAD
x = 1
=======
x = 2
>>>>>>> branch
EOF
    _mock_git_merge_conflicts "foo.py"
    _mock_resolver ""

    run bash "$SCRIPT"

    [ "$status" -eq 0 ]
    grep -q "^status=unresolved$" "$GITHUB_OUTPUT"
}

@test "merge mode: git commit fails → loops up to MAX_ROUNDS" {
    export RESOLVE_MODE=merge
    export MAX_ROUNDS=2

    cat > "${WORK_DIR}/foo.py" << 'EOF'
<<<<<<< HEAD
x = 1
=======
x = 2
>>>>>>> branch
EOF

    # git diff always returns conflicts; git commit always fails
    cat > "$MOCK_BIN/git" << 'EOF'
#!/usr/bin/env bash
if [[ "$1" == "diff" ]]; then
    echo "foo.py"
elif [[ "$1" == "add" ]]; then
    exit 0
elif [[ "$1" == "commit" ]]; then
    exit 1
fi
EOF
    chmod +x "$MOCK_BIN/git"
    _mock_resolver "resolved content"

    run bash "$SCRIPT"

    [ "$status" -eq 0 ]
    grep -q "^status=unresolved$" "$GITHUB_OUTPUT"
}

@test "merge mode: step summary written on success" {
    export RESOLVE_MODE=merge

    _mock_git_no_conflicts

    run bash "$SCRIPT"

    [ "$status" -eq 0 ]
    grep -q "AI resolved" "$GITHUB_STEP_SUMMARY"
}

@test "merge mode: rebase --continue is NOT called (mode isolation)" {
    export RESOLVE_MODE=merge

    cat > "${WORK_DIR}/foo.py" << 'EOF'
<<<<<<< HEAD
x = 1
=======
x = 2
>>>>>>> branch
EOF

    # Track what git sub-commands are invoked
    local git_log="${BATS_TEST_TMPDIR}/git_log"
    local call_count_file="${BATS_TEST_TMPDIR}/git_calls"
    echo 0 > "$call_count_file"
    : > "$git_log"
    cat > "$MOCK_BIN/git" << EOF
#!/usr/bin/env bash
echo "\$*" >> "$git_log"
if [[ "\$1" == "diff" ]]; then
    count=\$(cat "$call_count_file")
    count=\$((count + 1))
    echo "\$count" > "$call_count_file"
    if [ "\$count" -eq 1 ]; then
        echo "foo.py"
    fi
elif [[ "\$1" == "add" ]]; then
    exit 0
elif [[ "\$1" == "commit" ]]; then
    exit 0
elif [[ "\$1" == "rebase" ]]; then
    echo "UNEXPECTED: rebase called in merge mode" >&2
    exit 99
fi
EOF
    chmod +x "$MOCK_BIN/git"

    _mock_resolver "x = 2"

    run bash "$SCRIPT"

    [ "$status" -eq 0 ]
    grep -q "^status=clean$" "$GITHUB_OUTPUT"
    # Verify that 'rebase' was never invoked
    ! grep -q "rebase" "$git_log"
}

@test "merge mode: multiple conflicted files resolved in one round → status=clean" {
    export RESOLVE_MODE=merge

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

    local call_count_file="${BATS_TEST_TMPDIR}/git_calls"
    echo 0 > "$call_count_file"
    cat > "$MOCK_BIN/git" << EOF
#!/usr/bin/env bash
if [[ "\$1" == "diff" ]]; then
    count=\$(cat "$call_count_file")
    count=\$((count + 1))
    echo "\$count" > "$call_count_file"
    if [ "\$count" -eq 1 ]; then
        printf 'foo.py\nbar.py\n'
    fi
elif [[ "\$1" == "add" ]]; then
    exit 0
elif [[ "\$1" == "commit" ]]; then
    exit 0
fi
EOF
    chmod +x "$MOCK_BIN/git"

    _mock_resolver "resolved content"

    run bash "$SCRIPT"

    [ "$status" -eq 0 ]
    grep -q "^status=clean$" "$GITHUB_OUTPUT"
}
