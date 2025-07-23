/**
 * This file contains the tests for the test seed.
 */

import { runTestSeeds } from '../test-seed';
import { DataSource, Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Role } from '../../entities/role.entity';
import { UserRole } from '../../../common/constants/roles.constant';
import * as bcrypt from 'bcrypt';

describe('runTestSeeds', () => {
  let dataSource: jest.Mocked<DataSource>;
  let userRepository: jest.Mocked<Repository<User>>;
  let roleRepository: jest.Mocked<Repository<Role>>;
  let logSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    userRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<Repository<User>>;
    roleRepository = {
      find: jest.fn(),
    } as unknown as jest.Mocked<Repository<Role>>;
    dataSource = {
      getRepository: jest.fn().mockImplementation(entity => {
        if (entity === User) return userRepository;
        if (entity === Role) return roleRepository;
      }),
    } as unknown as jest.Mocked<DataSource>;
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it('should log error and return if required roles are missing', async () => {
    roleRepository.find.mockResolvedValue([]);
    await runTestSeeds(dataSource);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('Required role'),
    );
  });

  it('should create users if they do not exist', async () => {
    // Mock roles
    const roles = [UserRole.USER, UserRole.ADMIN, UserRole.MODERATOR].map(
      (name, i) => ({ name, uuid: `uuid-${i}` }) as Role,
    );
    roleRepository.find.mockResolvedValue(roles);
    userRepository.findOne.mockResolvedValue(null);
    userRepository.create.mockImplementation(user => ({ ...user }) as User);
    userRepository.save.mockResolvedValue({} as User);
    jest.spyOn(bcrypt, 'hash').mockImplementation(async () => 'hashed');
    await runTestSeeds(dataSource);
    expect(userRepository.create).toHaveBeenCalled();
    expect(userRepository.save).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('Created test user'),
    );
  });

  it('should update user role if user exists with wrong role', async () => {
    const roles = [UserRole.USER, UserRole.ADMIN, UserRole.MODERATOR].map(
      (name, i) => ({ name, uuid: `uuid-${i}` }) as Role,
    );
    roleRepository.find.mockResolvedValue(roles);
    userRepository.findOne.mockResolvedValue({
      email: 'test@example.com',
      roleUuid: 'wrong-uuid',
    } as User);
    userRepository.save.mockResolvedValue({} as User);
    jest.spyOn(bcrypt, 'hash').mockImplementation(async () => 'hashed');
    await runTestSeeds(dataSource);
    expect(userRepository.save).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('Updated test user'),
    );
  });
});
