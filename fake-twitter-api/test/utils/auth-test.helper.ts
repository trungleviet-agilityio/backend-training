/**
 * Auth Test Helper
 * Provides helper functions for common test operations with proper types
 */

import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import {
  IApiResponse,
  IAuthResponse,
  IAuthTestHelper,
  IErrorResponse,
  IForgotPasswordTestResponse,
  ILoginTestResponse,
  ILogoutTestResponse,
  IRefreshTestResponse,
  IRegisterTestResponse,
  IResetPasswordTestResponse,
  ITestResponse,
  IUserLoginData,
  IUserRegistrationData,
} from '../interfaces/auth.interface';

export class AuthTestHelper implements IAuthTestHelper {
  constructor(private app: INestApplication) {}

  async registerUser(
    userData: IUserRegistrationData,
  ): Promise<IRegisterTestResponse> {
    const response = await request(this.app.getHttpServer())
      .post('/api/v1/auth/register')
      .send(userData);

    return {
      status: response.status,
      body: response.body as IApiResponse<IAuthResponse>,
      tokens: response.body?.data?.tokens,
    };
  }

  async loginUser(credentials: IUserLoginData): Promise<ILoginTestResponse> {
    const response = await request(this.app.getHttpServer())
      .post('/api/v1/auth/login')
      .send(credentials);

    return {
      status: response.status,
      body: response.body as IApiResponse<IAuthResponse>,
      tokens: response.body?.data?.tokens,
    };
  }

  async logoutUser(accessToken: string): Promise<ILogoutTestResponse> {
    const response = await request(this.app.getHttpServer())
      .post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`);

    return {
      status: response.status,
      body: response.body as IApiResponse<null>,
    };
  }

  async refreshTokens(refreshToken: string): Promise<IRefreshTestResponse> {
    const response = await request(this.app.getHttpServer())
      .post('/api/v1/auth/refresh')
      .send({ refreshToken });

    return {
      status: response.status,
      body: response.body as IApiResponse<{
        access_token: string;
        refresh_token: string;
      }>,
      tokens: response.body?.data,
    };
  }

  async requestPasswordReset(
    email: string,
  ): Promise<IForgotPasswordTestResponse> {
    const response = await request(this.app.getHttpServer())
      .post('/api/v1/auth/forgot-password')
      .send({ email });

    return {
      status: response.status,
      body: response.body as IApiResponse<null>,
    };
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<IResetPasswordTestResponse> {
    const response = await request(this.app.getHttpServer())
      .post('/api/v1/auth/reset-password')
      .send({ token, password: newPassword });

    return {
      status: response.status,
      body: response.body as IApiResponse<null>,
    };
  }

  async testEndpointAvailability(endpoint: string): Promise<ITestResponse> {
    // Use POST for auth endpoints since they are POST endpoints
    const response = await request(this.app.getHttpServer()).post(endpoint);

    return {
      status: response.status,
      body: response.body,
    };
  }

  // Utility methods for assertions
  expectValidJwtToken(token: string): void {
    expect(token).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/);
  }

  expectValidAuthResponse(response: IApiResponse<IAuthResponse>): void {
    expect(response).toMatchObject({
      success: true,
      data: {
        user: expect.objectContaining({
          username: expect.any(String),
        }),
        tokens: expect.objectContaining({
          access_token: expect.any(String),
          refresh_token: expect.any(String),
        }),
      },
    });
  }

  expectValidErrorResponse(
    response: ITestResponse<IErrorResponse>,
    expectedStatus: number,
    expectedMessage?: string,
  ): void {
    expect(response.status).toBe(expectedStatus);
    if (expectedMessage) {
      expect(response.body.message).toContain(expectedMessage);
    }
  }

  generateTestEmail(): string {
    return `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@example.com`;
  }

  generateTestUsername(): string {
    return `testuser-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  generateTestPassword(): string {
    return `SecurePass${Date.now()}!`;
  }
}
