# AGENTS.md — Commit Message Guidelines

This project enforces commit messages via [commitlint](https://commitlint.js.org/)
using the **Conventional Commits** specification (`@commitlint/config-conventional`).

See `commitlint.config.mjs` for the full configuration.

## Commit Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

### Type (required)

Must be one of:

| Type | Purpose |
|---|---|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation-only changes |
| `style` | Changes that do not affect the meaning of the code (whitespace, formatting) |
| `refactor` | A code change that neither fixes a bug nor adds a feature |
| `perf` | A code change that improves performance |
| `test` | Adding or correcting tests |
| `build` | Changes that affect the build system or external dependencies |
| `ci` | Changes to CI configuration files and scripts |
| `chore` | Other changes that don't modify src or test files |
| `revert` | Reverts a previous commit |

### Scope (optional)

A noun in parentheses describing the section of the codebase affected, e.g.
`feat(drivers)`, `fix(aio)`, `docs(demo)`, `test(sync)`.

### Subject (required)

- Use the imperative, present tense: "add", not "added" or "adds"
- Do not capitalize the first letter
- No period (`.`) at the end

### Body (optional)

Free-form. Explain **what** and **why** (not how).

### Footer (optional)

- `BREAKING CHANGE: <description>` for breaking changes
- `Refs: #<issue>` or `Closes #<issue>` for issue references

## Line Length

This project **disables** the default line-length limits:

- `header-max-length`: unlimited
- `body-max-line-length`: unlimited
- `footer-max-line-length`: unlimited

## Ignored Patterns

Commits starting with `Initial plan` are exempt from linting.

## Examples

```
feat(aio): add TTL support to Document.save()
```

```
fix(cql_builder): escape column names with reserved words
```

```
docs(demo): add HTMX UI setup instructions to README
```

```
test(sync): add QuerySet chaining coverage for order_by
```

```
refactor(drivers): extract prepared-statement cache into mixin

The cache was duplicated across CassandraDriver and AcsyllaDriver.
Extract into a shared PreparedStatementCache mixin.

Refs: #42
```

```
feat!: rename init_coodie() to connect()

BREAKING CHANGE: `init_coodie()` is removed. Use `connect()` instead.
```
