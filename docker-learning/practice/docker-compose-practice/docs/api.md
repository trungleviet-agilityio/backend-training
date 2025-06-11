# API Documentation

## Endpoints

### Health Check
```http
GET /health
```
Returns the health status of the application and its dependencies.

**Response**
```json
{
    "status": "UP",
    "redis": "connected"
}
```

### Index
```http
GET /
```
Returns a welcome message and visit counter.

**Response**
```json
{
    "message": "Welcome to Docker Compose Practice",
    "visits": 1
}
```

## Error Responses

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

The API implements rate limiting to prevent abuse:
- 100 requests per minute per IP
- 1000 requests per hour per IP

When rate limit is exceeded:
```json
{
    "error": "Too Many Requests",
    "message": "Rate limit exceeded"
}
```

## Authentication

Currently, the API is public and does not require authentication. Future versions may implement:
- JWT authentication
- API key authentication
- OAuth2 integration

## Caching

The API implements caching for certain endpoints:
- Health check: 30 seconds
- Index page: 5 minutes

Cache headers are included in responses:
```http
Cache-Control: public, max-age=300
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

## Monitoring

The API includes monitoring endpoints:

### Metrics
```http
GET /metrics
```
Returns Prometheus-compatible metrics.

### Status
```http
GET /status
```
Returns detailed service status information.

## Development

### Local Development
```bash
# Start development server
make dev

# Run tests
make test

# Check API documentation
make docs
```

### API Testing
```bash
# Run API tests
pytest tests/api/

# Run with coverage
pytest tests/api/ --cov=app
``` 