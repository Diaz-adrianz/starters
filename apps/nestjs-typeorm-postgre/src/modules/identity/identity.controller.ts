import { Body, Controller, Post } from '@nestjs/common';
import { IdentityService } from './identity.service';
import { NoAuth } from '../../common/decorators/no-auth.decorator';
import { ResSuccess } from '../../common/decorators/res-success.decorator';
import { AcceptInviteCheckDto, AcceptInviteDto } from './dto/accept-invite.dto';
import { maskEmailString } from '../../shared/utils/string.util';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Controller('identity')
export class IdentityController {
  constructor(private identityService: IdentityService) {}

  @NoAuth()
  @ResSuccess({ message: 'If the email exists, a reset code has been sent' })
  @Post('/forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.identityService.forgotPassword(dto);
  }

  @NoAuth()
  @ResSuccess({ message: 'Set password verified' })
  @Post('/set-password-check')
  async setPasswordCheck(@Body() dto: AcceptInviteCheckDto) {
    const { expiresAt, user } =
      await this.identityService.setPasswordCheck(dto);
    return {
      expiresAt,
      email: maskEmailString(user.email),
    };
  }

  @NoAuth()
  @ResSuccess({ message: 'Set password accepted' })
  @Post('/set-password')
  async setPassword(@Body() dto: AcceptInviteDto) {
    const { consumedAt, user } = await this.identityService.setPassword(dto);
    return { consumedAt, userId: user.id, username: user.username };
  }

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

  @NoAuth()
  @ResSuccess({ message: 'Invitation accepted' })
  @Post('/accept-invite')
  async acceptInvite(@Body() dto: AcceptInviteDto) {
    const { consumedAt, user } = await this.identityService.acceptInvite(dto);
    return { consumedAt, userId: user.id, username: user.username };
  }
}
