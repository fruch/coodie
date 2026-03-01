COMPOSE  := docker compose -f ../docker-compose.yml
KEYSPACE := viewdemo

.PHONY: db-up db-down seed run clean

db-up:                          ## Start ScyllaDB and create keyspace
	@echo ""
	@echo "  🔮 THE ORACLE'S MIRROR — Dimension-9"
	@echo "  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "  The Oracle is awakening..."
	@echo ""
	$(COMPOSE) up -d
	@echo "  🌀 Waiting for ScyllaDB node to materialize in this dimension..."
	@until $(COMPOSE) exec scylladb nodetool status 2>/dev/null | grep -q "^UN"; do sleep 2; done
	@echo "  ✓ ScyllaDB is UP — dimensional mirror calibrated"
	@echo "  🔧 Creating keyspace '$(KEYSPACE)' across all reflections..."
	$(COMPOSE) exec scylladb cqlsh -e \
	  "CREATE KEYSPACE IF NOT EXISTS $(KEYSPACE) \
	   WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'};"
	@echo "  ✓ Keyspace ready — The Oracle can see all timelines"
	@echo ""

db-down:                        ## Stop ScyllaDB
	@echo "  🌀 Dimming The Oracle's mirrors... shutting down ScyllaDB"
	$(COMPOSE) down
	@echo "  ✓ The Oracle has closed its eyes"

seed: db-up                     ## Seed sample data (depends on db-up)
	@echo "  🔮 The Oracle is materializing product reflections..."
	@echo ""
	uv run python seed.py --count 50

run: seed                       ## Install deps, seed, and start the app
	@echo ""
	@echo "  🔮 Launching The Oracle's Mirror interface..."
	@echo "  📡 http://127.0.0.1:8000 — Dimension-9 portal active"
	@echo ""
	uv run uvicorn main:app --reload

clean: db-down                  ## Stop DB and remove data volumes
	$(COMPOSE) down -v
	@echo "  ✓ All reflections shattered — mirror reset"
