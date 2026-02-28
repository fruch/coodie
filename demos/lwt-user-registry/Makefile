COMPOSE  := docker compose -f ../docker-compose.yml
KEYSPACE := registry

.PHONY: db-up db-down seed run clean

db-up:                          ## Start ScyllaDB and create keyspace
	@echo ""
	@echo "  🛡️  THE IDENTITY REGISTRY — Dimension-6"
	@echo "  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "  IF-NOT-EXISTS is booting up..."
	@echo ""
	$(COMPOSE) up -d
	@echo "  🌀 Waiting for ScyllaDB node to materialize in this dimension..."
	@until $(COMPOSE) exec scylladb nodetool status 2>/dev/null | grep -q "^UN"; do sleep 2; done
	@echo "  ✓ ScyllaDB is UP — identity matrix established"
	@echo "  🔧 Creating keyspace '$(KEYSPACE)' across all timelines..."
	$(COMPOSE) exec scylladb cqlsh -e \
	  "CREATE KEYSPACE IF NOT EXISTS $(KEYSPACE) \
	   WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'};"
	@echo "  ✓ Keyspace ready — the Registry is online"
	@echo ""

db-down:                        ## Stop ScyllaDB
	@echo "  🌀 Shutting down identity matrix... disconnecting ScyllaDB"
	$(COMPOSE) down
	@echo "  ✓ IF-NOT-EXISTS has logged off"

seed: db-up                     ## Seed sample data (depends on db-up)
	@echo "  🛡️  Deploying hero identities and triggering Doppel-9 clone attack..."
	@echo ""
	uv run python seed.py --count 40

run: seed                       ## Install deps, seed, and start the app
	@echo ""
	@echo "  🛡️  Launching The Identity Registry interface..."
	@echo "  📡 http://127.0.0.1:8000 — Dimension-6 portal active"
	@echo ""
	uv run uvicorn main:app --reload

clean: db-down                  ## Stop DB and remove data volumes
	$(COMPOSE) down -v
	@echo "  ✓ All identity data purged — timeline reset"
