# API Documentation

This document describes the available API endpoints in the Docker Compose Practice project.

## Base URL

All API endpoints are available at:
- Development: `http://localhost/`
- Production: `https://your-domain.com/` (when configured)

## Endpoints

### 1. Main Endpoint

Returns a welcome message and the current visit count.

```http
GET /
```

#### Response

```json
{
  "message": "Welcome to Docker Compose Practice",
  "visits": n,
  "served_by": {
    "hostname": "app-1",
    "container_id": "abc123",
    "instance": "app-1"
  }
}
```

#### Description
- Increments the visit counter in Redis
- Returns the current visit count
- Includes instance information for load balancing verification

### 2. Health Check

Returns the health status of the application and its dependencies.

```http
GET /health
```

#### Response

```json
{
  "status": "UP",
  "redis": "connected",
  "instance": {
    "container_id": "abc123",
    "hostname": "app-1",
    "service": "app-1"
  }
}
```

#### Description
- Checks application status
- Verifies Redis connection
- Returns instance information
- Used by Docker health checks

### 3. Visit Counter

Returns the current visit count without incrementing.

```http
GET /visits
```

#### Response

```json
{
  "visits": n
}
```

#### Description
- Reads the current visit count from Redis
- Does not increment the counter
- Useful for monitoring

## Error Responses

### 400 Bad Request

```json
{
  "error": "Bad Request",
  "message": "Invalid request parameters"
}
```

### 404 Not Found

```json
{
  "error": "Not Found",
  "message": "The requested resource was not found"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

## Rate Limiting

Currently, there is no rate limiting implemented. Future versions may include:
- Per-IP rate limiting
- Per-endpoint rate limiting
- Rate limit headers in responses

## Testing the API

### Using curl

```bash
# Test main endpoint
curl http://localhost/

# Test health check
curl http://localhost/health

# Test visit counter
curl http://localhost/visits
```

### Using Python requests

```python
import requests

# Test main endpoint
response = requests.get('http://localhost/')
print(response.json())

# Test health check
response = requests.get('http://localhost/health')
print(response.json())

# Test visit counter
response = requests.get('http://localhost/visits')
print(response.json())
```

## Monitoring

### Health Check Integration

The `/health` endpoint is used by Docker's health check system:

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

### Metrics

Future versions may include:
- Prometheus metrics endpoint
- Request timing information
- Resource usage statistics

## Security

### Headers

The API is served through Nginx with the following security headers:

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self'" always;
```

### Authentication

Currently, there is no authentication required. Future versions may include:
- API key authentication
- JWT token support
- OAuth2 integration

## Versioning

The API is currently at version 1. Future versions will be available at:
- `http://localhost/v2/`
- `http://localhost/v3/`

## Future Endpoints

Planned endpoints for future versions:

1. **Metrics**
   ```http
   GET /metrics
   ```

2. **Status**
   ```http
   GET /status
   ```

3. **Configuration**
   ```http
   GET /config
   ```

## Best Practices

1. **Error Handling**
   - Consistent error format
   - Descriptive error messages
   - Appropriate HTTP status codes

2. **Response Format**
   - JSON responses
   - Consistent structure
   - Clear field names

3. **Documentation**
   - OpenAPI/Swagger support (planned)
   - Example requests/responses
   - Clear endpoint descriptions 