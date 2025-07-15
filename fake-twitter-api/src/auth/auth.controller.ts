/**
 * This file contains the controller for the auth.
 */

import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthLogoutResponse, AuthResponse } from './interfaces/auth-response.interface';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponse> {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  async logout(@CurrentUser() user: JwtPayload): Promise<AuthLogoutResponse> {
    await this.authService.logout(user.sub);
    return { message: 'Logged out successfully' };
  }

  // @Post('refresh')
  // async refresh(@Req() req: Request): Promise<void> {
  //     // TODO: Implement refresh
  // }

  // @Post('forgot-password')
  // async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<AuthResponse> {
  //     // TODO: Implement forgot password
  // }

  // @Post('reset-password')
  // async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<AuthResponse> {
  //     // TODO: Implement reset password
  // }

  // @Post('change-password')
  // async changePassword(@Body() changePasswordDto: ChangePasswordDto): Promise<AuthResponse> {
  //     // TODO: Implement change password
  // }
}
