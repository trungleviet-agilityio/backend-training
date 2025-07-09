# Blog Engine - NestJS Application

A modern blog engine built with NestJS, following best practices and design patterns.

## 🏗️ Architecture & Best Practices

### Folder Structure
```
src/
├── core/                   # Core utilities, decorators, guards, pipes
│   ├── decorators/        # Custom decorators
│   ├── exceptions/        # Custom exceptions
│   ├── guards/           # Authentication & authorization guards
│   └── pipes/            # Validation & transformation pipes
├── config/                # Configuration management
├── database/              # Database configuration & migrations
├── middleware/            # Custom middleware
├── modules/               # Feature modules
│   ├── auth/             # Authentication module
│   ├── blogs/            # Blog management module
│   └── users/            # User management module
├── shared/               # Shared interfaces and utilities
│   └── interfaces/       # Common interfaces
└── main.ts              # Application entry point
```

### Type Safety Improvements

All `any` types have been replaced with proper interfaces:

#### 1. JWT Payload Interface
```typescript
export interface IJwtPayload {
  sub: string;
  id: string;
  email: string;
  username: string;
  role: string;
  iat?: number;
  exp?: number;
}
```

#### 2. Request Interface
```typescript
export interface IRequest extends Request {
  user?: IJwtPayload;
}
```

#### 3. Validation Details Interface
```typescript
export interface IValidationDetails {
  field?: string;
  value?: unknown;
  message?: string;
  code?: string;
  [key: string]: unknown;
}
```

#### 4. API Response Interface
```typescript
export interface IApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode: number;
  timestamp: string;
  path: string;
}
```

### NestJS Best Practices Applied

#### 1. **Dependency Injection**
- All services use `@Injectable()` decorator
- Proper constructor injection
- Repository pattern with TypeORM

#### 2. **Module Organization**
- Feature-based module structure
- Clear separation of concerns
- Shared modules for common functionality

#### 3. **Exception Handling**
- Custom exception classes extending `HttpException`
- Proper HTTP status codes
- Detailed error messages with validation details

#### 4. **Validation & Transformation**
- Custom pipes for data transformation
- Input validation with proper error messages
- Type-safe request handling

#### 5. **Authentication & Authorization**
- JWT-based authentication
- Custom guards for route protection
- Role-based access control

#### 6. **Database Design**
- Entity relationships properly defined
- Soft delete support
- Audit fields (createdAt, updatedAt)

#### 7. **API Design**
- RESTful endpoints
- Proper HTTP methods and status codes
- Swagger/OpenAPI documentation
- Pagination support

#### 8. **Configuration Management**
- Environment-based configuration
- Secure secret management
- Database connection configuration

### Key Features

- ✅ **Type Safety**: All `any` types replaced with proper interfaces
- ✅ **Authentication**: JWT-based authentication system
- ✅ **Authorization**: Role-based access control
- ✅ **Validation**: Comprehensive input validation
- ✅ **Error Handling**: Custom exception classes
- ✅ **Documentation**: Swagger/OpenAPI integration
- ✅ **Database**: TypeORM with SQLite
- ✅ **Testing**: Jest testing framework
- ✅ **Logging**: Structured logging
- ✅ **Security**: Rate limiting, CORS, helmet

### Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run start:dev

# Build for production
npm run build

# Run tests
npm run test

# Run e2e tests
npm run test:e2e

# Generate documentation
npm run docs:generate
```

### Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DB_PATH=./data/blog-engine.db

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Application
PORT=3000
NODE_ENV=development
```

### API Endpoints

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Refresh token

#### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create user
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

#### Blogs
- `GET /blogs` - Get all published blogs
- `GET /blogs/my-blogs` - Get current user's blogs
- `GET /blogs/:id` - Get blog by ID
- `POST /blogs` - Create blog
- `PATCH /blogs/:id` - Update blog
- `POST /blogs/:id/publish` - Publish blog
- `POST /blogs/:id/unpublish` - Unpublish blog
- `POST /blogs/:id/like` - Like blog
- `DELETE /blogs/:id` - Delete blog

### Contributing

1. Follow the established folder structure
2. Use proper TypeScript interfaces instead of `any`
3. Implement proper error handling
4. Add tests for new features
5. Update documentation

### License

MIT License
