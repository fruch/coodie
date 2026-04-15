COMPOSE  := docker compose -f docker-compose.yml
KEYSPACE := vector_demo

.PHONY: db-up db-down seed run clean

db-up:                          ## Start ScyllaDB + vector-store and create keyspace
	@echo ""
	@echo "  📡  SIGNAL GRAVEYARD — Dimension-10"
	@echo "  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "  Booting ScyllaDB + vector-store sidecar..."
	@echo ""
	$(COMPOSE) up -d
	@echo "  🌀 Waiting for ScyllaDB node to come online..."
	@until $(COMPOSE) exec scylladb nodetool status 2>/dev/null | grep -q "^UN"; do sleep 2; done
	@echo "  ✓ ScyllaDB is UP"
	@echo "  🌀 Waiting for vector-store sidecar to be ready..."
	@until $(COMPOSE) logs vector-store 2>&1 | grep -q "listening"; do sleep 2; done
	@echo "  ✓ Vector-store is READY"
	@echo "  🔧 Creating keyspace '$(KEYSPACE)'..."
	$(COMPOSE) exec scylladb cqlsh -e \
	  "CREATE KEYSPACE IF NOT EXISTS $(KEYSPACE) \
	   WITH replication = {'class': 'NetworkTopologyStrategy', 'replication_factor': '1'} \
	   AND tablets = {'enabled': true};"
	@echo "  ✓ Keyspace ready — signal archive can be deployed"
	@echo ""

db-down:                        ## Stop ScyllaDB
	@echo "  🌀 Shutting down ScyllaDB..."
	$(COMPOSE) down
	@echo "  ✓ ScyllaDB stopped"

seed: db-up                     ## Seed the distress signal archive (downloads model on first run)
	@echo "  🤖 Computing embeddings and seeding signals..."
	@echo "     (first run downloads sentence-transformers/all-MiniLM-L6-v2, ~80MB)"
	@echo ""
	uv run python seed.py

run: seed                       ## Install deps, seed, and start the app
	@echo ""
	@echo "  📡 Launching Signal Graveyard demo..."
	@echo "  🔭 http://127.0.0.1:8000 — signal scanner active"
	@echo ""
	uv run uvicorn main:app --reload

clean: db-down                  ## Stop DB and remove data volumes
	$(COMPOSE) down -v
	@echo "  ✓ All signal data purged"
