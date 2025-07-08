/**
 * Facade Pattern - TypeScript Implementation
 *
 * This is the main index file that exports all Facade pattern examples.
 * The actual implementations are split into separate files for better organization.
 */

// Re-export all facade examples
export * from './banking-facade';
export * from './video-conversion-facade';
export * from './home-theater-facade';
export * from './demo';

// Main facade classes for easy access
export { BankAccountManager } from './banking-facade';
export { VideoConverter } from './video-conversion-facade';
export { HomeTheaterFacade } from './home-theater-facade';
