# E2E Testing Guide

This directory contains end-to-end (e2e) tests for the Blog Engine API, focusing on testing complete user flows and API integrations.

## Overview

The e2e tests are designed to test the application as a whole, including:
- Database interactions
- HTTP request/response cycles
- Authentication flows
- Validation pipelines
- Business logic integration

## Test Structure

### Auth Module Tests (`auth.e2e-spec.ts`)

Comprehensive testing for authentication functionality:

#### Registration Tests
- ✅ Successful user registration
- ✅ Duplicate email prevention
- ✅ Email format validation
- ✅ Password length validation
- ✅ Required field validation
- ✅ Extra field filtering (whitelist)
- ✅ Optional avatar field handling

#### Login Tests
- ✅ Valid credential authentication
- ✅ Invalid credential rejection
- ✅ Missing field validation
- ✅ Email format validation
- ✅ Password validation

#### JWT Token Tests
- ✅ Token generation and validation
- ✅ Token payload verification
- ✅ Invalid token rejection
- ✅ Expired token handling

#### Integration Tests
- ✅ Complete registration → login flow
- ✅ Duplicate registration prevention
- ✅ Concurrent request handling

#### Security Tests
- ✅ SQL injection protection
- ✅ Long input handling
- ✅ Malicious data filtering

## Setup Requirements

### Database
The tests require a PostgreSQL database for integration testing:

```bash
# Using Docker (recommended)
docker run --name blog-engine-test-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=blog_engine_test \
  -p 5432:5432 \
  -d postgres:14

# Or use your existing PostgreSQL instance
createdb blog_engine_test
```

### Environment Variables
The tests use specific environment variables (configured in `jest-test-setup.ts`):

```env
NODE_ENV=test
JWT_SECRET=test-jwt-secret-key-for-e2e-tests
JWT_EXPIRES_IN=1h
LOG_LEVEL=error
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=blog_engine_test
```

## Running Tests

### All E2E Tests
```bash
npm run test:e2e
```

### Auth Module Only
```bash
npm run test:e2e:auth
```

### Watch Mode
```bash
npm run test:e2e:watch
```

### With Coverage
```bash
npm run test:e2e:coverage
```

### Debug Mode
```bash
npm run test:debug test/auth.e2e-spec.ts
```

## Test Configuration

### Jest Configuration (`jest-e2e.json`)
- **Test Environment**: Node.js
- **Test Pattern**: `*.e2e-spec.ts`
- **Setup File**: `jest-test-setup.ts`
- **Timeout**: 30 seconds
- **Coverage**: Excludes test files

### Global Setup (`jest-test-setup.ts`)
- Environment variable configuration
- Test utilities and helpers
- Database cleanup functions
- Common test data factories

## Writing New E2E Tests

### Basic Structure
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('Feature (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [YourModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should do something', () => {
    return request(app.getHttpServer())
      .get('/api/v1/endpoint')
      .expect(200);
  });
});
```

### Best Practices

1. **Database Isolation**: Each test should clean up after itself
2. **Real Dependencies**: Use actual database and services, not mocks
3. **Complete Flows**: Test entire user journeys, not just individual endpoints
4. **Error Scenarios**: Test both success and failure cases
5. **Security**: Include tests for common security vulnerabilities
6. **Performance**: Be mindful of test execution time

### Test Data Management
Use the helper functions from `jest-test-setup.ts`:

```typescript
import { createTestUser, createLoginData } from './jest-test-setup';

const testUser = createTestUser({
  email: 'custom@example.com',
  role: 'admin'
});

const loginData = createLoginData({
  email: 'custom@example.com'
});
```

## Debugging Tests

### Common Issues

1. **Database Connection**: Ensure PostgreSQL is running and accessible
2. **Environment Variables**: Check that test environment variables are set
3. **Port Conflicts**: Make sure test database port is available
4. **Timeouts**: Increase timeout for slow database operations

### Debugging Tips

```bash
# Run with verbose output
npm run test:e2e -- --verbose

# Run specific test file
npm run test:e2e -- auth.e2e-spec.ts

# Run specific test case
npm run test:e2e -- --testNamePattern="should register a new user"

# Enable debug logging
LOG_LEVEL=debug npm run test:e2e
```

## CI/CD Integration

For continuous integration, ensure:

1. **Database**: Provision test database in CI environment
2. **Environment**: Set proper environment variables
3. **Cleanup**: Tests clean up after themselves
4. **Parallelization**: Tests can run in parallel safely

### Example GitHub Actions
```yaml
- name: Setup PostgreSQL
  run: |
    docker run --name postgres-test \
      -e POSTGRES_PASSWORD=postgres \
      -e POSTGRES_DB=blog_engine_test \
      -p 5432:5432 \
      -d postgres:14

- name: Run E2E Tests
  run: npm run test:e2e
  env:
    DB_HOST: localhost
    DB_PORT: 5432
    DB_USERNAME: postgres
    DB_PASSWORD: postgres
    DB_NAME: blog_engine_test
```

## Contributing

When adding new e2e tests:

1. Follow the existing test structure
2. Include comprehensive error testing
3. Test security scenarios
4. Add documentation for complex test cases
5. Ensure tests are isolated and can run independently
6. Update this README with new test descriptions 