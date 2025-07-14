/**
 * Repository Providers
 * Provides custom repository instances for entities
 */

import { DataSource } from 'typeorm';
import { Blog } from '../../modules/blog/entities/blog.entity';
import { User } from '../../modules/user/entities/user.entity';

export const blogRepositoryProvider = {
  provide: 'BLOG_REPOSITORY',
  useFactory: (dataSource: DataSource) => dataSource.getRepository(Blog),
  inject: [DataSource],
};

export const userRepositoryProvider = {
  provide: 'USER_REPOSITORY',
  useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
  inject: [DataSource],
};
