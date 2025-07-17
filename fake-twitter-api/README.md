#  Fake Twitter API

A comprehensive social media API built with NestJS, featuring authentication, posts, comments, and user management with full testing support.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Development Guide](#-development-guide)
- [Testing](#-testing)
- [API Documentation](#-api-documentation)
- [Database Management](#-database-management)
- [Docker Support](#-docker-support)
- [Project Structure](#-project-structure)

## ✨ Features

-  **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (User, Moderator, Admin)
  - Password reset functionality
  - Session management

- 📝 **Content Management**
  - Create, read, update, delete posts
  - Comment system with threading
  - User profiles and relationships

- ️ **Architecture**
  - Clean architecture with modules
  - Design patterns (Factory, Strategy, Observer)
  - Dependency injection
  - Repository pattern

- 🧪 **Testing**
  - Unit tests with Jest
  - E2E tests with supertest
  - Separate test database
  - Test data seeding

- 🐳 **DevOps**
  - Docker containerization
  - Database migrations
  - Environment configuration
  - CI/CD ready

## 🛠️ Tech Stack

- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT + Passport
- **Validation**: class-validator + class-transformer
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest + supertest
- **Containerization**: Docker + Docker Compose
- **Code Quality**: ESLint + Prettier + Husky

## 🚀 Quick Start

### Prerequisites

- Node.js (v18+)
- Docker & Docker Compose
- npm or yarn

### 1. Clone & Install

```bash
git clone <repository-url>
cd fake-twitter-api
npm install
```

### 2. Environment Setup

```bash
# Create development environment
cat > .env << 'EOF'
# Database Configuration
POSTGRES_USER=fake_twitter_user
POSTGRES_PASSWORD=fake_twitter_password
POSTGRES_DB=fake_twitter_db
POSTGRES_SCHEMA=fake_twitter_schema

# Development Database Connection
DB_HOST=localhost
DB_PORT=5436
DB_DATABASE=fake_twitter_db
DB_USERNAME=fake_twitter_user
DB_PASSWORD=fake_twitter_password
DB_SYNCHRONIZE=true

# Application Environment
NODE_ENV=development
APP_PORT=5555

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_ACCESS_TOKEN_EXPIRATION=15m
JWT_REFRESH_TOKEN_EXPIRATION=7d

# Email Provider
EMAIL_PROVIDER=console
EOF

# Create test environment
cat > .env.test << 'EOF'
# Test Database Configuration
DB_HOST=localhost
DB_PORT=5437
DB_DATABASE=fake_twitter_test
DB_USERNAME=fake_twitter_user
DB_PASSWORD=fake_twitter_password
DB_SYNCHRONIZE=true

# Application Environment
NODE_ENV=test
APP_PORT=5555

# JWT (use different secrets for testing)
JWT_SECRET=test-jwt-secret
JWT_REFRESH_SECRET=test-refresh-secret
JWT_ACCESS_TOKEN_EXPIRATION=15m
JWT_REFRESH_TOKEN_EXPIRATION=7d

# Email Provider
EMAIL_PROVIDER=console
EOF
```

### 3. Start Development

```bash
# Start development database
npm run db:dev:up

# Start the application
npm run start:dev
```

### 4. Access the API

- **API Base URL**: `http://localhost:5555/api/v1`
- **Swagger Documentation**: `http://localhost:5555/api/v1/docs`
- **Health Check**: `http://localhost:5555/api/v1/health`

## 💻 Development Guide

### Daily Development Workflow

```bash
# 1. Start development environment
npm run db:dev:up && npm run start:dev

# 2. Run tests
npm run test && npm run test:e2e

# 3. Code quality checks
npm run validate
```

### Available Scripts

#### 🚀 Application
```bash
npm run start:dev          # Start in development mode
npm run start:debug        # Start in debug mode
npm run build             # Build the application
```

#### 🧪 Testing
```bash
npm run test              # Run unit tests
npm run test:watch        # Run tests in watch mode
npm run test:e2e          # Run E2E tests
npm run test:cov          # Run tests with coverage
npm run test:all          # Run all tests (unit + e2e)
```

#### ️ Database
```bash
npm run db:dev:up         # Start development database
npm run db:test:up        # Start test database
npm run db:both:up        # Start both databases
npm run migration:run     # Run migrations
npm run seed              # Seed development database
```

####  Docker
```bash
npm run docker:up         # Start everything in Docker
npm run docker:down       # Stop all containers
npm run docker:logs       # View logs
```

#### 🔧 Code Quality
```bash
npm run validate          # Run all checks (type, lint, format)
npm run lint              # Lint code
npm run format            # Format code
npm run type-check        # Type checking
```

##  Testing

### Local Testing

```bash
# 1. Start test database
npm run db:test:up

# 2. Run unit tests
npm run test

# 3. Run E2E tests
npm run test:e2e

# 4. Run all tests
npm run test:all
```

### Docker Testing

```bash
# Start test environment in Docker
npm run docker:test:up

# Run tests against Docker environment
NODE_ENV=test npm run test:e2e
```

### Test Database Setup

```bash
# Complete test database setup
npm run db:test:setup

# Reset test database
npm run db:test:reset
```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/forgot-password` - Forgot password
- `POST /api/v1/auth/reset-password` - Reset password

### User Endpoints

- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

### Post Endpoints

- `GET /api/v1/posts` - Get all posts
- `POST /api/v1/posts` - Create post
- `GET /api/v1/posts/:id` - Get post by ID
- `PUT /api/v1/posts/:id` - Update post
- `DELETE /api/v1/posts/:id` - Delete post

### Comment Endpoints

- `GET /api/v1/comments` - Get all comments
- `POST /api/v1/comments` - Create comment
- `GET /api/v1/comments/:id` - Get comment by ID
- `PUT /api/v1/comments/:id` - Update comment
- `DELETE /api/v1/comments/:id` - Delete comment

### Interactive Documentation

Visit `http://localhost:5555/api/v1/docs` for interactive API documentation with Swagger UI.

## 🗄️ Database Management

### Database Connections

- **Development**: `localhost:5436` → `fake_twitter_db`
- **Testing**: `localhost:5437` → `fake_twitter_test`

### Migrations

```bash
# Generate new migration
npm run migration:generate src/migrations/MigrationName

# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert

# Test migrations
npm run migration:run:test
```

### Seeding

```bash
# Seed development database
npm run seed

# Seed test database
npm run seed:test
```

### Database Access

```bash
# Connect to development database
docker compose exec dev-db psql -U fake_twitter_user -d fake_twitter_db

# Connect to test database
docker compose exec test-db psql -U fake_twitter_user -d fake_twitter_test

# Check database tables
docker compose exec dev-db psql -U fake_twitter_user -d fake_twitter_db -c "\dt"
```

## 🐳 Docker Support

### Docker Commands

```bash
# Start everything in Docker
npm run docker:up

# Start in detached mode
npm run docker:up:detached

# Stop all containers
npm run docker:down

# View logs
npm run docker:logs
```

### Docker Services

- **app**: NestJS application (port 5555)
- **dev-db**: Development PostgreSQL (port 5436)
- **test-db**: Test PostgreSQL (port 5437)

### Environment Variables

Docker uses environment variables from `.env` files:
- `.env` for development
- `.env.test` for testing

## 📁 Project Structure

```
fake-twitter-api/
├── src/
│   ├── auth/                 # Authentication module
│   │   ├── controllers/      # Auth controllers
│   │   ├── services/         # Auth services
│   │   ├── strategies/       # Passport strategies
│   │   ├── guards/           # Auth guards
│   │   └── dto/              # Auth DTOs
│   ├── user/                 # User module
│   ├── post/                 # Post module
│   ├── comment/              # Comment module
│   ├── notifications/        # Notification module
│   ├── database/             # Database configuration
│   │   ├── entities/         # TypeORM entities
│   │   └── seeds/            # Database seeds
│   ├── migrations/           # Database migrations
│   └── common/               # Shared utilities
├── test/                     # E2E tests
├── scripts/                  # Build and deployment scripts
├── docs/                     # Documentation
└── docker-compose.yaml       # Docker configuration
```

##  Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` |
| `APP_PORT` | Application port | `5555` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5436` |
| `DB_DATABASE` | Database name | `fake_twitter_db` |
| `DB_USERNAME` | Database username | `fake_twitter_user` |
| `DB_PASSWORD` | Database password | `fake_twitter_password` |
| `JWT_SECRET` | JWT secret key | Required |
| `EMAIL_PROVIDER` | Email provider | `console` |

### Database Configuration

- **Development**: Uses `fake_twitter_db` on port 5436
- **Testing**: Uses `fake_twitter_test` on port 5437
- **Synchronization**: Enabled for development, disabled for production

## 🚨 Troubleshooting

### Common Issues

#### Permission Errors
```bash
sudo rm -rf dist/ node_modules/
npm install
```

#### Database Connection Issues
```bash
npm run db:both:down
npm run db:both:up
```

#### Port Conflicts
```bash
lsof -i :5555
lsof -i :5436
lsof -i :5437
```

#### Environment Issues
```bash
# Verify environment files
ls -la .env*

# Check environment variables
echo $NODE_ENV
```

### Reset Everything

```bash
# Complete reset
docker compose down -v
sudo rm -rf dist/
npm install
npm run db:both:up
npm run start:dev
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run test:all`
5. Run validation: `npm run validate`
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Happy coding! **
