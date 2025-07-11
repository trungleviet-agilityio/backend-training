/**
 * Authentication Service
 * Handles user authentication and JWT token management
 */

import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { IJwtPayload } from '../../commons/interfaces/common.interface';

@Injectable()
export class AuthService {
  private readonly saltRounds = 12;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}



  async register(
    registerDto: RegisterDto,
  ): Promise<{ access_token: string; user: any }> {
    try {
      // Hash password before saving
      const hashedPassword = await this.hashPassword(registerDto.password);
      const userWithHashedPassword = {
        ...registerDto,
        password: hashedPassword,
      };

      // Create user with hashed password
      const user = await this.usersService.create(userWithHashedPassword);

      // Generate access token
      const access_token = await this.generateAccessToken(user);

      return {
        access_token,
        user: this.createUserResponse(user),
      };
    } catch (error) {
      // Handle database constraint violations (duplicate email)
      if (error.code === '23505' && error.constraint === 'UQ_97672ac88f789774dd47f7c8be3') {
        throw new ConflictException('Email already exists');
      }
      // Re-throw other errors
      throw error;
    }
  }

  async validateUser(payload: IJwtPayload): Promise<any> {
    const user = await this.usersService.findOne(payload.id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  /**
   * Validate user credentials (email and password)
   */
  async validateUserCredentials(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    // Verify password
    const isPasswordValid = await this.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  /**
   * Hash password using bcrypt
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  /**
   * Verify password against hash
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate JWT access token
   */
  async generateAccessToken(user: any): Promise<string> {
    const payload: IJwtPayload = {
      sub: user.id,
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }

  /**
   * Create user response object (exclude sensitive data)
   */
  createUserResponse(user: any): any {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
