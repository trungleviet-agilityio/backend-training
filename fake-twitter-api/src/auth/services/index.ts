/**
 * Auth Services - New architecture
 */

// Main orchestrator
export * from './auth.service';

// Domain-specific services
export * from './auth-user.service';
export * from './auth-token.service';
export * from './auth-password.service';
export * from './auth-session.service';
export * from './auth-error-handler.service';

// Legacy service (keep for compatibility)
export * from './auth-password-reset.service';
