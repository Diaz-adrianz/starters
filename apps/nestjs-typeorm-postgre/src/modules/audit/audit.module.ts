import { Module } from '@nestjs/common';
import { DefaultDatabaseModule } from '../../database/default/default-database.module';
import { Activity } from './entities/activity.entity';
import { ActivityService } from './resources/activity/activity.service';
import { ActivityController } from './resources/activity/activity.controller';

@Module({
  imports: [DefaultDatabaseModule.forFeature([Activity])],
  providers: [ActivityService],
  controllers: [ActivityController],
})
export class AuditModule {}
