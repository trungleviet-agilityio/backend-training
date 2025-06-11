# Docker Compose Practice Project

This project demonstrates a **production-ready Flask application** with Redis and Nginx using Docker Compose. It serves as a comprehensive learning resource for understanding container orchestration, service communication, and Docker Compose best practices.

## 🚀 Quick Start

### Prerequisites
- Docker Engine (version 20.10.0 or later)
- Docker Compose (version 2.0.0 or later)
- Make (optional, for using Makefile commands)

### Running the Project

```bash
# Clone and navigate to the project
cd docker-compose-practice

# Start development environment (recommended for first-time)
make dev

# Or start production environment
make prod
```

### Access the Application
- **Main Application**: http://localhost/
- **Health Check**: http://localhost/health
- **Visit Counter**: Each request to `/` increments the Redis counter

## 📚 Complete Documentation

This project includes comprehensive documentation for all skill levels:

### 🚀 Quick Guides
- **[Quick Start Guide](docs/quick-start.md)** - Get running in 5 minutes
- **[Documentation Index](docs/README.md)** - Complete documentation overview

### 🏗️ Technical Details  
- **[Architecture Documentation](docs/architecture.md)** - System design and patterns
- **[API Documentation](docs/api.md)** - Complete endpoint reference
- **[Project Verification](docs/PROJECT_VERIFICATION.md)** - Working status and metrics

### 📖 Choose Your Path
| **If you want to...** | **Start with...** |
|----------------------|-------------------|
| Get it running quickly | [Quick Start Guide](docs/quick-start.md) |
| Understand the architecture | [Architecture Documentation](docs/architecture.md) |
| Learn the API | [API Documentation](docs/api.md) |
| See current working state | [Project Verification](docs/PROJECT_VERIFICATION.md) |
| Browse all documentation | [Documentation Index](docs/README.md) |

## 📁 Project Architecture

### Directory Structure
```
docker-compose-practice/
├── src/                           # Application source code
│   ├── main.py                   # Flask application entrypoint
│   ├── app/                      # Flask application package
│   │   ├── __init__.py          # App factory
│   │   ├── routes.py            # API endpoints
│   │   └── config/              # Configuration management
│   ├── requirements/            # Python dependencies by environment
│   ├── static/                  # Static files
│   └── tests/                   # Test files
│
├── deploy/                       # Deployment configurations
│   ├── docker/                  # Dockerfiles
│   │   ├── app/Dockerfile       # Flask app container
│   │   └── nginx/Dockerfile     # Nginx container
│   ├── nginx/                   # Nginx configurations
│   │   ├── nginx.conf           # Main Nginx config
│   │   └── conf.d/default.conf  # Site configuration
│   └── scripts/                 # Deployment scripts
│       └── entrypoint.sh        # App startup script
│
├── config/                      # Environment configurations
│   ├── local/.env.example       # Local development
│   ├── dev/.env.example         # Development environment  
│   └── prod/.env.example        # Production environment
│
├── docs/                        # Comprehensive Documentation
│   ├── README.md                # Documentation index
│   ├── quick-start.md           # 5-minute setup guide
│   ├── architecture.md          # System architecture
│   ├── api.md                   # API documentation
│   └── PROJECT_VERIFICATION.md  # Working status report
│
├── docker-compose.yml           # Base Docker Compose config
├── docker-compose.dev.yml       # Development overrides
├── docker-compose.prod.yml      # Production overrides
├── Makefile                     # Common commands
└── README.md                    # This file
```

### Service Architecture
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

## 🛠️ What We Built

### 1. Multi-Service Docker Application
- **Flask API** - Python web application with Redis integration
- **Redis** - In-memory database for visit counting and caching
- **Nginx** - Reverse proxy for production-ready setup

### 2. Docker Compose Features Demonstrated
- **Service Dependencies**: App waits for Redis to be healthy
- **Health Checks**: All services monitor their own health
- **Environment Management**: Separate configs for dev/prod
- **Volume Management**: Persistent Redis data storage
- **Network Isolation**: Services communicate on private network
- **Multi-stage Builds**: Optimized Docker images

### 3. Development Best Practices
- **Environment Variables**: Configurable through .env files
- **Code Quality**: Pre-commit hooks, linting, formatting
- **Modern Python**: pyproject.toml, type hints, factory pattern
- **Documentation**: Comprehensive README and API docs

## 🔧 Common Commands

### Development Workflow
```bash
# Environment setup (first time only)
make setup-env          # Create environment files
make setup-dev          # Set up local development environment

# Daily development
make dev               # Start development environment
make logs              # View container logs
make clean             # Stop and clean up containers

# Code quality
make format            # Format code with Ruff
make lint             # Run linters
make pre-commit       # Run pre-commit hooks
make test             # Run tests
```

### Docker Commands
```bash
# Manual Docker Compose usage
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Service management
docker-compose ps                    # Check service status
docker-compose logs app             # View app logs
docker-compose exec app /bin/sh     # Access app container
docker-compose down -v              # Stop and remove everything
```

## 🧪 Testing the Application

### API Endpoints
```bash
# Main endpoint (increments visit counter)
curl http://localhost/
# Response: {"message": "Welcome to Docker Compose Practice", "visits": 1}

# Health check endpoint
curl http://localhost/health  
# Response: {"status": "UP", "redis": "connected"}

# Test multiple visits
curl http://localhost/ && curl http://localhost/
# Visit counter increments: visits: 2, then visits: 3
```

### Service Health
```bash
# Check all services
docker-compose ps

# Individual service health
docker-compose exec app curl http://localhost:5000/health
docker-compose exec redis redis-cli ping
docker-compose exec nginx nginx -t
```

## 🐛 Troubleshooting

### Common Issues and Solutions

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   sudo lsof -i :80
   sudo lsof -i :5000
   
   # Stop conflicting services
   sudo systemctl stop apache2  # or nginx
   ```

2. **Container Build Failures**
   ```bash
   # Clean rebuild
   make clean
   docker-compose build --no-cache
   ```

3. **Permission Issues**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   chmod +x deploy/scripts/entrypoint.sh
   ```

4. **Redis Connection Issues**
   ```bash
   # Check Redis is running
   docker-compose logs redis
   
   # Test Redis connection
   docker-compose exec redis redis-cli ping
   ```

## 📚 Key Learning Outcomes

### Docker Compose Concepts Mastered
1. **Service Orchestration**: Multi-container application coordination
2. **Environment Management**: Development vs Production configurations  
3. **Health Monitoring**: Container health checks and dependencies
4. **Volume Management**: Data persistence and sharing
5. **Network Security**: Service isolation and communication
6. **Load Balancing**: Nginx as reverse proxy

### Best Practices Implemented
1. **Multi-stage Builds**: Optimized container images
2. **Non-root Users**: Security best practices
3. **Environment Variables**: Configuration management
4. **Health Checks**: Application monitoring
5. **Development Workflow**: Hot-reloading and debugging
6. **Production Ready**: Resource limits and logging

## 🔄 Development vs Production

### Development Mode (`make dev`)
- Hot-reloading enabled
- Debug mode active
- Development dependencies installed
- Exposed ports for debugging
- Volume mounts for live code changes

### Production Mode (`make prod`)
- Optimized builds
- Security hardening
- Resource limits enforced
- Health monitoring enabled
- Log management configured

## 📖 Further Reading

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Flask Best Practices](https://flask.palletsprojects.com/en/2.3.x/)
- [Nginx Configuration Guide](https://nginx.org/en/docs/)
- [Redis Configuration](https://redis.io/documentation)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`make test && make lint`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Made with ❤️ for learning Docker Compose** 