# API Documentation

## Overview

This document describes the REST API endpoints provided by the Docker Compose Practice Flask application. The API demonstrates Redis integration, health monitoring, and container-to-container communication within a Docker Compose environment.

## Base URL

- **Development**: `http://localhost/` (via Nginx proxy)
- **Direct Access**: `http://localhost:5000/` (Flask development server)
- **Production**: `http://localhost/` (via Nginx proxy)

## Authentication

Currently, this API does not require authentication. This is designed for learning purposes and should not be used in production without proper authentication mechanisms.

## Endpoints

### 1. Welcome Endpoint

**Get Welcome Message with Visit Counter**

```http
GET /
```

#### Description
Returns a welcome message along with the current visit count. Each request increments the visit counter stored in Redis.

#### Response

**Success Response**
- **Code**: `200 OK`
- **Content Type**: `application/json`

```json
{
  "message": "Welcome to Docker Compose Practice",
  "visits": 1
}
```

#### Example Usage

```bash
# First visit
curl http://localhost/
# Response: {"message": "Welcome to Docker Compose Practice", "visits": 1}

# Second visit
curl http://localhost/
# Response: {"message": "Welcome to Docker Compose Practice", "visits": 2}
```

#### Implementation Details
- Uses Redis `INCR` command for atomic counter increment
- Counter persists across container restarts (with Redis volume)
- Thread-safe for concurrent requests
- Redis key: `visit_count`

---

### 2. Health Check Endpoint

**Check Application and Dependencies Health**

```http
GET /health
```

#### Description
Provides health status information for the application and its dependencies. Used by Docker health checks and monitoring systems.

#### Response

**Success Response**
- **Code**: `200 OK`
- **Content Type**: `application/json`

```json
{
  "status": "UP",
  "redis": "connected"
}
```

**Error Response (Redis Unavailable)**
- **Code**: `503 Service Unavailable`
- **Content Type**: `application/json`

```json
{
  "status": "DOWN",
  "redis": "disconnected",
  "error": "Redis connection failed"
}
```

#### Example Usage

```bash
# Healthy system
curl http://localhost/health
# Response: {"status": "UP", "redis": "connected"}

# When Redis is down
curl http://localhost/health
# Response: {"status": "DOWN", "redis": "disconnected", "error": "..."}
```

#### Health Check Criteria
- **UP**: Application is running and Redis is accessible
- **DOWN**: Application is running but Redis is inaccessible
- **No Response**: Application container is not running

---

## Error Handling

### Standard Error Response Format

```json
{
  "error": "Error description",
  "status": "error_type",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Common HTTP Status Codes

| Status Code | Description | When It Occurs |
|-------------|-------------|----------------|
| `200` | OK | Successful request |
| `404` | Not Found | Invalid endpoint |
| `500` | Internal Server Error | Application error |
| `503` | Service Unavailable | Redis connection failed |

---

## Redis Integration Details

### Data Storage

The application uses Redis for the following purposes:

1. **Visit Counter**: 
   - Key: `visit_count`
   - Type: Integer
   - Operation: `INCR visit_count`

2. **Future Enhancements** (not implemented):
   - Session storage
   - Caching layer
   - Rate limiting counters

### Redis Connection

```python
import redis

# Connection configuration
redis_client = redis.Redis(
    host=os.getenv('REDIS_HOST', 'localhost'),
    port=int(os.getenv('REDIS_PORT', 6379)),
    db=0,
    decode_responses=True
)
```

### Error Handling

The application handles Redis connection errors gracefully:
- Connection timeouts
- Redis server unavailable
- Network issues between containers

---

## Docker Compose Integration

### Service Communication

The API demonstrates several Docker Compose concepts:

1. **Service Discovery**: Flask connects to Redis using service name `redis`
2. **Network Isolation**: Services communicate on internal network
3. **Health Checks**: Docker monitors application health via `/health` endpoint
4. **Load Balancing**: Nginx proxies requests to Flask backend

### Environment Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `REDIS_HOST` | Redis server hostname | `localhost` | `redis` |
| `REDIS_PORT` | Redis server port | `6379` | `6379` |
| `FLASK_ENV` | Flask environment | `development` | `production` |
| `FLASK_DEBUG` | Debug mode | `False` | `True` |

---

## Testing the API

### Manual Testing

```bash
# Test welcome endpoint
curl -X GET http://localhost/

# Test health endpoint
curl -X GET http://localhost/health

# Test with verbose output
curl -v http://localhost/

# Test response headers
curl -I http://localhost/
```

### Automated Testing

```bash
# Using HTTPie
http GET localhost/
http GET localhost/health

# Using wget
wget -qO- http://localhost/
wget -qO- http://localhost/health

# Using Python requests
python3 -c "
import requests
response = requests.get('http://localhost/')
print(response.json())
"
```

### Load Testing

```bash
# Simple load test with curl
for i in {1..10}; do
  curl -s http://localhost/ | jq .visits
done

# Using Apache Bench (if installed)
ab -n 100 -c 10 http://localhost/
```

---

## Development and Debugging

### Logging

The application provides logging for debugging:

```bash
# View application logs
docker-compose logs app

# Follow logs in real-time
docker-compose logs -f app

# View all service logs
docker-compose logs
```

### Direct Container Access

```bash
# Access Flask app container
docker-compose exec app /bin/sh

# Test internal endpoints
docker-compose exec app curl http://localhost:5000/health

# Access Redis container
docker-compose exec redis redis-cli

# Check Redis data
docker-compose exec redis redis-cli GET visit_count
```

### Redis Debugging

```bash
# Monitor Redis commands
docker-compose exec redis redis-cli monitor

# Check Redis info
docker-compose exec redis redis-cli info

# List all keys
docker-compose exec redis redis-cli keys "*"
```

---

## Performance Considerations

### Response Times
- **Welcome Endpoint**: ~5-10ms (Redis operation)
- **Health Check**: ~2-5ms (Redis ping)

### Throughput
- **Concurrent Users**: Scales with Gunicorn workers
- **Redis Performance**: Handles thousands of operations/second
- **Nginx**: Efficient static content serving

### Caching Headers

Nginx adds appropriate caching headers for static content:

```nginx
# Static files
location /static/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# API responses (no cache)
location / {
    add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

---

## Security Considerations

### Current Security Measures
- Internal network isolation
- No sensitive data exposure
- Basic security headers via Nginx

### Production Recommendations
- Add authentication/authorization
- Implement rate limiting
- Add input validation
- Use HTTPS with SSL certificates
- Implement CORS policies
- Add request logging and monitoring

---

## API Versioning

Currently, this is a single-version API. For production applications, consider:

```http
# Version in URL
GET /api/v1/health

# Version in headers
GET /health
Accept: application/vnd.api+json;version=1
```

---

## Future Enhancements

Potential API improvements for learning purposes:

1. **User Sessions**
   ```http
   POST /sessions
   DELETE /sessions/{id}
   ```

2. **Visit Analytics**
   ```http
   GET /analytics/visits
   GET /analytics/visits/daily
   ```

3. **Configuration**
   ```http
   GET /config
   PUT /config
   ```

4. **Cache Management**
   ```http
   DELETE /cache
   POST /cache/clear
   ```

This API serves as a foundation for understanding Docker Compose, Redis integration, and containerized application development. 