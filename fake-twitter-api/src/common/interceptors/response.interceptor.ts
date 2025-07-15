/**
 * Global Response Interceptor - NestJS Best Practice
 * Transforms all controller responses into a standardized format
 */

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { ApiResponse, CommonResponseData } from '../types';

// Metadata key for custom response messages
export const RESPONSE_MESSAGE_METADATA = 'custom_response_message';

@Injectable()
export class ResponseInterceptor<
  T extends CommonResponseData = CommonResponseData,
> implements NestInterceptor<T, ApiResponse<T>>
{
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest();
    const { statusCode } = context.switchToHttp().getResponse();

    // Get custom message from decorator or use default
    const customMessage = this.reflector.getAllAndOverride<string>(
      RESPONSE_MESSAGE_METADATA,
      [context.getHandler(), context.getClass()],
    );

    return next.handle().pipe(
      map((data: T) => ({
        success: true,
        message: customMessage || this.getDefaultMessage(statusCode),
        data,
        timestamp: new Date().toISOString(),
        path: request.url,
      })),
    );
  }

  private getDefaultMessage(statusCode: number): string {
    switch (statusCode) {
      case 200:
        return 'Success';
      case 201:
        return 'Created successfully';
      case 204:
        return 'Updated successfully';
      default:
        return 'Success';
    }
  }
}
