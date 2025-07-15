/**
 * Enhanced Global Exception Filter - NestJS Best Practice
 * Handles all exceptions and returns standardized error responses
 */

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { ApiErrorResponse } from '../types';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: string[] = [];

    // Handle different types of exceptions
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        message =
          ((exceptionResponse as Record<string, unknown>).message as string) ||
          exception.message;
        const responseMessage = (exceptionResponse as Record<string, unknown>)
          .message;
        errors = responseMessage
          ? Array.isArray(responseMessage)
            ? (responseMessage as string[])
            : [responseMessage as string]
          : [];
      }
    } else if (exception instanceof QueryFailedError) {
      // Handle database errors
      status = HttpStatus.BAD_REQUEST;
      message = 'Database operation failed';
      errors = [exception.message];
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const errorResponse: ApiErrorResponse = {
      success: false,
      message,
      errors: errors.length > 0 ? errors : undefined,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(errorResponse);
  }
}
