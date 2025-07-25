/**
 * User Test Interfaces - Types for user e2e tests
 */

export interface IUserProfile {
  uuid: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  bio: string;
  avatarUrl?: string;
  role: { name: string };
}

export interface ITestUserResponse {
  status: number;
  body: any;
}
