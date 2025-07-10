import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Dynamic modules
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';

// Core modules
import { LoggerCoreModule } from './core/logger/logger.module';

// Commons - Context services
import { ContextModule, AuditFlushInterceptor } from './commons';

// Core - Middleware
import { RequestContextMiddleware } from './core/middleware/request-context.middleware';

// Feature modules
import { UsersModule } from './modules/users/users.module';
import { BlogsModule } from './modules/blogs/blogs.module';

@Module({
  imports: [
    // Global modules with forRoot()
    ConfigModule.forRoot({
      isGlobal: true,
      envFiles: ['.env.local', '.env'],
      cache: true,
      expandVariables: true,
    }),

    DatabaseModule.forRoot({
      isGlobal: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      extra: {
        connectionLimit: 10,
        acquireTimeout: 60000,
        timeout: 60000,
      },
    }),

    // Core logging module
    LoggerCoreModule,

    // REQUEST-scoped context services
    ContextModule,

    // Authentication module
    AuthModule,

    // Feature modules
    UsersModule,
    BlogsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditFlushInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('*'); // Apply to all routes
  }
}
