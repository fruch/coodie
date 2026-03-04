COMPOSE  := docker compose -f ../docker-compose.yml
KEYSPACE := tagmind

.PHONY: db-up db-down seed run clean

db-up:                          ## Start ScyllaDB and create keyspace
	@echo ""
	@echo "  📚  TAGMIND — The Infinite Taxonomy // Dimension-8"
	@echo "  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "  Booting the universal classification engine..."
	@echo ""
	$(COMPOSE) up -d
	@echo "  🌀 Waiting for ScyllaDB node to stabilize..."
	@until $(COMPOSE) exec scylladb nodetool status 2>/dev/null | grep -q "^UN"; do sleep 2; done
	@echo "  ✓ ScyllaDB is UP — taxonomy matrix established"
	@echo "  🔧 Creating keyspace '$(KEYSPACE)' for article tagging..."
	$(COMPOSE) exec scylladb cqlsh -e \
	  "CREATE KEYSPACE IF NOT EXISTS $(KEYSPACE) \
	   WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'};"
	@echo "  ✓ Keyspace ready — TagMind is online"
	@echo ""

db-down:                        ## Stop ScyllaDB
	@echo "  🌀 Shutting down taxonomy matrix... disconnecting ScyllaDB"
	$(COMPOSE) down
	@echo "  ✓ TagMind has logged off"

seed: db-up                     ## Seed sample data (depends on db-up)
	@echo "  📚  Deploying articles and triggering tag classification..."
	@echo ""
	uv run python seed.py --count 30

run: seed                       ## Install deps, seed, and start the app
	@echo ""
	@echo "  📚  Launching The Infinite Taxonomy interface..."
	@echo "  📡 http://127.0.0.1:8000 — Dimension-8 portal active"
	@echo ""
	uv run uvicorn main:app --reload

clean: db-down                  ## Stop DB and remove data volumes
	$(COMPOSE) down -v
	@echo "  ✓ All taxonomy data purged — dimension reset"
