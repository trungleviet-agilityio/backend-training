/**
 * Auth operation strategy interface
 */

import { User } from '../../database/entities/user.entity';
import {
  AuthRefreshTokenDto,
  AuthTokensWithUserDto,
  LoginDto,
  RegisterDto,
} from '../dto';

export interface IAuthOperationStrategy {
  authenticate(credentials: LoginDto): Promise<AuthTokensWithUserDto>;
  register(userData: RegisterDto): Promise<AuthTokensWithUserDto>;
  refreshToken(refreshToken: string): Promise<AuthRefreshTokenDto>;
  logout(sessionId: string): Promise<void>;
  validateToken(token: string): Promise<User>;
}
