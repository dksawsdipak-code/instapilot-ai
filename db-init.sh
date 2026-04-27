#!/bin/bash

# Database Initialization Helper Script
# Usage:
#   ./db-init.sh              - Initialize database in Docker
#   ./db-init.sh reset        - Reset database (drop and recreate)

cd "$(dirname "$0")"

if [ "$1" = "reset" ]; then
    echo "Resetting database in Docker container..."
    docker compose exec backend python init_db.py reset
else
    echo "Initializing database in Docker container..."
    docker compose exec backend python init_db.py
fi
