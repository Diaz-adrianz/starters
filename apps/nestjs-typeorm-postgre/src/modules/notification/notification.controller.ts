import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ReqUser } from '../../common/decorators/req-user.decorator';
import { Principal } from '../../shared/classes/principal.class';
import { Public } from '../../common/decorators/public.decorator';
import { CreateDeviceTokenDto } from './dto/create-device-token.dto';
import { ReqClient } from '../../common/decorators/req-client.decorator';
import { Client } from '../../shared/classes/client.class';
import { UpdateDeviceTokenDto } from './dto/update-device-token.dto';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // ================================================================
  // Device handlers
  // ----------------------------------------------------------------
  @Public()
  @Post('/device-token')
  registerDevice(
    @ReqClient() client: Client,
    @Body() createDeviceTokenDto: CreateDeviceTokenDto,
    @ReqUser() principal: Principal | null | undefined,
  ) {
    this.requireClientDeviceId(client);

    return this.notificationService.createDeviceToken(
      client.deviceId!,
      createDeviceTokenDto,
      principal?.user.id,
    );
  }

  @Public()
  @Patch('/device-token/:token')
  updateDeviceToken(
    @ReqClient() client: Client,
    @Param('token') token: string,
    @Body() updateDeviceTokenDto: UpdateDeviceTokenDto,
  ) {
    this.requireClientDeviceId(client);
    return this.notificationService.updateDeviceToken(
      client.deviceId!,
      token,
      updateDeviceTokenDto,
    );
  }

  @Public()
  @Delete('/device-token/:token')
  unregisterDevice(@ReqClient() client: Client, @Param('token') token: string) {
    this.requireClientDeviceId(client);
    return this.notificationService.deleteDeviceToken(client.deviceId!, token);
  }

  // ================================================================
  // Local utils
  // ----------------------------------------------------------------
  private requireClientDeviceId(client: Client) {
    if (!client.deviceId)
      throw new BadRequestException('Device initialization required');
  }
}
