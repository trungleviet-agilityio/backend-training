# Quick Start Guide

This guide will help you get the Docker Compose Practice project up and running in 5 minutes.

## Prerequisites

- Docker Engine (version 20.10.0 or later)
- Docker Compose (version 2.0.0 or later)
- Make (optional, for using Makefile commands)
- curl and jq (for testing endpoints)

## Setup Steps

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd docker-compose-practice
   ```

2. **Create Environment Files**
   Create the following environment files:

   ```bash
   # Development environment
   mkdir -p config/dev
   cat > config/dev/.env << EOL
   # Flask Application
   FLASK_APP=main.py
   FLASK_ENV=development
   FLASK_DEBUG=1

   # Redis Configuration
   REDIS_HOST=redis
   REDIS_PORT=6379
   REDIS_DB=0

   # Application Settings
   APP_HOST=0.0.0.0
   APP_PORT=5000
   APP_SECRET_KEY=dev_secret_key_change_in_production

   # Nginx Configuration
   NGINX_HOST=localhost
   NGINX_PORT=80
   EOL

   # Production environment
   mkdir -p config/prod
   cat > config/prod/.env << EOL
   # Flask Application
   FLASK_APP=main.py
   FLASK_ENV=production
   FLASK_DEBUG=0

   # Redis Configuration
   REDIS_HOST=redis
   REDIS_PORT=6379
   REDIS_DB=0

   # Application Settings
   APP_HOST=0.0.0.0
   APP_PORT=5000
   APP_SECRET_KEY=change_this_to_a_secure_key_in_production

   # Nginx Configuration
   NGINX_HOST=localhost
   NGINX_PORT=80
   EOL
   ```

3. **Start the Development Environment**
   ```bash
   # Using Make
   make dev

   # Or manually
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
   ```

4. **Verify the Setup**
   ```bash
   # Check if services are running
   docker-compose ps

   # Test the main endpoint
   curl http://localhost/

   # Test the health endpoint
   curl http://localhost/health
   ```

## Accessing the Application

- **Main Application**: http://localhost/
- **Health Check**: http://localhost/health
- **Visit Counter**: Each request to `/` increments the Redis counter

## Common Issues and Solutions

1. **Port Conflicts**
   If port 80 is already in use:
   ```bash
   # Check what's using port 80
   sudo lsof -i :80
   
   # Stop conflicting service (e.g., Apache)
   sudo systemctl stop apache2
   ```

2. **Container Build Failures**
   ```bash
   # Clean rebuild
   docker-compose down -v
   docker-compose build --no-cache
   ```

3. **Redis Connection Issues**
   ```bash
   # Check Redis logs
   docker-compose logs redis
   
   # Test Redis connection
   docker-compose exec redis redis-cli ping
   ```

## Next Steps

- Review the [Architecture Documentation](architecture.md) to understand the system design
- Check the [API Documentation](api.md) for available endpoints
- Read the [Project Verification](PROJECT_VERIFICATION.md) for current working status

## 🚀 What's Next?

- Try scaling services: `make scale-test`
- Explore the production configuration: `make prod`
- Study the network architecture: `docker network inspect app-network`
- Learn about health checks: `docker-compose ps`
- Read the full documentation to understand the architecture
 