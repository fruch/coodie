COMPOSE  := docker compose -f docker-compose.yml
KEYSPACE := vector_demo

.PHONY: db-up db-down seed run clean

db-up:                          ## Start ScyllaDB + vector-store and create keyspace
	@echo ""
	@echo "  🔍  VECTOR SEARCH — Neural Product Index"
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
	@echo "  ✓ Keyspace ready — neural index can be deployed"
	@echo ""

db-down:                        ## Stop ScyllaDB
	@echo "  🌀 Shutting down ScyllaDB..."
	$(COMPOSE) down
	@echo "  ✓ ScyllaDB stopped"

seed: db-up                     ## Seed sample product embeddings
	@echo "  🧠 Computing embeddings and seeding products..."
	@echo ""
	uv run python seed.py --count 30

run: seed                       ## Install deps, seed, and start the app
	@echo ""
	@echo "  🔍 Launching Vector Search demo..."
	@echo "  📡 http://127.0.0.1:8000 — search portal active"
	@echo ""
	uv run uvicorn main:app --reload

clean: db-down                  ## Stop DB and remove data volumes
	$(COMPOSE) down -v
	@echo "  ✓ All vector data purged"
