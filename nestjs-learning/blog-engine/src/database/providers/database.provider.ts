import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';
import { IConfigService } from '../../config/interfaces/config.interface';
import {
  DATABASE_CONNECTION,
  CONFIG_SERVICE,
} from '../../commons/constants/tokens';

export const databaseProvider = {
  provide: DATABASE_CONNECTION,
  useFactory: async (configService: IConfigService): Promise<DataSource> => {
    const logger = new Logger('DatabaseProvider');
    const dbConfig = configService.getDatabaseConfig();

    const dataSource = new DataSource({
      type: dbConfig.type,
      host: dbConfig.host,
      port: dbConfig.port,
      username: dbConfig.username,
      password: dbConfig.password,
      database: dbConfig.database,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: dbConfig.synchronize,
      logging: dbConfig.logging,
      // Connection pool settings
      extra: {
        connectionLimit: 10,
        acquireTimeout: 60000,
        timeout: 60000,
      },
    });

    try {
      await dataSource.initialize();
      logger.log(`🚀 Database connection established (${dbConfig.type})`);
      return dataSource;
    } catch (error) {
      logger.error(`❌ Database connection failed (${dbConfig.type}):`, error);
      throw error;
    }
  },
  inject: [CONFIG_SERVICE],
};
