/**
 * Authentication Service
 * Handles user authentication and JWT token management
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { IJwtPayload } from '../../commons/interfaces/common.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(
    loginDto: LoginDto,
  ): Promise<{ access_token: string; user: any }> {
    const { email, password: _password } = loginDto;

    // Find user by email
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // TODO: Implement password verification with bcrypt
    // For now, we'll just check if password is provided
    if (!_password) {
      throw new UnauthorizedException('Password is required');
    }

    // Generate JWT payload
    const payload: IJwtPayload = {
      sub: user.id,
      id: user.id,
      email: user.email,
      role: user.role,
    };

    // Generate access token
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async register(
    registerDto: RegisterDto,
  ): Promise<{ access_token: string; user: any }> {
    // TODO: Hash password with bcrypt before saving
    const user = await this.usersService.create(registerDto);

    // Generate JWT payload
    const payload: IJwtPayload = {
      sub: user.id,
      id: user.id,
      email: user.email,
      role: user.role,
    };

    // Generate access token
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async validateUser(payload: IJwtPayload): Promise<any> {
    const user = await this.usersService.findOne(payload.id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
