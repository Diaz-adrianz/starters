import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  EventName,
  EventPayload,
} from '../../../infra/event/interfaces/events.interface';
import { InjectQueue } from '@nestjs/bullmq';
import { LoggerService } from '../../../infra/logger/logger.service';
import { APP_CONFIG_KEY, type AppConfig } from '../../../config/app.config';
import {
  EMAIL_DELIVERY_QUEUE,
  type EmailDeliveryQueue,
} from '../queue/email-delivery/email-delivery.config';

@Injectable()
export class UserEventListener {
  constructor(
    @Inject(APP_CONFIG_KEY) private appConfig: AppConfig,
    @InjectQueue(EMAIL_DELIVERY_QUEUE)
    private emailDeliveryQueue: EmailDeliveryQueue,
    private logger: LoggerService,
  ) {}

  @OnEvent(EventName['user.signIn'])
  async signIn(payload: EventPayload['user.signIn']) {
    // Sign In activity email
    // ---------------------------------
    if (this.appConfig.mode === 'production')
      await this.emailDeliveryQueue
        .add('send-transactional-email', {
          to: payload.email,
          subject: 'New Sign In Activity',
          template: 'signin-alert.html',
          payload: {
            deviceName: payload.deviceName,
            deviceType: payload.deviceType,
            ip: payload.ip,
            userAgent: payload.userAgent,
          },
        })
        .catch((err: Error) =>
          this.logger.error(
            `Failed to enqueue signin-alert email: ${err.message}`,
            this.constructor.name,
          ),
        );
  }
}
