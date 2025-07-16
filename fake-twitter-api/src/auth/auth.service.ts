import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

import { User } from '../database/entities/user.entity';
import { Role } from '../database/entities/role.entity';
import { AuthSession } from '../database/entities/auth-session.entity';
import { AuthPasswordReset } from '../database/entities/auth-password-reset.entity';

import {
  AuthRefreshTokenDto,
  AuthTokensWithUserDto,
  LoginDto,
  RegisterDto,
} from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { NotificationService } from '../notifications/notification.service';
import { DEFAULT_ROLE } from '../common/constants/roles.constant';

// Response interfaces
interface MessageOnlyResponse {
  success: boolean;
  message: string;
  data: null;
  timestamp: string;
  path: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(AuthSession)
    private readonly authSessionRepository: Repository<AuthSession>,

    @InjectRepository(AuthPasswordReset)
    private readonly authPasswordResetRepository: Repository<AuthPasswordReset>,

    private readonly jwtService: JwtService,
    private readonly notificationService: NotificationService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthTokensWithUserDto> {
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
      where: { name: DEFAULT_ROLE },
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

    // Load user with role for token generation
    const userWithRole = await this.userRepository.findOne({
      where: { uuid: savedUser.uuid },
      relations: ['role'],
    });

    if (!userWithRole) {
      throw new Error('Failed to load user with role');
    }

    // Generate tokens
    return this.generateTokens(userWithRole);
  }

  async login(loginDto: LoginDto): Promise<AuthTokensWithUserDto> {
    /*
    This function logs in a user.
    */

    const { email, password } = loginDto;

    // Find user with role (support both email and username)
    const user = await this.userRepository.findOne({
      where: [{ email }, { username: email }],
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

    // Generate tokens and return user data
    return this.generateTokens(user);
  }

  async refresh(refreshToken: string): Promise<AuthRefreshTokenDto> {
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
      const tokens = await this.generateTokens(session.user, session.uuid);
      return {
        access_token: tokens.tokens.access_token,
        refresh_token: tokens.tokens.refresh_token,
      };
    } catch (error) {
      this.logger.error('Invalid refresh token', error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(sessionId: string): Promise<MessageOnlyResponse> {
    await this.authSessionRepository.update(sessionId, { isActive: false });

    return {
      success: true,
      message: 'Logged out successfully',
      data: null,
      timestamp: new Date().toISOString(),
      path: '/api/v1/auth/logout',
    };
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;

    // Find user by email
    const user = await this.userRepository.findOne({
      where: { email, isActive: true },
    });

    // Always return success message for security (don't reveal if email exists)
    const successMessage = 'Password reset email sent';

    if (!user) {
      // Hardcoded delay to prevent timing attacks
      await new Promise(resolve => setTimeout(resolve, 500));
      return { message: successMessage };
    }

    // Generate secure reset token
    const resetToken = randomBytes(32).toString('hex');
    const tokenHash = await bcrypt.hash(resetToken, 12);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Invalidate any existing reset tokens for this user
    await this.authPasswordResetRepository.update(
      { userUuid: user.uuid, isUsed: false },
      { isUsed: true },
    );

    // Create new password reset record
    const passwordReset = this.authPasswordResetRepository.create({
      userUuid: user.uuid,
      tokenHash,
      expiresAt,
      isUsed: false,
    });

    await this.authPasswordResetRepository.save(passwordReset);

    try {
      await this.notificationService.sendPasswordResetEmail(
        email,
        resetToken,
        user.firstName || user.username,
      );
    } catch (error) {
      this.logger.error('Failed to send password reset email:', error);
      // Don't throw error - still return success for security
    }

    return { message: successMessage };
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    const { token, password } = resetPasswordDto;

    // Find valid reset token
    const resetTokenRecords = await this.authPasswordResetRepository.find({
      where: {
        isUsed: false,
        expiresAt: MoreThan(new Date()),
      },
      relations: ['user'],
    });

    // Verify token against stored hashes
    let validResetRecord: AuthPasswordReset | null = null;
    for (const record of resetTokenRecords) {
      const isValidToken = await bcrypt.compare(token, record.tokenHash);
      if (isValidToken) {
        validResetRecord = record;
        break;
      }
    }

    if (
      !validResetRecord ||
      !validResetRecord.user ||
      !validResetRecord.user.isActive
    ) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(password, 12);

    // Update user password - Using load-modify-save approach instead of update()
    const userToUpdate = await this.userRepository.findOne({
      where: { uuid: validResetRecord.user.uuid },
    });

    if (!userToUpdate) {
      throw new BadRequestException('User not found for password update');
    }

    userToUpdate.passwordHash = passwordHash;
    userToUpdate.updatedAt = new Date();

    await this.userRepository.save(userToUpdate);

    // Mark reset token as used
    await this.authPasswordResetRepository.update(validResetRecord.uuid, {
      isUsed: true,
    });

    // Invalidate all active sessions for this user (force re-login)
    await this.authSessionRepository.update(
      { userUuid: validResetRecord.user.uuid },
      { isActive: false },
    );

    // Send success email
    try {
      await this.notificationService.sendPasswordResetSuccessEmail(
        validResetRecord.user.email,
        validResetRecord.user.firstName || validResetRecord.user.username,
      );
    } catch (error) {
      this.logger.error('Failed to send password reset success email:', error);
      // Don't throw error - password reset was successful
    }

    return { message: 'Password reset successfully' };
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
  ): Promise<AuthTokensWithUserDto> {
    /*
    This function generates the tokens for the user.
    */

    let currentSessionId = sessionId;

    const payload: JwtPayload = {
      sub: user.uuid,
      email: user.email,
      username: user.username,
      role: user.role?.name || DEFAULT_ROLE,
      permissions: user.role?.permissions || {},
      sessionId: currentSessionId || '',
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION || '15m',
    });
    const refreshToken = this.jwtService.sign(
      { sub: user.uuid, type: 'refresh', sessionId: currentSessionId },
      { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION || '7d' },
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
