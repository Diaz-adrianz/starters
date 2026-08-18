import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { LoggerService } from '../../../infra/logger/logger.service';
import { APP_CONFIG_KEY, type AppConfig } from '../../../config/app.config';
import { DeliveryService } from '../resources/delivery/delivery.service';
import { Type } from '../enums/delivery-type.enum';
import { Channel } from '../enums/channel.enum';
import {
  AuthEventName,
  AuthEventPayload,
} from '../../../infra/event/interfaces/auth-event.interface';

@Injectable()
export class AuthEventSubscriber {
  constructor(
    @Inject(APP_CONFIG_KEY) private appConfig: AppConfig,
    private logger: LoggerService,
    private deliveryService: DeliveryService,
  ) {}

  @OnEvent(AuthEventName.AUTH_SIGNIN)
  async signIn(payload: AuthEventPayload['auth.signIn']) {
    if (this.appConfig.mode == 'development') return;

    try {
      await this.deliveryService.create({
        type: Type.SYSTEM,
        channels: [Channel.EMAIL],
        templateKey: 'auth.signin-alert',
        recipients: [
          {
            email: payload.email,
            payload: {
              deviceName: payload.deviceName,
              deviceType: payload.deviceType,
              ip: payload.ip,
              userAgent: payload.userAgent,
            },
          },
        ],
      });
    } catch (error) {
      this.logger.error(error, this.constructor.name);
    }
  }
}
