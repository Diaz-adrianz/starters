import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUsers1784353996126 implements MigrationInterface {
  name = 'UpdateUsers1784353996126';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth"."users" ADD "reset_password_sent_at" TIMESTAMP WITH TIME ZONE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth"."users" DROP COLUMN "reset_password_sent_at"`,
    );
  }
}
