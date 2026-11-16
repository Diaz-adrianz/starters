import { Module } from '@nestjs/common';
import { DefaultDatabaseModule } from '../../database/default/default-database.module';
import { Activity } from './entities/activity.entity';
import { ActivityService } from './resources/activity/activity.service';
import { ActivityController } from './resources/activity/activity.controller';
import { AuditEventSubscriber } from './subscribers/audit-event.subscriber';
import { DefaultQueueModule } from '../../lib/queue/default/default-queue.module';
import {
  ACTIVITY_LOG_QUEUE,
  ActivityLogJobOptions,
} from './queue/activity-log/activity-log.config';
import { ActivityLogProcessor } from './queue/activity-log/activity-log.processor';
import { AuditEntitySubscriber } from './subscribers/audit-entity.subscriber';

@Module({
  imports: [
    DefaultDatabaseModule.forFeature([Activity]),

    // queue
    DefaultQueueModule.registerQueue({
      name: ACTIVITY_LOG_QUEUE,
      defaultJobOptions: ActivityLogJobOptions,
    }),
  ],
  providers: [
    ActivityService,

    // subscribers
    AuditEventSubscriber,

    // entity subscribers
    AuditEntitySubscriber,

    // processors
    ActivityLogProcessor,
  ],
  controllers: [ActivityController],
})
export class AuditModule {}
