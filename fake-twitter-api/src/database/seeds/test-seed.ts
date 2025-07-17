/**
 * Test-specific seed data
 */

import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { UserRole } from '../../common/constants/roles.constant';
import * as bcrypt from 'bcrypt';

export const runTestSeeds = async (dataSource: DataSource) => {
  const userRepository = dataSource.getRepository(User);
  const roleRepository = dataSource.getRepository(Role);

  // Get all roles
  const roles = await roleRepository.find();
  const roleMap = new Map(roles.map(role => [role.name, role]));

  // Verify all required roles exist
  const requiredRoles = [UserRole.USER, UserRole.ADMIN, UserRole.MODERATOR];
  for (const roleName of requiredRoles) {
    if (!roleMap.has(roleName)) {
      console.error(
        `Required role '${roleName}' not found. Make sure role seeding ran first.`,
      );
      return;
    }
  }

  // Create test users with specific roles
  const testUsers = [
    {
      email: 'test@example.com',
      username: 'testuser',
      passwordHash: await bcrypt.hash('password123', 12),
      firstName: 'Test',
      lastName: 'User',
      isActive: true,
      roleUuid: roleMap.get(UserRole.USER)!.uuid,
    },
    {
      email: 'admin@example.com',
      username: 'admin',
      passwordHash: await bcrypt.hash('admin123', 12),
      firstName: 'Admin',
      lastName: 'User',
      isActive: true,
      roleUuid: roleMap.get(UserRole.ADMIN)!.uuid,
    },
    {
      email: 'moderator@example.com',
      username: 'moderator',
      passwordHash: await bcrypt.hash('moderator123', 12),
      firstName: 'Moderator',
      lastName: 'User',
      isActive: true,
      roleUuid: roleMap.get(UserRole.MODERATOR)!.uuid,
    },
    {
      email: 'inactive@example.com',
      username: 'inactive',
      passwordHash: await bcrypt.hash('inactive123', 12),
      firstName: 'Inactive',
      lastName: 'User',
      isActive: false, // Inactive user for testing
      roleUuid: roleMap.get(UserRole.USER)!.uuid,
    },
  ];

  for (const userData of testUsers) {
    const existingUser = await userRepository.findOne({
      where: { email: userData.email },
    });

    if (!existingUser) {
      const user = userRepository.create(userData);
      await userRepository.save(user);
      const roleName = Array.from(roleMap.entries()).find(
        ([_, role]) => role.uuid === userData.roleUuid,
      )?.[0];
      console.log(
        `Created test user: ${userData.email} with role: ${roleName}`,
      );
    } else {
      // Update existing user's role if needed
      if (existingUser.roleUuid !== userData.roleUuid) {
        existingUser.roleUuid = userData.roleUuid;
        await userRepository.save(existingUser);
        const roleName = Array.from(roleMap.entries()).find(
          ([_, role]) => role.uuid === userData.roleUuid,
        )?.[0];
        console.log(
          `Updated test user: ${userData.email} with new role: ${roleName}`,
        );
      }
    }
  }

  console.log('Test seeding completed');
};
