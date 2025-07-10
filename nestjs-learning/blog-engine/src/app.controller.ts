/**
 * Application Controller
 * Main controller for application-level endpoints including health checks
 * and application information
 */

import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { AuditService } from './commons/context/services/audit.service';

@ApiTags('Application')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly auditService: AuditService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get application info' })
  @ApiResponse({ status: 200, description: 'Application information' })
  getHello(): string {
    // Record access to main endpoint for monitoring
    this.auditService.recordAccess('application', 'info');

    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Application health status' })
  getHealth(): any {
    // Record health check access
    this.auditService.recordAccess('application', 'health-check');

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Blog Engine API',
      version: '1.0.0',
    };
  }
}
