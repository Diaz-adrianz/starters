import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { LoggerService } from '../../../infra/logger/logger.service';
import {
  AuditEventName,
  AuditEventPayload,
} from '../../../infra/event/interfaces/audit-event.interface';
import { InjectQueue } from '@nestjs/bullmq';
import {
  ACTIVITY_LOG_QUEUE,
  ActivityLogJobNames,
  type ActivityLogQueue,
} from '../queue/activity-log/activity-log.config';

const LOGS_BATCH_SIZE = 100;
const LOGS_FLUSH_INTERVAL_MS = 1000;

@Injectable()
export class AuditEventSubscriber implements OnModuleDestroy {
  private name = 'audit/' + this.constructor.name;

  private logsBuffer: AuditEventPayload['audit.activity.log'][] = [];
  private logsTimer: NodeJS.Timeout | null = null;

  constructor(
    private logger: LoggerService,
    @InjectQueue(ACTIVITY_LOG_QUEUE)
    private activityLogQueue: ActivityLogQueue,
  ) {}

  @OnEvent(AuditEventName.ACTIVITY_LOG)
  logActivity(payload: AuditEventPayload['audit.activity.log']) {
    this.logsBuffer.push(payload);

    if (this.logsBuffer.length >= LOGS_BATCH_SIZE) {
      void this.flushLogs();
      return;
    }

    this.logsTimer ??= setTimeout(
      () => void this.flushLogs(),
      LOGS_FLUSH_INTERVAL_MS,
    );
  }

  async onModuleDestroy() {
    await this.flushLogs();
  }

  private async flushLogs() {
    if (this.logsTimer) {
      clearTimeout(this.logsTimer);
      this.logsTimer = null;
    }
    if (!this.logsBuffer.length) return;

    const entries = this.logsBuffer;
    this.logsBuffer = [];

    try {
      await this.activityLogQueue.add(ActivityLogJobNames.WRITE_BATCH, {
        entries,
      });
    } catch (error) {
      this.logger.error('Failed to enqueue activities', error, this.name);
      this.logsBuffer.unshift(...entries);
    }
  }
}
