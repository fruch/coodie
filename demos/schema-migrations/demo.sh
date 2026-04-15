#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────────────
# Interactive demo for coodie schema migrations — Infinite Bazaar edition.
#
# Walks through the full migration lifecycle:
#   1.  Start ScyllaDB
#   2.  Discover migration files
#   3.  Dry-run preview
#   4.  Apply migrations one by one (with schema inspection after each)
#   5.  Inspect the state table
#   6.  Seed catalog data
#   7.  Roll back migrations 005+006 (data migration)
#   8.  Inspect partial state, re-apply
#   9.  Simulate a FAILED migration (bad type) — recovery walkthrough
#  10.  Fix and re-run
#  11.  Roll back migration 007 cleanly
#  12.  Gotchas & lessons learned
#  13.  Clean up
#
# Usage:
#     bash demo.sh          # or: make demo
# ──────────────────────────────────────────────────────────────────────────────
set -euo pipefail
cd "$(dirname "$0")"

COMPOSE="docker compose -f ../docker-compose.yml"
KEYSPACE="migrations_demo"
MIGRATIONS_DIR="migrations"

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
MAGENTA='\033[0;35m'
BOLD='\033[1m'
DIM='\033[2m'
RESET='\033[0m'

step=0

pause() {
    echo ""
    printf "${DIM}  ↵ Press Enter to continue...${RESET}"
    read -r
    echo ""
}

banner() {
    step=$((step + 1))
    local label="$1"
    local width=65
    local line
    line=$(printf '━%.0s' $(seq 1 $width))
    echo ""
    echo -e "${CYAN}${line}${RESET}"
    printf "${BOLD}  Step %-2s │ %s${RESET}\n" "$step" "$label"
    echo -e "${CYAN}${line}${RESET}"
    echo ""
}

info()   { echo -e "  ${CYAN}ℹ${RESET}  $*"; }
warn()   { echo -e "  ${YELLOW}⚠${RESET}  $*"; }
gotcha() { echo -e "  ${RED}☠${RESET}  ${BOLD}GOTCHA:${RESET} $*"; }
good()   { echo -e "  ${GREEN}✓${RESET}  $*"; }
cmd()    { echo -e "  ${DIM}»  $*${RESET}"; }
story()  { echo -e "  ${MAGENTA}🌀${RESET}  $*"; }

show_migration_file() {
    local filepath="$1"
    local filename
    filename=$(basename "$filepath")
    echo -e "  ${DIM}┌─ ${filename} ────────────────────────────────────────${RESET}"
    python3 - "$filepath" << 'PYEOF'
import sys, re

path = sys.argv[1]
lines = open(path).readlines()

in_docstring = False
doc_fence = None

for raw in lines:
    stripped = raw.rstrip()
    content = stripped.lstrip()

    if not in_docstring:
        if content.startswith('"""') or content.startswith("'''"):
            fence = content[:3]
            remainder = content[3:]
            if remainder.endswith(fence) and len(remainder) >= 3:
                continue
            in_docstring = True
            doc_fence = fence
            continue
        if content.startswith('#'):
            indent = len(raw) - len(raw.lstrip())
            if indent >= 8:
                print(f"  {stripped}")
            continue
    else:
        if doc_fence in content:
            in_docstring = False
        continue

    if not stripped:
        continue

    if (re.match(r'^class ', content) or
        re.match(r'^\s*(async )?def (upgrade|downgrade)', stripped) or
        re.match(r'^\s*description\s*=', stripped) or
        re.match(r'^\s*reversible\s*=', stripped) or
        re.match(r'^\s*allow_destructive\s*=', stripped) or
        (re.match(r'^\s*await ctx\.', stripped) and not stripped.rstrip().endswith('(')) or
        re.match(r'^\s*if (not )?await ctx\.', stripped) or
        re.match(r'^\s*async for .* in ctx\.scan_table', stripped)):
        print(f"  {stripped}")
PYEOF
    echo -e "  ${DIM}└─────────────────────────────────────────────────────${RESET}"
    echo ""
}

run_cqlsh() {
    $COMPOSE exec scylladb cqlsh -e "$1" 2>/dev/null
}

describe_table() {
    echo -e "  ${DIM}Current schema for ${BOLD}${KEYSPACE}.${1}${RESET}${DIM}:${RESET}"
    run_cqlsh "DESCRIBE TABLE ${KEYSPACE}.${1};" 2>/dev/null \
        | grep -E "^\s*(CREATE|[a-z_]+ [a-z<>,]+,?$|\))" \
        | sed 's/^/    /' || true
    echo ""
}

show_indexes() {
    echo -e "  ${DIM}Indexes on ${BOLD}${KEYSPACE}.products${RESET}${DIM}:${RESET}"
    run_cqlsh "SELECT index_name, options FROM system_schema.indexes WHERE keyspace_name='${KEYSPACE}' AND table_name='products';" \
        | grep -v "^$\|^-\|index_name\|rows)" \
        | sed 's/^/    /' || true
    echo ""
}

show_migration_state() {
    echo -e "  ${DIM}Migration state table (${KEYSPACE}._coodie_migrations):${RESET}"
    run_cqlsh "SELECT migration_name, applied_at, description FROM ${KEYSPACE}.\"_coodie_migrations\";" \
        | sed 's/^/    /' || true
    echo ""
}

# ──────────────────────────────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}╔═══════════════════════════════════════════════════════════════╗${RESET}"
echo -e "${CYAN}║${RESET}  ${BOLD}🌀  INFINITE BAZAAR — Schema Migrations Incident Report${RESET}       ${CYAN}║${RESET}"
echo -e "${CYAN}╠═══════════════════════════════════════════════════════════════╣${RESET}"
echo -e "${CYAN}║${RESET}                                                               ${CYAN}║${RESET}"
echo -e "${CYAN}║${RESET}  Intercepted transmission from Rift Corp Engineering, Dim-7   ${CYAN}║${RESET}"
echo -e "${CYAN}║${RESET}  Security clearance: OMEGA — Do not share with MerchBot.      ${CYAN}║${RESET}"
echo -e "${CYAN}║${RESET}                                                               ${CYAN}║${RESET}"
echo -e "${CYAN}║${RESET}  This walkthrough covers the full coodie migration lifecycle:  ${CYAN}║${RESET}"
echo -e "${CYAN}║${RESET}    • Apply migrations with live schema inspection              ${CYAN}║${RESET}"
echo -e "${CYAN}║${RESET}    • State table, checksums, distributed lock                 ${CYAN}║${RESET}"
echo -e "${CYAN}║${RESET}    • Rolling back a data migration                            ${CYAN}║${RESET}"
echo -e "${CYAN}║${RESET}    • Simulating & recovering from a FAILED migration           ${CYAN}║${RESET}"
echo -e "${CYAN}║${RESET}    • Common gotchas: ALLOW FILTERING, index-before-drop,      ${CYAN}║${RESET}"
echo -e "${CYAN}║${RESET}      idempotency, destructive rollbacks                       ${CYAN}║${RESET}"
echo -e "${CYAN}║${RESET}                                                               ${CYAN}║${RESET}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════════════════╝${RESET}"
pause

# ──────────────────────────────────────────────────────────────────────────────
banner "Start ScyllaDB & create keyspace"

story "Rift Corp's catalog cluster is coming online in Dimension-7."
info  "We start a ScyllaDB container via Docker Compose and create the"
info  "${BOLD}${KEYSPACE}${RESET} keyspace with SimpleStrategy RF=1 (dev only)."
echo ""
warn  "In production always use NetworkTopologyStrategy with RF ≥ 3."
echo ""
cmd   "docker compose up -d  +  cqlsh CREATE KEYSPACE"
pause

make db-up
good "ScyllaDB is up. Keyspace ${KEYSPACE} ready."
pause

# ──────────────────────────────────────────────────────────────────────────────
banner "Discover migration files"

story "The Bazaar's schema has evolved across six incidents — each captured"
story "in a versioned migration file in the ${BOLD}migrations/${RESET} directory."
echo ""
info  "coodie discovers files matching ${BOLD}YYYYMMDD_NNN_description.py${RESET} and"
info  "sorts them by the timestamp+sequence prefix so they always run in order."
echo ""
info  "Files found:"
for f in ${MIGRATIONS_DIR}/*.py; do
    [[ "$(basename "$f")" == __* ]] && continue
    echo -e "    ${GREEN}→${RESET}  $(basename "$f")"
done
echo ""
info  "Each file must define a ${BOLD}ForwardMigration(Migration)${RESET} class with"
info  "${BOLD}upgrade()${RESET} and optionally ${BOLD}downgrade()${RESET} methods."
pause

# ──────────────────────────────────────────────────────────────────────────────
banner "Dry-run — preview CQL without touching the database"

story "Before unleashing DDL on a live cluster, always preview first."
info  "The ${BOLD}--dry-run${RESET} flag records every CQL statement that would be"
info  "executed but sends nothing to ScyllaDB.  Zero risk."
echo ""
cmd   "coodie migrate --keyspace ${KEYSPACE} --migrations-dir ${MIGRATIONS_DIR} --dry-run"
pause

uv run coodie migrate --keyspace "${KEYSPACE}" --migrations-dir "${MIGRATIONS_DIR}" --dry-run
echo ""
gotcha "Dry-run bypasses the distributed lock — it never writes anything."
info   "But it does NOT validate that the CQL will succeed at runtime."
info   "A typo like ${BOLD}ADD \"hazard_class\" frobnitz${RESET} will only blow up at apply time."
pause

# ──────────────────────────────────────────────────────────────────────────────
banner "Apply migrations one by one — watch the schema evolve"

story "Directive Sigma-1 from ITA: apply all pending migrations NOW."
info  "The runner will:"
echo ""
echo -e "    ${GREEN}1.${RESET} Acquire a distributed lock via LWT (${BOLD}_coodie_migrations_lock${RESET})"
echo -e "    ${GREEN}2.${RESET} Wait for schema agreement across all nodes"
echo -e "    ${GREEN}3.${RESET} Execute each migration's ${BOLD}upgrade()${RESET} in order"
echo -e "    ${GREEN}4.${RESET} Record the result in ${BOLD}_coodie_migrations${RESET} (name + checksum)"
echo -e "    ${GREEN}5.${RESET} Release the lock"
echo ""
info  "Let's apply them one at a time so we can inspect the schema after each."
pause

# --- Migration 001 ---
echo -e "  ${BOLD}Applying 001 — Create base tables${RESET}"
echo ""
show_migration_file "${MIGRATIONS_DIR}/20260115_001_create_base_tables.py"
cmd   "coodie migrate --keyspace ${KEYSPACE} --migrations-dir ${MIGRATIONS_DIR} --target 20260115_001"
echo ""
uv run coodie migrate --keyspace "${KEYSPACE}" --migrations-dir "${MIGRATIONS_DIR}" --target 20260115_001
echo ""
info  "Migration 001 created two tables and three indexes:"
describe_table "products"
show_indexes
gotcha "The ${BOLD}brand${RESET} column has a secondary index.  In Cassandra/ScyllaDB,"
info   "secondary indexes are implemented as hidden materialized views."
info   "You ${BOLD}cannot DROP a column${RESET} while an index exists on it."
info   "Migration 005 will show exactly how to handle this safely."
pause

# --- Migration 002 ---
echo -e "  ${BOLD}Applying 002 — Add featured column + index${RESET}"
echo ""
show_migration_file "${MIGRATIONS_DIR}/20260203_002_add_featured_column.py"
cmd   "coodie migrate --keyspace ${KEYSPACE} --migrations-dir ${MIGRATIONS_DIR} --target 20260203_002"
echo ""
uv run coodie migrate --keyspace "${KEYSPACE}" --migrations-dir "${MIGRATIONS_DIR}" --target 20260203_002
echo ""
info  "The ${BOLD}featured boolean${RESET} column was added, along with an index."
info  "Without that index, ${BOLD}WHERE featured = true${RESET} would require"
info  "  ALLOW FILTERING  — a full-table scan across the entire cluster."
show_indexes
gotcha "ALLOW FILTERING is ScyllaDB's way of saying: this query will read"
info   "every partition on every node.  Never use it in production queries"
info   "on large tables.  Always add an index for filtered columns."
pause

# --- Migration 003 ---
echo -e "  ${BOLD}Applying 003 — Set default TTL on reviews${RESET}"
echo ""
show_migration_file "${MIGRATIONS_DIR}/20260220_003_set_reviews_ttl.py"
cmd   "coodie migrate --keyspace ${KEYSPACE} --migrations-dir ${MIGRATIONS_DIR} --target 20260220_003"
echo ""
uv run coodie migrate --keyspace "${KEYSPACE}" --migrations-dir "${MIGRATIONS_DIR}" --target 20260220_003
echo ""
info  "Reviews now expire automatically after 31 536 000 s (365 days)."
info  "TTL is stored per-cell in ScyllaDB — each column written after this"
info  "migration will carry a tombstone timer."
echo ""
warn  "ALTER TABLE ... WITH default_time_to_live only affects NEW writes."
info  "Rows inserted before this migration have no TTL and will never expire."
pause

# --- Migration 004 ---
echo -e "  ${BOLD}Applying 004 — Add name search index${RESET}"
echo ""
show_migration_file "${MIGRATIONS_DIR}/20260310_004_add_search_index.py"
cmd   "coodie migrate --keyspace ${KEYSPACE} --migrations-dir ${MIGRATIONS_DIR} --target 20260310_004"
echo ""
uv run coodie migrate --keyspace "${KEYSPACE}" --migrations-dir "${MIGRATIONS_DIR}" --target 20260310_004
echo ""
info  "A secondary index on ${BOLD}name${RESET} enables exact-match lookup by product name."
info  "Note: Cassandra/ScyllaDB secondary indexes support = equality only —"
info  "they do NOT support LIKE, prefix, or full-text search."
show_indexes
pause

# --- Migration 005 ---
echo -e "  ${BOLD}Applying 005 — Rename brand → manufacturer (data migration)${RESET}"
echo ""
story "Rift Corp legal received a cease-and-desist from 'Brand™ Corp'"
story "in Dimension-3.  All references to 'brand' must be expunged."
echo ""
show_migration_file "${MIGRATIONS_DIR}/20260325_005_rename_brand_to_manufacturer.py"
info  "This is a ${BOLD}four-step data migration${RESET}:"
echo -e "    ${GREEN}1.${RESET} ADD \"manufacturer\" text"
echo -e "    ${GREEN}2.${RESET} scan_table() — copy brand → manufacturer for every row"
echo -e "    ${GREEN}3.${RESET} ${RED}DROP INDEX on brand${RESET}   ← required before DROP COLUMN"
echo -e "    ${GREEN}4.${RESET} DROP \"brand\""
echo ""
cmd   "coodie migrate --keyspace ${KEYSPACE} --migrations-dir ${MIGRATIONS_DIR} --target 20260325_005"
pause

uv run coodie migrate --keyspace "${KEYSPACE}" --migrations-dir "${MIGRATIONS_DIR}" --target 20260325_005
echo ""
good "brand column and its index are gone.  manufacturer is in."
show_indexes
describe_table "products"
pause

# --- Migration 006 ---
echo -e "  ${BOLD}Applying 006 — ITA Directive Ω-7: hazard_class column${RESET}"
echo ""
story "The Interdimensional Trade Authority has mandated that all Bazaar"
story "listings carry a hazard classification (1=inert curiosity, 5=reality-"
story "destabilising).  Unclassified items will be seized at the next"
story "customs checkpoint in Dimension-4."
echo ""
show_migration_file "${MIGRATIONS_DIR}/20260410_006_add_hazard_class.py"
cmd   "coodie migrate --keyspace ${KEYSPACE} --migrations-dir ${MIGRATIONS_DIR} --target 20260410_006"
pause

uv run coodie migrate --keyspace "${KEYSPACE}" --migrations-dir "${MIGRATIONS_DIR}" --target 20260410_006
echo ""
good "hazard_class (int) column + index added.  All six migrations applied."
show_indexes
pause

# ──────────────────────────────────────────────────────────────────────────────
banner "Inspect the migration state table"

story "Every applied migration is tracked in ${BOLD}_coodie_migrations${RESET}."
info  "This table stores:"
echo -e "    • ${BOLD}migration_name${RESET} — file stem (primary key)"
echo -e "    • ${BOLD}applied_at${RESET}     — UTC timestamp"
echo -e "    • ${BOLD}description${RESET}    — from ForwardMigration.description"
echo -e "    • ${BOLD}checksum${RESET}       — SHA-256 of the migration file"
echo ""
cmd   "SELECT migration_name, applied_at, description FROM ${KEYSPACE}.\"_coodie_migrations\";"
pause

show_migration_state

info  "The ${BOLD}--status${RESET} flag cross-references files on disk against the state table"
info  "and flags any ${RED}CHECKSUM MISMATCH${RESET} (file edited after being applied)."
cmd   "coodie migrate --keyspace ${KEYSPACE} --migrations-dir ${MIGRATIONS_DIR} --status"
pause

uv run coodie migrate --keyspace "${KEYSPACE}" --migrations-dir "${MIGRATIONS_DIR}" --status
echo ""
gotcha "If you modify a migration file after it has been applied, the checksum"
info   "will not match and coodie will warn you.  NEVER edit applied migrations"
info   "on a shared/production cluster — create a new migration instead."
pause

# ──────────────────────────────────────────────────────────────────────────────
banner "Seed catalog data"

story "Seeding the Bazaar with 40 artifacts from across the dimensions."
cmd   "python seed.py --count 40"
pause

uv run python seed.py --count 40
pause

# ──────────────────────────────────────────────────────────────────────────────
banner "Roll back migrations 005 and 006 — the data migration"

story "Rift Corp legal received a counter-notice from 'Manufacturer™ Corp'"
story "in Dimension-9.  We must revert the rename.  brand is back."
story "And ITA Directive Ω-7 was suspended pending a tribunal in Dim-0."
echo ""
info  "Rolling back 2 steps runs downgrade() on 006 then 005, in order."
echo ""
info  "Migration 005 downgrade():"
echo -e "    ${GREEN}1.${RESET} ADD \"brand\" text                  (re-create old column)"
echo -e "    ${GREEN}2.${RESET} scan_table() — copy manufacturer → brand"
echo -e "    ${GREEN}3.${RESET} ${RED}DROP INDEX on manufacturer${RESET}   ← required before DROP COLUMN"
echo -e "    ${GREEN}4.${RESET} DROP \"manufacturer\""
echo ""
warn  "This is a ${BOLD}destructive rollback${RESET}.  Any data written to 'manufacturer'"
warn  "after the upgrade but before this rollback will be copied back to 'brand'."
warn  "Rows inserted after the scan starts but before DROP COLUMN may lose data."
echo ""
cmd   "coodie migrate --keyspace ${KEYSPACE} --migrations-dir ${MIGRATIONS_DIR} --rollback --steps 2"
pause

uv run coodie migrate --keyspace "${KEYSPACE}" --migrations-dir "${MIGRATIONS_DIR}" --rollback --steps 2
echo ""
good "Rolled back 006 and 005."
echo ""
info  "State table now:"
show_migration_state
echo ""
info  "Schema (brand is back, manufacturer and hazard_class are gone):"
describe_table "products"
show_indexes
pause

# ──────────────────────────────────────────────────────────────────────────────
banner "Re-apply migrations 005 and 006"

story "Legal came back with a third opinion: manufacturer is fine after all."
story "And the ITA tribunal ruled in the Bazaar's favour on hazard_class."
info  "Running coodie migrate with no flags picks up all pending migrations."
cmd   "coodie migrate --keyspace ${KEYSPACE} --migrations-dir ${MIGRATIONS_DIR}"
pause

uv run coodie migrate --keyspace "${KEYSPACE}" --migrations-dir "${MIGRATIONS_DIR}"
echo ""
good "Migrations 005 and 006 re-applied.  Schema fully restored."
pause

# ──────────────────────────────────────────────────────────────────────────────
banner "Simulate a FAILED migration — Incident Ω-7b"

story "A junior Rift Corp engineer is rushing to add a second compliance"
story "column — ${BOLD}void_rating${RESET} — to satisfy ITA Directive Ω-7b."
story "They mistype the column type as ${RED}frobnitz${RESET} instead of ${BOLD}int${RESET}."
echo ""
info  "We'll inject a broken migration file, run it, watch it fail,"
info  "then diagnose the state and walk through the fix."
echo ""
warn  "In production you would catch this in CI/CD before it reaches the cluster."
pause

cat > "${MIGRATIONS_DIR}/20260415_007_add_void_rating.py" << 'BROKEN_EOF'
"""Migration 007 — Add ITA Directive Ω-7b void_rating column.

INCIDENT: This file was deployed with a typo — 'frobnitz' is not a valid
CQL type.  The migration will fail at Step 1 before touching any data.
"""
from coodie.migrations import Migration, MigrationContext

class ForwardMigration(Migration):
    description = "Add ITA Directive Ω-7b void_rating (BROKEN: bad type)"
    reversible = True

    async def upgrade(self, ctx: MigrationContext) -> None:
        # BUG: 'frobnitz' is not a valid CQL type — should be 'int'
        await ctx.execute('ALTER TABLE migrations_demo.products ADD "void_rating" frobnitz')
        await ctx.execute("CREATE INDEX IF NOT EXISTS ON migrations_demo.products (void_rating)")

    async def downgrade(self, ctx: MigrationContext) -> None:
        await ctx.execute("DROP INDEX IF EXISTS migrations_demo.products_void_rating_idx")
        await ctx.execute('ALTER TABLE migrations_demo.products DROP "void_rating"')
BROKEN_EOF

echo ""
good "Broken migration 007 written."
echo ""
show_migration_file "${MIGRATIONS_DIR}/20260415_007_add_void_rating.py"
info  "The offending line:"
grep "frobnitz" "${MIGRATIONS_DIR}/20260415_007_add_void_rating.py" | sed 's/^/    /'
echo ""
cmd   "coodie migrate --keyspace ${KEYSPACE} --migrations-dir ${MIGRATIONS_DIR}"
pause

echo -e "  ${BOLD}Running (expect a failure):${RESET}"
echo ""
set +e
uv run coodie migrate --keyspace "${KEYSPACE}" --migrations-dir "${MIGRATIONS_DIR}" 2>&1 | tail -8
MIGRATE_EXIT=$?
set -e
echo ""
echo -e "  ${RED}✗ Migration failed (exit ${MIGRATE_EXIT})${RESET}"
pause

# ──────────────────────────────────────────────────────────────────────────────
banner "Diagnose the failure — what state are we in?"

story "Panic in the Bazaar.  MerchBot is issuing containment alerts."
story "First: is the migration recorded as applied?"
echo ""
cmd   "coodie migrate --keyspace ${KEYSPACE} --migrations-dir ${MIGRATIONS_DIR} --status"
pause

uv run coodie migrate --keyspace "${KEYSPACE}" --migrations-dir "${MIGRATIONS_DIR}" --status
echo ""
info  "Notice: 007 is NOT listed as applied.  The runner only records a"
info  "migration after ${BOLD}upgrade() completes without error${RESET}.  A hard failure"
info  "at the first statement leaves NO entry in the state table."
echo ""
info  "Second: did any partial DDL reach the database?"
cmd   "SELECT column_name FROM system_schema.columns WHERE keyspace_name='${KEYSPACE}' AND table_name='products';"
pause

echo -e "  ${DIM}Columns currently on products:${RESET}"
run_cqlsh "SELECT column_name FROM system_schema.columns WHERE keyspace_name='${KEYSPACE}' AND table_name='products';" \
    | grep -v "^$\|column_name\|rows)\|^-" | sed 's/^/    /' || true
echo ""
good "void_rating does NOT exist — the bad CQL was rejected by ScyllaDB"
good "before any schema change was committed.  The table is clean."
echo ""
warn  "This is the best-case failure: error at the first statement, no partial"
warn  "state.  If a multi-step migration fails mid-way you may need to manually"
warn  "undo earlier statements before re-running."
pause

# ──────────────────────────────────────────────────────────────────────────────
banner "Fix the migration and re-run"

story "The engineer is summoned to the Rift Corp War Room."
story "The fix is obvious — replace frobnitz with int."
echo ""
info  "Because the migration was NEVER recorded as applied, we can safely"
info  "edit the file in place.  coodie will treat it as still pending."
echo ""
cmd   "sed -i 's/frobnitz/int/' migrations/20260415_007_add_void_rating.py"
pause

sed -i 's/frobnitz/int/' "${MIGRATIONS_DIR}/20260415_007_add_void_rating.py"
good "File fixed."
echo ""
show_migration_file "${MIGRATIONS_DIR}/20260415_007_add_void_rating.py"
cmd   "coodie migrate --keyspace ${KEYSPACE} --migrations-dir ${MIGRATIONS_DIR}"
pause

uv run coodie migrate --keyspace "${KEYSPACE}" --migrations-dir "${MIGRATIONS_DIR}"
echo ""
good "Migration 007 applied successfully."
show_migration_state
echo ""
gotcha "If a migration PARTIALLY succeeds (some statements ran before the error):"
echo -e "    ${YELLOW}1.${RESET} Manually undo any DDL that got through (DROP COLUMN, DROP INDEX…)"
echo -e "    ${YELLOW}2.${RESET} Edit or rewrite the migration file"
echo -e "    ${YELLOW}3.${RESET} Re-run coodie migrate"
echo ""
info  "This is why migrations should use ${BOLD}IF NOT EXISTS${RESET} / ${BOLD}column_exists()${RESET} guards"
info  "wherever possible — so partial runs are safe to retry without manual cleanup."
pause

# ──────────────────────────────────────────────────────────────────────────────
banner "Roll back migration 007 cleanly"

story "ITA Directive Ω-7b was rescinded — void_rating is redundant now"
story "that hazard_class exists.  Let's roll it back properly."
echo ""
cmd   "coodie migrate --keyspace ${KEYSPACE} --migrations-dir ${MIGRATIONS_DIR} --rollback --steps 1"
pause

uv run coodie migrate --keyspace "${KEYSPACE}" --migrations-dir "${MIGRATIONS_DIR}" --rollback --steps 1
echo ""
good "007 rolled back.  void_rating column and index are gone."
show_indexes
pause

# ──────────────────────────────────────────────────────────────────────────────
banner "Gotchas & lessons learned"

echo -e "  ${BOLD}Summary of every trap we've navigated in this incident report:${RESET}"
echo ""

echo -e "  ${RED}☠${RESET}  ${BOLD}ALLOW FILTERING${RESET}"
echo -e "      Without an index, WHERE clauses on non-PK columns trigger a"
echo -e "      full cluster scan.  Add an index or redesign the query."
echo -e "      Migration 002 shows the right pattern."
echo ""

echo -e "  ${RED}☠${RESET}  ${BOLD}Cannot DROP a column that backs an index${RESET}"
echo -e "      ScyllaDB implements secondary indexes as materialized views."
echo -e "      You must DROP INDEX before DROP COLUMN — always."
echo -e "      Migration 005 upgrade() and downgrade() demonstrate this."
echo ""

echo -e "  ${RED}☠${RESET}  ${BOLD}sync_table() may race with migrations${RESET}"
echo -e "      If the app calls sync_table() on startup it may create columns"
echo -e "      or indexes that a pending migration also tries to create."
echo -e "      Guard every DDL with IF NOT EXISTS / column_exists() checks."
echo ""

echo -e "  ${RED}☠${RESET}  ${BOLD}Failed migrations leave no state table entry${RESET}"
echo -e "      A migration that raises an exception is NOT recorded.  Fix the"
echo -e "      file and re-run.  Safe as long as the failure was at statement 1."
echo -e "      Partial successes need manual DDL cleanup first."
echo ""

echo -e "  ${RED}☠${RESET}  ${BOLD}Never edit an already-applied migration${RESET}"
echo -e "      The checksum in _coodie_migrations catches this at --status time."
echo -e "      Correct mistakes in a new migration file — never mutate history."
echo ""

echo -e "  ${RED}☠${RESET}  ${BOLD}Data migration rollbacks are not perfectly safe${RESET}"
echo -e "      Rows inserted after scan_table() starts but before DROP COLUMN"
echo -e "      may silently lose data.  For production:"
echo -e "        → coordinate application deploys"
echo -e "        → consider marking the migration reversible = False"
echo -e "        → use a two-phase approach (add + backfill, then later drop)"
echo ""

echo -e "  ${GREEN}✓${RESET}  ${BOLD}Distributed lock prevents concurrent runs${RESET}"
echo -e "      Two concurrent coodie migrate processes race on an LWT lock."
echo -e "      Only one wins — the other aborts cleanly."
echo ""

echo -e "  ${GREEN}✓${RESET}  ${BOLD}Dry-run is your first line of defence${RESET}"
echo -e "      Always dry-run before applying to production.  It won't catch"
echo -e "      CQL type errors (those need a live DB), but it documents the"
echo -e "      exact statements that will run and is safe to share for review."
pause

# ──────────────────────────────────────────────────────────────────────────────
banner "Clean up"

story "Rift Corp Engineering is shutting down Dimension-7 for maintenance."
info  "Stopping ScyllaDB and removing all data volumes."
echo ""
cmd   "make clean"
pause

rm -f "${MIGRATIONS_DIR}/20260415_007_add_void_rating.py"
good  "Removed demo migration 007 (void_rating)."
make clean

# ──────────────────────────────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}╔═══════════════════════════════════════════════════════════════╗${RESET}"
echo -e "${CYAN}║${RESET}  ${GREEN}${BOLD}✓  INCIDENT REPORT CLOSED — DIMENSION-7 SECURED${RESET}           ${CYAN}║${RESET}"
echo -e "${CYAN}║${RESET}                                                               ${CYAN}║${RESET}"
echo -e "${CYAN}║${RESET}  You have witnessed:                                          ${CYAN}║${RESET}"
echo -e "${CYAN}║${RESET}    ✓ Dry-run preview                                          ${CYAN}║${RESET}"
echo -e "${CYAN}║${RESET}    ✓ Step-by-step apply with live schema inspection            ${CYAN}║${RESET}"
echo -e "${CYAN}║${RESET}    ✓ State table & checksum validation                        ${CYAN}║${RESET}"
echo -e "${CYAN}║${RESET}    ✓ Rolling back a multi-step data migration                 ${CYAN}║${RESET}"
echo -e "${CYAN}║${RESET}    ✓ Injecting, diagnosing & recovering from a bad migration  ${CYAN}║${RESET}"
echo -e "${CYAN}║${RESET}    ✓ Idempotency guards in real migration code                ${CYAN}║${RESET}"
echo -e "${CYAN}║${RESET}                                                               ${CYAN}║${RESET}"
echo -e "${CYAN}║${RESET}  See README.md to write your own migrations.                  ${CYAN}║${RESET}"
echo -e "${CYAN}║${RESET}  MerchBot thanks you for your compliance. — ITA Directive Ω  ${CYAN}║${RESET}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════════════════╝${RESET}"
echo ""
