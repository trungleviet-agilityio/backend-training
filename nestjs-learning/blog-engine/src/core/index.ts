/**
 * Core Module Barrel Exports
 * Centralized exports for all core functionality including guards, pipes,
 * decorators, middleware, and logging services
 */

// Authentication & Authorization
export * from './guards/auth.guard';
export * from './guards/roles.guard';
export * from './guards/permissions.guard';
export * from './guards/rate-limit.guard';

// Data Validation & Transformation
export * from './pipes/validation.pipe';
export * from './pipes/transform.pipe';

// Decorators
export * from './decorators/current-user.decorator';
export * from './decorators/role.decorator';

// Middleware
export * from './middleware/request-context.middleware';
export * from './middleware/common/logger.middleware';
export * from './middleware/common/error-handler.middleware';
export * from './middleware/common/auth.middleware';
export * from './middleware/common/cors.middleware';

// Logging Services
export * from './logger/custom-logger.service';
export * from './logger/logger.module';

// Exception Handling
export * from './exceptions';
