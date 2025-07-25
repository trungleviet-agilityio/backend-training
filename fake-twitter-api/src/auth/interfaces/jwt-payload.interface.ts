/**
 * This file contains the interface for the JWT payload.
 */

export interface IJwtPayload {
  sub: string;
  email: string;
  username: string;
  role: string;
  permissions: Record<string, unknown>;
  sessionId: string;
  iat?: number;
  exp?: number;
  jti?: string;
}
