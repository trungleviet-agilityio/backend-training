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
```

If you don't have Docker installed, visit: https://docs.docker.com/get-docker/

## Step 1: Clone and Navigate

```bash
# If you haven't already, navigate to the project
cd docker-learning/practice/docker-compose-practice

# Verify you're in the right place
ls -la
# You should see: docker-compose.yml, Makefile, src/, deploy/, etc.
```

## Step 2: Quick Start

Choose your preferred method:

### Option A: Using Make (Recommended)
```bash
# Start development environment
make dev
```

### Option B: Using Docker Compose Directly
```bash
# Start with development configuration
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
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
# Test main endpoint (should show visit counter)
curl http://localhost/

# Expected response:
# {"message": "Welcome to Docker Compose Practice", "visits": 1}

# Test health check
curl http://localhost/health

# Expected response:
# {"status": "UP", "redis": "connected"}
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

## Step 4: Explore the Application

### Visit in Browser
Open your browser and go to: http://localhost/

You should see a JSON response with a welcome message and visit counter.

### Test Multiple Visits
```bash
# Visit multiple times to see counter increment
curl http://localhost/ && echo
curl http://localhost/ && echo
curl http://localhost/ && echo

# Responses should show visits: 1, 2, 3, etc.
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

# Start production
make prod

# View logs
make logs

# Stop services
make down

# Clean everything
make clean

# Check status
docker-compose ps

# Access app container
docker-compose exec app /bin/sh

# Check Redis data
docker-compose exec redis redis-cli get visit_count
```

## 🎯 What You Just Built

You now have running:

1. **Flask Web Application** - Python API server with Redis integration
2. **Redis Database** - In-memory database storing visit counts
3. **Nginx Reverse Proxy** - Web server routing requests to Flask

The architecture demonstrates:
- Container orchestration with Docker Compose
- Service discovery and networking
- Health checks and monitoring
- Environment configuration management

## 🔧 Next Steps

### Explore the Code
```bash
# Look at the Flask application
cat src/main.py
cat src/app/__init__.py
cat src/app/routes.py

# Check Docker configurations
cat docker-compose.yml
cat deploy/docker/app/Dockerfile
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
docker-compose up --scale app=3
```

### Monitor Resources
```bash
# Check container resource usage
docker stats

# View detailed container info
docker-compose exec app ps aux
docker-compose exec app df -h
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
```

**Redis connection failed:**
```bash
# Check Redis is running
docker-compose exec redis redis-cli ping

# Should respond: PONG
```

### Getting Help

```bash
# Check service health
curl http://localhost/health

# Test individual services
docker-compose exec app curl http://localhost:5000/
docker-compose exec redis redis-cli ping
docker-compose exec nginx nginx -t
```

## 📚 Learn More

- **README.md** - Complete project documentation
- **docs/architecture.md** - System architecture details
- **docs/api.md** - API endpoint documentation
- **Makefile** - All available commands

## 🎉 Congratulations!

You've successfully set up a multi-container Docker application with:
- ✅ Flask web framework
- ✅ Redis database integration
- ✅ Nginx reverse proxy
- ✅ Docker Compose orchestration
- ✅ Health monitoring
- ✅ Development/Production environments

This project demonstrates real-world Docker Compose patterns you'll use in production applications! 