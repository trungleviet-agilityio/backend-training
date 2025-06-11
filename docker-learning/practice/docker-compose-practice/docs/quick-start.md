# Quick Start Guide

## 🚀 Get Running in 5 Minutes

This guide will get you up and running with the Docker Compose practice project in just a few minutes.

## Prerequisites Check

Before starting, make sure you have:

```bash
# Check Docker version (needs 20.10.0+)
docker --version

# Check Docker Compose version (needs 2.0.0+)
docker-compose --version

# Optional: Check if Make is available
make --version

# Useful tools for testing
curl --version && jq --version
```

If you don't have Docker installed, visit: https://docs.docker.com/get-docker/

## Step 1: Clone and Navigate

```bash
# If you haven't already, navigate to the project
cd docker-learning/practice/docker-compose-practice

# Verify you're in the right place
ls -la
# You should see: docker-compose.yml, Makefile, src/, deploy/, etc.

# ⚠️ Important: All Make commands must be run from this directory
pwd
# Should show: .../docker-compose-practice
```

## Step 2: Quick Start

Choose your preferred method:

### Option A: Using Make (Recommended)
```bash
# Start development environment
make dev

# Or start production environment
make prod

# Or test horizontal scaling (first time)
make clean && make scale-test

# Or scale up/down (after initial setup)
make scale-up    # Scale up to 5 instances
make scale-down  # Scale down to 1 instance
```

### Option B: Using Docker Compose Directly
```bash
# Start with development configuration
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Or start with production configuration
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Or test scaling (first time)
docker-compose down -v && docker-compose -f docker-compose.yml -f docker-compose.scale.yml up --scale app=3 -d

# Or scale up/down (after initial setup)
docker-compose -f docker-compose.yml -f docker-compose.scale.yml up --scale app=5 -d  # Scale up
docker-compose -f docker-compose.yml -f docker-compose.scale.yml up --scale app=1 -d  # Scale down
```

### Option C: Background Mode
```bash
# Start in background (detached mode)
make dev-bg
# or
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

## Step 3: Verify Everything Works

### Test the Application
```bash
# Test main endpoint (should show visit counter and instance info)
curl http://localhost/

# Expected response:
# {
#   "message": "Welcome to Docker Compose Practice",
#   "visits": N,
#   "served_by": {
#     "hostname": "xxx",
#     "container_id": "xxx",
#     "instance": "app-xxx"
#   }
# }

# Test health check
curl http://localhost/health

# Expected response:
# {
#   "status": "UP",
#   "redis": "connected",
#   "instance": {
#     "container_id": "xxx",
#     "hostname": "xxx",
#     "service": "app-xxx"
#   }
# }
```

### Check Container Status
```bash
# See all running containers
docker-compose ps

# Expected output:
# NAME                   STATUS         PORTS
# app_1                  Up (healthy)   5000/tcp
# nginx_1                Up (healthy)   0.0.0.0:80->80/tcp
# redis_1                Up (healthy)   6379/tcp
```

### Verify Network Setup
```bash
# Check the Docker network
docker network ls | grep app-network

# Inspect network details
docker network inspect app-network

# Should show app-network with 3 connected containers
```

## Step 4: Explore the Application

### Visit in Browser
Open your browser and go to: http://localhost/

You should see a JSON response with a welcome message, visit counter, and instance information.

### Test Multiple Visits
```bash
# Visit multiple times to see counter increment and load balancing
for i in {1..5}; do curl -s http://localhost/ | jq -r '.served_by.instance'; done

# Should show different app instances handling requests
```

### Test Service Communication
```bash
# Test internal connectivity
docker-compose exec app ping redis
docker-compose exec app ping nginx

# Check Redis data directly
docker-compose exec redis redis-cli get visit_count

# Check Nginx status
curl -s http://localhost/nginx-status
```

## Step 5: Check Logs (Optional)

```bash
# View all service logs
docker-compose logs

# View specific service logs
docker-compose logs app
docker-compose logs nginx
docker-compose logs redis

# Follow logs in real-time
docker-compose logs -f app
```

## Step 6: Stop When Done

```bash
# Stop all services
make down
# or
docker-compose down

# Stop and remove volumes (clears Redis data)
make clean
# or
docker-compose down -v
```

## ⚡ Quick Commands Reference

```bash
# Start development
make dev

# Start development in background
make dev-bg

# Start production
make prod

# Test scaling
make scale-test

# View logs
make logs

# Stop services
make down

# Clean everything (including volumes)
make clean

# Check status
docker-compose ps

# Access app container
docker-compose exec app /bin/sh

# Access Redis CLI
docker-compose exec redis redis-cli

# Check Redis data
docker-compose exec redis redis-cli get visit_count

# Test Nginx configuration
docker-compose exec nginx nginx -t

# Check Nginx status
curl -s http://localhost/nginx-status

# Inspect network
docker network inspect app-network
```

## 🎯 What You Just Built

You now have running:

1. **Flask Web Application** - Python API server with Redis integration
2. **Redis Database** - In-memory database storing visit counts
3. **Nginx Reverse Proxy** - Web server routing requests to Flask
4. **Load Balancing** - Automatic distribution of requests across instances

The architecture demonstrates:
- Container orchestration with Docker Compose
- Service discovery and networking on `app-network`
- Health checks and monitoring
- Environment configuration management
- Multi-service communication
- Horizontal scaling capabilities

### Network Details
- **Network Name**: `app-network`
- **Subnet**: `172.18.0.0/16`
- **Services**: All containers communicate internally using service names

## 🔧 Next Steps

### Explore the Code
```bash
# Look at the Flask application
cat src/main.py
cat src/app/__init__.py
cat src/app/routes.py

# Check Docker configurations
cat docker-compose.yml
cat docker-compose.scale.yml
cat deploy/docker/app/Dockerfile

# View network configuration
grep -A 5 "networks:" docker-compose.yml
```

### Try Different Environments
```bash
# Switch to production mode
make down
make prod

# Production uses optimized settings:
# - Gunicorn WSGI server
# - Resource limits
# - Security hardening
```

### Experiment with Scaling
```bash
# Scale the Flask app to multiple instances
make scale-test

# Test load balancing
for i in {1..10}; do curl -s http://localhost/ | jq -r '.served_by.instance'; done
```

### Monitor Resources
```bash
# Check container resource usage
docker stats

# View detailed container info
docker-compose exec app ps aux
docker-compose exec app df -h

# Monitor network traffic
docker-compose exec app netstat -tlnp
```

## 🐛 Troubleshooting

### Common Issues

**Port 80 already in use:**
```bash
# Check what's using port 80
sudo lsof -i :80

# Stop Apache/Nginx if running
sudo systemctl stop apache2
sudo systemctl stop nginx
```

**Permission denied:**
```bash
# Fix file permissions
sudo chown -R $USER:$USER .
chmod +x deploy/scripts/entrypoint.sh
```

**Container won't start:**
```bash
# Check container logs
docker-compose logs app

# Rebuild images
docker-compose build --no-cache

# Check system resources
docker system df
```

**Redis connection failed:**
```bash
# Check Redis is running
docker-compose exec redis redis-cli ping
# Should respond: PONG

# Test network connectivity
docker-compose exec app ping redis
```

**Network issues:**
```bash
# Check if network exists
docker network ls | grep app-network

# Inspect network configuration
docker network inspect app-network

# Test DNS resolution
docker-compose exec app nslookup redis
docker-compose exec app nslookup nginx
```

### Getting Help

```bash
# Check service health
curl http://localhost/health

# Test individual services
docker-compose exec app curl http://localhost:5000/
docker-compose exec redis redis-cli ping
docker-compose exec nginx nginx -t

# View health check status
docker-compose ps

# Inspect container health
docker inspect $(docker-compose ps -q app) | jq '.[0].State.Health'
```

## 📚 Learn More

- **[README.md](../README.md)** - Complete project documentation
- **[docs/architecture.md](architecture.md)** - System architecture details
- **[docs/api.md](api.md)** - API endpoint documentation
- **[docs/SCALING_GUIDE.md](SCALING_GUIDE.md)** - Horizontal scaling guide
- **[docs/PROJECT_VERIFICATION.md](PROJECT_VERIFICATION.md)** - Current working status
- **[Makefile](../Makefile)** - All available commands

## 🎉 Congratulations!

You've successfully set up a multi-container Docker application with:
- ✅ Flask web framework
- ✅ Redis database integration
- ✅ Nginx reverse proxy
- ✅ Docker Compose orchestration
- ✅ Health monitoring
- ✅ Development/Production environments
- ✅ Service networking on `app-network`
- ✅ Horizontal scaling capabilities

This project demonstrates real-world Docker Compose patterns you'll use in production applications!

## 🚀 What's Next?

- Try scaling services: `make scale-test`
- Explore the production configuration: `make prod`
- Study the network architecture: `docker network inspect app-network`
- Learn about health checks: `docker-compose ps`
- Read the full documentation to understand the architecture
 