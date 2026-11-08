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
import { clean, maskIp } from '../../../shared/utils/string.util';

@Injectable()
export class AuthEventSubscriber {
  private name = 'notification/' + this.constructor.name;

  constructor(
    @Inject(APP_CONFIG_KEY) private appConfig: AppConfig,
    private logger: LoggerService,
    private deliveryService: DeliveryService,
  ) {}

  @OnEvent(AuthEventName.AUTH_SIGNIN)
  async signIn({ email, date, client }: AuthEventPayload['auth.signIn']) {
    if (this.appConfig.mode == 'development') return;

    const templateKey = 'auth.signin-alert';
    try {
      const deviceDisplayBase =
        clean(client.label) ||
        [
          clean(client.browser),
          [clean(client.os), clean(client.osVersion)].filter(Boolean).join(' '),
        ]
          .filter(Boolean)
          .join(' on ') ||
        'Unknown device';

      await this.deliveryService.create({
        type: DeliveryType.SYSTEM,
        priority: DeliveryPriority.HIGH,
        channels: [Channel.EMAIL],
        templateKey,
        recipients: [
          {
            email: email,
            payload: {
              email: email,
              deviceDisplay:
                client.type && client.type !== 'web'
                  ? `${deviceDisplayBase} · App`
                  : deviceDisplayBase,
              ipAddress: maskIp(client.ipAddress),
              time:
                new Intl.DateTimeFormat('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                  timeZone: 'UTC',
                }).format(date) + ' UTC',
            },
          },
        ],
      });
      this.logger.debug(
        `Email ${templateKey} sent for user ${email} on user.signIn`,
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
