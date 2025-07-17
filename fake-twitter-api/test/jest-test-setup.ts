/**
 * Jest Test Setup
 * Global configuration and utilities for e2e tests
 * Ensures environment variables are loaded before tests run
 */

import { config } from 'dotenv';
import { randomBytes } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

// Debug: Check if environment files exist
const envTestPath = path.resolve(process.cwd(), '.env.test');
const envPath = path.resolve(process.cwd(), '.env');

// Load environment variables based on NODE_ENV
const nodeEnv = process.env.NODE_ENV || 'test';

if (nodeEnv === 'test') {
  if (fs.existsSync(envTestPath)) {
    config({ path: '.env.test' });
    console.log('Loaded .env.test file');
  } else {
    console.log('.env.test file not found, using defaults');
  }
} else {
  if (fs.existsSync(envPath)) {
    config({ path: '.env' });
    console.log('Loaded .env file');
  } else {
    console.log('.env file not found, using defaults');
  }
}

// Generate secure test secrets dynamically
const generateTestSecret = (length: number = 32): string => {
  return randomBytes(length).toString('hex');
};

// Environment configuration for testing
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = process.env.TEST_LOG_LEVEL || 'error';

// Generate secure JWT secret for this test run
process.env.JWT_SECRET = process.env.TEST_JWT_SECRET || generateTestSecret(64);
process.env.JWT_REFRESH_SECRET = process.env.TEST_JWT_REFRESH_SECRET || generateTestSecret(64);
process.env.JWT_ACCESS_TOKEN_EXPIRATION = process.env.TEST_JWT_ACCESS_TOKEN_EXPIRATION || '15m';
process.env.JWT_REFRESH_TOKEN_EXPIRATION = process.env.TEST_JWT_REFRESH_TOKEN_EXPIRATION || '7d';

// Database configuration - prefer environment variables, fallback to secure defaults
process.env.DB_HOST = process.env.TEST_DB_HOST || 'localhost';
process.env.DB_PORT = process.env.TEST_DB_PORT || '5437';
process.env.DB_USERNAME = process.env.TEST_DB_USERNAME || 'fake_twitter_user';
process.env.DB_PASSWORD = process.env.TEST_DB_PASSWORD || 'fake_twitter_password';
process.env.DB_DATABASE = process.env.TEST_DB_DATABASE || 'fake_twitter_test';
process.env.DB_SYNCHRONIZE = process.env.TEST_DB_SYNCHRONIZE || 'true';

// PostgreSQL Configuration
process.env.POSTGRES_USER = process.env.TEST_POSTGRES_USER || 'fake_twitter_user';
process.env.POSTGRES_PASSWORD = process.env.TEST_POSTGRES_PASSWORD || 'fake_twitter_password';
process.env.POSTGRES_DB = process.env.TEST_POSTGRES_DB || 'fake_twitter_db';
process.env.POSTGRES_DB_TEST = process.env.TEST_POSTGRES_DB_TEST || 'fake_twitter_test';
process.env.POSTGRES_SCHEMA = process.env.TEST_POSTGRES_SCHEMA || 'fake_twitter_schema';

// Email Provider
process.env.EMAIL_PROVIDER = process.env.TEST_EMAIL_PROVIDER || 'console';

// Global test timeout
global.testTimeout = 30000; // 30 seconds
