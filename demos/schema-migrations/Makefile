COMPOSE  := docker compose -f ../docker-compose.yml
KEYSPACE := migrations_demo

.PHONY: db-up db-down migrate migrate-dry-run migrate-rollback migrate-status seed run clean demo

db-up:                          ## Start ScyllaDB and create keyspace
	@echo ""
	@echo "  🔧 SCHEMA MIGRATIONS DEMO"
	@echo "  ━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "  Starting ScyllaDB..."
	@echo ""
	$(COMPOSE) up -d
	@echo "  🌀 Waiting for ScyllaDB to become ready..."
	@until $(COMPOSE) exec scylladb nodetool status 2>/dev/null | grep -q "^UN"; do sleep 2; done
	@echo "  ✓ ScyllaDB is UP"
	@echo "  🔧 Creating keyspace '$(KEYSPACE)'..."
	$(COMPOSE) exec scylladb cqlsh -e \
	  "CREATE KEYSPACE IF NOT EXISTS $(KEYSPACE) \
	   WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'};"
	@echo "  ✓ Keyspace ready"
	@echo ""

db-down:                        ## Stop ScyllaDB
	@echo "  🌀 Shutting down ScyllaDB..."
	$(COMPOSE) down
	@echo "  ✓ ScyllaDB stopped"

migrate: db-up                  ## Apply all pending migrations
	@echo "  🔧 Applying migrations..."
	uv run coodie migrate --keyspace $(KEYSPACE) --migrations-dir migrations
	@echo "  ✓ Migrations applied"

migrate-dry-run: db-up          ## Show planned CQL without applying
	@echo "  🔧 Dry-run — showing planned CQL..."
	uv run coodie migrate --keyspace $(KEYSPACE) --migrations-dir migrations --dry-run

migrate-rollback: db-up         ## Rollback the last migration
	@echo "  🔧 Rolling back last migration..."
	uv run coodie migrate --keyspace $(KEYSPACE) --migrations-dir migrations --rollback --steps 1
	@echo "  ✓ Rollback complete"

migrate-status: db-up           ## Show migration status
	uv run coodie migrate --keyspace $(KEYSPACE) --migrations-dir migrations --status

seed: migrate                   ## Seed sample data (depends on migrate)
	@echo "  📡 Seeding catalog data..."
	@echo ""
	uv run python seed.py --count 50

run: seed                       ## Install deps, migrate, seed, and start the app
	@echo ""
	@echo "  🚀 Launching the Schema Migrations demo app..."
	@echo "  📡 http://127.0.0.1:8000 — API ready"
	@echo ""
	uv run uvicorn main:app --reload

clean: db-down                  ## Stop DB and remove data volumes
	$(COMPOSE) down -v
	@echo "  ✓ All data purged"

demo:                           ## Run the interactive scripted demo
	bash demo.sh
