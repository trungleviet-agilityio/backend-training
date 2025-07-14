/**
 * Logger Module
 * Provides enhanced logging capabilities with proper NestJS integration
 * Follows NestJS Logger best practices with global availability
 */

import { Module, Global } from '@nestjs/common';
import { CustomLoggerService } from './custom-logger.service';

@Global()
@Module({
  providers: [CustomLoggerService],
  exports: [CustomLoggerService],
})
export class LoggerCoreModule {}
