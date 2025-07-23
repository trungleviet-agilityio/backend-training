/**
 * This file contains the tests for the auth mock provider.
 */

import { AuthMockProvider } from './auth-mock.provider';

describe('AuthMockProvider', () => {
  it('should create all mock providers', () => {
    expect(AuthMockProvider.createAuthService()).toBeDefined();
    expect(AuthMockProvider.createAuthOperationFactory()).toBeDefined();
    expect(AuthMockProvider.createAuthPasswordResetService()).toBeDefined();
    expect(AuthMockProvider.createUserRepository()).toBeDefined();
    expect(AuthMockProvider.createRoleRepository()).toBeDefined();
    expect(AuthMockProvider.createAuthSessionRepository()).toBeDefined();
    expect(AuthMockProvider.createAuthPasswordResetRepository()).toBeDefined();
    expect(AuthMockProvider.createJwtService()).toBeDefined();
    expect(AuthMockProvider.createAuthMapperService()).toBeDefined();
    expect(AuthMockProvider.createNotificationService()).toBeDefined();
    expect(AuthMockProvider.createAuthStrategy()).toBeDefined();
    expect(AuthMockProvider.createConfigService()).toBeDefined();
    expect(AuthMockProvider.createDataSource()).toBeDefined();
  });
});
