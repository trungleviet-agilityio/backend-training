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
- **Database**: PostgreSQL with Docker Compose for development and testing
- **E2E Testing**: Comprehensive test suite with real database integration

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
// PostgreSQL with environment-specific settings
database: {
  type: 'postgres',                  // PostgreSQL for all environments
  host: 'localhost',
  port: 5434,                        // 5434 for dev, 5435 for test
  username: 'postgres',
  password: 'postgres',
  database: 'blog_engine_dev',       // blog_engine_dev or blog_engine_test
  synchronize: true,                 // Auto-sync in development
  logging: true,                     // SQL query logging
}
```

### Docker Services
- **Development DB**: PostgreSQL on `localhost:5434`
- **Test DB**: PostgreSQL on `localhost:5435`
- **Redis**: Cache on `localhost:6379`
- **PgAdmin**: Web UI on `localhost:8080`

## 🚀 Quick Start

### 1. Prerequisites
- Docker & Docker Compose
- Node.js 18+
- npm or yarn

### 2. Installation & Setup
```bash
# Clone the repository
git clone <repository-url>
cd blog-engine

# Install dependencies
npm install

# Run the automated demo setup (recommended)
./scripts/demo-setup.sh
```

### 3. Database Setup (PostgreSQL with Docker)
```bash
# Start development database (port 5434)
npm run db:dev

# Start test database (port 5435)
npm run db:test

# Start PgAdmin web interface (port 8080)
npm run db:pgadmin

# Stop all services
npm run docker:down
```

### 4. Development
```bash
# Start development server with hot reload
npm run start:dev

# Build for production
npm run build

# Start production server
npm run start:prod
```

### 5. Testing
```bash
# Unit tests
npm run test
npm run test:watch
npm run test:cov

# E2E tests (with PostgreSQL)
npm run test:e2e:auth          # Auth module tests
npm run test:e2e               # All e2e tests
npm run test:e2e:coverage      # E2E with coverage

# Automated test setup with database
./scripts/test-setup.sh auth
./scripts/test-setup.sh all
```

📚 **For detailed setup instructions, see [DOCKER-SETUP.md](./DOCKER-SETUP.md)**

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

**Built with ❤️ using NestJS, TypeScript
