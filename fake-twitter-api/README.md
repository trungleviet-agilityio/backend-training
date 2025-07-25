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

---

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

> **Note:** Never commit your `.env` files or secrets to version control.

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
npm run db:dev:up      # Start development database
npm run start:dev      # Start the application
```

### 4. Access the API

- **API Base URL**: `http://localhost:5555/api/v1`
- **Swagger Documentation**: `http://localhost:5555/api/v1/docs`
- **Health Check**: `http://localhost:5555/api/v1/health`

---

## 💻 Development Guide

### Daily Workflow

```bash
npm run db:dev:up && npm run start:dev   # Start dev environment
npm run test && npm run test:e2e         # Run tests
npm run validate                         # Code quality checks
```

### Available Scripts

See `package.json` for the full list. Common scripts:

#### 🚀 Application
```bash
npm run start:dev          # Start in development mode
npm run start:debug        # Start in debug mode
npm run build              # Build the application
npm run start:prod         # Start built app in production mode
```

#### 🧪 Testing
```bash
npm run test               # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:e2e           # Run E2E tests
npm run test:e2e:watch     # Run E2E tests in watch mode
npm run test:cov           # Run tests with coverage
npm run test:all           # Run all tests (unit + e2e)
```

#### ️ Database
```bash
npm run db:dev:up          # Start development database
npm run db:dev:rm          # Remove dev database container
npm run db:dev:restart     # Restart dev database and run migrations
npm run db:test:up         # Start test database
npm run db:test:rm         # Remove test database container
npm run db:test:restart    # Restart test database
npm run db:test:setup      # Setup test database (restart, migrate, seed)
npm run db:test:reset      # Reset test database
npm run db:both:up         # Start both dev and test databases
npm run db:both:down       # Stop both databases
npm run db:both:logs       # View logs for both databases
npm run db:only            # Start both databases (foreground)
```

#### 🗄️ Migrations & Seeding
```bash
npm run migration:generate         # Generate new migration
npm run migration:create           # Create empty migration
npm run migration:run              # Run migrations
npm run migration:revert           # Revert last migration
npm run migration:run:test         # Run migrations on test DB
npm run migration:generate:test    # Generate migration for test DB
npm run migration:revert:test      # Revert migration on test DB
npm run seed                      # Seed development database
npm run seed:test                 # Seed test database
```

####  Docker
```bash
npm run docker:up          # Start everything in Docker
npm run docker:up:detached # Start Docker in detached mode
npm run docker:down        # Stop all containers
npm run docker:logs        # View logs
```

#### 🔧 Code Quality
```bash
npm run validate           # Run all checks (type, lint, format)
npm run lint               # Lint code
npm run lint:check         # Lint code (check only)
npm run lint-fix           # Lint and fix
npm run format             # Format code
npm run format:check       # Check formatting
npm run type-check         # Type checking
```

---

## 📁 Project Structure

```
fake-twitter-api/
├── src/
│   ├── auth/                 # Authentication module
│   ├── user/                 # User module
│   ├── post/                 # Post module
│   ├── comment/              # Comment module
│   ├── notifications/        # Notification module
│   ├── database/             # Database configuration & seeds
│   ├── migrations/           # Database migrations
│   ├── common/               # Shared utilities
│   └── main.ts               # Application entry point
├── test/                     # E2E tests
├── scripts/                  # Build and deployment scripts
├── docs/                     # Documentation
├── docker-compose.yaml       # Docker configuration
├── package.json              # Project metadata and scripts
└── README.md                 # Project documentation
```

---

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
