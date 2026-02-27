# Environment Setup

Shared setup instructions for the coodie development environment.
All skills should reference this file instead of duplicating setup steps.

See also: [CONTRIBUTING.md](../../CONTRIBUTING.md) for the full contributor guide.

## Prerequisites

- **Python 3.10+**
- **[uv](https://github.com/astral-sh/uv)** — fast Python package manager
- **Docker** — required for integration tests and benchmarks that use ScyllaDB

## Quick Setup

```bash
# Install all dev dependencies (lint, test, docs, benchmarks)
uv sync --all-groups

# Install the driver extra you need
uv pip install -e ".[scylla]"    # scylla-driver (default)
uv pip install -e ".[acsylla]"   # acsylla (async-native)
uv pip install -e ".[cassandra]" # cassandra-driver

# Install pre-commit hooks (required before pushing any changes)
uv run pre-commit install
```

## Before Committing and Pushing

Follow these steps before every commit and push to avoid CI failures.

### 1. Run pre-commit checks

```bash
# Run all checks (ruff lint + ruff format + trailing whitespace, etc.)
uv run pre-commit run --all-files
```

The CI `lint` job (`ci.yml`) runs `uv run pre-commit run --all-files` and will
reject pushes that fail ruff lint or formatting checks.

#### What pre-commit checks

| Hook | Purpose |
|------|---------|
| `ruff` | Lint Python — unused imports, style issues (auto-fixes) |
| `ruff-format` | Format Python — consistent code style |
| `trailing-whitespace` | Remove trailing whitespace |
| `end-of-file-fixer` | Ensure files end with a newline |
| `check-yaml` / `check-toml` / `check-json` | Validate config files |
| `commitizen` | Validate commit messages (Conventional Commits) |

See `.pre-commit-config.yaml` for the full configuration.

### 2. Run relevant tests

```bash
# Unit tests (no database needed)
uv run pytest tests/ -v -m "not integration" --timeout=30

# If you changed benchmark files
uv run pytest benchmarks/ -v --benchmark-enable
```

### 3. Use Conventional Commit messages

Commit messages **must** follow [Conventional Commits](https://www.conventionalcommits.org).
CI runs [commitlint](https://commitlint.js.org/) to enforce this. See
[AGENTS.md](../../AGENTS.md) for the full specification.

Format: `<type>(<scope>): <subject>`

| Type | Purpose |
|------|---------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation-only changes |
| `style` | Formatting, whitespace (no logic change) |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf` | Performance improvement |
| `test` | Adding or correcting tests |
| `build` | Build system or external dependency changes |
| `ci` | CI configuration changes |
| `chore` | Other changes that don't modify src or test files |

Examples:
```
feat(aio): add TTL support to Document.save()
fix(cql_builder): escape column names with reserved words
docs: update quickstart guide
test(sync): add QuerySet chaining coverage
```

## Running Linters Manually

If you need to run linters outside of pre-commit:

```bash
# Lint
uv run ruff check src/ tests/ benchmarks/

# Format check
uv run ruff format --check src/ tests/ benchmarks/

# Auto-fix lint issues
uv run ruff check --fix src/ tests/ benchmarks/

# Auto-format
uv run ruff format src/ tests/ benchmarks/
```
