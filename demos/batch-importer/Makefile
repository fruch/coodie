COMPOSE  := docker compose -f ../docker-compose.yml
KEYSPACE := cargo

.PHONY: db-up db-down seed seed-csv clean test

db-up:                          ## Start ScyllaDB and create keyspace
	@echo ""
	@echo "  📦 THE DIMENSIONAL CARGO DROP — Dimension-7"
	@echo "  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "  LoadMaster is booting up..."
	@echo ""
	$(COMPOSE) up -d
	@echo "  🌀 Waiting for ScyllaDB node to materialize in this dimension..."
	@until $(COMPOSE) exec scylladb nodetool status 2>/dev/null | grep -q "^UN"; do sleep 2; done
	@echo "  ✓ ScyllaDB is UP — cargo network established"
	@echo "  🔧 Creating keyspace '$(KEYSPACE)' across all timelines..."
	$(COMPOSE) exec scylladb cqlsh -e \
	  "CREATE KEYSPACE IF NOT EXISTS $(KEYSPACE) \
	   WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'};"
	@echo "  ✓ Keyspace ready — LoadMaster's warehouse is online"
	@echo ""

db-down:                        ## Stop ScyllaDB
	@echo "  🌀 Shutting down cargo network... disconnecting ScyllaDB"
	$(COMPOSE) down
	@echo "  ✓ LoadMaster has been disconnected"

seed: db-up                     ## Run batch import (depends on db-up)
	@echo "  📦 Deploying counter-manifest against LoadMaster..."
	@echo ""
	uv run python seed.py --count 200

seed-csv: db-up                 ## Import the bundled sample_manifest.csv (100 entries)
	@echo "  📂 Importing sample_manifest.csv..."
	@echo ""
	uv run python seed.py --feed sample_manifest.csv

clean: db-down                  ## Stop DB and remove data volumes
	$(COMPOSE) down -v
	@echo "  ✓ All cargo data purged — dimensional rift sealed"

test:                           ## Run smoke test (requires ScyllaDB running)
	uv run python smoke_test.py
