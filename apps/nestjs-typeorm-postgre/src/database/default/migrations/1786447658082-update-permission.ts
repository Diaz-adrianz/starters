import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatePermission1786447658082 implements MigrationInterface {
  name = 'UpdatePermission1786447658082';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "access_control"."permissions" RENAME COLUMN "deleted_at" TO "enabled"`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control"."permissions" DROP COLUMN "enabled"`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control"."permissions" ADD "enabled" boolean NOT NULL DEFAULT true`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "access_control"."permissions" DROP COLUMN "enabled"`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control"."permissions" ADD "enabled" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control"."permissions" RENAME COLUMN "enabled" TO "deleted_at"`,
    );
  }
}
