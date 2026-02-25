COMPOSE  := docker compose -f ../docker-compose.yml
KEYSPACE := blog

.PHONY: db-up db-down seed run clean

db-up:                          ## Start ScyllaDB and create keyspace
	@echo ""
	@echo "  📝 THE PROPAGANDA ENGINE — Dimension-2"
	@echo "  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "  Editor-X is booting up..."
	@echo ""
	$(COMPOSE) up -d
	@echo "  🌀 Waiting for ScyllaDB node to materialize in this dimension..."
	@until $(COMPOSE) exec scylladb nodetool status 2>/dev/null | grep -q "^UN"; do sleep 2; done
	@echo "  ✓ ScyllaDB is UP — propaganda network established"
	@echo "  🔧 Creating keyspace '$(KEYSPACE)' across all timelines..."
	$(COMPOSE) exec scylladb cqlsh -e \
	  "CREATE KEYSPACE IF NOT EXISTS $(KEYSPACE) \
	   WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'};"
	@echo "  ✓ Keyspace ready — the Engine is online"
	@echo ""

db-down:                        ## Stop ScyllaDB
	@echo "  🌀 Shutting down propaganda network... disconnecting ScyllaDB"
	$(COMPOSE) down
	@echo "  ✓ Editor-X has been silenced"

seed: db-up                     ## Seed sample data (depends on db-up)
	@echo "  🧠 Deploying counter-propaganda agents..."
	@echo ""
	uv run python seed.py --count 30

run: seed                       ## Install deps, seed, and start the app
	@echo ""
	@echo "  📝 Launching The Propaganda Engine interface..."
	@echo "  📡 http://127.0.0.1:5000 — Dimension-2 portal active"
	@echo ""
	uv run flask --app app run --debug

clean: db-down                  ## Stop DB and remove data volumes
	$(COMPOSE) down -v
	@echo "  ✓ All propaganda data purged — timeline reset"
