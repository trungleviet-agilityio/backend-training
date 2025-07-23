/**
 * This file contains the tests for the response interceptor.
 */

import {
  ResponseInterceptor,
  RESPONSE_MESSAGE_METADATA,
} from '../../interceptors/response.interceptor';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';

describe('ResponseInterceptor', () => {
  let interceptor: ResponseInterceptor<any>;
  let reflector: jest.Mocked<Reflector>;
  let context: Partial<ExecutionContext>;
  let callHandler: Partial<CallHandler>;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as unknown as jest.Mocked<Reflector>;
    interceptor = new ResponseInterceptor(reflector);
    context = {
      switchToHttp: () => ({
        getRequest: () => ({ url: '/test-url' }),
        getResponse: () => ({ statusCode: 200 }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;
    callHandler = { handle: jest.fn() };
  });

  it('should return default message and response shape', done => {
    reflector.getAllAndOverride.mockReturnValue(undefined);
    callHandler.handle = jest.fn(() => of({ foo: 'bar' }));
    interceptor
      .intercept(context as ExecutionContext, callHandler as CallHandler)
      .subscribe(result => {
        expect(result.success).toBe(true);
        expect(result.message).toBe('Success');
        expect(result.data).toEqual({ foo: 'bar' });
        expect(result.path).toBe('/test-url');
        expect(result.timestamp).toBeDefined();
        done();
      });
  });

  it('should use custom message if provided', done => {
    reflector.getAllAndOverride.mockReturnValue('Custom message');
    callHandler.handle = jest.fn(() => of({ foo: 'bar' }));
    interceptor
      .intercept(context as ExecutionContext, callHandler as CallHandler)
      .subscribe(result => {
        expect(result.message).toBe('Custom message');
        done();
      });
  });

  it('should use correct default message for status codes', done => {
    const statusMap = {
      200: 'Success',
      201: 'Created successfully',
      204: 'Updated successfully',
      500: 'Success',
    };
    for (const [status, msg] of Object.entries(statusMap)) {
      (context.switchToHttp as any) = () => ({
        getRequest: () => ({ url: '/test-url' }),
        getResponse: () => ({
          status: function () {
            return this;
          },
          statusCode: Number(status),
        }),
      });
      reflector.getAllAndOverride.mockReturnValue(undefined);
      callHandler.handle = jest.fn(() => of({ foo: 'bar' }));
      interceptor
        .intercept(context as ExecutionContext, callHandler as CallHandler)
        .subscribe(result => {
          expect(result.message).toBe(msg);
        });
    }
    done();
  });
});
