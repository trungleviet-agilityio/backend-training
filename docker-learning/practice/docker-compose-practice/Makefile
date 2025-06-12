.PHONY: setup-dev setup-prod dev prod test lint clean format pre-commit scale-test scale-up scale-down scale-status load-test venv activate clean-venv

# Environment setup
setup-env:
	@echo "Setting up environment files..."
	@for env in local dev prod; do \
		if [ ! -f config/$$env/.env ]; then \
			cp config/$$env/.env.example config/$$env/.env; \
			echo "Created config/$$env/.env"; \
		fi \
	done

# Development environment setup
setup-dev: setup-env
	python -m venv .venv
	. .venv/bin/activate && pip install -e ".[dev]"
	pre-commit install

# Production environment setup
setup-prod: setup-env
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Development commands
dev: setup-env
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Production commands
prod: setup-env
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Testing
test:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec -e PYTHONPATH=/app app pytest tests/ -v --cov=.

# Linting
lint:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec app ruff check .
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec app ruff format --check .

# Format code
format:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec app ruff format .
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec app ruff check --fix .

# Pre-commit
pre-commit:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec app pre-commit run --all-files

# Clean up
clean:
	docker-compose down -v
	find . -type d -name "__pycache__" -exec rm -r {} +
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type f -name "*.pyd" -delete
	find . -type f -name ".coverage" -delete
	find . -type d -name "*.egg-info" -exec rm -r {} +
	find . -type d -name "*.egg" -exec rm -r {} +
	find . -type d -name ".pytest_cache" -exec rm -r {} +
	find . -type d -name ".coverage" -exec rm -r {} +
	find . -type d -name "htmlcov" -exec rm -r {} +
	find . -type d -name ".mypy_cache" -exec rm -r {} +
	find . -type d -name ".ruff_cache" -exec rm -r {} +
	find . -type d -name ".tox" -exec rm -r {} +
	find . -type d -name ".venv" -exec rm -r {} +

# Database commands
db-migrate:
	docker compose exec web flask db upgrade

db-rollback:
	docker compose exec web flask db downgrade

# Logs
logs:
	docker compose logs -f

# Shell access
shell:
	docker compose exec web flask shell

# Help
help:
	@echo "Available commands:"
	@echo "  make setup-env   - Set up environment files"
	@echo "  make setup-dev   - Set up development environment"
	@echo "  make setup-prod  - Set up production environment"
	@echo "  make dev        - Start development environment"
	@echo "  make prod       - Start production environment"
	@echo "  make test       - Run tests"
	@echo "  make lint       - Run linters"
	@echo "  make format     - Format code"
	@echo "  make pre-commit - Run pre-commit hooks"
	@echo "  make logs       - View logs"
	@echo "  make shell      - Access Flask shell"

# Scaling commands
scale-test: ## Test horizontal scaling with 3 app instances
	@echo "🚀 Starting scaled deployment (3 app instances)..."
	docker-compose -f docker-compose.yml -f docker-compose.scale.yml up --scale app=3 -d
	@echo "⏳ Waiting for services to be ready..."
	@sleep 10
	@echo "✅ Testing load balancing..."
	@for i in 1 2 3 4 5; do \
		echo "Request $$i: $$(curl -s http://localhost/ | jq -r '.served_by.instance')"; \
	done
	@echo "🎯 Load balancing test complete!"

scale-up: ## Scale app to 5 instances  
	@echo "📈 Scaling up to 5 app instances..."
	docker-compose -f docker-compose.yml -f docker-compose.scale.yml up --scale app=5 -d
	
scale-down: ## Scale app down to 1 instance
	@echo "📉 Scaling down to 1 app instance..."
	docker-compose -f docker-compose.yml -f docker-compose.scale.yml up --scale app=1 -d

scale-status: ## Show current scaling status
	@echo "📊 Current scaling status:"
	@docker-compose ps | grep app
	@echo "\n🌐 Network configuration:"
	@docker network inspect app-network | jq '.[0].Containers | to_entries | map({name: .value.Name, ip: .value.IPv4Address}) | map(select(.name | contains("app"))) | sort_by(.name)'

load-test: ## Run comprehensive load balancing test
	@echo "🧪 Running comprehensive load balancing test..."
	@echo "Making 20 requests to /load-test endpoint..."
	@for i in $$(seq 1 20); do \
		curl -s http://localhost/load-test | jq -r '.served_by.instance + " (req #" + (.instance_requests | tostring) + ")"'; \
		sleep 0.1; \
	done
	@echo "🏁 Load test complete!"

PYTHON_VERSION := $(shell cat .python-version)
VENV_DIR := .venv

venv:
	@echo "Creating virtual environment with Python $(PYTHON_VERSION)"
	pyenv install -s $(PYTHON_VERSION)
	pyenv local $(PYTHON_VERSION)
	python -m venv $(VENV_DIR)
	$(VENV_DIR)/bin/pip install --upgrade pip

activate:
	@echo "To activate the virtual environment, run:"
	@echo "source $(VENV_DIR)/bin/activate"

clean-venv:
	rm -rf $(VENV_DIR)
