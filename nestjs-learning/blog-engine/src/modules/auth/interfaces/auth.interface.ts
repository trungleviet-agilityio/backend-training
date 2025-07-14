/*
This file is used to define the interfaces for the auth module.
*/

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface IAuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export interface IJwtPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface ICurrentUser {
  id: string;
  email: string;
  role: string;
}

export interface IAuthTokens {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

export interface AuthModuleOptions {
  isGlobal?: boolean;
  jwt?: {
    secret?: string;
    expiresIn?: string;
    global?: boolean;
  };
  strategies?: string[];
  defaultStrategy?: string;
}
