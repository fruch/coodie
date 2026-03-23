COMPOSE  := docker compose -f ../docker-compose.yml
KEYSPACE := analytics

.PHONY: db-up db-down seed run clean test

db-up:                          ## Start ScyllaDB and create keyspace
	@echo ""
	@echo "  📊 THE PULSE ENGINE — Dimension-7"
	@echo "  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "  PULSE is calibrating the analytics core..."
	@echo ""
	$(COMPOSE) up -d
	@echo "  🌀 Waiting for ScyllaDB node to come online..."
	@until $(COMPOSE) exec scylladb nodetool status 2>/dev/null | grep -q "^UN"; do sleep 2; done
	@echo "  ✓ ScyllaDB is UP — analytics core anchored"
	@echo "  🔧 Creating keyspace '$(KEYSPACE)' (counter data store)..."
	$(COMPOSE) exec scylladb cqlsh -e \
	  "CREATE KEYSPACE IF NOT EXISTS $(KEYSPACE) \
	   WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'};"
	@echo "  ✓ Keyspace ready — counter tables armed"
	@echo ""

db-down:                        ## Stop ScyllaDB
	@echo "  🌀 Shutting down analytics core... stopping ScyllaDB"
	$(COMPOSE) down
	@echo "  ✓ PULSE has been disconnected"

seed: db-up                     ## Seed page-view traffic (200 increments across 10 pages)
	@echo "  📊 Deploying synthetic traffic generation..."
	@echo ""
	uv run python seed.py --count 200

seed-short: db-up               ## Quick seed (50 increments, 5 pages)
	@echo "  📊 Generating quick traffic burst..."
	@echo ""
	uv run python seed.py --count 50 --pages 5

run: seed                       ## Install deps, seed, and start the app
	@echo ""
	@echo "  📊 Launching The Pulse Engine interface..."
	@echo "  📡 http://127.0.0.1:8000 — Dimension-7 portal active"
	@echo "  ⚡ Click increment/decrement to update counters in real-time"
	@echo ""
	uv run uvicorn main:app --reload

clean: db-down                  ## Stop DB and remove data volumes
	$(COMPOSE) down -v
	@echo "  ✓ All analytics data purged — pulse engine wiped"

test: db-up                     ## Run smoke tests (requires ScyllaDB running)
	@echo "  🧪 Running smoke tests..."
	uv run python smoke_test.py
	@echo "  ✓ All smoke tests passed"
