COMPOSE  := docker compose -f ../docker-compose.yml
KEYSPACE := taskboard

.PHONY: db-up db-down sync-tables seed run clean

db-up:                          ## Start ScyllaDB and create keyspace
	@echo ""
	@echo "  🐝 THE HIVEMIND KANBAN — Dimension-3"
	@echo "  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "  JIRA-TRON is powering up..."
	@echo ""
	$(COMPOSE) up -d
	@echo "  🌀 Waiting for ScyllaDB node to materialize in this dimension..."
	@until $(COMPOSE) exec scylladb nodetool status 2>/dev/null | grep -q "^UN"; do sleep 2; done
	@echo "  ✓ ScyllaDB is UP — Sprint infrastructure established"
	@echo "  🔧 Creating keyspace '$(KEYSPACE)' across all Sprint timelines..."
	$(COMPOSE) exec scylladb cqlsh -e \
	  "CREATE KEYSPACE IF NOT EXISTS $(KEYSPACE) \
	   WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'};"
	@echo "  ✓ Keyspace ready — JIRA-TRON's database is online"
	@echo ""

db-down:                        ## Stop ScyllaDB
	@echo "  🌀 Shutting down Sprint infrastructure... ScyllaDB powering off"
	$(COMPOSE) down
	@echo "  ✓ JIRA-TRON has been disconnected — humanity breathes"

sync-tables: db-up              ## Sync coodie tables to Cassandra
	@echo "  🔧 Syncing coodie models to Cassandra..."
	uv run python manage.py sync_cassandra
	@echo ""

seed: sync-tables               ## Seed sample data (depends on sync-tables)
	@echo "  🐝 Deploying task assignments across all Sprint timelines..."
	@echo ""
	uv run python seed.py --count 50

run: seed                       ## Install deps, seed, and start the app
	@echo ""
	@echo "  🐝 Launching The Hivemind Kanban interface..."
	@echo "  📡 http://127.0.0.1:8000 — Dimension-3 portal active"
	@echo ""
	uv run python manage.py runserver

clean: db-down                  ## Stop DB and remove data volumes
	$(COMPOSE) down -v
	rm -f db.sqlite3
	@echo "  ✓ All Sprint data purged — timeline reset"
