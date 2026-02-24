# Refactor a Test File

A 5-phase process for systematically refactoring a test file in the coodie test suite.

---

## Phase 1: Analyze Current State

**Entry:** You have identified a test file to refactor (e.g., `tests/test_types.py`).

**Actions:**

1. Read the entire file and count total lines.
2. List every test function/method with a one-line summary of what it tests.
3. Group functions that share the same structure — same function-under-test, same assertion pattern, differing only in inputs.
4. Count the groups: each group with 3+ members is a parametrize candidate.
5. Note any shared fixtures or model definitions that could be extracted.

**Exit:** You have a list of parametrize candidate groups and extraction candidates.

---

## Phase 2: Plan Changes

**Entry:** Phase 1 complete. Candidate groups identified.

**Actions:**

1. For each candidate group, draft the `@pytest.mark.parametrize` decorator with all cases.
2. Decide on `pytest.param(..., id="...")` labels for each case.
3. Identify any functions that should remain separate (different assertions, different setup).
4. If merging sync/async: decide whether to use `_maybe_await` + fixture parametrization.
5. If splitting a file: draft the new module layout with file names and which tests go where.
6. Estimate the line count after refactoring — confirm it meets the < 400 line target.

**Exit:** A concrete plan with before/after for each change. No code written yet.

---

## Phase 3: Apply Refactoring

**Entry:** Phase 2 complete. Plan validated.

**Actions:**

1. Create any new files needed (e.g., `tests/integration/__init__.py`, `conftest.py`).
2. Apply parametrize transformations one group at a time:
   - Replace the group of functions with a single parametrized function.
   - Use `pytest.param(..., id="...")` for every entry.
   - Keep the function name descriptive: `test_python_type_to_cql_type_str`, not `test_types`.
3. Extract shared models to `conftest.py` or `models.py` if needed.
4. If splitting a file: move tests to new modules, update imports, add `__init__.py`.
5. After each group transformation, run the affected tests to catch mistakes early:
   ```bash
   uv run pytest tests/test_types.py -v
   ```

**Exit:** All planned transformations applied. Code compiles (no syntax errors).

---

## Phase 4: Verify

**Entry:** Phase 3 complete. All transformations applied.

**Actions:**

1. Run the full unit test suite:
   ```bash
   uv run pytest tests/ -v --ignore=tests/test_integration.py
   ```
2. Compare test count before and after — it must be equal or higher.
3. Check that every original test case has a corresponding parametrize entry.
4. Verify no test was accidentally dropped by comparing `pytest --collect-only` output.
5. Run the linter to ensure code style compliance:
   ```bash
   uv run ruff check tests/ && uv run ruff format --check tests/
   ```

**Exit:** All tests pass. Test count unchanged or increased. Linter clean.

---

## Phase 5: Validate File Sizes

**Entry:** Phase 4 complete. Tests pass.

**Actions:**

1. Count lines in each modified file: `wc -l tests/*.py tests/**/*.py`.
2. Confirm all files are under 400 lines (target) or 500 lines (hard limit).
3. If any file exceeds 500 lines, apply further splitting by feature area.
4. Review the final diff — ensure no unrelated changes snuck in.

**Exit:** All files within size targets. Refactoring complete.
