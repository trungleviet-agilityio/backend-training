# Architecture Documentation

This document describes the architecture of the Docker Compose Practice project, a production-ready Flask application with Redis and Nginx.

## System Overview

The application consists of three main services:

1. **Flask Application** (`app`)
   - Python web application serving the API
   - Handles business logic and Redis integration
   - Runs on port 5000 internally

2. **Redis** (`redis`)
   - In-memory database for visit counting
   - Persists data using AOF (Append Only File)
   - Runs on port 6379 internally

3. **Nginx** (`nginx`)
   - Reverse proxy and load balancer
   - Serves static files
   - Exposes port 80 externally

## Network Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Client      │    │      Nginx      │    │   Flask App     │
│   (Browser)     │◄──►│  (Reverse Proxy │◄──►│  (Python API)   │
│                 │    │   Load Balancer)│    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                                                        ▼
                                              ┌─────────────────┐
                                              │     Redis       │
                                              │ (Cache/Session) │
                                              └─────────────────┘
```

### Network Details

- **Network Name**: `app-network`
- **Driver**: bridge
- **Subnet**: 172.18.0.0/16
- **Services**: All containers communicate internally using service names

## Service Configuration

### Flask Application

```yaml
app:
  build:
    context: ./src
    dockerfile: ../deploy/docker/app/Dockerfile
  volumes:
    - ./src:/app
  env_file:
    - ./config/${ENV:-dev}/.env
  depends_on:
    redis:
      condition: service_healthy
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
    interval: 30s
    timeout: 10s
    retries: 3
    start_period: 40s
  networks:
    - app-network
```

### Redis

```yaml
redis:
  image: redis:7-alpine
  command: redis-server --appendonly yes
  volumes:
    - redis-data:/data
  env_file:
    - ./config/${ENV:-dev}/.env
  healthcheck:
    test: ["CMD", "redis-cli", "ping"]
    interval: 10s
    timeout: 5s
    retries: 3
  networks:
    - app-network
```

### Nginx

```yaml
nginx:
  build:
    context: ./deploy/nginx
    dockerfile: ../docker/nginx/Dockerfile
  ports:
    - "80:80"
  volumes:
    - ./deploy/nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    - ./deploy/nginx/conf.d:/etc/nginx/conf.d:ro
    - ./src/static:/app/static:ro
  env_file:
    - ./config/${ENV:-dev}/.env
  depends_on:
    - app
  networks:
    - app-network
```

## Environment Configuration

The application supports multiple environments through environment files:

- **Development** (`config/dev/.env`)
  - Debug mode enabled
  - Development-specific settings
  - Local development configuration

- **Production** (`config/prod/.env`)
  - Debug mode disabled
  - Production-specific settings
  - Secure configuration

## Health Checks

Each service implements health checks:

1. **Flask App**
   - Endpoint: `/health`
   - Checks: Application status and Redis connection
   - Interval: 30s

2. **Redis**
   - Command: `redis-cli ping`
   - Checks: Redis server availability
   - Interval: 10s

3. **Nginx**
   - Command: `nginx -t`
   - Checks: Configuration validity
   - Interval: 30s

## Data Persistence

- **Redis Data**
  - Volume: `redis-data`
  - Persistence: AOF (Append Only File)
  - Location: `/data` in container

## Security Considerations

1. **Network Isolation**
   - Services communicate on private network
   - Only Nginx exposed to host
   - Internal services not directly accessible

2. **Environment Variables**
   - Sensitive data in .env files
   - Different configurations per environment
   - No hardcoded secrets

3. **File Permissions**
   - Read-only volume mounts where possible
   - Minimal file access in containers
   - Proper user permissions

## Scaling Considerations

The architecture supports horizontal scaling:

1. **Flask App**
   - Stateless design
   - Can be scaled horizontally
   - Load balanced by Nginx

2. **Redis**
   - Single instance for simplicity
   - Can be clustered for production
   - Data persistence enabled

3. **Nginx**
   - Handles load balancing
   - Static file serving
   - SSL termination (if configured)

## Monitoring and Logging

1. **Health Checks**
   - Service-level health monitoring
   - Automatic container restart
   - Dependency management

2. **Logging**
   - Container logs
   - Application logs
   - Nginx access/error logs

## Development Workflow

1. **Local Development**
   - Hot-reload enabled
   - Source code mounted
   - Debug mode active

2. **Testing**
   - Unit tests in `src/tests`
   - Integration tests
   - End-to-end testing

3. **Deployment**
   - Docker Compose for orchestration
   - Environment-specific configs
   - Production optimizations

## Best Practices Implemented

1. **Container Design**
   - Single responsibility
   - Minimal base images
   - Proper health checks

2. **Configuration**
   - Environment variables
   - Separate configs
   - No hardcoded values

3. **Networking**
   - Private network
   - Service discovery
   - Port mapping

4. **Security**
   - Read-only volumes
   - Minimal permissions
   - Secure defaults

## Future Improvements

1. **Scaling**
   - Redis clustering
   - Multiple Nginx instances
   - Service mesh integration

2. **Monitoring**
   - Prometheus metrics
   - Grafana dashboards
   - Alerting system

3. **Security**
   - SSL/TLS configuration
   - Authentication system
   - Rate limiting

4. **CI/CD**
   - Automated testing
   - Deployment pipeline
   - Version management
