import { Body, Controller, Post } from '@nestjs/common';
import { IdentityService } from './identity.service';
import { NoAuth } from '../../common/decorators/no-auth.decorator';
import { ResSuccess } from '../../common/decorators/res-success.decorator';
import { AcceptInviteCheckDto, AcceptInviteDto } from './dto/accept-invite.dto';
import { maskEmailString } from '../../shared/utils/string.util';

@Controller('identity')
export class IdentityController {
  constructor(private identityService: IdentityService) {}

  @NoAuth()
  @ResSuccess({ message: 'Invitation verified' })
  @Post('/accept-invite-check')
  async acceptInviteCheck(@Body() dto: AcceptInviteCheckDto) {
    const { expiresAt, user } =
      await this.identityService.acceptInviteCheck(dto);
    return { expiresAt, email: maskEmailString(user.email) };
  }

  @NoAuth()
  @ResSuccess({ message: 'Invitation accepted' })
  @Post('/accept-invite')
  resetPassword(@Body() dto: AcceptInviteDto) {
    return this.identityService.acceptInvite(dto);
  }
}
