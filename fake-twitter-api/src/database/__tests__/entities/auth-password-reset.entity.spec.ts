/**
 * This file contains the tests for the auth password reset entity.
 */

import { AuthPasswordReset } from '../../entities';

describe('AuthPasswordReset Entity', () => {
  it('should instantiate and assign properties', () => {
    const reset = new AuthPasswordReset({
      userUuid: 'user-uuid',
      tokenHash: 'token',
      expiresAt: new Date('2024-01-01'),
      isUsed: false,
    });
    expect(reset.userUuid).toBe('user-uuid');
    expect(reset.tokenHash).toBe('token');
    expect(reset.expiresAt).toEqual(new Date('2024-01-01'));
    expect(reset.isUsed).toBe(false);
  });
});
