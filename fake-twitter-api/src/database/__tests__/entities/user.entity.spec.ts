/**
 * This file contains the tests for the user entity.
 */

import { User } from '../../entities';

describe('User Entity', () => {
  it('should instantiate and assign properties', () => {
    const user = new User({
      email: 'test@example.com',
      username: 'testuser',
      passwordHash: 'hash',
      firstName: 'Test',
      lastName: 'User',
      bio: 'bio',
      avatarUrl: 'url',
      roleUuid: 'role-uuid',
      isActive: true,
      emailVerified: false,
    });
    expect(user.email).toBe('test@example.com');
    expect(user.username).toBe('testuser');
    expect(user.passwordHash).toBe('hash');
    expect(user.firstName).toBe('Test');
    expect(user.lastName).toBe('User');
    expect(user.bio).toBe('bio');
    expect(user.avatarUrl).toBe('url');
    expect(user.roleUuid).toBe('role-uuid');
    expect(user.isActive).toBe(true);
    expect(user.emailVerified).toBe(false);
  });
});
