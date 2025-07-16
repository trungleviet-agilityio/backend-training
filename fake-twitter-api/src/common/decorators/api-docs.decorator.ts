/**
 * @deprecated Use ApiOperation, ApiResponse, ApiBearerAuth, ApiTags decorators instead
 * This decorator is kept for backward compatibility but should not be used
 */

import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiTags } from '@nestjs/swagger';

export interface ApiDocsOptions {
  summary: string;
  description?: string;
  tags?: string[];
  auth?: boolean;
  responses?: {
    [key: number]: {
      description: string;
      type?: new () => any;
      example?: any;
    };
  };
}

export function ApiDocs(options: ApiDocsOptions) {
  const decorators: any[] = [];
  if (options.tags?.length) decorators.push(ApiTags(...options.tags));
  decorators.push(ApiOperation({ summary: options.summary, description: options.description }));
  if (options.auth) decorators.push(ApiBearerAuth());
  if (options.responses) {
    Object.entries(options.responses).forEach(([status, resp]) => {
      decorators.push(ApiResponse({ status: +status, ...resp }));
    });
  }
  return applyDecorators(...decorators);
}


export function UserApiDocs(options: Omit<ApiDocsOptions, 'tags'>) {
  return ApiDocs({ ...options, tags: ['Users'] });
}

export function AuthApiDocs(options: Omit<ApiDocsOptions, 'tags'>) {
  return ApiDocs({ ...options, tags: ['Authentication'] });
}

export function PostApiDocs(options: Omit<ApiDocsOptions, 'tags'>) {
  return ApiDocs({ ...options, tags: ['Posts'] });
}

export function CommentApiDocs(options: Omit<ApiDocsOptions, 'tags'>) {
  return ApiDocs({ ...options, tags: ['Comments'] });
}
