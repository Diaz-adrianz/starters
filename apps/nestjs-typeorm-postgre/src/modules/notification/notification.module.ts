import { Module } from '@nestjs/common';
import { Delivery } from './entities/delivery.entity';
import { PushToken } from './entities/push-token.entity';
import { DefaultDatabaseModule } from '../../database/default/default-database.module';
import { UserEventListener } from './listeners/user-event.listener';
import { EmailDeliveryProcessor } from './processors/email-delivery.processor';
import { DefaultQueueModule } from '../../lib/queue/default/default-queue.module';
import { Queues } from '../../lib/queue/default/constants/queues.constant';
import { DefaultMailerModule } from '../../lib/mailer/default/default-mailer.module';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from '../../config/app.config';
import { DeliveryLog } from './entities/delivery-log.entity';
import { Template } from './entities/template.entity';
import { Message } from './entities/message.entity';
import { PushTokenController } from './controllers/push-token.controller';
import { PushTokenService } from './services/push-token.service';
import { MessageController } from './controllers/message.controller';
import { MessageService } from './services/message.service';

@Module({
  imports: [
    ConfigModule.forFeature(appConfig),
    DefaultDatabaseModule.forFeature([
      DeliveryLog,
      Delivery,
      Message,
      PushToken,
      Template,
    ]),
    DefaultQueueModule.registerQueue({ name: Queues.EMAIL_DELIVERIES }),
    DefaultMailerModule,
  ],
  controllers: [MessageController, PushTokenController],
  providers: [
    MessageService,
    PushTokenService,
    UserEventListener,
    EmailDeliveryProcessor,
  ],
})
export class NotificationModule {}
