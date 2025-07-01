# URL Shortener Project

## Overview
Build a URL shortening service similar to Bit.ly, TinyURL, or Google URL shortener. This project implements the concepts learned from Chapter 8 of the System Design Interview book.

## Features to Implement

### Core Features
- [ ] **URL Shortening**: Convert long URLs to short URLs
- [ ] **URL Redirection**: Redirect short URLs to original URLs
- [ ] **Custom URLs**: Allow users to create custom short URLs
- [ ] **Analytics**: Track click counts and basic analytics
- [ ] **URL Validation**: Validate input URLs

### Advanced Features
- [ ] **User Authentication**: User registration and login
- [ ] **URL Management**: Users can manage their shortened URLs
- [ ] **Expiration**: Set expiration dates for URLs
- [ ] **Geographic Analytics**: Track clicks by location
- [ ] **API Access**: RESTful API for programmatic access

## Technical Requirements

### System Design
- **Scale**: Handle 100M URLs, 1000 QPS
- **URL Length**: 6-8 characters for short URLs
- **Storage**: 500 bytes per URL record
- **Read/Write Ratio**: 100:1 (mostly reads)

### Architecture Components
1. **Web Server**: Handle HTTP requests
2. **Application Server**: Business logic
3. **Database**: Store URL mappings
4. **Cache**: Redis for frequently accessed URLs
5. **Load Balancer**: Distribute traffic

### Database Schema
```sql
-- URLs table
CREATE TABLE urls (
    id BIGINT PRIMARY KEY,
    short_url VARCHAR(8) UNIQUE NOT NULL,
    long_url TEXT NOT NULL,
    user_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    click_count BIGINT DEFAULT 0,
    INDEX idx_short_url (short_url),
    INDEX idx_user_id (user_id)
);

-- Users table (for authentication)
CREATE TABLE users (
    id BIGINT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics table
CREATE TABLE url_analytics (
    id BIGINT PRIMARY KEY,
    url_id BIGINT NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    referrer TEXT,
    clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_url_id (url_id),
    INDEX idx_clicked_at (clicked_at)
);
```

## Implementation Steps

### Phase 1: Basic URL Shortener
1. **Set up project structure**
2. **Implement URL shortening algorithm**
3. **Create basic web interface**
4. **Add database storage**
5. **Implement URL redirection**

### Phase 2: Enhanced Features
1. **Add user authentication**
2. **Implement custom URLs**
3. **Add basic analytics**
4. **Create API endpoints**

### Phase 3: Advanced Features
1. **Add caching layer**
2. **Implement URL expiration**
3. **Add geographic analytics**
4. **Performance optimization**

## URL Shortening Algorithm

### Option 1: Hash + Collision Resolution
```python
def generate_short_url(long_url):
    # Generate hash
    hash_value = hashlib.md5(long_url.encode()).hexdigest()
    short_url = hash_value[:8]

    # Check for collision and resolve
    while url_exists(short_url):
        short_url = generate_new_hash(long_url, short_url)

    return short_url
```

### Option 2: Base62 Encoding
```python
def generate_short_url(long_url):
    # Use auto-increment ID
    url_id = get_next_id()

    # Convert to base62
    characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    short_url = ""

    while url_id > 0:
        short_url = characters[url_id % 62] + short_url
        url_id //= 62

    return short_url
```

## API Endpoints

### Core Endpoints
```
POST /api/v1/urls          # Create short URL
GET  /api/v1/urls/{id}     # Get URL details
GET  /{short_url}          # Redirect to original URL
GET  /api/v1/analytics/{id} # Get URL analytics
```

### User Management
```
POST /api/v1/users/register # User registration
POST /api/v1/users/login    # User login
GET  /api/v1/users/urls     # Get user's URLs
```

## Technology Stack Suggestions

### Backend
- **Language**: Python (Flask/Django) or Node.js (Express)
- **Database**: PostgreSQL or MySQL
- **Cache**: Redis
- **Queue**: RabbitMQ or Redis (for analytics)

### Frontend
- **Framework**: React, Vue.js, or simple HTML/CSS/JS
- **Styling**: Bootstrap or Tailwind CSS

### Deployment
- **Container**: Docker
- **Cloud**: AWS, Google Cloud, or Heroku
- **Load Balancer**: Nginx or cloud load balancer

## Performance Considerations

### Caching Strategy
- **Hot URLs**: Cache frequently accessed URLs in Redis
- **TTL**: Set appropriate cache expiration
- **Cache Invalidation**: Update cache on URL modifications

### Database Optimization
- **Indexing**: Index on short_url and user_id
- **Sharding**: Shard by user_id for large scale
- **Read Replicas**: Use read replicas for analytics queries

### Monitoring
- **Metrics**: QPS, response time, error rate
- **Logging**: Request logs, error logs
- **Alerts**: High error rate, slow response time

## Testing Strategy

### Unit Tests
- URL generation algorithms
- Database operations
- API endpoints

### Integration Tests
- End-to-end URL shortening flow
- Authentication flow
- Analytics tracking

### Load Tests
- High QPS testing
- Database performance under load
- Cache hit rate testing

## Security Considerations

### Input Validation
- Validate URL format
- Prevent SQL injection
- Sanitize user inputs

### Rate Limiting
- Limit URL creation per user
- Prevent abuse with rate limiting

### Access Control
- User authentication for custom URLs
- API key management for programmatic access

## Next Steps
1. Choose your technology stack
2. Set up development environment
3. Start with Phase 1 implementation
4. Gradually add advanced features
5. Deploy and monitor

## Resources
- [Chapter 8 Notes](../../reading/system-design-interview/chapter-08-design-a-url-shortener/notes.md)
- [System Design Interview Book](https://www.amazon.com/System-Design-Interview-Insiders-Guide/dp/1736049119)
