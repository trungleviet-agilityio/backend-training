import { DataSource, Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { User } from '../../src/modules/user/entities/user.entity';
import { Blog } from '../../src/modules/blog/entities/blog.entity';

@Injectable()
export class DatabaseCleanupHelper {
  private readonly logger = new Logger(DatabaseCleanupHelper.name);

  constructor(private readonly dataSource: DataSource) {}

  /**
   * Comprehensive database cleanup that handles foreign key constraints
   * Deletes data in the correct order to avoid constraint violations
   */
  async cleanDatabase(): Promise<void> {
    try {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();

      // Start transaction
      await queryRunner.startTransaction();

      try {
        // Disable foreign key checks temporarily (PostgreSQL)
        await queryRunner.query('SET session_replication_role = replica;');

        // Get all table names from the database
        const tables = await queryRunner.query(`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_type = 'BASE TABLE'
          AND table_name != 'migrations'
        `);

        // Truncate all tables
        for (const table of tables) {
          const tableName = table.table_name;
          await queryRunner.query(`TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE;`);
          this.logger.debug(`Truncated table: ${tableName}`);
        }

        // Re-enable foreign key checks
        await queryRunner.query('SET session_replication_role = DEFAULT;');

        // Commit transaction
        await queryRunner.commitTransaction();
        
        this.logger.log('✅ Database cleanup completed successfully');
      } catch (error) {
        // Rollback transaction on error
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        // Release query runner
        await queryRunner.release();
      }
    } catch (error) {
      this.logger.error('❌ Database cleanup failed:', error);
      throw error;
    }
  }

  /**
   * Clean specific entities in order (respecting foreign key constraints)
   * This is more targeted than full database cleanup
   */
  async cleanEntities(): Promise<void> {
    try {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();

      try {
        // Delete in order to respect foreign key constraints
        // Blogs depend on Users, so delete blogs first
        await queryRunner.query('DELETE FROM "blogs"');
        await queryRunner.query('DELETE FROM "users"');

        // Reset sequences for auto-increment fields
        await queryRunner.query('ALTER SEQUENCE "users_id_seq" RESTART WITH 1');
        await queryRunner.query('ALTER SEQUENCE "blogs_id_seq" RESTART WITH 1');

        this.logger.log('✅ Entity cleanup completed successfully');
      } finally {
        await queryRunner.release();
      }
    } catch (error) {
      this.logger.error('❌ Entity cleanup failed:', error);
      throw error;
    }
  }

  /**
   * Verify database is clean (useful for debugging)
   */
  async verifyCleanDatabase(): Promise<boolean> {
    try {
      const userRepository = this.dataSource.getRepository(User);
      const blogRepository = this.dataSource.getRepository(Blog);

      const userCount = await userRepository.count();
      const blogCount = await blogRepository.count();

      const isClean = userCount === 0 && blogCount === 0;
      
      if (isClean) {
        this.logger.log('✅ Database is clean');
      } else {
        this.logger.warn(`❌ Database not clean - Users: ${userCount}, Blogs: ${blogCount}`);
      }

      return isClean;
    } catch (error) {
      this.logger.error('❌ Database verification failed:', error);
      return false;
    }
  }

  /**
   * Quick cleanup for individual test isolation
   * Removes specific entities without full database reset
   */
  async quickClean(): Promise<void> {
    try {
      // Use raw SQL for reliable cleanup (TypeORM doesn't allow empty criteria with delete)
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();

      try {
        // Delete all records from tables in correct order (respecting foreign keys)
        await queryRunner.query('DELETE FROM "blogs"');
        await queryRunner.query('DELETE FROM "users"');
        
        this.logger.debug('✅ Quick cleanup completed');
      } finally {
        await queryRunner.release();
      }
    } catch (error) {
      this.logger.error('❌ Quick cleanup failed:', error);
      throw error;
    }
  }
}

/**
 * Standalone cleanup functions for use in test files
 */
export async function cleanTestDatabase(dataSource: DataSource): Promise<void> {
  const helper = new DatabaseCleanupHelper(dataSource);
  await helper.cleanDatabase();
}

export async function quickCleanTestDatabase(dataSource: DataSource): Promise<void> {
  const helper = new DatabaseCleanupHelper(dataSource);
  await helper.quickClean();
}

export async function verifyTestDatabase(dataSource: DataSource): Promise<boolean> {
  const helper = new DatabaseCleanupHelper(dataSource);
  return helper.verifyCleanDatabase();
} 