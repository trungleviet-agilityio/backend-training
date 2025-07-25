/**
 * This file contains the tests for the auth session entity.
 */

import { AuthSession } from '../../entities';

describe('AuthSession Entity', () => {
  it('should instantiate and assign properties', () => {
    const session = new AuthSession({
      userUuid: 'user-uuid',
      refreshTokenHash: 'hash',
      expiresAt: new Date('2024-01-01'),
      isActive: true,
      deviceInfo: 'device',
      ipAddress: '127.0.0.1',
    });
    expect(session.userUuid).toBe('user-uuid');
    expect(session.refreshTokenHash).toBe('hash');
    expect(session.expiresAt).toEqual(new Date('2024-01-01'));
    expect(session.isActive).toBe(true);
    expect(session.deviceInfo).toBe('device');
    expect(session.ipAddress).toBe('127.0.0.1');
  });
});
