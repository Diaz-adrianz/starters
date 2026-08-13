import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  EventName,
  EventPayload,
} from '../../../infra/event/interfaces/events.interface';
import { InjectQueue } from '@nestjs/bullmq';
import { Queues } from '../../../lib/queue/default/constants/queues.constant';
import type { EmailDeliveryQueue } from '../../../lib/queue/default/interfaces/email-delivery.interface';
import { LoggerService } from '../../../infra/logger/logger.service';

@Injectable()
export class UserEventListener {
  constructor(
    @InjectQueue(Queues.EMAIL_DELIVERIES)
    private emailDeliveryQueue: EmailDeliveryQueue,
    private logger: LoggerService,
  ) {}

  @OnEvent(EventName['user.signIn'])
  async signIn(payload: EventPayload['user.signIn']) {
    await this.emailDeliveryQueue
      .add('send-transactional-email', {
        to: payload.email,
        template: 'signin-alert.html',
        data: {},
      })
      .catch((err: Error) =>
        this.logger.error(
          `Failed to enqueue signin-alert email: ${err.message}`,
          this.constructor.name,
        ),
      );
  }
}
