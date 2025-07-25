/**
 * AuthTestBuilder Unit Tests
 */

import { AuthTestBuilder } from './auth-test.builder';
import { TestDataFactory } from '../../../common/__tests__/test-utils';
import { LoginPayloadDto, RegisterPayloadDto } from '../../dto';

describe('AuthTestBuilder', () => {
  let builder: AuthTestBuilder;

  beforeEach(() => {
    builder = new AuthTestBuilder();
  });

  describe('Entity Builders', () => {
    it('should add user to scenario', () => {
      const user = TestDataFactory.createUser();
      const scenario = builder.withUser(user).build();

      expect(scenario.user).toEqual(user);
    });

    it('should create user from partial data', () => {
      const partialUser = { email: 'test@example.com' };
      const scenario = builder.withUser(partialUser).build();

      expect(scenario.user).toBeDefined();
      expect(scenario.user!.email).toBe('test@example.com');
    });

    it('should add session to scenario', () => {
      const session = TestDataFactory.createAuthSession();
      const scenario = builder.withSession(session).build();

      expect(scenario.session).toEqual(session);
    });
  });

  describe('Request DTO Builders', () => {
    it('should add login DTO to scenario', () => {
      const loginDto = TestDataFactory.createLoginDto();
      const scenario = builder.withLoginDto(loginDto).build();

      expect(scenario.loginPayloadDto).toEqual(loginDto);
    });

    it('should create login DTO from partial data', () => {
      const partialLogin = { email: 'test@example.com' };
      const scenario = builder.withLoginDto(partialLogin).build();

      expect(scenario.loginPayloadDto).toBeDefined();
      expect(scenario.loginPayloadDto!.email).toBe('test@example.com');
    });

    it('should add register DTO to scenario', () => {
      const registerDto = TestDataFactory.createRegisterDto();
      const scenario = builder.withRegisterDto(registerDto).build();

      expect(scenario.registerPayloadDto).toEqual(registerDto);
    });
  });

  describe('Response DTO Builders', () => {
    it('should add login response to scenario', () => {
      const tokens = TestDataFactory.createAuthTokens();
      const scenario = builder.withLoginResponse(tokens).build();

      expect(scenario.loginResponseDto).toBeDefined();
      expect(scenario.loginResponseDto!.data).toEqual(tokens);
    });

    it('should add register response to scenario', () => {
      const tokens = TestDataFactory.createAuthTokens();
      const scenario = builder.withRegisterResponse(tokens).build();

      expect(scenario.registerResponseDto).toBeDefined();
      expect(scenario.registerResponseDto!.data).toEqual(tokens);
    });

    it('should add logout response to scenario', () => {
      const scenario = builder.withLogoutResponse().build();

      expect(scenario.logoutResponseDto).toBeDefined();
      expect(scenario.logoutResponseDto!.success).toBe(true);
    });
  });

  describe('Scenario Builders', () => {
    it('should build complete login scenario', () => {
      const scenario = builder.buildLoginScenario();

      expect(scenario.loginPayloadDto).toBeDefined();
      expect(scenario.tokens).toBeDefined();
      expect(scenario.loginResponseDto).toBeDefined();
      expect(scenario.loginResponseDto.data).toEqual(scenario.tokens);
    });

    it('should build complete registration scenario', () => {
      const scenario = builder.buildRegisterScenario();

      expect(scenario.registerPayloadDto).toBeDefined();
      expect(scenario.tokens).toBeDefined();
      expect(scenario.registerResponseDto).toBeDefined();
      expect(scenario.registerResponseDto.data).toEqual(scenario.tokens);
    });

    it('should build complete refresh scenario', () => {
      const scenario = builder.buildRefreshScenario();

      expect(scenario.refreshTokenPayloadDto).toBeDefined();
      expect(scenario.refreshTokens).toBeDefined();
      expect(scenario.refreshTokenResponseDto).toBeDefined();
      expect(scenario.refreshTokenResponseDto.data).toEqual(
        scenario.refreshTokens,
      );
    });

    it('should build complete logout scenario', () => {
      const scenario = builder.buildLogoutScenario();

      expect(scenario.jwtPayload).toBeDefined();
      expect(scenario.logoutResponseDto).toBeDefined();
      expect(scenario.logoutResponseDto.success).toBe(true);
    });
  });

  describe('Edge Case Builders', () => {
    it('should build login error scenario', () => {
      const error = new Error('Invalid credentials');
      const scenario = builder.buildLoginErrorScenario(error);

      expect(scenario.loginPayloadDto).toBeDefined();
      expect(scenario.error).toEqual(error);
    });

    it('should build inactive user scenario', () => {
      const scenario = builder.buildInactiveUserScenario();

      expect(scenario.user).toBeDefined();
      expect(scenario.user.isActive).toBe(false);
      expect(scenario.loginPayloadDto).toBeDefined();
      expect(scenario.loginPayloadDto.email).toBe(scenario.user.email);
    });

    it('should build expired session scenario', () => {
      const scenario = builder.buildExpiredSessionScenario();

      expect(scenario.session).toBeDefined();
      expect(scenario.session.expiresAt.getTime()).toBeLessThan(Date.now());
      expect(scenario.refreshTokenPayloadDto).toBeDefined();
    });
  });

  describe('Chaining', () => {
    it('should support method chaining', () => {
      const scenario = builder
        .withUser({ email: 'test@example.com' })
        .withLoginDto({ email: 'test@example.com' })
        .withTokens({})
        .withLoginResponse()
        .build();

      expect(scenario.user).toBeDefined();
      expect(scenario.loginPayloadDto).toBeDefined();
      expect(scenario.tokens).toBeDefined();
      expect(scenario.loginResponseDto).toBeDefined();
    });
  });
});
