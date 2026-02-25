COMPOSE  := docker compose -f ../docker-compose.yml
KEYSPACE := catalog

.PHONY: db-up db-down seed run clean

db-up:                          ## Start ScyllaDB and create keyspace
	$(COMPOSE) up -d
	@echo "Waiting for ScyllaDB to be ready..."
	@until $(COMPOSE) exec scylladb nodetool status 2>/dev/null | grep -q "^UN"; do sleep 2; done
	$(COMPOSE) exec scylladb cqlsh -e \
	  "CREATE KEYSPACE IF NOT EXISTS $(KEYSPACE) \
	   WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'};"

db-down:                        ## Stop ScyllaDB
	$(COMPOSE) down

seed: db-up                     ## Seed sample data (depends on db-up)
	uv run python seed.py --count 50

run: seed                       ## Install deps, seed, and start the app
	uv run uvicorn main:app --reload

clean: db-down                  ## Stop DB and remove data volumes
	$(COMPOSE) down -v
