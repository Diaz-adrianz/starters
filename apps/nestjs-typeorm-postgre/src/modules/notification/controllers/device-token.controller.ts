import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { DeviceTokenService } from '../services/device-token.service';
import { OptionalAuth } from '../../../common/decorators/optional-auth.decorator';
import { ReqClient } from '../../../common/decorators/req-client.decorator';
import { Client } from '../../../shared/classes/client.class';
import { RegisterDeviceTokenDto } from '../dto/register-device-token.dto';
import { ReqUser } from '../../../common/decorators/req-user.decorator';
import { Principal } from '../../../shared/classes/principal.class';
import { Public } from '../../../common/decorators/public.decorator';

@Controller('notification/device-tokens')
export class DeviceTokenController {
  constructor(private readonly deviceTokenService: DeviceTokenService) {}

  @OptionalAuth()
  @Post('register')
  register(
    @ReqClient() client: Client,
    @Body() registerDeviceTokenDto: RegisterDeviceTokenDto,
    @ReqUser() principal: Principal | undefined,
  ) {
    return this.deviceTokenService.register(
      principal?.user.id,
      registerDeviceTokenDto,
      client,
    );
  }

  @Public()
  @Patch(':id/revoke')
  revoke(@Param('id') id: string) {
    return this.deviceTokenService.revoke(id);
  }

  @Public()
  @Patch(':token/revoke-by-token')
  revokeByToken(@Param('token') token: string) {
    return this.deviceTokenService.revokeByToken(token);
  }
}
