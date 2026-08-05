import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { DeviceTokenService } from '../services/device-token.service';
import { OptionalAuth } from '../../../common/decorators/optional-auth.decorator';
import { ReqClient } from '../../../common/decorators/req-client.decorator';
import { Client } from '../../../shared/classes/client.class';
import { CreateDeviceTokenDto } from '../dto/create-device-token.dto';
import { ReqUser } from '../../../common/decorators/req-user.decorator';
import { Principal } from '../../../shared/classes/principal.class';
import { Public } from '../../../common/decorators/public.decorator';
import { UpdateDeviceTokenDto } from '../dto/update-device-token.dto';

@Controller('notification/device-tokens')
export class DeviceTokenController {
  constructor(private readonly deviceTokenService: DeviceTokenService) {}

  @OptionalAuth()
  @Post()
  create(
    @ReqClient() client: Client,
    @Body() createDeviceTokenDto: CreateDeviceTokenDto,
    @ReqUser() principal: Principal | undefined,
  ) {
    this.requireClientDeviceId(client);

    return this.deviceTokenService.create(
      client.deviceId!,
      createDeviceTokenDto,
      principal?.user.id,
    );
  }

  @Public()
  @Patch(':token')
  update(
    @ReqClient() client: Client,
    @Param('token') token: string,
    @Body() updateDeviceTokenDto: UpdateDeviceTokenDto,
  ) {
    this.requireClientDeviceId(client);
    return this.deviceTokenService.update(
      client.deviceId!,
      token,
      updateDeviceTokenDto,
    );
  }

  @Public()
  @Delete(':token')
  delete(@ReqClient() client: Client, @Param('token') token: string) {
    this.requireClientDeviceId(client);
    return this.deviceTokenService.delete(client.deviceId!, token);
  }

  // ================================================================
  // Local utils
  // ----------------------------------------------------------------
  private requireClientDeviceId(client: Client) {
    if (!client.deviceId)
      throw new BadRequestException('Device initialization required');
  }
}
