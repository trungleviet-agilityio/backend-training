/**
 * This file contains the interface for the JWT payload.
 */

export interface JwtPayload {
  sub: string;
  email: string;
  username: string;
  role: string;
  permissions: Record<string, unknown>;
  sessionId: string;
  iat?: number;
  exp?: number;
}
