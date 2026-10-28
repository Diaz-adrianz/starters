import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { LoggerService } from '../../../infra/logger/logger.service';
import { ActivityService } from '../resources/activity/activity.service';
import {
  AuditEventName,
  AuditEventPayload,
} from '../../../infra/event/interfaces/audit-event.interface';

@Injectable()
export class AuditEventSubscriber {
  constructor(
    private logger: LoggerService,
    private activityService: ActivityService,
  ) {}

  @OnEvent(AuditEventName.ACTIVITY_CREATE)
  async createActivity(payload: AuditEventPayload['audit.activity.create']) {
    try {
      await this.activityService.create(payload);
    } catch (error) {
      this.logger.error(
        `Failed to create activity: `,
        error,
        this.constructor.name,
      );
    }
  }
}
