import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUser1784289440052 implements MigrationInterface {
  name = 'UpdateUser1784289440052';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth"."users" ADD "verified_at" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth"."users" ADD "verification_sent_at" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth"."users" DROP COLUMN "verification_sent_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth"."users" DROP COLUMN "verified_at"`,
    );
  }
}
