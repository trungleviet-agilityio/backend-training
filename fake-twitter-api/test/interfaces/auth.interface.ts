/**
 * Auth E2E Test Types
 * Proper type definitions for auth e2e tests
 */

export interface IUserRegistrationData {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface IUserLoginData {
  email: string;
  password: string;
}

export interface IUserProfileData {
  uuid: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatarUrl?: string;
  isActive: boolean;
  emailVerified: boolean;
  role: {
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Token Types
export interface IAuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface IRefreshTokens {
  access_token: string;
  refresh_token: string;
}

// API Response Types
export interface IApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  timestamp: string;
}

export interface IAuthResponse {
  user: IUserProfileData;
  tokens: IAuthTokens;
}

export interface ILoginResponse extends IApiResponse<IAuthResponse> {}

export interface IRegisterResponse extends IApiResponse<IAuthResponse> {}

export interface IRefreshResponse extends IApiResponse<IRefreshTokens> {}

export interface ILogoutResponse extends IApiResponse<null> {}

export interface IForgotPasswordResponse extends IApiResponse<null> {}

export interface IResetPasswordResponse extends IApiResponse<null> {}

// Error Response Types
export interface IValidationError {
  field: string;
  message: string;
}

export interface IErrorResponse extends IApiResponse<null> {
  errors?: IValidationError[];
  statusCode?: number;
}

// Test Helper Response Types
export interface ITestResponse<T = unknown> {
  status: number;
  body: T;
}

export interface IAuthTestResponse extends ITestResponse<IApiResponse> {
  tokens?: IAuthTokens;
}

export interface ILoginTestResponse extends ITestResponse<ILoginResponse> {
  tokens?: IAuthTokens;
}

export interface IRegisterTestResponse
  extends ITestResponse<IRegisterResponse> {
  tokens?: IAuthTokens;
}

export interface IRefreshTestResponse extends ITestResponse<IRefreshResponse> {
  tokens?: IRefreshTokens;
}

export interface ILogoutTestResponse extends ITestResponse<ILogoutResponse> {}

export interface IForgotPasswordTestResponse
  extends ITestResponse<IForgotPasswordResponse> {}

export interface IResetPasswordTestResponse
  extends ITestResponse<IResetPasswordResponse> {}

// Test Helper Types
export interface IAuthTestHelper {
  registerUser(userData: IUserRegistrationData): Promise<IRegisterTestResponse>;
  loginUser(credentials: IUserLoginData): Promise<ILoginTestResponse>;
  logoutUser(accessToken: string): Promise<ILogoutTestResponse>;
  refreshTokens(refreshToken: string): Promise<IRefreshTestResponse>;
  requestPasswordReset(email: string): Promise<IForgotPasswordTestResponse>;
  resetPassword(
    token: string,
    newPassword: string,
  ): Promise<IResetPasswordTestResponse>;
  testEndpointAvailability(endpoint: string): Promise<ITestResponse>;
  expectValidJwtToken(token: string): void;
  expectValidAuthResponse(response: IApiResponse<IAuthResponse>): void;
  expectValidErrorResponse(
    response: ITestResponse<IErrorResponse>,
    expectedStatus: number,
    expectedMessage?: string,
  ): void;
  generateTestEmail(): string;
  generateTestUsername(): string;
  generateTestPassword(): string;
}

// Mock Data Types
export interface IMockUser {
  uuid: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatarUrl?: string;
  isActive: boolean;
  emailVerified: boolean;
  role: {
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
  deleted: boolean;
}

export interface IMockAuthSession {
  uuid: string;
  userUuid: string;
  refreshToken: string;
  expiresAt: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMockPasswordReset {
  uuid: string;
  userUuid: string;
  token: string;
  expiresAt: Date;
  isUsed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Test Scenario Types
export interface IAuthTestScenario {
  userData?: IUserRegistrationData;
  loginData?: IUserLoginData;
  expectedResponse?: IApiResponse;
  expectedError?: IErrorResponse;
  tokens?: IAuthTokens;
  mockUser?: IMockUser;
  mockSession?: IMockAuthSession;
  mockPasswordReset?: IMockPasswordReset;
}
