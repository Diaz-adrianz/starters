import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { LoggerService } from '../../../infra/logger/logger.service';
import { APP_CONFIG_KEY, type AppConfig } from '../../../config/app.config';
import { DeliveryService } from '../resources/delivery/delivery.service';
import { Channel } from '../enums/channel.enum';
import {
  AuthEventName,
  AuthEventPayload,
} from '../../../infra/event/interfaces/auth-event.interface';
import { DeliveryType } from '../enums/delivery-type.enum';
import { DeliveryPriority } from '../enums/delivery-priority.enum';

@Injectable()
export class AuthEventSubscriber {
  private name = 'notification/' + this.constructor.name;

  constructor(
    @Inject(APP_CONFIG_KEY) private appConfig: AppConfig,
    private logger: LoggerService,
    private deliveryService: DeliveryService,
  ) {}

  @OnEvent(AuthEventName.AUTH_SIGNIN)
  async signIn(payload: AuthEventPayload['auth.signIn']) {
    if (this.appConfig.mode == 'development') return;

    const templateKey = 'auth.signin-alert';
    try {
      await this.deliveryService.create({
        type: DeliveryType.SYSTEM,
        priority: DeliveryPriority.HIGH,
        channels: [Channel.EMAIL],
        templateKey,
        recipients: [
          {
            email: payload.email,
            payload: {
              email: payload.email,
              deviceLabel: payload.device.label,
              deviceType: payload.device.type,
              browser: payload.device.browser,
              os: payload.device.os,
              ipAddress: payload.device.ipAddress,
            },
          },
        ],
      });
      this.logger.debug(
        `Email ${templateKey} sent for user ${payload.email} on user.signIn`,
        this.name,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send ${templateKey} email: `,
        error,
        this.name,
      );
    }
  }
}
