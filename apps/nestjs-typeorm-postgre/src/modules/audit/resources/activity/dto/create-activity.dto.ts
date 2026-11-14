import { Exclude } from 'class-transformer';
import { ActivityOutcome } from '../../../enums/activity-outcome.enum';
import {
  ActivityContext,
  ActivityMetadata,
} from '../../../entities/activity.entity';

export class CreateActivityDto {
  @Exclude()
  occuredAt: Date;

  @Exclude()
  requestId?: string | null;

  @Exclude()
  module: string;

  @Exclude()
  context?: ActivityContext | null;

  @Exclude()
  actorType: string;

  @Exclude()
  actorId?: string | null;

  @Exclude()
  actorName?: string | null;

  @Exclude()
  action: string;

  @Exclude()
  resourceType?: string | null;

  @Exclude()
  resourceId?: string | null;

  @Exclude()
  outcome: ActivityOutcome = ActivityOutcome.SUCCESS;

  @Exclude()
  metadata?: ActivityMetadata | null;
}
