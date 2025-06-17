# Docker Compose: Advanced Topics

## Multi-Environment Configuration

### 1. Environment-Specific Files
```yaml
# docker-compose.yml (base)
version: '3.8'
services:
  web:
    image: nginx
    ports:
      - "${PORT:-80}:80"
    environment:
      - NODE_ENV=${NODE_ENV:-production}
    deploy:
      resources:
        limits:
          cpus: '${CPU_LIMIT:-0.50}'
          memory: ${MEMORY_LIMIT:-512M}

# docker-compose.dev.yml
version: '3.8'
services:
  web:
    environment:
      - NODE_ENV=development
      - DEBUG=true
    volumes:
      - .:/app
      - /app/node_modules
    ports:
      - "3000:3000"
    command: npm run dev

# docker-compose.prod.yml
version: '3.8'
services:
  web:
    environment:
      - NODE_ENV=production
      - DEBUG=false
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### 2. Using Multiple Files
```bash
# Development
docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# Production
docker compose -f docker-compose.yml -f docker-compose.prod.yml up

# Staging
docker compose -f docker-compose.yml -f docker-compose.staging.yml up
```

## Service Dependencies

### 1. Condition-Based Dependencies
```yaml
services:
  web:
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
      cache:
        condition: service_completed_successfully
```

### 2. Health Checks
```yaml
services:
  db:
    image: postgres
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

  redis:
    image: redis
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 3

  web:
    image: nginx
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost"]
      interval: 30s
      timeout: 10s
      retries: 3
```

## Resource Management

### 1. CPU and Memory Limits
```yaml
services:
  web:
    deploy:
      resources:
        limits:
          cpus: '0.50'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
        window: 120s
```

### 2. Restart Policies
```yaml
services:
  web:
    restart: unless-stopped
    # Options:
    # - no: Never restart
    # - always: Always restart
    # - on-failure: Restart on failure
    # - unless-stopped: Restart unless stopped manually
```

## Networking

### 1. Custom Networks
```yaml
services:
  web:
    networks:
      - frontend
      - backend
    network_mode: bridge

  db:
    networks:
      - backend
    network_mode: bridge

networks:
  frontend:
    driver: bridge
    driver_opts:
      com.docker.network.bridge.name: frontend
    ipam:
      driver: default
      config:
        - subnet: 172.28.0.0/16
          gateway: 172.28.0.1

  backend:
    driver: bridge
    internal: true
    driver_opts:
      com.docker.network.bridge.name: backend
    ipam:
      driver: default
      config:
        - subnet: 172.29.0.0/16
          gateway: 172.29.0.1
```

### 2. Network Aliases
```yaml
services:
  web:
    networks:
      frontend:
        aliases:
          - web.local
          - www.local
      backend:
        aliases:
          - api.local

  api:
    networks:
      backend:
        aliases:
          - api.local
          - api.internal
```

## Volume Management

### 1. Named Volumes
```yaml
services:
  db:
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init:/docker-entrypoint-initdb.d
      - ./backup:/backup

volumes:
  postgres_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /path/on/host
    labels:
      - "com.example.description=Database volume"
      - "com.example.department=IT"
```

### 2. Volume Templates
```yaml
services:
  web:
    volumes:
      - ${VOLUME_NAME:-default}:/app/data
      - ${BACKUP_VOLUME:-backup}:/backup
      - ${CONFIG_VOLUME:-config}:/config
```

## Secrets Management

### 1. Docker Secrets
```yaml
services:
  web:
    secrets:
      - db_password
      - api_key
      - ssl_cert
    configs:
      - source: nginx_config
        target: /etc/nginx/nginx.conf

secrets:
  db_password:
    file: ./secrets/db_password.txt
  api_key:
    external: true
  ssl_cert:
    file: ./secrets/ssl/cert.pem

configs:
  nginx_config:
    file: ./nginx/nginx.conf
```

### 2. Environment Variables
```yaml
services:
  web:
    env_file:
      - .env.prod
      - .env
    environment:
      - NODE_ENV=production
      - DEBUG=false
      - DB_HOST=${DB_HOST}
      - DB_USER=${DB_USER}
      - DB_PASSWORD=${DB_PASSWORD}
```

## Scaling and Load Balancing

### 1. Service Scaling
```yaml
services:
  web:
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
        order: start-first
        failure_action: rollback
      rollback_config:
        parallelism: 0
        order: stop-first
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
        window: 120s
```

### 2. Load Balancer
```yaml
services:
  web:
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
      restart_policy:
        condition: on-failure
    networks:
      - webnet

  nginx:
    image: nginx
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    networks:
      - webnet
    depends_on:
      - web
```

## Development Workflow

### 1. Hot Reloading
```yaml
services:
  web:
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - CHOKIDAR_USEPOLLING=true
      - WATCHPACK_POLLING=true
    command: npm run dev
```

### 2. Debugging
```yaml
services:
  web:
    ports:
      - "9229:9229"
    environment:
      - NODE_ENV=development
      - DEBUG=*
    volumes:
      - .:/app
      - /app/node_modules
    command: npm run debug
```

## Production Considerations

### 1. Security
```yaml
services:
  web:
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
    read_only: true
    tmpfs:
      - /tmp
      - /var/run
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### 2. Logging
```yaml
services:
  web:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
        labels: "production_status"
        env: "os,customer"
        tag: "{{.Name}}/{{.ID}}"

  db:
    logging:
      driver: "syslog"
      options:
        syslog-address: "udp://192.168.0.42:123"
        syslog-facility: "daemon"
        tag: "database"
```

## Monitoring and Metrics

### 1. Health Monitoring
```yaml
services:
  web:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"
```

### 2. Metrics Collection
```yaml
services:
  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    volumes:
      - grafana_data:/var/lib/grafana
    depends_on:
      - prometheus

volumes:
  grafana_data:
```

## Backup and Recovery

### 1. Volume Backups
```yaml
services:
  backup:
    image: alpine
    volumes:
      - postgres_data:/source
      - ./backups:/backup
    command: |
      tar -czf /backup/postgres-$(date +%Y%m%d).tar.gz /source
```

### 2. Data Recovery
```yaml
services:
  restore:
    image: alpine
    volumes:
      - postgres_data:/target
      - ./backups:/backup
    command: |
      tar -xzf /backup/postgres-20230101.tar.gz -C /target
```

## Best Practices

### 1. Configuration Management
- Use environment variables
- Implement secrets management
- Use configuration files
- Version control your compose files
- Document your configuration

### 2. Security
- Use non-root users
- Implement security options
- Drop unnecessary capabilities
- Use read-only volumes
- Regular security updates
- Implement proper secrets management

### 3. Performance
- Set appropriate resource limits
- Use appropriate restart policies
- Implement health checks
- Monitor resource usage
- Optimize container images
- Use appropriate volume types

### 4. Maintenance
- Regular updates
- Backup strategies
- Monitoring setup
- Logging configuration
- Documentation
- Testing procedures

## Next Steps
1. Implement multi-environment setup
2. Set up CI/CD pipeline
3. Configure monitoring
4. Implement backup strategies
