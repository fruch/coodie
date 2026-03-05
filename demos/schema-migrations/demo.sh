#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────
# Interactive scripted demo for the coodie schema-migrations framework.
#
# Walks through every step of the migration lifecycle, pausing at each
# with a brief explanation.  Press Enter to continue to the next step.
#
# Usage:
#     bash demo.sh          # or: make demo
# ──────────────────────────────────────────────────────────────────────
set -euo pipefail
cd "$(dirname "$0")"

COMPOSE="docker compose -f ../docker-compose.yml"
KEYSPACE="migrations_demo"
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
DIM='\033[2m'
RESET='\033[0m'

step=0

pause() {
    echo ""
    echo -e "${DIM}  Press Enter to continue...${RESET}"
    read -r
    echo ""
}

banner() {
    step=$((step + 1))
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
    echo -e "${BOLD}  Step ${step}: $1${RESET}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
    echo ""
}

# ──────────────────────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}╔═══════════════════════════════════════════════════════╗${RESET}"
echo -e "${CYAN}║${RESET}  ${BOLD}🔧 coodie Schema Migrations — Interactive Demo${RESET}      ${CYAN}║${RESET}"
echo -e "${CYAN}╠═══════════════════════════════════════════════════════╣${RESET}"
echo -e "${CYAN}║${RESET}  This demo walks through the full migration lifecycle ${CYAN}║${RESET}"
echo -e "${CYAN}║${RESET}  — apply, rollback, dry-run, status, and data         ${CYAN}║${RESET}"
echo -e "${CYAN}║${RESET}  migration — pausing at each step for explanation.    ${CYAN}║${RESET}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════════╝${RESET}"
pause

# ──────────────────────────────────────────────────────────────────────
banner "Start ScyllaDB & create keyspace"
echo -e "  We start a ScyllaDB container using Docker Compose and create the"
echo -e "  ${BOLD}${KEYSPACE}${RESET} keyspace with SimpleStrategy (RF=1)."
echo ""
echo -e "  ${DIM}Command: make db-up${RESET}"
pause

make db-up

# ──────────────────────────────────────────────────────────────────────
banner "List migration files"
echo -e "  Migration files live in ${BOLD}migrations/${RESET} and follow the naming convention:"
echo -e "  ${BOLD}YYYYMMDD_NNN_description.py${RESET}"
echo ""
echo -e "  Each file defines a ${BOLD}ForwardMigration${RESET} class with ${BOLD}upgrade()${RESET} and"
echo -e "  ${BOLD}downgrade()${RESET} methods containing CQL statements."
echo ""
echo -e "  Files discovered:"
for f in migrations/*.py; do
    echo -e "    ${GREEN}→${RESET} $(basename "$f")"
done
pause

# ──────────────────────────────────────────────────────────────────────
banner "Dry-run — preview CQL without applying"
echo -e "  The ${BOLD}--dry-run${RESET} flag shows what CQL each migration would execute"
echo -e "  without actually touching the database.  Useful for review before"
echo -e "  applying in production."
echo ""
echo -e "  ${DIM}Command: coodie migrate --keyspace $KEYSPACE --migrations-dir migrations --dry-run${RESET}"
pause

uv run coodie migrate --keyspace "$KEYSPACE" --migrations-dir migrations --dry-run

# ──────────────────────────────────────────────────────────────────────
banner "Apply all migrations"
echo -e "  Now we apply all pending migrations.  The runner:"
echo -e "    1. Acquires a distributed lock (${BOLD}_coodie_migrations_lock${RESET})"
echo -e "    2. Waits for schema agreement across nodes"
echo -e "    3. Executes each migration's ${BOLD}upgrade()${RESET} in order"
echo -e "    4. Records each in the ${BOLD}_coodie_migrations${RESET} state table"
echo -e "    5. Releases the lock"
echo ""
echo -e "  ${DIM}Command: coodie migrate --keyspace $KEYSPACE --migrations-dir migrations${RESET}"
pause

uv run coodie migrate --keyspace "$KEYSPACE" --migrations-dir migrations

# ──────────────────────────────────────────────────────────────────────
banner "Check migration status"
echo -e "  The ${BOLD}--status${RESET} flag shows which migrations are applied, their"
echo -e "  timestamps, and validates file checksums.  If a migration file has"
echo -e "  been modified since it was applied, it shows ${RED}[CHECKSUM MISMATCH]${RESET}."
echo ""
echo -e "  ${DIM}Command: coodie migrate --keyspace $KEYSPACE --migrations-dir migrations --status${RESET}"
pause

uv run coodie migrate --keyspace "$KEYSPACE" --migrations-dir migrations --status

# ──────────────────────────────────────────────────────────────────────
banner "Seed sample data"
echo -e "  We insert 50 products (20% marked as featured) and random reviews"
echo -e "  to populate the migrated schema."
echo ""
echo -e "  ${DIM}Command: python seed.py --count 50${RESET}"
pause

uv run python seed.py --count 50

# ──────────────────────────────────────────────────────────────────────
banner "Query the state table"
echo -e "  coodie tracks every applied migration in the"
echo -e "  ${BOLD}_coodie_migrations${RESET} table.  Each row stores:"
echo -e "    • migration_name — file stem (e.g. 20260115_001_create_base_tables)"
echo -e "    • applied_at     — UTC timestamp"
echo -e "    • description    — human-readable summary"
echo -e "    • checksum       — SHA-256 of the migration file"
echo ""
echo -e "  ${DIM}Command: cqlsh -e 'SELECT * FROM ${KEYSPACE}.\"_coodie_migrations\";'${RESET}"
pause

$COMPOSE exec scylladb cqlsh -e "SELECT migration_name, applied_at, description FROM ${KEYSPACE}.\"_coodie_migrations\";"

# ──────────────────────────────────────────────────────────────────────
banner "Rollback the last migration"
echo -e "  The ${BOLD}--rollback${RESET} flag executes the ${BOLD}downgrade()${RESET} method of the most"
echo -e "  recently applied migration and removes its row from the state table."
echo ""
echo -e "  We'll roll back migration 005 (rename brand → manufacturer)."
echo -e "  This is a ${YELLOW}data migration${RESET} rollback — it re-creates the old column,"
echo -e "  copies data back, and drops the new column."
echo ""
echo -e "  ${DIM}Command: coodie migrate --keyspace $KEYSPACE --migrations-dir migrations --rollback --steps 1${RESET}"
pause

uv run coodie migrate --keyspace "$KEYSPACE" --migrations-dir migrations --rollback --steps 1

# ──────────────────────────────────────────────────────────────────────
banner "Status after rollback"
echo -e "  The rolled-back migration now shows as ${BOLD}[ ]${RESET} (not applied)."
echo ""
echo -e "  ${DIM}Command: coodie migrate --keyspace $KEYSPACE --migrations-dir migrations --status${RESET}"
pause

uv run coodie migrate --keyspace "$KEYSPACE" --migrations-dir migrations --status

# ──────────────────────────────────────────────────────────────────────
banner "Re-apply the rolled-back migration"
echo -e "  Running ${BOLD}coodie migrate${RESET} again picks up the pending migration and"
echo -e "  re-applies it — including the data migration step."
echo ""
echo -e "  ${DIM}Command: coodie migrate --keyspace $KEYSPACE --migrations-dir migrations${RESET}"
pause

uv run coodie migrate --keyspace "$KEYSPACE" --migrations-dir migrations

# ──────────────────────────────────────────────────────────────────────
banner "Data migration rollback — important notes"
echo -e "  Migration 005 renames ${BOLD}brand → manufacturer${RESET} with a three-step process:"
echo ""
echo -e "    ${GREEN}upgrade()${RESET}:"
echo -e "      1. ALTER TABLE ... ADD \"manufacturer\" text"
echo -e "      2. scan_table() → copy brand → manufacturer for each row"
echo -e "      3. ALTER TABLE ... DROP \"brand\""
echo ""
echo -e "    ${YELLOW}downgrade()${RESET}:"
echo -e "      1. ALTER TABLE ... ADD \"brand\" text"
echo -e "      2. scan_table() → copy manufacturer → brand for each row"
echo -e "      3. ALTER TABLE ... DROP \"manufacturer\""
echo ""
echo -e "  ${RED}⚠ Key considerations for data migration rollbacks:${RESET}"
echo ""
echo -e "  • ${BOLD}Data written after the upgrade uses the new column.${RESET}"
echo -e "    If the app writes to 'manufacturer' and you rollback, those writes"
echo -e "    are copied back to 'brand'.  But any rows inserted between the"
echo -e "    upgrade and rollback might have NULLs in the old column name if"
echo -e "    the app already switched to the new name."
echo ""
echo -e "  • ${BOLD}Large tables take time.${RESET}"
echo -e "    scan_table() walks the full token ring.  For large tables, use"
echo -e "    throttle_seconds and resume_token to avoid overloading the cluster."
echo ""
echo -e "  • ${BOLD}Consider making destructive rollbacks irreversible.${RESET}"
echo -e "    If data loss is unacceptable, set ${BOLD}reversible = False${RESET} and handle"
echo -e "    rollback manually with a backup/restore strategy."
echo ""
echo -e "  • ${BOLD}Test rollbacks in staging first.${RESET}"
echo -e "    Always validate that downgrade() produces the expected schema and"
echo -e "    data state before running in production."
pause

# ──────────────────────────────────────────────────────────────────────
banner "Clean up"
echo -e "  Stopping ScyllaDB and removing all data volumes."
echo ""
echo -e "  ${DIM}Command: make clean${RESET}"
pause

make clean

# ──────────────────────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}╔═══════════════════════════════════════════════════════╗${RESET}"
echo -e "${CYAN}║${RESET}  ${GREEN}${BOLD}✓ Demo complete!${RESET}                                     ${CYAN}║${RESET}"
echo -e "${CYAN}║${RESET}                                                       ${CYAN}║${RESET}"
echo -e "${CYAN}║${RESET}  You've seen the full coodie migration lifecycle:      ${CYAN}║${RESET}"
echo -e "${CYAN}║${RESET}    • Dry-run preview         • Apply migrations       ${CYAN}║${RESET}"
echo -e "${CYAN}║${RESET}    • Status & checksums      • Rollback               ${CYAN}║${RESET}"
echo -e "${CYAN}║${RESET}    • Data migration          • Re-apply               ${CYAN}║${RESET}"
echo -e "${CYAN}║${RESET}                                                       ${CYAN}║${RESET}"
echo -e "${CYAN}║${RESET}  See README.md for writing your own migrations.        ${CYAN}║${RESET}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════════╝${RESET}"
echo ""
