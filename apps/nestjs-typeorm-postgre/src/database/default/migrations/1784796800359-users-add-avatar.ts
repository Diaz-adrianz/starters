import { MigrationInterface, QueryRunner } from 'typeorm';

export class UsersAddAvatar1784796800359 implements MigrationInterface {
  name = 'UsersAddAvatar1784796800359';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth"."users" ADD "avatar" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "auth"."users" DROP COLUMN "avatar"`);
  }
}
