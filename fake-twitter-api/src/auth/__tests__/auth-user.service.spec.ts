/**
 * AuthUserService Unit Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AuthUserService } from '../services';
import { User } from '../../database/entities/user.entity';
import { Role } from '../../database/entities/role.entity';
import { RegisterPayloadDto } from '../dto';
import { AuthMockProvider } from './mocks/auth-mock.provider';
import { TestDataFactory } from '../../common/__tests__/test-utils';

jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthUserService', () => {
  let service: AuthUserService;
  let userRepository: jest.Mocked<any>;
  let roleRepository: jest.Mocked<any>;

  beforeEach(async () => {
    const mockUserRepository = AuthMockProvider.createUserRepository();
    const mockRoleRepository = AuthMockProvider.createRoleRepository();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthUserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Role),
          useValue: mockRoleRepository,
        },
      ],
    }).compile();

    service = module.get<AuthUserService>(AuthUserService);
    userRepository = module.get(getRepositoryToken(User));
    roleRepository = module.get(getRepositoryToken(Role));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateCredentials', () => {
    it('should validate user credentials successfully', async () => {
      // Arrange
      const user = TestDataFactory.createUser();
      const email = 'test@example.com';
      const password = 'password123';

      userRepository.findOne.mockResolvedValue(user);
      mockedBcrypt.compare.mockResolvedValue(true as never);

      // Act
      const result = await service.validateCredentials(email, password);

      // Assert
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: [{ email }, { username: email }],
        relations: ['role'],
      });
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        password,
        user.passwordHash,
      );
      expect(result).toEqual(user);
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      // Arrange
      userRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.validateCredentials('invalid@example.com', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for inactive user', async () => {
      // Arrange
      const inactiveUser = TestDataFactory.createUser({ isActive: false });
      userRepository.findOne.mockResolvedValue(inactiveUser);

      // Act & Assert
      await expect(
        service.validateCredentials('test@example.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for wrong password', async () => {
      // Arrange
      const user = TestDataFactory.createUser();
      userRepository.findOne.mockResolvedValue(user);
      mockedBcrypt.compare.mockResolvedValue(false as never);

      // Act & Assert
      await expect(
        service.validateCredentials('test@example.com', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('createUser', () => {
    it('should create user successfully', async () => {
      // Arrange
      const registerPayload: RegisterPayloadDto = {
        email: 'new@example.com',
        username: 'newuser',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
      };

      const defaultRole = TestDataFactory.createRole();
      const newUser = TestDataFactory.createUser();
      const userWithRole = TestDataFactory.createUser({ role: defaultRole });

      userRepository.findOne
        .mockResolvedValueOnce(null) // No existing user
        .mockResolvedValueOnce(userWithRole); // User with role after creation
      roleRepository.findOne.mockResolvedValue(defaultRole);
      userRepository.create.mockReturnValue(newUser);
      userRepository.save.mockResolvedValue(newUser);
      mockedBcrypt.hash.mockResolvedValue('hashedpassword' as never);

      // Act
      const result = await service.createUser(registerPayload);

      // Assert
      expect(result).toEqual(userWithRole);
      expect(userRepository.create).toHaveBeenCalled();
      expect(userRepository.save).toHaveBeenCalled();
    });

    it('should throw error if email already exists', async () => {
      // Arrange
      const existingUser = TestDataFactory.createUser({
        email: 'existing@example.com',
      });
      const registerPayload: RegisterPayloadDto = {
        email: 'existing@example.com',
        username: 'newuser',
        password: 'password123',
      };

      userRepository.findOne.mockResolvedValue(existingUser);

      // Act & Assert
      await expect(service.createUser(registerPayload)).rejects.toThrow(
        'EMAIL_EXISTS',
      );
    });

    it('should throw error if username already exists', async () => {
      // Arrange
      const existingUser = TestDataFactory.createUser({
        username: 'existinguser',
      });
      const registerPayload: RegisterPayloadDto = {
        email: 'new@example.com',
        username: 'existinguser',
        password: 'password123',
      };

      userRepository.findOne.mockResolvedValue(existingUser);

      // Act & Assert
      await expect(service.createUser(registerPayload)).rejects.toThrow(
        'USERNAME_EXISTS',
      );
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      // Arrange
      const user = TestDataFactory.createUser();
      const email = 'test@example.com';

      userRepository.findOne.mockResolvedValue(user);

      // Act
      const result = await service.findByEmail(email);

      // Assert
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email },
        relations: ['role'],
      });
      expect(result).toEqual(user);
    });

    it('should return null if user not found', async () => {
      // Arrange
      userRepository.findOne.mockResolvedValue(null);

      // Act
      const result = await service.findByEmail('notfound@example.com');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('updatePassword', () => {
    it('should update user password', async () => {
      // Arrange
      const userUuid = 'user-uuid';
      const newPassword = 'newpassword123';
      const hashedPassword = 'hashedpassword';

      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);
      userRepository.update.mockResolvedValue({ affected: 1 });

      // Act
      await service.updatePassword(userUuid, newPassword);

      // Assert
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(newPassword, 12);
      expect(userRepository.update).toHaveBeenCalledWith(userUuid, {
        passwordHash: hashedPassword,
      });
    });
  });
});
