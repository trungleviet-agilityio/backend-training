/**
 * This file contains the tests for the global exception filter.
 */

import { GlobalExceptionFilter } from '../../filters/http-exception.filter';
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;
  let mockResponse: any;
  let mockRequest: any;
  let mockContext: any;
  let host: Partial<ArgumentsHost>;

  beforeEach(() => {
    filter = new GlobalExceptionFilter();
    mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    mockRequest = { url: '/test-url' };
    mockContext = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    };
    host = { switchToHttp: mockContext.switchToHttp } as any;
  });

  it('should handle HttpException with string response', () => {
    const exception = new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    filter.catch(exception, host as ArgumentsHost);
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Forbidden',
        statusCode: HttpStatus.FORBIDDEN,
        path: '/test-url',
      }),
    );
  });

  it('should handle HttpException with object response', () => {
    const exception = new HttpException(
      { message: 'Custom error', foo: 'bar' },
      HttpStatus.BAD_REQUEST,
    );
    filter.catch(exception, host as ArgumentsHost);
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Custom error',
        statusCode: HttpStatus.BAD_REQUEST,
        path: '/test-url',
      }),
    );
  });

  it('should handle QueryFailedError', () => {
    const exception = new QueryFailedError(
      'SELECT 1',
      [],
      new Error('db error'),
    );
    filter.catch(exception, host as ArgumentsHost);
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Database operation failed',
        statusCode: HttpStatus.BAD_REQUEST,
        path: '/test-url',
      }),
    );
  });

  it('should handle generic Error', () => {
    const exception = new Error('Some error');
    filter.catch(exception, host as ArgumentsHost);
    expect(mockResponse.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Some error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        path: '/test-url',
      }),
    );
  });
});
