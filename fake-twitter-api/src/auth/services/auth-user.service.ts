/**
 * User Management Service - Handles user operations
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../database/entities/user.entity';
import { Role } from '../../database/entities/role.entity';
import { RegisterPayloadDto } from '../dto';
import { DEFAULT_ROLE } from '../../common/constants/roles.constant';

@Injectable()
export class AuthUserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async validateCredentials(
    emailOrUsername: string,
    password: string,
  ): Promise<User> {
    /*
    This method is used to validate the credentials of a user.

    @param emailOrUsername - Email or username
    @param password - Password
    @returns User
    */
    const user = await this.userRepository.findOne({
      where: [{ email: emailOrUsername }, { username: emailOrUsername }],
      relations: ['role'],
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async createUser(payload: RegisterPayloadDto): Promise<User> {
    /*
    This method is used to create a new user.

    @param payload - Register payload
    @returns User
    */
    // Check for existing user
    const existingUser = await this.userRepository.findOne({
      where: [{ email: payload.email }, { username: payload.username }],
    });

    if (existingUser) {
      if (existingUser.email === payload.email) {
        throw new Error('EMAIL_EXISTS');
      }
      if (existingUser.username === payload.username) {
        throw new Error('USERNAME_EXISTS');
      }
    }

    // Get default role
    const defaultRole = await this.roleRepository.findOne({
      where: { name: DEFAULT_ROLE },
    });

    if (!defaultRole) {
      throw new Error('Default role not found');
    }

    // Create user
    const passwordHash = await bcrypt.hash(payload.password, 12);
    const user = this.userRepository.create({
      email: payload.email,
      username: payload.username,
      passwordHash,
      firstName: payload.firstName,
      lastName: payload.lastName,
      roleUuid: defaultRole.uuid,
    });

    const savedUser = await this.userRepository.save(user);

    // Return user with role
    const userWithRole = await this.userRepository.findOne({
      where: { uuid: savedUser.uuid },
      relations: ['role'],
    });

    if (!userWithRole) {
      throw new Error('User not found after creation');
    }

    return userWithRole;
  }

  async findByEmail(email: string): Promise<User | null> {
    /*
    This method is used to find a user by email.

    @param email - Email
    @returns User
    */
    return await this.userRepository.findOne({
      where: { email },
      relations: ['role'],
    });
  }

  async updatePassword(userUuid: string, newPassword: string): Promise<void> {
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await this.userRepository.update(userUuid, { passwordHash });
  }
}
