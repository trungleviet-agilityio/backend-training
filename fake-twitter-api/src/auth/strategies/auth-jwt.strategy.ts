/**
 * JWT authentication strategy
 */

import {
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../../database/entities/user.entity';
import { AuthSession } from '../../database/entities/auth-session.entity';
import { IAuthOperationStrategy } from './auth-operation.strategy';
import {
  AuthRefreshTokenDto,
  AuthTokensWithUserDto,
  LoginDto,
  RegisterDto,
} from '../dto';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';
import { AuthMapperService } from '../services';
import { DEFAULT_ROLE } from '../../common/constants/roles.constant';
import { Role } from 'src/database/entities/role.entity';

@Injectable()
export class JwtAuthStrategy implements IAuthOperationStrategy {
  /**
   * Constructor
   *
   * @param userRepository - User repository
   * @param authSessionRepository - Auth session repository
   * @param jwtService - JWT service
   * @param authMapperService - Auth mapper service
   */
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(AuthSession)
    private readonly authSessionRepository: Repository<AuthSession>,
    private readonly jwtService: JwtService,
    @Inject('AUTH_MAPPER_SERVICE')
    private readonly authMapperService: AuthMapperService,
    private readonly dataSource: DataSource,
  ) {}

  async authenticate(credentials: LoginDto): Promise<AuthTokensWithUserDto> {
    /**
     * Authenticate
     *
     * @param credentials - Login credentials
     * @returns Auth tokens with user
     */

    const { email, password } = credentials;

    // Find user with role (support both email and username)
    const user = await this.userRepository.findOne({
      where: [{ email }, { username: email }],
      relations: ['role'],
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user);
  }

  async register(userData: RegisterDto): Promise<AuthTokensWithUserDto> {
    /**
     * Register
     *
     * @param userData - User data
     * @returns Auth tokens with user
     */

    const { email, username, password, firstName, lastName } = userData;

    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });

    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    // Get default role
    const defaultRole = await this.roleRepository.findOne({
      where: { name: DEFAULT_ROLE },
    });

    if (!defaultRole) {
      throw new Error('Default role not found');
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = this.userRepository.create({
      email,
      username,
      passwordHash,
      firstName,
      lastName,
      roleUuid: defaultRole.uuid,
    });

    const savedUser = await this.userRepository.save(user);

    const userWithRole = await this.userRepository.findOne({
      where: { uuid: savedUser.uuid },
      relations: ['role'],
    });

    if (!userWithRole) {
      throw new Error('Failed to load user with role');
    }

    return this.generateTokens(userWithRole);
  }

  async refreshToken(refreshToken: string): Promise<AuthRefreshTokenDto> {
    /**
     * Refresh token
     *
     * @param refreshToken - Refresh token
     * @returns Auth refresh token
     */

    try {
      const payload = this.jwtService.verify(refreshToken);

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

      const isValidToken = await bcrypt.compare(
        refreshToken,
        session.refreshTokenHash,
      );
      if (!isValidToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = await this.generateTokens(session.user, session.uuid);
      return {
        access_token: tokens.tokens.access_token,
        refresh_token: tokens.tokens.refresh_token,
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(sessionId: string): Promise<void> {
    /**
     * Logout
     *
     * @param sessionId - Session ID
     */

    await this.authSessionRepository.update(sessionId, { isActive: false });
  }

  async validateToken(token: string): Promise<User> {
    /**
     * Validate token
     *
     * @param token - Token
     * @returns User
     */

    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userRepository.findOne({
        where: { uuid: payload.sub },
        relations: ['role'],
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Invalid token');
      }

      return user;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private async generateTokens(
    user: User,
    sessionId?: string,
  ): Promise<AuthTokensWithUserDto> {
    /*
    This function generates the tokens for the user.
    */

    let currentSessionId = sessionId;

    const payload: IJwtPayload = {
      sub: user.uuid,
      email: user.email,
      username: user.username,
      role: user.role?.name || DEFAULT_ROLE,
      permissions: user.role?.permissions || {},
      sessionId: currentSessionId || '',
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
    });
    const refreshToken = this.jwtService.sign(
      { sub: user.uuid, type: 'refresh', sessionId: currentSessionId },
      { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION },
    );

    // Create or update session
    const refreshTokenHash = await bcrypt.hash(refreshToken, 12);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    if (currentSessionId) {
      // Update existing session
      await this.authSessionRepository.update(currentSessionId, {
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
      const savedSession = await this.authSessionRepository.save(session);
      currentSessionId = savedSession.uuid;
    }

    return {
      tokens: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
      user: {
        uuid: user.uuid,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: {
          name: user.role?.name || DEFAULT_ROLE,
        },
      },
    };
  }
}
