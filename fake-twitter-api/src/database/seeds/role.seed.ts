/**
 * This file contains the seed for the roles.
 */

import { DataSource } from 'typeorm';
import { Role } from '../entities/role.entity';
import { UserRole } from '../../common/constants/roles.constant';

export const seedRoles = async (dataSource: DataSource) => {
  const roleRepository = dataSource.getRepository(Role);

  const roles = [
    {
      name: UserRole.USER,
      description: 'Regular user with basic permissions',
      permissions: {
        'read:posts': true,
        'write:posts': true,
        'read:comments': true,
        'write:comments': true,
        'read:profile': true,
        'write:profile': true,
      },
    },
    {
      name: UserRole.ADMIN,
      description: 'Administrator with full permissions',
      permissions: {
        'read:posts': true,
        'write:posts': true,
        'delete:posts': true,
        'read:comments': true,
        'write:comments': true,
        'delete:comments': true,
        'read:profile': true,
        'write:profile': true,
        'manage:users': true,
        'manage:roles': true,
      },
    },
    {
      name: UserRole.MODERATOR,
      description: 'Moderator with limited admin permissions',
      permissions: {
        'read:posts': true,
        'write:posts': true,
        'delete:posts': true,
        'read:comments': true,
        'write:comments': true,
        'delete:comments': true,
        'read:profile': true,
        'write:profile': true,
      },
    },
  ];

  for (const roleData of roles) {
    const existingRole = await roleRepository.findOne({
      where: { name: roleData.name },
    });

    if (!existingRole) {
      const role = roleRepository.create(roleData);
      await roleRepository.save(role);
      console.log(`Created role: ${roleData.name}`);
    }
  }
};
