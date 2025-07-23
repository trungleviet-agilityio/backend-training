/**
 * This file contains the tests for the role seed.
 */

import { seedRoles } from './role.seed';
import { DataSource, Repository } from 'typeorm';
import { Role } from '../entities/role.entity';

describe('seedRoles', () => {
  let dataSource: jest.Mocked<DataSource>;
  let roleRepository: jest.Mocked<Repository<Role>>;

  beforeEach(() => {
    roleRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<Repository<Role>>;
    dataSource = {
      getRepository: jest.fn().mockReturnValue(roleRepository),
    } as unknown as jest.Mocked<DataSource>;
  });

  it('should create roles if they do not exist', async () => {
    roleRepository.findOne.mockResolvedValue(null);
    roleRepository.create.mockImplementation(
      role =>
        ({
          ...role,
          name: role.name || '',
          description: role.description || '',
          permissions: role.permissions || {},
        }) as Role,
    );
    roleRepository.save.mockResolvedValue({
      name: '',
      description: '',
      permissions: {},
    } as Role);

    await seedRoles(dataSource);

    expect(roleRepository.create).toHaveBeenCalledTimes(3);
    expect(roleRepository.save).toHaveBeenCalledTimes(3);
  });

  it('should not create roles if they already exist', async () => {
    roleRepository.findOne.mockResolvedValue({} as Role);
    await seedRoles(dataSource);
    expect(roleRepository.create).not.toHaveBeenCalled();
    expect(roleRepository.save).not.toHaveBeenCalled();
  });
});
