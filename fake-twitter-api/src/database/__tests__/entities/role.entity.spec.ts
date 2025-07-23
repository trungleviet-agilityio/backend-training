/**
 * This file contains the tests for the role entity.
 */

import { Role } from '../../entities';

describe('Role Entity', () => {
  it('should instantiate and assign properties', () => {
    const role = new Role({
      name: 'admin',
      description: 'desc',
      permissions: { canEdit: true },
    });
    expect(role.name).toBe('admin');
    expect(role.description).toBe('desc');
    expect(role.permissions).toEqual({ canEdit: true });
  });
});
