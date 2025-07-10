/**
 * Context Module
 * Provides REQUEST-scoped services for request context management,
 * audit logging, and user-specific caching
 */

import { Module, Global } from '@nestjs/common';
import { RequestContextService } from './services/request-context.service';
import { AuditService } from './services/audit.service';
import { UserSpecificCacheService } from './services/user-cache.service';

@Global() // Make this module global so services are available everywhere
@Module({
  providers: [RequestContextService, AuditService, UserSpecificCacheService],
  exports: [RequestContextService, AuditService, UserSpecificCacheService],
})
export class ContextModule {}
