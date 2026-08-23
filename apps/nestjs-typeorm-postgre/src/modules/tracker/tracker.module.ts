import { Module } from '@nestjs/common';
import { DefaultDatabaseModule } from '../../database/default/default-database.module';
import { Activity } from './entities/activity.entity';
import { ActivityService } from './resources/activity/activity.service';
import { ActivityController } from './resources/activity/activity.controller';
import { TrackerEventSubscriber } from './resources/subscribers/tracker-event.subscriber';

@Module({
  imports: [DefaultDatabaseModule.forFeature([Activity])],
  providers: [
    ActivityService,

    // subscribers
    TrackerEventSubscriber,
  ],
  controllers: [ActivityController],
})
export class TrackerModule {}
