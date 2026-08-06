import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNotificationMessageUserpreferenceDeliveryDevicetoken1786000367056 implements MigrationInterface {
  name =
    'CreateNotificationMessageUserpreferenceDeliveryDevicetoken1786000367056';

  public async up(queryRunner: QueryRunner): Promise<void> {
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
      `CREATE TABLE "notification"."messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "category" character varying NOT NULL, "title" character varying NOT NULL, "body" text NOT NULL, "data" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "notification"."notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "message_id" uuid NOT NULL, "user_id" uuid NOT NULL, "read_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_c4178b4f4939444d43236dbf549" UNIQUE ("message_id", "user_id"), CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "notification"."deliveries_channel_enum" AS ENUM('email', 'fcm')`,
    );
    await queryRunner.query(
      `CREATE TYPE "notification"."deliveries_status_enum" AS ENUM('pending', 'sent', 'failed')`,
    );
    await queryRunner.query(
      `CREATE TABLE "notification"."deliveries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "notification_id" uuid NOT NULL, "channel" "notification"."deliveries_channel_enum" NOT NULL, "status" "notification"."deliveries_status_enum" NOT NULL, "status_detail" text, "sent_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a6ef225c5c5f0974e503bfb731f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification"."user_preferences" ADD CONSTRAINT "FK_458057fa75b66e68a275647da2e" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification"."device_tokens" ADD CONSTRAINT "FK_17e1f528b993c6d55def4cf5bea" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification"."notifications" ADD CONSTRAINT "FK_14569f8a49ebb2ed92e9f8ba01c" FOREIGN KEY ("message_id") REFERENCES "notification"."messages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification"."notifications" ADD CONSTRAINT "FK_9a8a82462cab47c73d25f49261f" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
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
      `ALTER TABLE "notification"."notifications" DROP CONSTRAINT "FK_9a8a82462cab47c73d25f49261f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification"."notifications" DROP CONSTRAINT "FK_14569f8a49ebb2ed92e9f8ba01c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification"."device_tokens" DROP CONSTRAINT "FK_17e1f528b993c6d55def4cf5bea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification"."user_preferences" DROP CONSTRAINT "FK_458057fa75b66e68a275647da2e"`,
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
    await queryRunner.query(`DROP TABLE "notification"."device_tokens"`);
    await queryRunner.query(
      `DROP TYPE "notification"."device_tokens_channel_enum"`,
    );
    await queryRunner.query(`DROP TABLE "notification"."user_preferences"`);
  }
}
