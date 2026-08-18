import { Module } from '@nestjs/common';
import { Delivery } from './entities/delivery.entity';
import { PushToken } from './entities/push-token.entity';
import { DefaultDatabaseModule } from '../../database/default/default-database.module';
import { UserEventListener } from './listeners/user-event.listener';
import { EmailDeliveryProcessor } from './queue/email-delivery/email-delivery.processor';
import { DefaultQueueModule } from '../../lib/queue/default/default-queue.module';
import { DefaultMailerModule } from '../../lib/mailer/default/default-mailer.module';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from '../../config/app.config';
import { DeliveryLog } from './entities/delivery-log.entity';
import { Template } from './entities/template.entity';
import { Message } from './entities/message.entity';
import { MessageController } from './resources/message/message.controller';
import { TemplateController } from './resources/template/template.controller';
import { TemplateService } from './resources/template/template.service';
import { PushTokenController } from './resources/push-token/push-token.controller';
import { PushTokenService } from './resources/push-token/push-token.service';
import { MessageService } from './resources/message/message.service';
import {
  PUSH_DELIVERY_QUEUE,
  PushDeliveryJobOptions,
} from './queue/push-delivery/push-delivery.config';
import { PushDeliveryProcessor } from './queue/push-delivery/push-delivery.processor';
import { DeliveryController } from './resources/delivery/delivery.controller';
import { DeliveryService } from './resources/delivery/delivery.service';
import { DefaultFirebaseModule } from '../../lib/firebase/default/default-firebase.module';
import { EMAIL_DELIVERY_QUEUE } from './queue/email-delivery/email-delivery.config';

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
    DefaultQueueModule.registerQueue({ name: EMAIL_DELIVERY_QUEUE }),
    DefaultQueueModule.registerQueue({
      name: PUSH_DELIVERY_QUEUE,
      defaultJobOptions: PushDeliveryJobOptions,
    }),
    DefaultMailerModule,
    DefaultFirebaseModule,
  ],
  controllers: [
    MessageController,
    PushTokenController,
    TemplateController,
    DeliveryController,
  ],
  providers: [
    MessageService,
    PushTokenService,
    TemplateService,
    DeliveryService,
    UserEventListener,
    EmailDeliveryProcessor,
    PushDeliveryProcessor,
  ],
})
export class NotificationModule {}
