/**
 * Auth module unit tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from '../auth.module';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../auth.controller';
import { AuthMapperService } from '../services/auth-mapper.service';
import { AuthOperationFactory } from '../factories/auth-operation.factory';
import { AuthPasswordResetService } from '../services/auth-password-reset.service';

describe('AuthModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide AuthService', () => {
    const service = module.get<AuthService>(AuthService);
    expect(service).toBeDefined();
  });
});
