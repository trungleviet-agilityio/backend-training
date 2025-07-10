# Blog Engine - Enterprise NestJS Application

An enterprise-grade blog engine built with NestJS, following advanced patterns and best practices for production-ready applications.

## 🚀 Features

- **Enterprise Architecture**: Clean, scalable codebase following NestJS best practices
- **Dynamic Module System**: Configurable modules with `forRoot()`, `register()`, and `forFeature()` patterns
- **Request Context Management**: REQUEST-scoped services for proper request lifecycle management
- **Enhanced Logging**: Structured logging with component-based context and audit trails
- **Type Safety**: Complete TypeScript implementation with strong typing
- **Security**: JWT authentication, role-based authorization, rate limiting
- **Performance**: Caching, connection pooling, and optimized database queries
- **Monitoring**: Health checks, audit logging, and comprehensive error tracking

## 🏗️ Architecture Overview

### 📁 Folder Structure
```
src/
├── 📱 main.ts                    # Application bootstrap with enhanced setup
├── 🎮 app.module.ts             # Root module with dynamic imports
├── 🎯 app.controller.ts         # Health checks and application info
├── 🔧 app.service.ts            # Core application services
│
├── 📁 core/                     # Framework-level Infrastructure
│   ├── guards/                  # Auth, roles, permissions, rate-limit
│   ├── pipes/                   # Validation, transformation
│   ├── decorators/              # Custom decorators (@CurrentUser, @Roles)
│   ├── middleware/              # Request logging, CORS, error handling
│   ├── exceptions/              # Custom exception classes
│   ├── logger/                  # Enhanced logging system
│   └── index.ts                 # Organized barrel exports
│
├── 📁 commons/                  # Shared Business Logic
│   ├── context/                 # REQUEST-scoped context management
│   │   ├── services/           # RequestContext, Audit, UserCache
│   │   ├── interceptors/       # AuditFlush interceptor
│   │   └── context.module.ts   # Global context module
│   ├── interfaces/              # Common business interfaces
│   ├── constants/               # Application constants & DI tokens
│   ├── types/                   # Type definitions
│   ├── utils/                   # Utility functions
│   └── index.ts                 # Comprehensive exports
│
├── 📁 config/                   # Configuration Management
│   ├── environments/            # Environment-specific configs
│   │   ├── local.environment.ts
│   │   ├── development.environment.ts
│   │   ├── production.environment.ts
│   │   └── environment.factory.ts
│   ├── services/                # Config service implementations
│   ├── interfaces/              # Configuration interfaces
│   ├── providers/               # Environment-based providers
│   └── config.module.ts         # Dynamic configuration module
│
├── 📁 database/                 # Database Layer
│   ├── entities/                # Base entity with common fields
│   ├── providers/               # Database connection providers
│   ├── interfaces/              # Database interfaces
│   └── database.module.ts       # Dynamic database module
│
├── 📁 shared/                   # Cross-cutting Concerns
│   └── shared.module.ts         # Shared constants and services
│
└── 📁 modules/                  # Feature Modules
    ├── auth/                    # JWT Authentication & Authorization
    │   ├── strategies/          # Passport strategies
    │   ├── dto/                # Auth DTOs
    │   ├── interfaces/         # Auth interfaces
    │   └── auth.module.ts      # Dynamic auth module
    ├── users/                   # User Management
    │   ├── entities/           # User entity
    │   ├── dto/                # User DTOs
    │   ├── interfaces/         # User interfaces
    │   └── users.module.ts     # Dynamic users module
    └── blogs/                   # Blog Management
        ├── entities/           # Blog entity
        ├── dto/                # Blog DTOs
        ├── interfaces/         # Blog interfaces
        └── blogs.module.ts     # Dynamic blogs module
```

### 🎯 Enterprise Patterns Implemented

#### 1. **Dynamic Module Configuration**
```typescript
// Global singleton configuration
ConfigModule.forRoot({
  isGlobal: true,
  envFiles: ['.env.local', '.env'],
  cache: true,
  expandVariables: true,
})

// Per-module configuration
UsersModule.register({
  enableValidation: true,
  enableCaching: true,
  pagination: { defaultLimit: 10, maxLimit: 100 },
  features: { enableProfile: true, enableAvatar: false },
})

// Entity-specific imports
TypeOrmModule.forFeature([User, Blog])
```

#### 2. **REQUEST-Scoped Context Management**
```typescript
@Injectable({ scope: Scope.REQUEST })
export class RequestContextService {
  private readonly requestId: string;
  private userId?: string;
  private readonly metadata: Map<string, any>;
  // ... advanced context management
}
```

#### 3. **Enhanced Logging System**
```typescript
// Structured logging with emojis (dev) and JSON (prod)
logger.debug('🎯 Context created', {
  requestId: this.requestId,
  component: 'CONTEXT',
  action: 'CREATE',
  metadata: { userId: 'user123' }
});
```

#### 4. **Comprehensive Security**
```typescript
// Multi-layered security guards
@UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard, RateLimitGuard)
@Roles('admin', 'moderator')
@Permissions('blogs:write', 'blogs:publish')
export class BlogsController {
  // ... protected endpoints
}
```

## 🔧 Configuration

### Environment Files
```bash
# Local Development
.env.local              # Local overrides
.env                    # Default values

# Environment-specific
NODE_ENV=local|development|production
LOG_LEVEL=debug|info|warn|error
LOG_CONSOLE=true|false
DB_TYPE=sqlite|mysql|postgres
PORT=3000
```

### Database Configuration
```typescript
// Multi-database support
database: {
  type: 'sqlite',                    // sqlite|mysql|postgres
  database: './data/blog-engine.db', // file path or database name
  host: 'localhost',
  port: 3306,
  username: 'user',
  password: 'password',
  synchronize: true,                 // Auto-sync in development
  logging: true,                     // SQL query logging
}
```

## 🚀 Quick Start

### 1. Installation
```bash
# Clone the repository
git clone <repository-url>
cd blog-engine

# Install dependencies
npm install
```

### 2. Environment Setup
```bash
# Copy example environment file
cp .env.example .env.local

# Edit configuration
nano .env.local
```

### 3. Development
```bash
# Start development server with hot reload
npm run start:dev

# Build for production
npm run build

# Start production server
npm run start:prod
```

### 4. Testing
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📡 API Endpoints

### 🔒 Authentication
```http
POST   /api/v1/auth/login        # User login
POST   /api/v1/auth/register     # User registration
POST   /api/v1/auth/refresh      # Refresh token
GET    /api/v1/auth/profile      # Get user profile
```

### 👥 Users Management
```http
GET    /api/v1/users             # List users (paginated)
GET    /api/v1/users/:id         # Get user by ID
POST   /api/v1/users             # Create user (admin)
PATCH  /api/v1/users/:id         # Update user
DELETE /api/v1/users/:id         # Soft delete user
```

### 📝 Blog Management
```http
GET    /api/v1/blogs             # List published blogs (paginated)
GET    /api/v1/blogs/my-blogs    # Current user's blogs
GET    /api/v1/blogs/:id         # Get blog by ID
POST   /api/v1/blogs             # Create blog
PATCH  /api/v1/blogs/:id         # Update blog
POST   /api/v1/blogs/:id/publish # Publish blog
POST   /api/v1/blogs/:id/like    # Like/unlike blog
DELETE /api/v1/blogs/:id         # Delete blog
```

### 📊 System Endpoints
```http
GET    /api/v1/health            # Health check
GET    /api/v1/docs              # Swagger documentation
GET    /api/v1/                  # Application info
```

## 🛡️ Security Features

- **JWT Authentication**: Stateless authentication with refresh tokens
- **Role-Based Access Control**: Admin, moderator, user roles
- **Permission-Based Authorization**: Granular permissions system
- **Rate Limiting**: Configurable request rate limiting
- **Input Validation**: Comprehensive DTO validation
- **SQL Injection Protection**: TypeORM parameterized queries
- **CORS Configuration**: Configurable cross-origin requests

## 📈 Monitoring & Observability

### Structured Logging
```typescript
// Development: Human-readable with emojis
🎯 Context created | RequestID: abc123 | Component: CONTEXT

// Production: Machine-readable JSON
{"level":"debug","timestamp":"2024-01-01T12:00:00Z","requestId":"abc123","component":"CONTEXT","action":"CREATE"}
```

### Health Checks
```http
GET /api/v1/health
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "service": "Blog Engine API",
  "version": "1.0.0"
}
```

### Audit Logging
- User authentication events
- Authorization attempts
- Data modifications
- Security events
- Performance metrics

## 🔄 Development Workflow

### Code Quality
```bash
# Linting
npm run lint

# Formatting
npm run format

# Type checking
npm run type-check
```

### Database Management
```bash
# Generate migration
npm run migration:generate

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert
```

## 📚 Architecture Benefits

### 🎯 **Scalability**
- Modular architecture for easy feature addition
- REQUEST-scoped services for proper isolation
- Connection pooling and caching strategies

### 🔒 **Security**
- Multi-layered security implementation
- Comprehensive audit logging
- Input validation and sanitization

### 🛠️ **Maintainability**
- Clean code architecture
- Comprehensive TypeScript typing
- Extensive documentation and comments

### ⚡ **Performance**
- Efficient database queries
- User-specific caching
- Request lifecycle optimization

### 🔍 **Observability**
- Structured logging system
- Request correlation IDs
- Performance monitoring

## 🤝 Contributing

1. **Follow the established patterns**
   - Use dynamic modules with proper configuration
   - Implement REQUEST-scoped services where appropriate
   - Follow the logging and error handling patterns

2. **Code Standards**
   - Use TypeScript strict mode
   - Follow NestJS best practices
   - Implement comprehensive error handling
   - Add proper JSDoc documentation

3. **Testing Requirements**
   - Unit tests for all services
   - Integration tests for controllers
   - E2E tests for critical workflows

4. **Security Considerations**
   - Validate all inputs
   - Implement proper authorization
   - Log security events
   - Follow OWASP guidelines

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using NestJS, TypeScript, and Enterprise Best Practices**
