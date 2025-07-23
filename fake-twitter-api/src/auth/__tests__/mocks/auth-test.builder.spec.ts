/**
 * This file contains the tests for the auth test builder.
 */
import { AuthTestBuilder } from './auth-test.builder';

describe('AuthTestBuilder', () => {
  it('should build scenario with all builder methods', () => {
    const builder = new AuthTestBuilder()
      .withUser({ uuid: 'u1' })
      .withTokens({ tokens: { access_token: 'a', refresh_token: 'r' } })
      .withRefreshTokens({ access_token: 'a', refresh_token: 'r' })
      .withLoginDto({ email: 'e', password: 'p' })
      .withRegisterDto({
        email: 'e',
        username: 'u',
        password: 'p',
        firstName: 'f',
        lastName: 'l',
      })
      .withSession({ uuid: 's1' })
      .withPasswordReset({ uuid: 'pr1' })
      .withError(new Error('err'));
    const scenario = builder.build();
    expect(scenario.user).toBeDefined();
    expect(scenario.tokens).toBeDefined();
    expect(scenario.refreshTokens).toBeDefined();
    expect(scenario.loginDto).toBeDefined();
    expect(scenario.registerDto).toBeDefined();
    expect(scenario.session).toBeDefined();
    expect(scenario.passwordReset).toBeDefined();
    expect(scenario.error).toBeDefined();
  });

  it('should create predefined scenarios', () => {
    expect(
      AuthTestBuilder.createSuccessfulLoginScenario().build(),
    ).toBeDefined();
    expect(AuthTestBuilder.createFailedLoginScenario().build()).toBeDefined();
    expect(
      AuthTestBuilder.createSuccessfulRegistrationScenario().build(),
    ).toBeDefined();
  });

  it('should create a successful login scenario', () => {
    const scenario = AuthTestBuilder.createSuccessfulLoginScenario().build();
    expect(scenario.user).toBeDefined();
    expect(scenario.tokens).toBeDefined();
    expect(scenario.loginDto).toBeDefined();
  });

  it('should create a failed login scenario', () => {
    const scenario = AuthTestBuilder.createFailedLoginScenario().build();
    expect(scenario.error).toBeDefined();
    expect(scenario.loginDto).toBeDefined();
  });

  it('should create a successful registration scenario', () => {
    const scenario =
      AuthTestBuilder.createSuccessfulRegistrationScenario().build();
    expect(scenario.tokens).toBeDefined();
    expect(scenario.registerDto).toBeDefined();
  });

  it('should allow chaining builder methods in any order', () => {
    const builder = new AuthTestBuilder()
      .withError(new Error('test'))
      .withUser({ uuid: 'u2' })
      .withSession({ uuid: 's2' });
    const scenario = builder.build();
    expect(scenario.error).toBeDefined();
    expect(scenario.user).toBeDefined();
    expect(scenario.session).toBeDefined();
  });

  it('should build scenario with only one property set', () => {
    const builder = new AuthTestBuilder().withUser({ uuid: 'only-user' });
    const scenario = builder.build();
    expect(scenario.user).toBeDefined();
    expect(scenario.tokens).toBeUndefined();
    expect(scenario.refreshTokens).toBeUndefined();
    expect(scenario.loginDto).toBeUndefined();
    expect(scenario.registerDto).toBeUndefined();
    expect(scenario.session).toBeUndefined();
    expect(scenario.passwordReset).toBeUndefined();
    expect(scenario.error).toBeUndefined();
  });
});
