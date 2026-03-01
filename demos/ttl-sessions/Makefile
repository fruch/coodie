COMPOSE  := docker compose -f ../docker-compose.yml
KEYSPACE := ephemera

.PHONY: db-up db-down seed run clean test

db-up:                          ## Start ScyllaDB and create keyspace
	@echo ""
	@echo "  👻 THE MEMORY VAULT — Dimension-4"
	@echo "  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "  EPHEMERA is initializing memory harvest..."
	@echo ""
	$(COMPOSE) up -d
	@echo "  🌀 Waiting for ScyllaDB node to come online..."
	@until $(COMPOSE) exec scylladb nodetool status 2>/dev/null | grep -q "^UN"; do sleep 2; done
	@echo "  ✓ ScyllaDB is UP — memory vault anchored"
	@echo "  🔧 Creating keyspace '$(KEYSPACE)' (ephemeral data store)..."
	$(COMPOSE) exec scylladb cqlsh -e \
	  "CREATE KEYSPACE IF NOT EXISTS $(KEYSPACE) \
	   WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'};"
	@echo "  ✓ Keyspace ready — TTL enforcement active"
	@echo ""

db-down:                        ## Stop ScyllaDB
	@echo "  🌀 Collapsing memory vault... shutting down ScyllaDB"
	$(COMPOSE) down
	@echo "  ✓ EPHEMERA has been disconnected"

seed: db-up                     ## Seed session tokens (default TTL: 300s)
	@echo "  👻 Deploying memory harvest protocol..."
	@echo ""
	uv run python seed.py --count 20 --ttl 300

seed-short: db-up               ## Seed short-lived tokens (TTL: 30s) to watch them expire
	@echo "  👻 Seeding volatile memories — they dissolve in 30 seconds..."
	@echo ""
	uv run python seed.py --count 10 --ttl 30

run: seed                       ## Install deps, seed, and start the app
	@echo ""
	@echo "  👻 Launching The Memory Vault interface..."
	@echo "  📡 http://127.0.0.1:8000 — Dimension-4 portal active"
	@echo "  ⏳ Watch rows disappear as TTL expires (auto-refresh every 5s)"
	@echo ""
	uv run uvicorn main:app --reload

clean: db-down                  ## Stop DB and remove data volumes
	$(COMPOSE) down -v
	@echo "  ✓ All ephemeral data purged — memory vault wiped"

test: db-up                     ## Run smoke tests (requires ScyllaDB running)
	@echo "  🧪 Running smoke tests..."
	uv run python smoke_test.py
	@echo "  ✓ All smoke tests passed"
