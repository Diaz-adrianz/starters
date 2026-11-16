import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from '../../identity/entities/user.entity';
import {
  UserDisabledException,
  UserInvalidPasswordException,
  UserInvitedException,
  UserNoPasswordException,
  UserNotFoundException,
} from '../../identity/classes/exceptions/user.exception';
import { EventService } from '../../../infra/event/event.service';
import { ActivityOutcome } from '../../audit/enums/activity-outcome.enum';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private event: EventService,
  ) {
    super();
  }

  async validate(username: string, password: string): Promise<User> {
    try {
      const user = await this.authService.validateLocalStrategy(
        username,
        password,
      );
      return user;
    } catch (error) {
      if (error instanceof Error) {
        this.event.emitAuditActivityLog({
          module: 'auth',
          action: 'signIn',
          outcome: ActivityOutcome.FAILURE,
          metadata: { reason: error.message ?? '' },
          ...((error instanceof UserNoPasswordException ||
            error instanceof UserInvalidPasswordException ||
            error instanceof UserInvitedException ||
            error instanceof UserDisabledException) && {
            resourceId: error.user.id,
            resourceType: 'User',
          }),
        });
      }

      if (
        error instanceof UserNotFoundException ||
        error instanceof UserInvalidPasswordException
      )
        throw new UnauthorizedException('Username/Email or password invalid');

      throw error;
    }
  }
}
