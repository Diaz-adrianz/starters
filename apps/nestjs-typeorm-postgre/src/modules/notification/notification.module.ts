import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { Notification } from './entities/notification.entity';
import { Delivery } from './entities/delivery.entity';
import { UserPreference } from './entities/user-preference.entity';
import { DeviceToken } from './entities/device-token.entity';
import { DeviceTokenService } from './services/device-token.service';
import { DeviceTokenController } from './controllers/device-token.controller';
import { Message } from './entities/message.entity';
import { MessageController } from './controllers/message.controller';
import { MessageService } from './services/message.service';
import { DefaultDatabaseModule } from '../../database/default/default-database.module';
import { UserEventListener } from './listeners/user-event.listener';

@Module({
  imports: [
    DefaultDatabaseModule.forFeature([
      Notification,
      Message,
      Delivery,
      UserPreference,
      DeviceToken,
    ]),
  ],
  controllers: [
    NotificationController,
    DeviceTokenController,
    MessageController,
  ],
  providers: [
    NotificationService,
    DeviceTokenService,
    MessageService,
    UserEventListener,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
