import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSchemaAuth1783950073173 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "auth"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP SCHEMA IF EXISTS "auth" CASCADE`);
  }
}
