import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNotificationsRecipientsDeliveriesUserpreferencesDevicetokens1785765280944 implements MigrationInterface {
  name =
    'CreateNotificationsRecipientsDeliveriesUserpreferencesDevicetokens1785765280944';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "notification"."notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "category" character varying NOT NULL, "title" character varying NOT NULL, "body" text NOT NULL, "data" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "notification"."user_preferences" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "category" character varying NOT NULL, "channels" jsonb NOT NULL, "quiet_hours_start_at" TIME, "quiet_hours_end_at" TIME, "timezone" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97702a9e33f8fbdba60de2af994" UNIQUE ("user_id", "category"), CONSTRAINT "PK_e8cfb5b31af61cd363a6b6d7c25" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "notification"."device_tokens_channel_enum" AS ENUM('fcm')`,
    );
    await queryRunner.query(
      `CREATE TABLE "notification"."device_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "device_id" character varying NOT NULL, "channel" "notification"."device_tokens_channel_enum" NOT NULL, "user_id" uuid, "token" character varying NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_958e1434ecf0c0a086ebc2d9a80" UNIQUE ("device_id", "channel"), CONSTRAINT "PK_84700be257607cfb1f9dc2e52c3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "notification"."recipients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "notification_id" uuid NOT NULL, "user_id" uuid NOT NULL, "read_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_dd946b661b3a402ece8ed1fef0d" UNIQUE ("notification_id", "user_id"), CONSTRAINT "PK_de8fc5a9c364568f294798fe1e9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "notification"."deliveries_channel_enum" AS ENUM('email', 'fcm')`,
    );
    await queryRunner.query(
      `CREATE TABLE "notification"."deliveries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "recipient_id" uuid NOT NULL, "channel" "notification"."deliveries_channel_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a6ef225c5c5f0974e503bfb731f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification"."user_preferences" ADD CONSTRAINT "FK_458057fa75b66e68a275647da2e" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification"."device_tokens" ADD CONSTRAINT "FK_17e1f528b993c6d55def4cf5bea" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification"."recipients" ADD CONSTRAINT "FK_afbd40bbc0e187c925e1de6b8f3" FOREIGN KEY ("notification_id") REFERENCES "notification"."notifications"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification"."recipients" ADD CONSTRAINT "FK_6157e8b6ba4e6e3089616481fe2" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification"."deliveries" ADD CONSTRAINT "FK_2499c339279740e77a256d15646" FOREIGN KEY ("recipient_id") REFERENCES "notification"."recipients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification"."deliveries" DROP CONSTRAINT "FK_2499c339279740e77a256d15646"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification"."recipients" DROP CONSTRAINT "FK_6157e8b6ba4e6e3089616481fe2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification"."recipients" DROP CONSTRAINT "FK_afbd40bbc0e187c925e1de6b8f3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification"."device_tokens" DROP CONSTRAINT "FK_17e1f528b993c6d55def4cf5bea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification"."user_preferences" DROP CONSTRAINT "FK_458057fa75b66e68a275647da2e"`,
    );
    await queryRunner.query(`DROP TABLE "notification"."deliveries"`);
    await queryRunner.query(
      `DROP TYPE "notification"."deliveries_channel_enum"`,
    );
    await queryRunner.query(`DROP TABLE "notification"."recipients"`);
    await queryRunner.query(`DROP TABLE "notification"."device_tokens"`);
    await queryRunner.query(
      `DROP TYPE "notification"."device_tokens_channel_enum"`,
    );
    await queryRunner.query(`DROP TABLE "notification"."user_preferences"`);
    await queryRunner.query(`DROP TABLE "notification"."notifications"`);
  }
}
