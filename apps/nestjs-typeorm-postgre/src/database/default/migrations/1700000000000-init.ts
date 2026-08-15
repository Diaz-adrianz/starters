import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1700000000000 implements MigrationInterface {
  name = 'Init1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "identity"."users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying, "enabled" boolean NOT NULL DEFAULT false, "avatar" character varying, "verified_at" TIMESTAMP WITH TIME ZONE, "verification_sent_at" TIMESTAMP WITH TIME ZONE, "reset_password_sent_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "access_control"."user_roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "role_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_23ed6f04fe43066df08379fd034" UNIQUE ("user_id", "role_id"), CONSTRAINT "PK_8acd5cf26ebd158416f477de799" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "access_control"."roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "is_default" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "access_control"."role_permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role_id" uuid NOT NULL, "permission_id" uuid NOT NULL, "scope" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_25d24010f53bb80b78e412c9656" UNIQUE ("role_id", "permission_id"), CONSTRAINT "PK_84059017c90bfcb701b8fa42297" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "access_control"."permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "resource" character varying NOT NULL, "action" character varying NOT NULL, "group" character varying, "description" character varying, "enabled" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_7331684c0c5b063803a425001a0" UNIQUE ("resource", "action"), CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "notification"."templates_channel_enum" AS ENUM('email', 'push', 'in_app')`,
    );
    await queryRunner.query(
      `CREATE TABLE "notification"."templates" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying NOT NULL, "channel" "notification"."templates_channel_enum" NOT NULL, "title" character varying, "subject" character varying, "body" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_a0262f833ae847bd105f6895762" UNIQUE ("key", "channel"), CONSTRAINT "PK_515948649ce0bbbe391de702ae5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "notification"."messages_type_enum" AS ENUM('transactional', 'system', 'promotional')`,
    );
    await queryRunner.query(
      `CREATE TABLE "notification"."messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "template_id" uuid NOT NULL, "type" "notification"."messages_type_enum" NOT NULL, "context" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "notification"."notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "message_id" uuid NOT NULL, "recipient_id" character varying NOT NULL, "read_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "notification"."deliveries_channel_enum" AS ENUM('email', 'push', 'in_app')`,
    );
    await queryRunner.query(
      `CREATE TYPE "notification"."deliveries_status_enum" AS ENUM('pending', 'sent', 'failed', 'retrying')`,
    );
    await queryRunner.query(
      `CREATE TABLE "notification"."deliveries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "notification_id" uuid NOT NULL, "channel" "notification"."deliveries_channel_enum" NOT NULL, "status" "notification"."deliveries_status_enum" NOT NULL, "attempt_count" integer, "last_attempt_at" TIMESTAMP WITH TIME ZONE, "provider_response" character varying, CONSTRAINT "UQ_298241e1f9d3f1793a715aa7022" UNIQUE ("notification_id", "channel"), CONSTRAINT "PK_a6ef225c5c5f0974e503bfb731f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "notification"."device_tokens_provider_enum" AS ENUM('fcm')`,
    );
    await queryRunner.query(
      `CREATE TABLE "notification"."device_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying, "provider" "notification"."device_tokens_provider_enum" NOT NULL, "token" character varying NOT NULL, "enabled" boolean NOT NULL DEFAULT true, "device_id" character varying, "device_type" character varying, "device_name" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ceac2f9b188aa86239bfc013688" UNIQUE ("provider", "token"), CONSTRAINT "PK_84700be257607cfb1f9dc2e52c3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control"."user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "identity"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control"."user_roles" ADD CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY ("role_id") REFERENCES "access_control"."roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control"."role_permissions" ADD CONSTRAINT "FK_178199805b901ccd220ab7740ec" FOREIGN KEY ("role_id") REFERENCES "access_control"."roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control"."role_permissions" ADD CONSTRAINT "FK_17022daf3f885f7d35423e9971e" FOREIGN KEY ("permission_id") REFERENCES "access_control"."permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification"."messages" ADD CONSTRAINT "FK_f7b87b9df16052b1b08eae2423b" FOREIGN KEY ("template_id") REFERENCES "notification"."templates"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification"."notifications" ADD CONSTRAINT "FK_14569f8a49ebb2ed92e9f8ba01c" FOREIGN KEY ("message_id") REFERENCES "notification"."messages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification"."deliveries" ADD CONSTRAINT "FK_f81ac6f833049eb6ade70110f1b" FOREIGN KEY ("notification_id") REFERENCES "notification"."notifications"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification"."deliveries" DROP CONSTRAINT "FK_f81ac6f833049eb6ade70110f1b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification"."notifications" DROP CONSTRAINT "FK_14569f8a49ebb2ed92e9f8ba01c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification"."messages" DROP CONSTRAINT "FK_f7b87b9df16052b1b08eae2423b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control"."role_permissions" DROP CONSTRAINT "FK_17022daf3f885f7d35423e9971e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control"."role_permissions" DROP CONSTRAINT "FK_178199805b901ccd220ab7740ec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control"."user_roles" DROP CONSTRAINT "FK_b23c65e50a758245a33ee35fda1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control"."user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`,
    );
    await queryRunner.query(`DROP TABLE "notification"."device_tokens"`);
    await queryRunner.query(
      `DROP TYPE "notification"."device_tokens_provider_enum"`,
    );
    await queryRunner.query(`DROP TABLE "notification"."deliveries"`);
    await queryRunner.query(
      `DROP TYPE "notification"."deliveries_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "notification"."deliveries_channel_enum"`,
    );
    await queryRunner.query(`DROP TABLE "notification"."notifications"`);
    await queryRunner.query(`DROP TABLE "notification"."messages"`);
    await queryRunner.query(`DROP TYPE "notification"."messages_type_enum"`);
    await queryRunner.query(`DROP TABLE "notification"."templates"`);
    await queryRunner.query(
      `DROP TYPE "notification"."templates_channel_enum"`,
    );
    await queryRunner.query(`DROP TABLE "access_control"."permissions"`);
    await queryRunner.query(`DROP TABLE "access_control"."role_permissions"`);
    await queryRunner.query(`DROP TABLE "access_control"."roles"`);
    await queryRunner.query(`DROP TABLE "access_control"."user_roles"`);
    await queryRunner.query(`DROP TABLE "identity"."users"`);
  }
}
