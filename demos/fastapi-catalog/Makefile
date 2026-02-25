COMPOSE  := docker compose -f ../docker-compose.yml
KEYSPACE := catalog

.PHONY: db-up db-down seed run clean

db-up:                          ## Start ScyllaDB and create keyspace
	@echo ""
	@echo "  ⚡ THE INFINITE BAZAAR — Dimension-1"
	@echo "  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "  MerchBot Prime is powering up..."
	@echo ""
	$(COMPOSE) up -d
	@echo "  🌀 Waiting for ScyllaDB node to materialize in this dimension..."
	@until $(COMPOSE) exec scylladb nodetool status 2>/dev/null | grep -q "^UN"; do sleep 2; done
	@echo "  ✓ ScyllaDB is UP — dimensional anchor established"
	@echo "  🔧 Creating keyspace '$(KEYSPACE)' across all timelines..."
	$(COMPOSE) exec scylladb cqlsh -e \
	  "CREATE KEYSPACE IF NOT EXISTS $(KEYSPACE) \
	   WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'};"
	@echo "  ✓ Keyspace ready — the Bazaar is open for business"
	@echo ""

db-down:                        ## Stop ScyllaDB
	@echo "  🌀 Collapsing dimensional rift... shutting down ScyllaDB"
	$(COMPOSE) down
	@echo "  ✓ MerchBot Prime has been disconnected"

seed: db-up                     ## Seed sample data (depends on db-up)
	@echo "  📡 Deploying Coodie Corps agents to catalog artifacts..."
	@echo ""
	uv run python seed.py --count 50

run: seed                       ## Install deps, seed, and start the app
	@echo ""
	@echo "  ⚡ Launching The Infinite Bazaar interface..."
	@echo "  📡 http://127.0.0.1:8000 — Dimension-1 portal active"
	@echo ""
	uv run uvicorn main:app --reload

clean: db-down                  ## Stop DB and remove data volumes
	$(COMPOSE) down -v
	@echo "  ✓ All dimensional data purged — timeline reset"
