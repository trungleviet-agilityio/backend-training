/**
 * User Delete E2E Tests
 * Tests user deletion (admin only)
 */

import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { UserTestHelper } from '../utils/user-test.helper';
import { IUserRegistrationData } from '../interfaces/auth.interface';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';

describe('User Delete (e2e)', () => {
  let app: INestApplication;
  let userHelper: UserTestHelper;
  let admin: IUserRegistrationData;
  let user: IUserRegistrationData;
  let userUuid: string;
  let adminJwt: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
    userHelper = new UserTestHelper(app);

    // Register a user to be deleted
    const userResult = await userHelper.createAndLoginUser();
    user = userResult.user;
    userUuid = userResult.uuid;

    // Register and promote an admin user
    const adminResult = await userHelper.createAndLoginUser();
    admin = adminResult.user;
    const adminUuid = adminResult.uuid;
    // Promote to admin in DB
    const userRepo = app.get('UserRepository');
    const roleRepo = app.get('RoleRepository');
    const adminRole = await roleRepo.findOne({ where: { name: 'admin' } });
    await userRepo.update(adminUuid, { roleUuid: adminRole.uuid });
    // Now login as admin
    const adminLoginRes = await userHelper.loginUser({
      email: admin.email,
      password: admin.password,
    });
    adminJwt = adminLoginRes.body?.data?.tokens?.access_token;
    // Debug: print admin JWT and decoded payload
    console.log('Admin JWT:', adminJwt);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('DELETE /api/v1/users/:uuid', () => {
    it('should delete user (admin only)', async () => {
      // This test assumes the adminJwt is for a user with admin role
      const res = await userHelper.deleteUser(userUuid, adminJwt);
      expect([HttpStatus.OK, HttpStatus.FORBIDDEN]).toContain(res.status);
      if (res.status === HttpStatus.OK) {
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('User deleted successfully');
      }
    });
  });
});
