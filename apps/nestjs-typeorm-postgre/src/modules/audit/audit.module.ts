import { Module } from '@nestjs/common';
import { DefaultDatabaseModule } from '../../database/default/default-database.module';
import { Activity } from './entities/activity.entity';
import { ActivityService } from './resources/activity/activity.service';
import { ActivityController } from './resources/activity/activity.controller';
import { AuditEventSubscriber } from './subscribers/audit-event.subscriber';

@Module({
  imports: [DefaultDatabaseModule.forFeature([Activity])],
  providers: [
    ActivityService,

    // subscribers
    AuditEventSubscriber,
  ],
  controllers: [ActivityController],
})
export class AuditModule {}
