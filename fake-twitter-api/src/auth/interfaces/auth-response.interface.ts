/**
 * This file contains the interface for the auth response.
 */

import { Role } from '../../database/entities/role.entity';
import { User } from '../../database/entities/user.entity';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  role: Role;
}

export interface AuthLogoutResponse {
  message: string;
}
