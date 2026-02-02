#!/bin/bash

docker compose down -v --remove-orphans
docker rm -f local_postgres_db 2>/dev/null || true
docker network prune -f
docker volume rm media-trends-analyser_postgres_data 2>/dev/null || true
docker volume prune -f

if [ -f "database/seed_data.sql" ]; then
    mv database/seed_data.sql database/seed_data.sql.example
fi

docker compose --profile local up --build --force-recreate