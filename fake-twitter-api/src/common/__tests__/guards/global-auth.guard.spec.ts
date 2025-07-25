/**
 * This file contains the tests for the global auth guard.
 */

import { GlobalAuthGuard } from '../../guards/global-auth.guard';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthMockProvider } from '../../../auth/__tests__/mocks/auth-mock.provider';
import { UserInfoDto } from '../../../auth/dto/auth.dto';

describe('GlobalAuthGuard', () => {
  let guard: GlobalAuthGuard;
  let reflector: jest.Mocked<Reflector>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;
  let context: Partial<ExecutionContext>;
  let request: { headers: { authorization?: string }; user?: UserInfoDto };

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as unknown as jest.Mocked<Reflector>;
    jwtService = AuthMockProvider.createJwtService();
    configService = AuthMockProvider.createConfigService();
    guard = new GlobalAuthGuard(reflector, jwtService, configService);
    request = { headers: {}, user: undefined };
    context = {
      switchToHttp: () => ({ getRequest: () => request }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;
  });

  it('should allow access to public routes', () => {
    reflector.getAllAndOverride.mockReturnValue(true);
    expect(guard.canActivate(context as ExecutionContext)).toBe(true);
  });

  it('should throw UnauthorizedException if no Authorization header', () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    request.headers = {};
    expect(() => guard.canActivate(context as ExecutionContext)).toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if Authorization header does not start with Bearer', () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    request.headers = { authorization: 'Token abc' };
    expect(() => guard.canActivate(context as ExecutionContext)).toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if JWT verification fails', () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    request.headers = { authorization: 'Bearer invalidtoken' };
    jwtService.verify.mockImplementation(() => {
      throw new Error('bad token');
    });
    expect(() => guard.canActivate(context as ExecutionContext)).toThrow(
      UnauthorizedException,
    );
  });

  it('should set user and allow access if JWT is valid', () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    request.headers = { authorization: 'Bearer validtoken' };
    const payload = { sub: 'user-id', role: 'user' };
    jwtService.verify.mockReturnValue(payload);
    expect(guard.canActivate(context as ExecutionContext)).toBe(true);
    expect(request.user).toEqual(payload);
  });
});
