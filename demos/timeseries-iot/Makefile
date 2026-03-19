COMPOSE  := docker compose -f ../docker-compose.yml
KEYSPACE := iot

.PHONY: db-up db-down seed seed-large run clean test

db-up:                          ## Start ScyllaDB and create keyspace
	@echo ""
	@echo "  📡 STATION ARGOS-7 — Sensor Grid"
	@echo "  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "  Initializing sensor telemetry database..."
	@echo ""
	$(COMPOSE) up -d
	@echo "  🌀 Waiting for ScyllaDB node to come online..."
	@until $(COMPOSE) exec scylladb nodetool status 2>/dev/null | grep -q "^UN"; do sleep 2; done
	@echo "  ✓ ScyllaDB is UP — telemetry datastore anchored"
	@echo "  🔧 Creating keyspace '$(KEYSPACE)' (sensor data store)..."
	$(COMPOSE) exec scylladb cqlsh -e \
	  "CREATE KEYSPACE IF NOT EXISTS $(KEYSPACE) \
	   WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'};"
	@echo "  ✓ Keyspace ready — sensor partitions active"
	@echo ""

db-down:                        ## Stop ScyllaDB
	@echo "  🌀 Powering down sensor grid... shutting down ScyllaDB"
	$(COMPOSE) down
	@echo "  ✓ Station Argos-7 has been disconnected"

seed: db-up                     ## Seed 5 sensors × 3 days × 50 readings/day
	@echo "  📡 Deploying sensor telemetry feed..."
	@echo ""
	uv run python seed.py --sensors 5 --days 3 --readings-per-day 50

seed-large: db-up               ## Seed 10 sensors × 7 days × 100 readings/day (pagination demo)
	@echo "  📡 Deploying extended sensor telemetry feed..."
	@echo ""
	uv run python seed.py --sensors 10 --days 7 --readings-per-day 100

run: seed                       ## Install deps, seed, and start the app
	@echo ""
	@echo "  📡 Launching Station Argos-7 dashboard..."
	@echo "  🖥  http://127.0.0.1:8000 — Telemetry portal active"
	@echo "  📊 per_partition_limit() + paged_all() in action"
	@echo ""
	uv run uvicorn main:app --reload

clean: db-down                  ## Stop DB and remove data volumes
	$(COMPOSE) down -v
	@echo "  ✓ All sensor data purged — telemetry datastore wiped"

test: db-up                     ## Run smoke tests (requires ScyllaDB running)
	@echo "  🧪 Running smoke tests..."
	uv run python smoke_test.py
	@echo "  ✓ All smoke tests passed"
