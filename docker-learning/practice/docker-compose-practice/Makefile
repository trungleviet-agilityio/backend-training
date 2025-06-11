.PHONY: setup-dev setup-prod dev prod test lint clean format pre-commit

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
	pytest src/tests/ -v --cov=src

# Linting
lint:
	ruff check src/
	ruff format --check src/

# Format code
format:
	ruff format src/
	ruff check --fix src/

# Pre-commit
pre-commit:
	pre-commit run --all-files

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
