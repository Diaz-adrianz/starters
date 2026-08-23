import { Module } from '@nestjs/common';
import { DefaultDatabaseModule } from '../../database/default/default-database.module';
import { Activity } from './entities/activity.entity';

@Module({
  imports: [DefaultDatabaseModule.forFeature([Activity])],
})
export class TrackerModule {}
