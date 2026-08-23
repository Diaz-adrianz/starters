import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  TrackerEventName,
  TrackerEventPayload,
} from '../../../../infra/event/interfaces/tracker-event.interface';
import { LoggerService } from '../../../../infra/logger/logger.service';
import { ActivityService } from '../activity/activity.service';

@Injectable()
export class TrackerEventSubscriber {
  constructor(
    private activityService: ActivityService,
    private logger: LoggerService,
  ) {}

  @OnEvent(TrackerEventName.TRACKER_ACTIVITY_SAVE)
  async userUpdated(payload: TrackerEventPayload['tracker.activity.save']) {
    try {
      await this.activityService.create({
        level: payload.level,
        module: payload.module,
        description: payload.description,
        actorType: payload.actorType,
        actorId: payload.actorId,
        actorName: payload.actorName,
        targetType: payload.targetType,
        targetId: payload.targetId,
        targetName: payload.targetName,
        action: payload.action,
        metadata: payload.metadata,
      });
    } catch (error) {
      this.logger.warn(error, this.constructor.name);
    }
  }
}
