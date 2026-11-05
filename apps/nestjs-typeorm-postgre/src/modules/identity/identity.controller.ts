import { Body, Controller, Post } from '@nestjs/common';
import { IdentityService } from './identity.service';
import { NoAuth } from '../../common/decorators/no-auth.decorator';
import { ResSuccess } from '../../common/decorators/res-success.decorator';
import { AcceptInviteCheckDto, AcceptInviteDto } from './dto/accept-invite.dto';
import { maskEmailString } from '../../shared/utils/string.util';
import { AuditActivity } from '../audit/decorators/audit-activity.decorator';

@Controller('identity')
export class IdentityController {
  constructor(private identityService: IdentityService) {}

  @NoAuth()
  @ResSuccess({ message: 'Invitation verified' })
  @Post('/accept-invite-check')
  async acceptInviteCheck(@Body() dto: AcceptInviteCheckDto) {
    const { expiresAt, user } =
      await this.identityService.acceptInviteCheck(dto);
    return {
      expiresAt,
      email: maskEmailString(user.email),
      username: user.username,
    };
  }

  @AuditActivity({
    module: 'identity',
    action: 'acceptInvite',
    actor: ({ res: result }) => ({
      type: 'user',
      id: result.userId,
      name: '',
    }),
    redact: ['otp', 'password', 'matchPassword'],
  })
  @NoAuth()
  @ResSuccess({ message: 'Invitation accepted' })
  @Post('/accept-invite')
  async acceptInvite(@Body() dto: AcceptInviteDto) {
    const { consumedAt, userId } = await this.identityService.acceptInvite(dto);
    return { consumedAt, userId };
  }
}
