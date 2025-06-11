# Architecture Documentation

## System Overview

This Docker Compose practice project demonstrates a **production-ready microservices architecture** with Flask, Redis, and Nginx. The application showcases container orchestration, service communication, and Docker Compose best practices.

## 🏗️ Architecture Diagram

```
                          ┌─────────────────────────────┐
                          │          Client             │
                          │        (Browser)            │
                          └─────────────┬───────────────┘
                                        │
                                        │ HTTP Requests
                                        │ Port 80
                                        ▼
                          ┌─────────────────────────────┐
                          │          Nginx              │
                          │     (Reverse Proxy)         │
                          │   ┌─────────────────────┐   │
                          │   │ • Load Balancing    │   │
                          │   │ • SSL Termination   │   │
                          │   │ • Static Files      │   │
                          │   │ • Security Headers  │   │
                          │   └─────────────────────┘   │
                          └─────────────┬───────────────┘
                                        │
                                        │ Proxy Pass
                                        │ Port 5000
                                        ▼
                          ┌─────────────────────────────┐
                          │         Flask App           │
                          │      (Python API)           │
                          │   ┌─────────────────────┐   │
                          │   │ • REST API          │   │
                          │   │ • Business Logic    │   │
                          │   │ • Session Management│   │
                          │   │ • Health Checks     │   │
                          │   └─────────────────────┘   │
                          └─────────────┬───────────────┘
                                        │
                                        │ Redis Protocol
                                        │ Port 6379
                                        ▼
                          ┌─────────────────────────────┐
                          │          Redis              │
                          │     (Cache/Database)        │
                          │   ┌─────────────────────┐   │
                          │   │ • Visit Counter     │   │
                          │   │ • Session Storage   │   │
                          │   │ • Caching Layer     │   │
                          │   │ • Pub/Sub Messaging │   │
                          │   └─────────────────────┘   │
                          └─────────────────────────────┘
```

## 🐳 Container Architecture

### Service Breakdown

#### 1. Nginx Container (`nginx`)
- **Purpose**: Reverse proxy and load balancer
- **Base Image**: `nginx:alpine`
- **Ports**: 
  - `80:80` (HTTP traffic)
- **Key Features**:
  - Routes requests to Flask backend
  - Serves static files efficiently
  - Implements security headers
  - Handles SSL termination (in production)
  - Provides load balancing for multiple Flask instances

#### 2. Flask Application Container (`app`)
- **Purpose**: Python web application and API server
- **Base Image**: `python:3.11-slim`
- **Ports**: 
  - `5000` (internal only, accessed via Nginx)
- **Key Features**:
  - RESTful API endpoints
  - Redis integration for data persistence
  - Health monitoring endpoints
  - Environment-based configuration
  - Multi-stage build for optimization

#### 3. Redis Container (`redis`)
- **Purpose**: In-memory database and cache
- **Base Image**: `redis:alpine`
- **Ports**: 
  - `6379` (internal only)
- **Key Features**:
  - Visit counter storage
  - Session management
  - High-performance caching
  - Data persistence with RDB snapshots

## 🔗 Service Communication

### Network Architecture
```
┌─────────────────────────────────────────────────────────┐
│                  Docker Network                         │
│                (app-network)                            │
│                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │    nginx    │    │     app     │    │    redis    │  │
│  │   :80       │◄──►│   :5000     │◄──►│   :6379     │  │
│  └─────────────┘    └─────────────┘    └─────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Communication Flow
1. **Client → Nginx** (HTTP/HTTPS)
   - Client sends request to `http://localhost/`
   - Nginx receives on port 80

2. **Nginx → Flask** (HTTP Proxy)
   - Nginx forwards to `http://app:5000/`
   - Load balancing across Flask instances

3. **Flask → Redis** (Redis Protocol)
   - Flask connects to `redis:6379`
   - Stores/retrieves visit counter data

## 📦 Data Flow

### Request Lifecycle
```
1. Browser Request
   │
   ├─► GET / HTTP/1.1
   │   Host: localhost
   │
2. Nginx Processing
   │
   ├─► proxy_pass http://app:5000/
   │   + Add security headers
   │   + Log request
   │
3. Flask Processing
   │
   ├─► Route: @app.route('/')
   │   │
   │   ├─► Redis INCR visits
   │   │   │
   │   │   └─► visits = redis.incr('visit_count')
   │   │
   │   └─► Return JSON response
   │
4. Response Chain
   │
   ├─► Flask: {"message": "...", "visits": N}
   │   │
   │   ├─► Nginx: Add headers, forward response
   │   │
   │   └─► Browser: Display result
```

## 🔧 Configuration Management

### Environment Strategy
```
config/
├── local/     # Local development (Docker Desktop)
├── dev/       # Development server (CI/CD)
└── prod/      # Production server (deployment)
```

### Configuration Hierarchy
1. **Default Values** (in Python code)
2. **Environment Files** (.env)
3. **Environment Variables** (override .env)
4. **Command Line Arguments** (highest priority)

### Key Configuration Areas
- **Flask Settings**: Debug mode, secret keys, database URLs
- **Redis Settings**: Host, port, database selection, TTL
- **Nginx Settings**: Upstream servers, SSL, caching rules
- **Docker Settings**: Resource limits, health checks, networks

## 🚀 Deployment Architecture

### Multi-Environment Setup

#### Development Environment
```yaml
# docker-compose.dev.yml
services:
  app:
    volumes:
      - ./src:/app  # Live code reload
    environment:
      - FLASK_ENV=development
      - FLASK_DEBUG=1
    ports:
      - "5000:5000"  # Direct access for debugging
```

#### Production Environment
```yaml
# docker-compose.prod.yml
services:
  app:
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'
    environment:
      - FLASK_ENV=production
      - GUNICORN_WORKERS=4
```

## 🛡️ Security Architecture

### Security Layers
1. **Container Security**
   - Non-root users in containers
   - Read-only file systems where possible
   - Minimal base images (Alpine Linux)
   - No unnecessary packages

2. **Network Security**
   - Internal network isolation
   - Only necessary ports exposed
   - Service-to-service authentication

3. **Application Security**
   - Environment variable secrets
   - Request validation
   - Security headers (via Nginx)
   - Rate limiting capabilities

### Security Headers (Nginx)
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self'" always;
```

## 📊 Monitoring & Health Checks

### Health Check Strategy
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

### Health Check Endpoints
- **Flask App**: `GET /health`
  - Checks Redis connectivity
  - Returns service status
  - Response time monitoring

- **Nginx**: Default nginx status
  - Process health check
  - Upstream server status

- **Redis**: Redis PING command
  - Memory usage check
  - Connection availability

## 🔄 Scaling Considerations

### Horizontal Scaling
```yaml
services:
  app:
    deploy:
      replicas: 3  # Multiple Flask instances
```

### Load Balancing (Nginx)
```nginx
upstream flask_app {
    least_conn;
    server app_1:5000;
    server app_2:5000;
    server app_3:5000;
}
```

### Session Management
- **Stateless Design**: Sessions stored in Redis
- **Sticky Sessions**: Not required due to Redis backend
- **Session Replication**: Redis handles persistence

## 🏗️ Build Architecture

### Multi-Stage Docker Build
```dockerfile
# Stage 1: Builder
FROM python:3.11-slim AS builder
COPY requirements/ requirements/
RUN pip install -r requirements/prod.txt

# Stage 2: Final
FROM python:3.11-slim AS final
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
```

### Benefits
- **Smaller Images**: Only runtime dependencies
- **Security**: No build tools in final image
- **Performance**: Faster container startup
- **Caching**: Efficient layer caching

## 📈 Performance Optimizations

### Docker Optimizations
- Multi-stage builds reduce image size
- Alpine Linux base images
- Efficient layer caching
- Volume mounts for development

### Application Optimizations
- Redis connection pooling
- Gunicorn with multiple workers
- Nginx static file serving
- HTTP/2 support ready

### Development Optimizations
- Live code reloading
- Debug mode for development
- Hot-reload for CSS/JS
- Efficient build caching

## 🔍 Troubleshooting Architecture

### Common Issues & Solutions
1. **Service Discovery**: Use service names in Docker network
2. **Port Conflicts**: Map to different host ports
3. **Volume Permissions**: Use proper user mapping
4. **Health Check Failures**: Verify endpoint accessibility

### Debugging Tools
```bash
# Network inspection
docker network inspect app-network

# Service logs
docker-compose logs -f app

# Container access
docker-compose exec app /bin/sh

# Redis debugging
docker-compose exec redis redis-cli monitor
```

This architecture provides a solid foundation for learning Docker Compose while demonstrating real-world patterns and best practices.
