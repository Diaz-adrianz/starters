import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatePosts1783941434250 implements MigrationInterface {
  name = 'UpdatePosts1783941434250';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "posts" ADD "deleted_at" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "deleted_at"`);
  }
}
