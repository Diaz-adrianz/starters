import { MigrationInterface, QueryRunner } from 'typeorm';

export class DevicetokenAddDevicedata1786458287115 implements MigrationInterface {
  name = 'DevicetokenAddDevicedata1786458287115';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification"."device_tokens" ADD "device_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification"."device_tokens" ADD "device_type" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification"."device_tokens" ADD "device_name" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification"."device_tokens" DROP COLUMN "device_name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification"."device_tokens" DROP COLUMN "device_type"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification"."device_tokens" DROP COLUMN "device_id"`,
    );
  }
}
