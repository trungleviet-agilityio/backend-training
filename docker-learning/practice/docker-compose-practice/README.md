# Docker Compose Practice Project

This project demonstrates a practical implementation of Docker Compose with a Flask application, Redis, and Nginx. It serves as a learning resource for understanding container orchestration, service communication, and best practices in Docker Compose.

## Quick Start

### Prerequisites
- Docker Engine (version 20.10.0 or later)
- Docker Compose (version 2.0.0 or later)
- Make (optional, for using Makefile)
- Python 3.11 (for local development)

### Environment Setup

1. **Initial Setup**
```bash
# Clone the repository
git clone <repository-url>
cd docker-compose-practice

# Set up environment files
make setup-env

# This will create:
# - config/local/.env
# - config/dev/.env
# - config/prod/.env
```

2. **Configure Environment Variables**
```bash
# Edit environment files as needed
vim config/local/.env  # For local development
vim config/dev/.env    # For development environment
vim config/prod/.env   # For production environment
```

### Running the Project

1. **Development Environment**
```bash
# First time setup
make setup-dev

# Start all services in development mode
make dev

# Or using docker-compose directly
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

2. **Production Environment**
```bash
# First time setup
make setup-prod

# Start all services in production mode
make prod

# Or using docker-compose directly
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

3. **Access the Application**
- Development: http://localhost:8080
- Production: http://localhost:80
- Health Check: http://localhost:8080/health

## Project Structure

```
docker-compose-practice/
├── src/                    # Application source code
│   ├── app/               # Flask application
│   │   ├── __init__.py    # App factory
│   │   └── routes.py      # API endpoints
│   ├── tests/            # Test files
│   └── requirements/     # Python dependencies
│
├── deploy/               # Deployment configurations
│   ├── docker/          # Docker related files
│   │   ├── app/        # App-specific Docker files
│   │   │   └── Dockerfile
│   │   └── nginx/      # Nginx Docker files
│   │       └── Dockerfile
│   ├── nginx/          # Nginx configurations
│   │   ├── nginx.conf
│   │   └── conf.d/
│   └── scripts/        # Deployment scripts
│
├── docker-compose/      # Docker Compose files
│   ├── docker-compose.yml        # Base configuration
│   ├── docker-compose.dev.yml    # Development overrides
│   └── docker-compose.prod.yml   # Production overrides
│
└── docs/               # Documentation
    ├── architecture.md
    └── api.md
```

## Docker Compose Features Demonstrated

### 1. Service Definition
- Multi-service architecture
- Service dependencies
- Health checks
- Resource limits
- Environment variables

### 2. Networking
- Custom network creation
- Service discovery
- Port mapping
- Network isolation

### 3. Volumes
- Persistent data storage
- Configuration mounting
- Development code mounting
- Read-only volumes

### 4. Environment Management
- Development/Production environments
- Environment-specific configurations
- Secret management
- Variable substitution

## Common Commands

### Development
```bash
# Start development environment
make dev

# View logs
make logs

# Access Flask shell
make shell

# Run tests
make test

# Format code
make format
```

### Production
```bash
# Start production environment
make prod

# View logs
make logs

# Stop all services
make down
```

### Maintenance
```bash
# Clean up containers and volumes
make clean

# Rebuild images
make build

# Check service status
docker-compose ps
```

## Key Docker Compose Concepts Demonstrated

1. **Service Dependencies**
```yaml
services:
  app:
    depends_on:
      redis:
        condition: service_healthy
```

2. **Health Checks**
```yaml
services:
  app:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

3. **Volume Management**
```yaml
services:
  redis:
    volumes:
      - redis-data:/data
```

4. **Environment Configuration**
```yaml
services:
  app:
    env_file:
      - ../config/${ENV:-dev}/.env
```

## Best Practices Implemented

1. **Development**
   - Hot-reloading
   - Debug mode
   - Development tools
   - Code quality checks

2. **Production**
   - Multi-stage builds
   - Resource limits
   - Health monitoring
   - Log management

3. **Security**
   - Non-root users
   - Read-only filesystems
   - Network isolation
   - Security headers

## Troubleshooting

### Common Issues

1. **Port Conflicts**
```bash
# Check if ports are in use
sudo lsof -i :80
sudo lsof -i :5000
```

2. **Container Issues**
```bash
# View container logs
docker-compose logs app

# Check container status
docker-compose ps
```

3. **Network Issues**
```bash
# Inspect network
docker network inspect docker-compose-practice_app-network
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
MIT License

## Environment Configuration

### Environment Files Structure
```
config/
├── local/              # Local development
│   └── .env.example   # Local environment template
├── dev/               # Development environment
│   └── .env.example   # Development environment template
└── prod/              # Production environment
    └── .env.example   # Production environment template
```

### Key Environment Variables

1. **Flask Configuration**
```env
FLASK_APP=app:create_app
FLASK_ENV=development|production
FLASK_DEBUG=1|0
```

2. **Redis Configuration**
```env
REDIS_HOST=localhost|redis
REDIS_PORT=6379
```

3. **Application Configuration**
```env
APP_PORT=5000
APP_HOST=0.0.0.0
```

4. **Production Settings**
```env
GUNICORN_WORKERS=4
GUNICORN_THREADS=2
GUNICORN_TIMEOUT=30
``` 