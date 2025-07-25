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
  ForgotPasswordPayloadDto,
  LoginPayloadDto,
  RefreshTokenPayloadDto,
  RegisterPayloadDto,
  RegisterResponseDto,
  ResetPasswordPayloadDto,
  ForgotPasswordResponseDto,
  ResetPasswordResponseDto,
  RefreshTokenResponseDto,
  LogoutResponseDto,
  LoginResponseDto,
  AuthInvalidCredentialsError,
  AuthUserAlreadyExistsError,
  AuthInvalidTokenError,
  AuthPasswordResetTokenExpiredError,
  AuthWeakPasswordError,
  UserInfoDto,
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
import { ValidationErrorResponse } from '../common';
import { Public } from './decorators';
import { ResponseMessage } from '../common/decorators';

@ApiTags('Authentication')
@Controller('auth')
@ApiBearerAuth('JWT-auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @ResponseMessage('User registered successfully')
  @ApiOperation({
    summary: 'Register a new user',
    description: `Creates a new user account with email, username, password, and optional personal information.
      Returns JWT tokens for immediate authentication.`,
  })
  @ApiBody({
    type: RegisterPayloadDto,
    description: 'User registration data',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: RegisterResponseDto,
    description: 'User successfully registered and authenticated',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ValidationErrorResponse,
    description: 'Bad Request - Validation failed',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    type: AuthWeakPasswordError,
    description: 'Unprocessable Entity - Password does not meet requirements',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    type: AuthUserAlreadyExistsError,
    description: 'Conflict - Email or username already exists',
  })
  async register(
    @Body() registerPayloadDto: RegisterPayloadDto,
  ): Promise<RegisterResponseDto> {
    return await this.authService.register(registerPayloadDto);
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('User logged in successfully')
  @ApiOperation({
    summary: 'Login user',
    description: `Authenticate user with email and password.
      Returns JWT access and refresh tokens along with user information.`,
  })
  @ApiBody({
    type: LoginPayloadDto,
    description: 'User login credentials',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: LoginResponseDto,
    description: 'Login successful',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: AuthInvalidCredentialsError,
    description: 'Unauthorized - Invalid credentials',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ValidationErrorResponse,
    description: 'Bad Request - Validation failed',
  })
  async login(
    @Body() loginPayloadDto: LoginPayloadDto,
  ): Promise<LoginResponseDto> {
    return await this.authService.login(loginPayloadDto);
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Token refreshed successfully')
  @ApiOperation({
    summary: 'Refresh access token',
    description: `Generate new access and refresh tokens using a valid refresh token.
      The old refresh token will be invalidated.`,
  })
  @ApiBody({
    type: RefreshTokenPayloadDto,
    description: 'Refresh token payload',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: RefreshTokenResponseDto,
    description: 'Token refreshed successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ValidationErrorResponse,
    description: 'Bad Request - Invalid or missing refresh token',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: AuthInvalidTokenError,
    description: 'Unauthorized - Invalid or expired refresh token',
  })
  async refresh(
    @Body() refreshTokenPayloadDto: RefreshTokenPayloadDto,
  ): Promise<RefreshTokenResponseDto> {
    return await this.authService.refresh(refreshTokenPayloadDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('User logged out successfully')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Logout user',
    description: `Invalidate the current user session and refresh token.
      Requires valid JWT access token in Authorization header.`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: LogoutResponseDto,
    description: 'User successfully logged out',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: AuthInvalidTokenError,
    description: 'Unauthorized - Invalid or expired JWT token',
  })
  async logout(
    @CurrentUser() currentUser: IJwtPayload & { user: UserInfoDto },
  ): Promise<LogoutResponseDto> {
    return await this.authService.logout(currentUser);
  }

  @Post('forgot-password')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Password reset email sent')
  @ApiOperation({
    summary: 'Request password reset',
    description: `Initiates password reset process by sending a reset token to the user's email address.
      Always returns success for security reasons.`,
  })
  @ApiBody({
    type: ForgotPasswordPayloadDto,
    description: 'Email address for password reset',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ForgotPasswordResponseDto,
    description: 'Password reset email sent (always returned for security)',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ValidationErrorResponse,
    description: 'Bad Request - Validation failed',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ValidationErrorResponse,
    description: 'Internal Server Error - Email sending failed',
  })
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordPayloadDto,
  ): Promise<ForgotPasswordResponseDto> {
    await this.authService.forgotPassword(forgotPasswordDto);
    return new ForgotPasswordResponseDto();
  }

  @Post('reset-password')
  @Public()
  @ResponseMessage('Password reset successfully')
  @ApiOperation({
    summary: 'Reset password',
    description: `Resets user password using a valid reset token received via email.
      Invalidates all active sessions forcing re-login.`,
  })
  @ApiBody({
    type: ResetPasswordPayloadDto,
    description: 'Password reset data',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResetPasswordResponseDto,
    description: 'Password reset successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ValidationErrorResponse,
    description: 'Bad Request - Validation failed',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: AuthPasswordResetTokenExpiredError,
    description: 'Unauthorized - Invalid or expired reset token',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    type: AuthWeakPasswordError,
    description:
      'Unprocessable Entity - New password does not meet requirements',
  })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordPayloadDto,
  ): Promise<ResetPasswordResponseDto> {
    return await this.authService.resetPassword(resetPasswordDto);
  }
}
