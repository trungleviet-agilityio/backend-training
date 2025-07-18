/**
 * This file contains the controller for the auth.
 */

import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  AuthRefreshTokenDto,
  AuthTokensWithUserDto,
  ForgotPasswordDto,
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
  ResetPasswordDto,
} from './dto';
import { AuthService } from './services';
import { CurrentUser } from './decorators/current-user.decorator';
import { IJwtPayload } from './interfaces/jwt-payload.interface';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from './guards';
import { Public, ResponseMessage } from '../common';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  /**
   * Constructor
   *
   * @param authService - Auth service
   */
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @ResponseMessage('User registered successfully')
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Creates a new user account with email, username, password, and optional personal information. Returns JWT tokens for immediate authentication.',
  })
  @ApiBody({
    type: RegisterDto,
    description: 'User registration data',
    examples: {
      'complete-registration': {
        summary: 'Complete registration with all fields',
        description: 'Registration with all optional fields provided',
        value: {
          email: 'john.doe@example.com',
          username: 'johndoe',
          password: 'SecurePass123!',
          firstName: 'John',
          lastName: 'Doe',
        },
      },
      'minimal-registration': {
        summary: 'Minimal registration',
        description: 'Registration with only required fields',
        value: {
          email: 'jane.smith@example.com',
          username: 'janesmith',
          password: 'MyPassword456!',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered and authenticated',
    schema: {
      example: {
        success: true,
        message: 'User registered successfully',
        data: {
          tokens: {
            access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
          user: {
            uuid: '123e4567-e89b-12d3-a456-426614174000',
            username: 'johndoe',
            firstName: 'John',
            lastName: 'Doe',
            role: {
              name: 'user',
            },
          },
        },
        timestamp: '2024-01-01T00:00:00.000Z',
        path: '/api/v1/auth/register',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Validation failed',
    schema: {
      example: {
        success: false,
        message: 'Validation failed',
        errors: [
          'Email must be a valid email address',
          'Username must be at least 3 characters long',
          'Password must be at least 8 characters long',
        ],
        statusCode: 400,
        timestamp: '2024-01-01T00:00:00.000Z',
        path: '/api/v1/auth/register',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - User already exists',
    schema: {
      example: {
        success: false,
        message: 'User already exists',
        statusCode: 401,
        timestamp: '2024-01-01T00:00:00.000Z',
        path: '/api/v1/auth/register',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description:
      'Internal Server Error - Default role not found or database error',
    schema: {
      example: {
        success: false,
        message: 'Default role not found',
        statusCode: 500,
        timestamp: '2024-01-01T00:00:00.000Z',
        path: '/api/v1/auth/register',
      },
    },
  })
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<AuthTokensWithUserDto> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Login successful')
  @ApiOperation({
    summary: 'Login user',
    description:
      'Authenticate user with email and password. Returns JWT access and refresh tokens along with user information.',
  })
  @ApiBody({
    type: LoginDto,
    description: 'User login credentials',
    examples: {
      'email-login': {
        summary: 'Login with email',
        description: 'Standard login using email and password',
        value: {
          email: 'john.doe@example.com',
          password: 'SecurePass123!',
        },
      },
      'username-login': {
        summary: 'Login with username',
        description: 'Alternative login using username instead of email',
        value: {
          email: 'johndoe',
          password: 'SecurePass123!',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      example: {
        success: true,
        message: 'Login successful',
        data: {
          tokens: {
            access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
          user: {
            uuid: '123e4567-e89b-12d3-a456-426614174000',
            username: 'johndoe',
            firstName: 'John',
            lastName: 'Doe',
            role: {
              name: 'user',
            },
          },
        },
        timestamp: '2024-01-01T00:00:00.000Z',
        path: '/api/v1/auth/login',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Validation failed',
    schema: {
      example: {
        success: false,
        message: 'Validation failed',
        errors: ['Email or username is required', 'Password is required'],
        statusCode: 400,
        timestamp: '2024-01-01T00:00:00.000Z',
        path: '/api/v1/auth/login',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid credentials or inactive user',
    schema: {
      example: {
        success: false,
        message: 'Invalid credentials',
        statusCode: 401,
        timestamp: '2024-01-01T00:00:00.000Z',
        path: '/api/v1/auth/login',
      },
    },
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthTokensWithUserDto> {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Token refreshed successfully')
  @ApiOperation({
    summary: 'Refresh access token',
    description:
      'Generate new access and refresh tokens using a valid refresh token. The old refresh token will be invalidated.',
  })
  @ApiBody({
    type: RefreshTokenDto,
    description: 'Refresh token payload',
    examples: {
      'valid-refresh-token': {
        summary: 'Valid refresh token',
        description: 'Example of a valid refresh token request',
        value: {
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    schema: {
      example: {
        success: true,
        message: 'Token refreshed successfully',
        data: {
          access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        timestamp: '2024-01-01T00:00:00.000Z',
        path: '/api/v1/auth/refresh',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid or missing refresh token',
    schema: {
      example: {
        success: false,
        message: 'Validation failed',
        errors: ['Refresh token is required', 'Refresh token must be a string'],
        statusCode: 400,
        timestamp: '2024-01-01T00:00:00.000Z',
        path: '/api/v1/auth/refresh',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or expired refresh token',
    schema: {
      example: {
        success: false,
        message: 'Invalid refresh token',
        statusCode: 401,
        timestamp: '2024-01-01T00:00:00.000Z',
        path: '/api/v1/auth/refresh',
      },
    },
  })
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthRefreshTokenDto> {
    return this.authService.refresh(refreshTokenDto.refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Logged out successfully')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Logout user',
    description:
      'Invalidate the current user session and refresh token. Requires valid JWT access token in Authorization header.',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged out',
    schema: {
      example: {
        success: true,
        message: 'Logged out successfully',
        data: null,
        timestamp: '2024-01-01T00:00:00.000Z',
        path: '/api/v1/auth/logout',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
    schema: {
      example: {
        success: false,
        message: 'Unauthorized',
        statusCode: 401,
        timestamp: '2024-01-01T00:00:00.000Z',
        path: '/api/v1/auth/logout',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User not found or inactive',
    schema: {
      example: {
        success: false,
        message: 'User not found',
        statusCode: 403,
        timestamp: '2024-01-01T00:00:00.000Z',
        path: '/api/v1/auth/logout',
      },
    },
  })
  async logout(@CurrentUser() user: IJwtPayload): Promise<void> {
    await this.authService.logout(user.sub);
  }

  @Post('forgot-password')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Password reset email sent')
  @ApiOperation({
    summary: 'Request password reset',
    description:
      "Initiates password reset process by sending a reset token to the user's email address. Always returns success for security reasons.",
  })
  @ApiBody({
    type: ForgotPasswordDto,
    description: 'Email address for password reset',
    examples: {
      'password-reset-request': {
        summary: 'Password reset request',
        description: 'Request password reset for an email address',
        value: {
          email: 'john.doe@example.com',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset email sent (always returned for security)',
    schema: {
      example: {
        success: true,
        message: 'Password reset email sent',
        data: {
          message: 'Password reset email sent',
        },
        timestamp: '2024-01-01T00:00:00.000Z',
        path: '/api/v1/auth/forgot-password',
      },
    },
  })
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('reset-password')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Password reset successfully')
  @ApiOperation({
    summary: 'Reset password',
    description:
      'Resets user password using a valid reset token received via email. Invalidates all active sessions forcing re-login.',
  })
  @ApiBody({
    type: ResetPasswordDto,
    description: 'Password reset data',
    examples: {
      'password-reset': {
        summary: 'Reset password with token',
        description: 'Reset password using token from email',
        value: {
          token: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
          password: 'NewSecurePass123!',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully',
    schema: {
      example: {
        success: true,
        message: 'Password reset successfully',
        data: {
          message: 'Password reset successfully',
        },
        timestamp: '2024-01-01T00:00:00.000Z',
        path: '/api/v1/auth/reset-password',
      },
    },
  })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.password,
    );
  }
}
