import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1700000000000 implements MigrationInterface {
  name = 'Init1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "access_control"."role_users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role_id" uuid NOT NULL, "user_id" uuid NOT NULL, "username" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_e976807ebe4fc773c2365d91566" UNIQUE ("role_id", "user_id"), CONSTRAINT "PK_6b4286b64efea084922d1c709bd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "access_control"."permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "module" character varying NOT NULL, "resource" character varying NOT NULL, "action" character varying NOT NULL, "description" character varying NOT NULL, "enabled" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_534580365a9abdb3120b7307312" UNIQUE ("module", "resource", "action"), CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "access_control"."role_permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role_id" uuid NOT NULL, "permission_id" uuid NOT NULL, "scope" jsonb, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_25d24010f53bb80b78e412c9656" UNIQUE ("role_id", "permission_id"), CONSTRAINT "PK_84059017c90bfcb701b8fa42297" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "access_control"."roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "default" boolean NOT NULL DEFAULT false, "enabled" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "access_control"."role_pages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role_id" uuid NOT NULL, "page_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_02468f6b10560ceecaac64e663a" UNIQUE ("role_id", "page_id"), CONSTRAINT "PK_41bb500b5ef7ffb79b03c573d75" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "access_control"."pages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "enabled" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_fd04e631bf857b757e33711e5be" UNIQUE ("name"), CONSTRAINT "PK_8f21ed625aa34c8391d636b7d3b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "auth"."sessions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "refresh_token_hash" character varying NOT NULL, "device_id" character varying, "device_label" character varying, "device_type" character varying, "browser" character varying, "os" character varying, "ip_address" character varying, "user_agent" character varying, "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "last_used_at" TIMESTAMP WITH TIME ZONE, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "identity"."verification_tokens_type_enum" AS ENUM('email_verification', 'password_reset', 'set_password')`,
    );
    await queryRunner.query(
      `CREATE TABLE "identity"."verification_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "type" "identity"."verification_tokens_type_enum" NOT NULL, "token_hash" character varying NOT NULL, "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "sent_at" TIMESTAMP WITH TIME ZONE, "consumed_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_f2d4d7a2aa57ef199e61567db22" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "active_token_per_type" ON "identity"."verification_tokens"  ("user_id", "type") WHERE "consumed_at" IS NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE "identity"."users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying, "enabled" boolean NOT NULL DEFAULT false, "avatar" character varying, "verified_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "notification"."messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "delivery_id" uuid NOT NULL, "user_id" uuid NOT NULL, "title" character varying NOT NULL, "body" text NOT NULL, "action_url" character varying, "read_at" TIMESTAMP WITH TIME ZONE, "payload" jsonb, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "notification"."deliveries_type_enum" AS ENUM('transactional', 'system', 'promotional')`,
    );
    await queryRunner.query(
      `CREATE TYPE "notification"."deliveries_priority_enum" AS ENUM('critical', 'high', 'normal', 'low')`,
    );
    await queryRunner.query(
      `CREATE TABLE "notification"."deliveries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "notification"."deliveries_type_enum" NOT NULL, "priority" "notification"."deliveries_priority_enum" NOT NULL, "template_key" character varying NOT NULL, "sender" jsonb, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_a6ef225c5c5f0974e503bfb731f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "notification"."delivery_logs_channel_enum" AS ENUM('email', 'push', 'in_app')`,
    );
    await queryRunner.query(
      `CREATE TYPE "notification"."delivery_logs_status_enum" AS ENUM('pending', 'sent', 'failed', 'retrying')`,
    );
    await queryRunner.query(
      `CREATE TABLE "notification"."delivery_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "delivery_id" uuid NOT NULL, "channel" "notification"."delivery_logs_channel_enum" NOT NULL, "recipient" character varying NOT NULL, "status" "notification"."delivery_logs_status_enum" NOT NULL, "status_message" character varying, "sent_at" TIMESTAMP WITH TIME ZONE, "attempts_count" integer, "payload" jsonb, CONSTRAINT "UQ_78f84e530afd2b7d31f93592b68" UNIQUE ("delivery_id", "channel", "recipient"), CONSTRAINT "PK_c647802ec5e927513f2d0beec47" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "notification"."push_tokens_provider_enum" AS ENUM('fcm')`,
    );
    await queryRunner.query(
      `CREATE TABLE "notification"."push_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid, "provider" "notification"."push_tokens_provider_enum" NOT NULL, "token" character varying NOT NULL, "enabled" boolean NOT NULL DEFAULT true, "device_id" character varying, "device_label" character varying, "device_type" character varying, "os" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_3470f186e712e35b679da817270" UNIQUE ("provider", "token"), CONSTRAINT "PK_32734e87f299c29ca3878861f4f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "notification"."templates_channel_enum" AS ENUM('email', 'push', 'in_app')`,
    );
    await queryRunner.query(
      `CREATE TABLE "notification"."templates" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying NOT NULL, "channel" "notification"."templates_channel_enum" NOT NULL, "title" character varying NOT NULL, "body" text NOT NULL, "available_keys" text array NOT NULL, "sensitive_keys" text array NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_a0262f833ae847bd105f6895762" UNIQUE ("key", "channel"), CONSTRAINT "PK_515948649ce0bbbe391de702ae5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control"."role_users" ADD CONSTRAINT "FK_790a8ca58c37fd1f31944ae65e2" FOREIGN KEY ("role_id") REFERENCES "access_control"."roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control"."role_permissions" ADD CONSTRAINT "FK_178199805b901ccd220ab7740ec" FOREIGN KEY ("role_id") REFERENCES "access_control"."roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control"."role_permissions" ADD CONSTRAINT "FK_17022daf3f885f7d35423e9971e" FOREIGN KEY ("permission_id") REFERENCES "access_control"."permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control"."role_pages" ADD CONSTRAINT "FK_fc7b16bb146c798654131f350a4" FOREIGN KEY ("role_id") REFERENCES "access_control"."roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control"."role_pages" ADD CONSTRAINT "FK_763a33d0f12ad09a5a75fc78db5" FOREIGN KEY ("page_id") REFERENCES "access_control"."pages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "identity"."verification_tokens" ADD CONSTRAINT "FK_31d2079dc4079b80517d31cf4f2" FOREIGN KEY ("user_id") REFERENCES "identity"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification"."messages" ADD CONSTRAINT "FK_d030aa5e7c96396b592ba647e33" FOREIGN KEY ("delivery_id") REFERENCES "notification"."deliveries"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification"."delivery_logs" ADD CONSTRAINT "FK_390fbb5da0cd08bb753e4b3bcaf" FOREIGN KEY ("delivery_id") REFERENCES "notification"."deliveries"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification"."delivery_logs" DROP CONSTRAINT "FK_390fbb5da0cd08bb753e4b3bcaf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification"."messages" DROP CONSTRAINT "FK_d030aa5e7c96396b592ba647e33"`,
    );
    await queryRunner.query(
      `ALTER TABLE "identity"."verification_tokens" DROP CONSTRAINT "FK_31d2079dc4079b80517d31cf4f2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control"."role_pages" DROP CONSTRAINT "FK_763a33d0f12ad09a5a75fc78db5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control"."role_pages" DROP CONSTRAINT "FK_fc7b16bb146c798654131f350a4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control"."role_permissions" DROP CONSTRAINT "FK_17022daf3f885f7d35423e9971e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control"."role_permissions" DROP CONSTRAINT "FK_178199805b901ccd220ab7740ec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control"."role_users" DROP CONSTRAINT "FK_790a8ca58c37fd1f31944ae65e2"`,
    );
    await queryRunner.query(`DROP TABLE "notification"."templates"`);
    await queryRunner.query(
      `DROP TYPE "notification"."templates_channel_enum"`,
    );
    await queryRunner.query(`DROP TABLE "notification"."push_tokens"`);
    await queryRunner.query(
      `DROP TYPE "notification"."push_tokens_provider_enum"`,
    );
    await queryRunner.query(`DROP TABLE "notification"."delivery_logs"`);
    await queryRunner.query(
      `DROP TYPE "notification"."delivery_logs_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "notification"."delivery_logs_channel_enum"`,
    );
    await queryRunner.query(`DROP TABLE "notification"."deliveries"`);
    await queryRunner.query(
      `DROP TYPE "notification"."deliveries_priority_enum"`,
    );
    await queryRunner.query(`DROP TYPE "notification"."deliveries_type_enum"`);
    await queryRunner.query(`DROP TABLE "notification"."messages"`);
    await queryRunner.query(`DROP TABLE "identity"."users"`);
    await queryRunner.query(`DROP INDEX "identity"."active_token_per_type"`);
    await queryRunner.query(`DROP TABLE "identity"."verification_tokens"`);
    await queryRunner.query(
      `DROP TYPE "identity"."verification_tokens_type_enum"`,
    );
    await queryRunner.query(`DROP TABLE "auth"."sessions"`);
    await queryRunner.query(`DROP TABLE "access_control"."pages"`);
    await queryRunner.query(`DROP TABLE "access_control"."role_pages"`);
    await queryRunner.query(`DROP TABLE "access_control"."roles"`);
    await queryRunner.query(`DROP TABLE "access_control"."role_permissions"`);
    await queryRunner.query(`DROP TABLE "access_control"."permissions"`);
    await queryRunner.query(`DROP TABLE "access_control"."role_users"`);
  }
}
