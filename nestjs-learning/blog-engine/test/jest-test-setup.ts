/**
 * Jest Test Setup
 * Global configuration and utilities for e2e tests
 * Uses secure, non-hard-coded configuration for testing
 */

import { DataSource } from 'typeorm';
import { randomBytes, randomUUID } from 'crypto';

// Global test configuration
global.testTimeout = 30000; // 30 seconds

// Generate secure test secrets dynamically
const generateTestSecret = (length: number = 32): string => {
  return randomBytes(length).toString('hex');
};

// Generate unique test database name to prevent conflicts
const generateTestDbName = (): string => {
  const timestamp = Date.now();
  const random = randomBytes(4).toString('hex');
  return `blog_engine_test_${timestamp}_${random}`;
};

// Environment configuration for testing
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = process.env.TEST_LOG_LEVEL || 'error'; // Reduce noise in test output

// Generate secure JWT secret for this test run
process.env.JWT_SECRET = process.env.TEST_JWT_SECRET || generateTestSecret(64);
process.env.JWT_EXPIRES_IN = process.env.TEST_JWT_EXPIRES_IN || '1h';

// Database configuration - prefer environment variables, fallback to secure defaults
process.env.DB_TYPE = 'postgres';
process.env.DB_HOST = process.env.TEST_DB_HOST || 'localhost';
process.env.DB_PORT = process.env.TEST_DB_PORT || '5435';
process.env.DB_USERNAME = process.env.TEST_DB_USERNAME || 'postgres';
process.env.DB_PASSWORD = process.env.TEST_DB_PASSWORD || 'postgres';
process.env.DB_DATABASE = process.env.TEST_DB_DATABASE || generateTestDbName();

// Cleanup function to be used in afterAll hooks
export async function cleanupTestDatabase(dataSource?: DataSource) {
  if (dataSource && dataSource.isInitialized) {
    await dataSource.destroy();
  }
}

// Helper function to create randomized test user data
export function createTestUser(overrides = {}) {
  const uuid = randomUUID();
  const timestamp = Date.now();
  
  return {
    email: `test_${uuid.slice(0, 8)}_${timestamp}@example.com`,
    password: generateSecureTestPassword(),
    firstName: `TestUser_${uuid.slice(0, 8)}`,
    lastName: `User_${timestamp}`,
    ...overrides,
  };
}

// Helper function to create randomized login data
export function createLoginData(overrides = {}) {
  const uuid = randomUUID();
  const timestamp = Date.now();
  
  return {
    email: `login_${uuid.slice(0, 8)}_${timestamp}@example.com`,
    password: generateSecureTestPassword(),
    ...overrides,
  };
}

// Generate secure test password
export function generateSecureTestPassword(): string {
  // Generate a secure random password for testing
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  return password;
}

// Helper to create unique test emails
export function generateTestEmail(prefix: string = 'test'): string {
  const uuid = randomUUID();
  const timestamp = Date.now();
  return `${prefix}_${uuid.slice(0, 8)}_${timestamp}@example.com`;
}

// Helper to create test data with specific roles
export function createTestUserWithRole(role: 'user' | 'admin', overrides = {}) {
  return {
    ...createTestUser(),
    role,
    ...overrides,
  };
}

// Test database cleanup
beforeEach(() => {
  // Reset any global state if needed
  jest.clearAllMocks();
});

afterEach(() => {
  // Cleanup after each test
  jest.restoreAllMocks();
});

// Log test configuration (without sensitive data)
console.log('🧪 Test Configuration:');
console.log(`  - Database: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`);
console.log(`  - JWT Expires: ${process.env.JWT_EXPIRES_IN}`);
console.log(`  - Log Level: ${process.env.LOG_LEVEL}`);
console.log(`  - Test Timeout: ${global.testTimeout}ms`);
