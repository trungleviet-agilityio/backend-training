/*
Exception filter is used to define the exception filter for the application.
*/

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { BaseException } from '../core/exceptions';

/*
ExceptionFilter is a filter that provides the exception functionality for the application.
*/
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  /*
  catch is a method that provides the exception functionality for the application.
  */
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    // Handle custom exceptions
    if (exception instanceof BaseException) {
      const errorResponse = exception.getResponse() as any;

      response.status(status).json({
        success: false,
        statusCode: status,
        message: errorResponse.message,
        errorCode: errorResponse.errorCode,
        details: errorResponse.details,
        path: request.url,
        timestamp: errorResponse.timestamp,
      });
    } else {
      // Handle standard HTTP exceptions
      response.status(status).json({
        success: false,
        statusCode: status,
        message: exception.message,
        path: request.url,
        error: exception.getResponse(),
        timestamp: new Date().toISOString(),
      });
    }
  }
}

/*
CatchEverythingFilter is a filter that provides the exception functionality for the application.
This filter will catch all exceptions, include server errors, unknown errors, etc.
*/
@Catch()
export class CatchEverythingFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      success: false,
      statusCode: httpStatus,
      message: exception instanceof Error ? exception.message : 'Internal server error',
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      timestamp: new Date().toISOString(),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);

  }
}
