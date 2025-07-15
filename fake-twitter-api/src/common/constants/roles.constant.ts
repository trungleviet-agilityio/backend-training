/**
 * This file contains the constants for the roles of the users.
 */

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
}

export const DEFAULT_ROLE = UserRole.USER;
