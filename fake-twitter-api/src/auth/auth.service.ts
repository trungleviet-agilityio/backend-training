import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../database/entities/user.entity';
import { Role } from '../database/entities/role.entity';
import { AuthSession } from '../database/entities/auth-session.entity';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { AuthResponse } from './interfaces/auth-response.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(AuthSession)
    private readonly authSessionRepository: Repository<AuthSession>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    /*
    This function registers a new user.
    */

    const { email, username, password, firstName, lastName } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });

    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    // Get default role
    const defaultRole = await this.roleRepository.findOne({
      where: { name: 'user' },
    });

    if (!defaultRole) {
      throw new Error('Default role not found');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = this.userRepository.create({
      email,
      username,
      passwordHash,
      firstName,
      lastName,
      roleUuid: defaultRole.uuid,
    });

    const savedUser = await this.userRepository.save(user);

    // Generate tokens
    return this.generateTokens(savedUser);
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    /*
    This function logs in a user.
    */

    const { email, password } = loginDto;

    // Find user with role
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['role'],
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    return this.generateTokens(user);
  }

  async refresh(refreshToken: string): Promise<AuthResponse> {
    /*
    This function refreshes a token.
    */

    try {
      const payload = this.jwtService.verify(refreshToken);

      // Find active session
      const session = await this.authSessionRepository.findOne({
        where: {
          uuid: payload.sessionId,
          isActive: true,
        },
        relations: ['user', 'user.role'],
      });

      if (!session || session.expiresAt < new Date()) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Verify token hash
      const isValidToken = await bcrypt.compare(
        refreshToken,
        session.refreshTokenHash,
      );
      if (!isValidToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new tokens
      return this.generateTokens(session.user, session.uuid);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(sessionId: string): Promise<void> {
    await this.authSessionRepository.update(sessionId, { isActive: false });
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { uuid: payload.sub },
      relations: ['role'],
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  private async generateTokens(
    user: User,
    sessionId?: string,
  ): Promise<AuthResponse> {
    /*
    This function generates the tokens for the user.
    */

    const payload: JwtPayload = {
      sub: user.uuid,
      email: user.email,
      username: user.username,
      role: user.role?.name || 'user',
      permissions: user.role?.permissions || {},
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(
      { sub: user.uuid, type: 'refresh' },
      { expiresIn: '7d' },
    );

    // Create or update session
    const refreshTokenHash = await bcrypt.hash(refreshToken, 12);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    if (sessionId) {
      // Update existing session
      await this.authSessionRepository.update(sessionId, {
        refreshTokenHash,
        expiresAt,
      });
    } else {
      // Create new session
      const session = this.authSessionRepository.create({
        userUuid: user.uuid,
        refreshTokenHash,
        expiresAt,
      });
      await this.authSessionRepository.save(session);
    }

    return {
      accessToken,
      refreshToken,
      user: user as unknown as User,
      role: user.role,
    };
  }
}
