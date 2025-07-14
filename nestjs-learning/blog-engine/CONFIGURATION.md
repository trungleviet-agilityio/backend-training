# Blog Engine - Configuration Guide

This guide explains how to configure the Blog Engine application for different environments.

## 📋 Environment Variables

### Application Configuration
```bash
# Environment: local | development | production
NODE_ENV=local

# Server port
PORT=3000
```

### Logging Configuration
```bash
# Log level: error | warn | log | debug | verbose
LOG_LEVEL=debug

# Enable console logging
LOG_CONSOLE=true

# Enable file logging (optional)
LOG_FILE=false
```

### Database Configuration
```bash
# Database type: sqlite | mysql | postgres
DB_TYPE=sqlite

# SQLite (recommended for development)
DB_DATABASE=./data/blog-engine-local.db

# MySQL/PostgreSQL (for production)
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=blog_user
DB_PASSWORD=your_secure_password
DB_DATABASE=blog_engine

# Database options
DB_SYNC=true         # Auto-sync schema (development only)
DB_LOGGING=true      # Log SQL queries
```

### Authentication Configuration
```bash
# JWT secrets (change in production!)
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=30d
```

### CORS Configuration
```bash
# Allowed origins (comma-separated)
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# Allow credentials
CORS_CREDENTIALS=true

# Allowed methods
CORS_METHODS=GET,HEAD,PUT,PATCH,POST,DELETE
```

### Rate Limiting
```bash
# Rate limit window (seconds)
RATE_LIMIT_TTL=60

# Max requests per window
RATE_LIMIT_MAX=100
```

## 🌍 Environment-Specific Configurations

### Local Development (.env.local)
```bash
NODE_ENV=local
PORT=3000
LOG_LEVEL=debug
LOG_CONSOLE=true
DB_TYPE=sqlite
DB_DATABASE=./data/blog-engine-local.db
DB_SYNC=true
DB_LOGGING=true
JWT_SECRET=local-dev-secret-change-me
JWT_EXPIRES_IN=24h
```

### Development (.env.development)
```bash
NODE_ENV=development
PORT=8000
LOG_LEVEL=debug
LOG_CONSOLE=true
DB_TYPE=sqlite
DB_DATABASE=./data/blog-engine-dev.db
DB_SYNC=true
DB_LOGGING=true
JWT_SECRET=dev-secret-change-me
JWT_EXPIRES_IN=8h
```

### Production (.env.production)
```bash
NODE_ENV=production
PORT=3000
LOG_LEVEL=warn
LOG_CONSOLE=false
LOG_FILE=true
DB_TYPE=postgres
DB_HOST=your-db-host
DB_PORT=5432
DB_USERNAME=your-db-user
DB_PASSWORD=your-secure-password
DB_DATABASE=blog_engine_prod
DB_SYNC=false
DB_LOGGING=false
JWT_SECRET=your-production-jwt-secret
JWT_EXPIRES_IN=1h
```

## 🔧 Configuration Features

### Dynamic Module Configuration

The application uses NestJS dynamic modules for flexible configuration:

#### Global Modules (forRoot)
```typescript
// Configuration Module
ConfigModule.forRoot({
  isGlobal: true,
  envFiles: ['.env.local', '.env'],
  cache: true,
  expandVariables: true,
})

// Database Module
DatabaseModule.forRoot({
  isGlobal: true,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  extra: {
    connectionLimit: 10,
    acquireTimeout: 60000,
    timeout: 60000,
  },
})

// Auth Module
AuthModule.forRoot({
  isGlobal: true,
  jwt: { global: true },
  strategies: ['jwt'],
  defaultStrategy: 'jwt',
})
```

#### Feature Modules (register)
```typescript
// Users Module
UsersModule.register({
  enableValidation: true,
  enableCaching: true,
  pagination: {
    defaultLimit: 10,
    maxLimit: 100,
  },
  features: {
    enableProfile: true,
    enableAvatar: false,
  },
})

// Blogs Module
BlogsModule.register({
  enableCaching: true,
  enableSearch: true,
  enableComments: true,
  pagination: {
    defaultLimit: 10,
    maxLimit: 100,
  },
  features: {
    enableDrafts: true,
    enableScheduling: false,
    enableAnalytics: true,
  },
})
```

### Environment-Based Service Selection

The application automatically selects the appropriate configuration service:

```typescript
// Local environment
export class LocalConfigService {
  getDatabaseConfig() {
    return {
      type: 'sqlite',
      database: './data/blog-engine-local.db',
      synchronize: true,
      logging: true,
    };
  }
}

// Production environment
export class ProductionConfigService {
  getDatabaseConfig() {
    return {
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: false,
      logging: false,
    };
  }
}
```

## 🚀 Quick Setup

### 1. Local Development
```bash
# Create local environment file
echo "NODE_ENV=local
PORT=3000
LOG_LEVEL=debug
LOG_CONSOLE=true
DB_TYPE=sqlite
DB_DATABASE=./data/blog-engine-local.db
DB_SYNC=true
DB_LOGGING=true
JWT_SECRET=local-dev-secret-change-me
JWT_EXPIRES_IN=24h" > .env.local

# Start development server
npm run start:dev
```

### 2. Production Deployment
```bash
# Set production environment variables
export NODE_ENV=production
export DB_TYPE=postgres
export DB_HOST=your-db-host
export DB_USERNAME=your-db-user
export DB_PASSWORD=your-secure-password
export JWT_SECRET=your-production-jwt-secret

# Build and start
npm run build
npm run start:prod
```

## 🔍 Configuration Validation

The application validates configuration on startup:

```typescript
// Environment validation
const requiredEnvVars = [
  'NODE_ENV',
  'JWT_SECRET',
  'DB_TYPE',
];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Required environment variable ${envVar} is not set`);
  }
});
```

## 📊 Configuration Monitoring

The application provides configuration information through:

### Health Check Endpoint
```http
GET /api/v1/health
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "service": "Blog Engine API",
  "version": "1.0.0",
  "environment": "local",
  "database": "connected"
}
```

### Configuration Endpoint (Development Only)
```http
GET /api/v1/config
{
  "environment": "local",
  "database": {
    "type": "sqlite",
    "synchronize": true
  },
  "logging": {
    "level": "debug",
    "console": true
  }
}
```

## 🔒 Security Considerations

1. **Never commit secrets**: Use environment variables for sensitive data
2. **Rotate secrets regularly**: Especially JWT secrets in production
3. **Use strong passwords**: For database and service accounts
4. **Limit CORS origins**: Don't use wildcards (*) in production
5. **Enable rate limiting**: Protect against abuse
6. **Use HTTPS**: Always use SSL/TLS in production

## 🛠️ Troubleshooting

### Common Configuration Issues

1. **Database Connection Failed**
   ```bash
   # Check database configuration
   echo $DB_HOST $DB_PORT $DB_USERNAME
   
   # Test database connectivity
   npm run db:test
   ```

2. **JWT Authentication Issues**
   ```bash
   # Verify JWT secret is set
   echo $JWT_SECRET
   
   # Check token expiration
   echo $JWT_EXPIRES_IN
   ```

3. **CORS Issues**
   ```bash
   # Check allowed origins
   echo $CORS_ORIGIN
   
   # Verify credentials setting
   echo $CORS_CREDENTIALS
   ```

### Debug Mode

Enable debug mode for detailed logging:

```bash
# Enable debug logging
LOG_LEVEL=debug
LOG_CONSOLE=true

# Additional debug information
DEBUG_MODE=true
```

This configuration guide ensures your Blog Engine application runs optimally in any environment! 