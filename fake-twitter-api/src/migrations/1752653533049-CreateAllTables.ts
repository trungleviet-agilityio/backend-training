import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAllTables1752653533049 implements MigrationInterface {
  name = 'CreateAllTables1752653533049';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "auth_password_resets" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted" boolean NOT NULL DEFAULT false, "user_uuid" uuid NOT NULL, "token_hash" character varying NOT NULL, "expires_at" TIMESTAMP NOT NULL, "is_used" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_43378e38f6f06aa2cd68a29cb76" PRIMARY KEY ("uuid"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "auth_sessions" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted" boolean NOT NULL DEFAULT false, "user_uuid" uuid NOT NULL, "refresh_token_hash" character varying NOT NULL, "expires_at" TIMESTAMP NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "device_info" character varying, "ip_address" character varying, CONSTRAINT "PK_9c881992ec0e6bf0e1ec8c00601" PRIMARY KEY ("uuid"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "comments" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted" boolean NOT NULL DEFAULT false, "content" text NOT NULL, "author_uuid" uuid NOT NULL, "post_uuid" uuid NOT NULL, "parent_uuid" uuid, "depth_level" integer NOT NULL DEFAULT '0', "likes_count" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_160936d39977f78f7789e0fb787" PRIMARY KEY ("uuid"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "posts" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted" boolean NOT NULL DEFAULT false, "content" text NOT NULL, "author_uuid" uuid NOT NULL, "likes_count" integer NOT NULL DEFAULT '0', "comments_count" integer NOT NULL DEFAULT '0', "is_published" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_5e4c1fdaa5e514bb813e64457a7" PRIMARY KEY ("uuid"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted" boolean NOT NULL DEFAULT false, "email" character varying NOT NULL, "username" character varying NOT NULL, "password_hash" character varying NOT NULL, "first_name" character varying, "last_name" character varying, "bio" character varying, "avatar_url" character varying, "role_uuid" uuid NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "email_verified" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_951b8f1dfc94ac1d0301a14b7e1" PRIMARY KEY ("uuid"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "roles" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted" boolean NOT NULL DEFAULT false, "name" character varying NOT NULL DEFAULT 'user', "description" character varying, "permissions" jsonb NOT NULL DEFAULT '{}', CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_cdc7776894e484eaed828ca0616" PRIMARY KEY ("uuid"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth_password_resets" ADD CONSTRAINT "FK_0f77870be00234c8d2302df9944" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth_sessions" ADD CONSTRAINT "FK_642b9108878d0313a02579b900a" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" ADD CONSTRAINT "FK_f279fbcabd34bb5147cfb9a6508" FOREIGN KEY ("author_uuid") REFERENCES "users"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" ADD CONSTRAINT "FK_5455c71d4dac683e4cffa09b508" FOREIGN KEY ("post_uuid") REFERENCES "posts"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" ADD CONSTRAINT "FK_6a0b89d7f2830803ead6287cae0" FOREIGN KEY ("parent_uuid") REFERENCES "comments"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_cb928c69dc753e7218ab4ab2b28" FOREIGN KEY ("author_uuid") REFERENCES "users"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_b925bcec35ac48b9393685253d6" FOREIGN KEY ("role_uuid") REFERENCES "roles"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_b925bcec35ac48b9393685253d6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" DROP CONSTRAINT "FK_cb928c69dc753e7218ab4ab2b28"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" DROP CONSTRAINT "FK_6a0b89d7f2830803ead6287cae0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" DROP CONSTRAINT "FK_5455c71d4dac683e4cffa09b508"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" DROP CONSTRAINT "FK_f279fbcabd34bb5147cfb9a6508"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth_sessions" DROP CONSTRAINT "FK_642b9108878d0313a02579b900a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth_password_resets" DROP CONSTRAINT "FK_0f77870be00234c8d2302df9944"`,
    );
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "posts"`);
    await queryRunner.query(`DROP TABLE "comments"`);
    await queryRunner.query(`DROP TABLE "auth_sessions"`);
    await queryRunner.query(`DROP TABLE "auth_password_resets"`);
  }
}
