# Docker Compose: Getting Started

## What is Docker Compose?
Docker Compose is a tool for defining and running multi-container Docker applications. It uses YAML files to configure application services and makes it easy to start, stop, and rebuild services. Docker Compose is particularly useful for:
- Development environments
- Automated testing
- Single-host deployments
- CI/CD pipelines

## Key Concepts

### 1. Services
- Individual containers that make up your application
- Defined in docker-compose.yml
- Can have dependencies on other services
- Can be scaled independently
- Each service runs in its own container
- Services can be built from Dockerfile or use existing images

### 2. Networks
- Default network created for services
- Services can communicate by service name
- Can define custom networks
- Supports different network drivers
- Automatic DNS resolution between services
- Network isolation for security

### 3. Volumes
- Persistent data storage
- Can be shared between services
- Supports different volume types
- Defined in docker-compose.yml
- Preserves data between container restarts
- Can be backed up and restored

## Installation

### Linux
```bash
# Install Docker Compose plugin
sudo apt-get update
sudo apt-get install docker-compose-plugin

# Verify installation
docker compose version
```

### macOS
```bash
# Install via Homebrew
brew install docker-compose

# Verify installation
docker compose version
```

### Windows
```bash
# Install via Docker Desktop
# Docker Compose is included with Docker Desktop for Windows

# Verify installation
docker compose version
```

## Basic Usage

### 1. docker-compose.yml Structure
```yaml
version: '3.8'

services:
  web:
    image: nginx:latest
    ports:
      - "80:80"
    volumes:
      - ./web:/usr/share/nginx/html
    depends_on:
      - db
    environment:
      - NODE_ENV=production
    networks:
      - frontend
      - backend

  db:
    image: postgres:latest
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - backend

networks:
  frontend:
  backend:

volumes:
  postgres_data:
```

### 2. Basic Commands
```bash
# Start services
docker compose up

# Start in detached mode
docker compose up -d

# Stop services
docker compose down

# View logs
docker compose logs

# Rebuild services
docker compose build

# List running services
docker compose ps

# Execute command in service
docker compose exec web ls

# View service logs
docker compose logs web

# Restart services
docker compose restart

# Remove stopped containers
docker compose rm
```

## Service Configuration

### 1. Basic Service Options
```yaml
services:
  web:
    # Image to use
    image: nginx:latest

    # Container name
    container_name: my-web

    # Port mapping
    ports:
      - "80:80"
      - "443:443"

    # Environment variables
    environment:
      - NODE_ENV=production
      - DEBUG=false

    # Volume mounts
    volumes:
      - ./web:/app
      - /app/node_modules

    # Service dependencies
    depends_on:
      - db
      - redis

    # Restart policy
    restart: unless-stopped

    # Health check
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### 2. Advanced Service Options
```yaml
services:
  web:
    # Build from Dockerfile
    build:
      context: .
      dockerfile: Dockerfile
      args:
        - NODE_ENV=production

    # Resource limits
    deploy:
      resources:
        limits:
          cpus: '0.50'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M

    # Health check
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

    # Security options
    security_opt:
      - no-new-privileges:true

    # Capabilities
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
```

## Environment Variables

### 1. Using .env File
```bash
# .env file
DB_HOST=db
DB_USER=user
DB_PASSWORD=secret
NODE_ENV=production
DEBUG=false
```

### 2. In docker-compose.yml
```yaml
services:
  web:
    # Direct environment variables
    environment:
      - DB_HOST=${DB_HOST}
      - DB_USER=${DB_USER}
      - NODE_ENV=production

    # Environment file
    env_file:
      - .env
      - .env.prod

    # Environment variable substitution
    command: echo "Hello ${DB_USER}"
```

## Best Practices

### 1. Service Organization
- Group related services
- Use meaningful service names
- Implement proper dependencies
- Use version control
- Keep services focused and single-purpose
- Document service configurations

### 2. Configuration
- Use environment variables
- Implement health checks
- Set resource limits
- Use named volumes
- Define restart policies
- Use appropriate network isolation

### 3. Security
- Use non-root users
- Implement security options
- Drop unnecessary capabilities
- Use read-only volumes when possible
- Implement proper secrets management
- Regular security updates

## Common Use Cases

### 1. Development Environment
```yaml
version: '3.8'

services:
  web:
    build: .
    volumes:
      - .:/app
      - /app/node_modules
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DEBUG=true
    command: npm run dev

  db:
    image: postgres:latest
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=dev
      - POSTGRES_USER=dev
      - POSTGRES_PASSWORD=dev

volumes:
  postgres_data:
```

### 2. Production Environment
```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '0.50'
          memory: 512M
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost"]
      interval: 30s
      timeout: 10s
      retries: 3
```

## Troubleshooting

### 1. Common Issues
- Service startup order
- Network connectivity
- Volume mounting
- Environment variables
- Resource constraints
- Permission issues

### 2. Debugging
```bash
# View service status
docker compose ps

# Check service logs
docker compose logs web

# Inspect service
docker compose inspect web

# Execute command in service
docker compose exec web sh

# View network information
docker network ls
docker network inspect docker-compose-practice_default

# Check volume information
docker volume ls
docker volume inspect docker-compose-practice_postgres_data
```

## Next Steps
1. Practice creating multi-service applications
2. Learn about service dependencies
3. Implement health checks
4. Explore advanced configuration options
5. Study production deployment strategies
6. Learn about Docker Compose in CI/CD
