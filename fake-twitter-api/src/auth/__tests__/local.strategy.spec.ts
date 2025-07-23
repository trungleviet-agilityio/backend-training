/**
 * This file contains the tests for the local strategy.
 */

import { LocalStrategy } from '../strategies/local.strategy';
import { AuthService } from '../services/auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let authService: jest.Mocked<AuthService>;

  beforeEach(() => {
    authService = {
      validateUser: jest.fn(),
    } as any;
    strategy = new LocalStrategy(authService);
  });

  it('should return user if AuthService returns a user', async () => {
    const user = { uuid: 'user-uuid-123', email: 'test@example.com' };
    authService.validateUser.mockResolvedValue(user as any);
    await expect(strategy.validate('test@example.com')).resolves.toBe(user);
    expect(authService.validateUser).toHaveBeenCalledWith('test@example.com');
  });

  it('should throw UnauthorizedException if AuthService returns null', async () => {
    authService.validateUser.mockResolvedValue(null as never);
    await expect(strategy.validate('test@example.com')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if AuthService throws', async () => {
    authService.validateUser.mockRejectedValue(new Error('DB error') as never);
    await expect(strategy.validate('test@example.com')).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
