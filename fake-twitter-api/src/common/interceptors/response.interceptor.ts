/**
 * Global Response Interceptor - NestJS Best Practice
 * Transforms all controller responses into a standardized format
 */

import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { ResponseData, BaseApiResponse } from '../dto/api-response.dto';

// Metadata key for custom response messages
export const RESPONSE_MESSAGE_METADATA = 'custom_response_message';

// Standard API Response Interface
export interface InterceptorApiResponse<T = ResponseData> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

@Injectable()
export class ResponseInterceptor<T = ResponseData>
  implements NestInterceptor<T, InterceptorApiResponse<T>>
{
  private readonly logger = new Logger(ResponseInterceptor.name);
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<InterceptorApiResponse<T>> {
    const request = context.switchToHttp().getRequest();
    const { statusCode } = context.switchToHttp().getResponse();

    // Get custom message from decorator or use default
    const customMessage = this.reflector.getAllAndOverride<string>(
      RESPONSE_MESSAGE_METADATA,
      [context.getHandler(), context.getClass()],
    );

    return next.handle().pipe(
      map((data: T) => {
        // Check if the response is already wrapped (instance of BaseApiResponse)
        if (this.isAlreadyWrapped(data)) {
          this.logger.debug('Response already wrapped, returning as-is');
          return data as InterceptorApiResponse<T>;
        }

        // If not wrapped, apply the standard wrapping
        const wrappedResponse = {
          success: true,
          message: customMessage || this.getDefaultMessage(statusCode),
          data,
          timestamp: new Date().toISOString(),
          path: request.url,
        };

        this.logger.debug('Wrapping response', wrappedResponse);
        return wrappedResponse;
      }),
    );
  }

  /**
   * Check if the response is already wrapped in the expected format
   */
  private isAlreadyWrapped(data: any): boolean {
    // Check if it's an instance of BaseApiResponse or its subclasses
    if (data instanceof BaseApiResponse) {
      this.logger.debug('Data is instance of BaseApiResponse');
      return true;
    }

    // Check if it has the expected structure of a wrapped response
    const isWrapped =
      data &&
      typeof data === 'object' &&
      typeof data.success === 'boolean' &&
      typeof data.message === 'string' &&
      typeof data.timestamp === 'string' &&
      data.hasOwnProperty('data');

    this.logger.debug('Structure check for wrapped response:', isWrapped);
    return isWrapped;
  }

  private getDefaultMessage(statusCode: number): string {
    switch (statusCode) {
      case HttpStatus.OK:
        return 'Success';
      case HttpStatus.CREATED:
        return 'Created successfully';
      case HttpStatus.NO_CONTENT:
        return 'Updated successfully';
      default:
        return 'Success';
    }
  }
}
