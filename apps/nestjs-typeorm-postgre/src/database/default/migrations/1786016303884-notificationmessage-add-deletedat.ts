import { MigrationInterface, QueryRunner } from 'typeorm';

export class NotificationmessageAddDeletedat1786016303884 implements MigrationInterface {
  name = 'NotificationmessageAddDeletedat1786016303884';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification"."messages" ADD "deleted_at" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification"."messages" DROP COLUMN "deleted_at"`,
    );
  }
}
