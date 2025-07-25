/**
 * UserTestHelper - E2E utility for user module
 * Provides methods to register, login, and interact with user endpoints
 */

import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  IUserRegistrationData,
  IUserLoginData,
  IUserProfile,
} from '../interfaces';

export class UserTestHelper {
  constructor(private readonly app: INestApplication) {}

  async registerUser(userData: IUserRegistrationData) {
    // Remove 'bio' if present
    const { bio, ...cleanedUserData } = userData;
    return request(this.app.getHttpServer())
      .post('/api/v1/auth/register')
      .send(cleanedUserData);
  }

  async loginUser(loginData: IUserLoginData) {
    return request(this.app.getHttpServer())
      .post('/api/v1/auth/login')
      .send(loginData);
  }

  async getJwtToken(loginData: IUserLoginData): Promise<string> {
    const res = await this.loginUser(loginData);
    return res.body?.data?.tokens?.access_token;
  }

  async createAndLoginUser(base: Partial<IUserRegistrationData> = {}) {
    // Always use a username <= 20 chars
    const timestamp = Date.now().toString().slice(-6);
    const user: IUserRegistrationData = {
      email: base.email || `user${timestamp}@example.com`,
      username: (base.username || `user${timestamp}`).slice(0, 20),
      password: base.password || 'TestPass123!',
      firstName: base.firstName || 'Test',
      lastName: base.lastName || 'User',
    };
    const regRes = await this.registerUser(user);
    if (regRes.status !== HttpStatus.CREATED) {
      throw new Error('Registration failed: ' + JSON.stringify(regRes.body));
    }
    const uuid = regRes.body?.data?.user?.uuid;
    const loginRes = await this.loginUser({
      email: user.email,
      password: user.password,
    });
    if (loginRes.status !== HttpStatus.OK) {
      throw new Error('Login failed: ' + JSON.stringify(loginRes.body));
    }
    const jwt = loginRes.body?.data?.tokens?.access_token;
    return { user, uuid, jwt };
  }

  async getUserProfile(uuid: string, jwt: string) {
    return request(this.app.getHttpServer())
      .get(`/api/v1/users/${uuid}`)
      .set('Authorization', `Bearer ${jwt}`);
  }

  async updateUserProfile(
    uuid: string,
    jwt: string,
    updateData: Partial<IUserProfile>,
  ) {
    return request(this.app.getHttpServer())
      .patch(`/api/v1/users/${uuid}`)
      .set('Authorization', `Bearer ${jwt}`)
      .send(updateData);
  }

  async getUserStats(uuid: string, jwt: string) {
    return request(this.app.getHttpServer())
      .get(`/api/v1/users/${uuid}/stats`)
      .set('Authorization', `Bearer ${jwt}`);
  }

  async getUserPosts(uuid: string, jwt: string, page = 1, limit = 20) {
    return request(this.app.getHttpServer())
      .get(`/api/v1/users/${uuid}/posts?page=${page}&limit=${limit}`)
      .set('Authorization', `Bearer ${jwt}`);
  }

  async getUserComments(uuid: string, jwt: string, page = 1, limit = 20) {
    return request(this.app.getHttpServer())
      .get(`/api/v1/users/${uuid}/comments?page=${page}&limit=${limit}`)
      .set('Authorization', `Bearer ${jwt}`);
  }

  async deleteUser(uuid: string, jwt: string) {
    return request(this.app.getHttpServer())
      .delete(`/api/v1/users/${uuid}`)
      .set('Authorization', `Bearer ${jwt}`);
  }
}
