/*
This file is used to define the JWT payload interface for the shared module.
*/

export interface IJwtPayload {
  sub: string;
  id: string;
  email: string;
  username: string;
  role: string;
  iat?: number;
  exp?: number;
}
