import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDeletedAtColumn1752656701563 implements MigrationInterface {
  name = 'AddDeletedAtColumn1752656701563';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add deleted_at columns with IF NOT EXISTS to avoid errors
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth_sessions" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth_password_resets" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove the deleted_at columns
    await queryRunner.query(
      `ALTER TABLE "auth_password_resets" DROP COLUMN IF EXISTS "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth_sessions" DROP COLUMN IF EXISTS "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" DROP COLUMN IF EXISTS "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" DROP COLUMN IF EXISTS "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" DROP COLUMN IF EXISTS "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "deleted_at"`,
    );
  }
}
