import { MigrationInterface, QueryRunner } from 'typeorm';

export class RolepermissionsAddScope1785294186827 implements MigrationInterface {
  name = 'RolepermissionsAddScope1785294186827';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth"."role_permissions" ADD "scope" jsonb`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth"."role_permissions" DROP COLUMN "scope"`,
    );
  }
}
