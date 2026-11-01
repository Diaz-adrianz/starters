import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  IdentityEventName,
  IdentityEventPayload,
} from '../../../infra/event/interfaces/identity-event.interface';
import { APP_CONFIG_KEY, type AppConfig } from '../../../config/app.config';
import { LoggerService } from '../../../infra/logger/logger.service';
import { DeliveryService } from '../resources/delivery/delivery.service';
import { DeliveryType } from '../enums/delivery-type.enum';
import { DeliveryPriority } from '../enums/delivery-priority.enum';
import { Channel } from '../enums/channel.enum';

@Injectable()
export class IdentityEventSubscriber {
  constructor(
    @Inject(APP_CONFIG_KEY) private appConfig: AppConfig,
    private logger: LoggerService,
    private deliveryService: DeliveryService,
  ) {}

  @OnEvent(IdentityEventName.USER_INVITED)
  async userInvited(payload: IdentityEventPayload['identity.user.invited']) {
    const templateKey = 'identity.user-invitation';
    try {
      await this.deliveryService.create({
        type: DeliveryType.TRANSACTIONAL,
        priority: DeliveryPriority.CRITICAL,
        templateKey,
        channels: [Channel.EMAIL],
        recipients: [
          {
            email: payload.email,
            payload: {
              otp: payload.otp.code,
              expiresIn: payload.otp.expiresIn,
              acceptUrl:
                this.appConfig.client.default.origin +
                '/auth/accept-invitation',
            },
          },
        ],
      });
    } catch (error) {
      this.logger.error(
        `Failed to send ${templateKey} email: `,
        error,
        this.constructor.name,
      );
    }
  }
}
