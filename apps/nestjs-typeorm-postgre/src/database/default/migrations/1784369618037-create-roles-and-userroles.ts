import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRolesAndUserroles1784369618037 implements MigrationInterface {
  name = 'CreateRolesAndUserroles1784369618037';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "auth"."user_roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "role_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_23ed6f04fe43066df08379fd034" UNIQUE ("user_id", "role_id"), CONSTRAINT "PK_8acd5cf26ebd158416f477de799" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "auth"."roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth"."user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth"."user_roles" ADD CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY ("role_id") REFERENCES "auth"."roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth"."user_roles" DROP CONSTRAINT "FK_b23c65e50a758245a33ee35fda1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth"."user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`,
    );
    await queryRunner.query(`DROP TABLE "auth"."roles"`);
    await queryRunner.query(`DROP TABLE "auth"."user_roles"`);
  }
}
