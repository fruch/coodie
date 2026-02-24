---
name: test-refactoring
description: >-
  Guides refactoring of Python test suites to reduce duplication using
  pytest.mark.parametrize, split large monolithic test files into focused
  modules, and deduplicate mirrored sync/async test classes. Use when
  test files exceed 400 lines, when multiple test functions share
  identical structure with different inputs, or when sync and async test
  classes are copy-pasted mirrors of each other.
---

# Test Refactoring

Reduce test duplication and improve maintainability by applying pytest patterns systematically.

## Essential Principles

<essential_principles>

<principle name="parametrize-over-copy-paste">
**Replace groups of structurally identical tests with `@pytest.mark.parametrize`.**

When three or more test functions call the same function with different inputs and assert the same way, they should be one parametrized test. Individual functions hide the pattern — parametrize makes it explicit. This catches missing cases (gaps in the parameter table are visible) and makes adding new cases a one-line change.
</principle>

<principle name="one-function-both-variants">
**Sync and async tests that mirror each other must share a single test function.**

Duplicating test logic across sync and async classes means every bug fix or new assertion must be applied twice. Use a `_maybe_await` helper or parametrized fixture to run both variants from the same test function body. The source of truth for test logic should exist in exactly one place.
</principle>

<principle name="small-focused-modules">
**Keep test files under 400 lines; split by feature area, not by sync/async.**

Large files degrade readability and make `pytest -k` targeting harder. Split by domain (basic CRUD, raw CQL, keyspace management, extended types, views) rather than by execution model. Each module should have a clear, non-overlapping scope described by its filename.
</principle>

<principle name="readable-parametrize-ids">
**Always use `pytest.param(..., id="description")` or descriptive tuple values.**

Parametrized tests with bare tuples produce failure output like `test_foo[param0]`, which is useless for debugging. Every parametrize entry should produce a human-readable test ID. Use `pytest.param` with `id=` or ensure the first tuple element is a descriptive string.
</principle>

<principle name="shared-models-in-conftest">
**Shared test model definitions belong in `conftest.py` or a `models.py` module, never duplicated across files.**

When multiple test files need the same Document subclass, define it once and import it. Duplicated model definitions drift apart silently and make refactoring harder.
</principle>

</essential_principles>

## When to Use

- A test file exceeds 400 lines and contains tests for multiple feature areas
- Three or more test functions follow the same structure with different inputs
- Sync and async test classes contain mirrored test methods with identical logic
- Adding a new test case requires copying an existing function and changing one value
- Extended-type roundtrip tests repeat the same save/read/assert pattern per type
- A new contributor asks how to write tests for this project

## When NOT to Use

- Tests that genuinely differ in logic, not just inputs — keep them as separate functions
- Integration test infrastructure changes (fixtures, containers) — use the `integration-tests` skill instead
- Adding brand-new test coverage for untested features — write the tests first, refactor later
- Performance benchmarks in `benchmarks/` — those follow different conventions

## Refactoring Decision Tree

```
Look at the test file you want to refactor:
│
├─ Multiple functions calling the same function with different inputs?
│  └─ Collapse into @pytest.mark.parametrize
│     See: references/parametrize-patterns.md
│
├─ Parallel sync and async test classes with mirrored methods?
│  └─ Merge into single parametrized tests with _maybe_await
│     See: references/sync-async-dedup.md
│
├─ File exceeds 400 lines?
│  └─ Split by feature area into separate modules
│     See: workflows/refactor-test-file.md
│
└─ None of the above?
   └─ File is fine — don't refactor for the sake of refactoring
```

## Quick Reference: Parametrize Patterns

| Pattern | When | Example |
|---------|------|---------|
| Simple type mapping | `f(input) == expected` repeated N times | `@pytest.mark.parametrize("py_type,cql", [(str,"text"), ...])` |
| Collection operations | Same builder, different op/value/fragment | `@pytest.mark.parametrize("op,value,fragment", [...])` |
| Filter operators | Same parser, different kwargs/expected | `@pytest.mark.parametrize("kwargs,expected", [...])` |
| Roundtrip tests | Save value → read back → assert for N types | `@pytest.mark.parametrize("field,write_val,check", [...])` |
| Error cases | Same function, different bad inputs, same exception | `@pytest.mark.parametrize("bad_input", [...])` |

## Quick Reference: File Size Targets

| File | Current | Target | Action |
|------|---------|--------|--------|
| `tests/test_types.py` | ~242 lines | ~120 lines | Parametrize type mappings and coercion tests |
| `tests/test_cql_builder.py` | ~706 lines | ~450 lines | Parametrize filter/collection/USING variants |
| `tests/test_integration.py` | ~2,435 lines | Split into 5 modules | Move to `tests/integration/` package |
| `tests/sync/test_document.py` | ~699 lines | Merge with async | Shared models + `_maybe_await` pattern |
| `tests/aio/test_document.py` | ~609 lines | Merge with async | Shared models + `_maybe_await` pattern |

## Quick Reference: Conventions

| Convention | Rule |
|-----------|------|
| Parametrize threshold | ≥ 3 functions with same structure → parametrize |
| Test IDs | Always use `pytest.param(..., id="name")` for non-obvious params |
| Shared models | Define in `conftest.py` or dedicated `models.py` |
| Sync/async parity | One function + `_maybe_await` helper, not two classes |
| File size | Target < 400 lines, split at 500 lines |
| Session fixtures | Expensive resources (containers, drivers) in `conftest.py`, session-scoped |
| Function fixtures | State-clearing fixtures stay function-scoped |

## Reference Index

| File | Content |
|------|---------|
| [parametrize-patterns.md](references/parametrize-patterns.md) | Concrete before/after examples for each parametrize pattern in this codebase |
| [sync-async-dedup.md](references/sync-async-dedup.md) | The `_maybe_await` pattern, shared model extraction, fixture parametrization |

| Workflow | Purpose |
|----------|---------|
| [refactor-test-file.md](workflows/refactor-test-file.md) | 5-phase process for refactoring a test file from analysis to verification |

## Success Criteria

A well-refactored test file:

- [ ] Has no groups of 3+ functions with identical structure differing only in inputs
- [ ] Uses `pytest.param(..., id="...")` for all non-obvious parametrize entries
- [ ] Has no duplicated model definitions across files
- [ ] Has no mirrored sync/async test classes with identical logic
- [ ] Stays under 400 lines (or has a documented reason for exceeding)
- [ ] All tests pass: `uv run pytest tests/ -v --ignore=tests/test_integration.py`
- [ ] Test count is unchanged or increased (refactoring must not drop coverage)
