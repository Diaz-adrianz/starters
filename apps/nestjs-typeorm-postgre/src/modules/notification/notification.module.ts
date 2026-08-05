import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Recipient } from './entities/recipient.entity';
import { Delivery } from './entities/delivery.entity';
import { UserPreference } from './entities/user-preference.entity';
import { DeviceToken } from './entities/device-token.entity';
import { DeviceTokenService } from './services/device-token.service';
import { RecipientService } from './services/recipient.service';
import { DeviceTokenController } from './controllers/device-token.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Notification,
      Recipient,
      Delivery,
      UserPreference,
      DeviceToken,
    ]),
  ],
  controllers: [NotificationController, DeviceTokenController],
  providers: [NotificationService, DeviceTokenService, RecipientService],
  exports: [NotificationService],
})
export class NotificationModule {}
