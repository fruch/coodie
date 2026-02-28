COMPOSE  := docker compose -f ../docker-compose.yml
KEYSPACE := ephemera

.PHONY: db-up db-down seed run clean

db-up:                          ## Start ScyllaDB and create keyspace
	@echo ""
	@echo "  👻 THE MEMORY THIEF — Dimension-4"
	@echo "  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "  Ephemera is booting up..."
	@echo ""
	$(COMPOSE) up -d
	@echo "  🌀 Waiting for ScyllaDB node to materialize in this dimension..."
	@until $(COMPOSE) exec scylladb nodetool status 2>/dev/null | grep -q "^UN"; do sleep 2; done
	@echo "  ✓ ScyllaDB is UP — memory extraction network established"
	@echo "  🔧 Creating keyspace '$(KEYSPACE)' across all timelines..."
	$(COMPOSE) exec scylladb cqlsh -e \
	  "CREATE KEYSPACE IF NOT EXISTS $(KEYSPACE) \
	   WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'};"
	@echo "  ✓ Keyspace ready — the Memory Vault is online"
	@echo ""

db-down:                        ## Stop ScyllaDB
	@echo "  🌀 Shutting down memory extraction network... disconnecting ScyllaDB"
	$(COMPOSE) down
	@echo "  ✓ Ephemera has been contained"

seed: db-up                     ## Seed sample data (depends on db-up)
	@echo "  👻 Extracting memories from Dimension-4 inhabitants..."
	@echo ""
	uv run python seed.py --count 20 --ttl 30

run: seed                       ## Install deps, seed, and start the app
	@echo ""
	@echo "  👻 Launching The Memory Thief interface..."
	@echo "  📡 http://127.0.0.1:8000 — Dimension-4 portal active"
	@echo "  ⏳ Seeded memories will expire in 30 seconds — watch the UI!"
	@echo ""
	uv run uvicorn main:app --reload

clean: db-down                  ## Stop DB and remove data volumes
	$(COMPOSE) down -v
	@echo "  ✓ All memory data purged — timeline reset"
