## Description

<!-- Describe the changes in this PR. -->

## Related Issue

<!-- Link any related GitHub issues: Fixes #123 -->

## Plan Reference

<!--
If this PR implements a phase of a multi-phase plan, add a `Plan:` line below.
The Plan Phase Continuation workflow uses this to automatically delegate the
next phase to Copilot after merge.

Format:
  Plan: docs/plans/<plan-name>.md
  Phase: N        ← optional: the phase number this PR completes

Example:
  Plan: docs/plans/udt-support.md
  Phase: 2

Leave blank if this PR is not part of a plan.
-->

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Refactor / code cleanup
- [ ] Test improvements
- [ ] CI / workflow changes

## Checklist

- [ ] My code follows the project's coding style
- [ ] I have added/updated tests that prove my fix/feature works
- [ ] All existing tests pass (`uv run pytest tests/`)
- [ ] I have run `uv run pre-commit run --all-files` and fixed any issues
- [ ] My commit messages follow the Conventional Commits format
