.PHONY: help install build test lint clean dev

help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install all dependencies
	@echo "📦 Installing dependencies..."
	cd frontend && npm install
	cd backend && /usr/local/bin/python -m pip install -e .
	cd backend && /usr/local/bin/python -m pip install -r requirements-dev.txt

build: ## Build the project
	@echo "🏗️  Building project..."
	cd frontend && npm run build

test: ## Run all tests
	@echo "🧪 Running tests..."
	cd frontend && npm test
	cd backend && /usr/local/bin/python -m pytest

lint: ## Run linting
	@echo "🔍 Running linting..."
	cd frontend && npm run lint
	cd backend && /usr/local/bin/python -m black --check openui/
	cd backend && /usr/local/bin/python -m pylint openui/

format: ## Format code
	@echo "✨ Formatting code..."
	cd frontend && npm run format
	cd backend && /usr/local/bin/python -m black openui/

clean: ## Clean build artifacts
	@echo "🧹 Cleaning..."
	rm -rf frontend/dist
	rm -rf frontend/node_modules/.cache
	find backend -name "__pycache__" -type d -exec rm -rf {} +
	find backend -name "*.pyc" -delete

dev: ## Start development environment
	@echo "🚀 Starting development environment..."
	./start.sh

setup: ## Setup development environment
	@echo "🛠️  Setting up development environment..."
	./setup-dev.sh

docker-build: ## Build with Docker
	@echo "🐳 Building with Docker..."
	docker-compose build

docker-up: ## Start with Docker
	@echo "🐳 Starting with Docker..."
	docker-compose up -d

docker-down: ## Stop Docker containers
	@echo "🐳 Stopping Docker containers..."
	docker-compose down

docker-logs: ## Show Docker logs
	@echo "📜 Showing Docker logs..."
	docker-compose logs -f
