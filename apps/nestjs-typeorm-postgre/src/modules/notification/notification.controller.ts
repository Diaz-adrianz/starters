import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ReqUser } from '../../common/decorators/req-user.decorator';
import { Principal } from '../../shared/classes/principal.class';
import { Public } from '../../common/decorators/public.decorator';
import { CreateDeviceTokenDto } from './dto/create-device-token.dto';
import { ReqClient } from '../../common/decorators/req-client.decorator';
import { Client } from '../../shared/classes/client.class';
import { UpdateDeviceTokenDto } from './dto/update-device-token.dto';
import { OptionalAuth } from '../../common/decorators/optional-auth.decorator';
import { Permission } from '../../common/decorators/permission.decorator';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { DeviceTokenService } from './services/device-token.service';
import { ResourceScopeDto } from '../../shared/dto/resource-scope.dto';
import { RecipientService } from './services/recipient.service';

@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly deviceTokenService: DeviceTokenService,
    private readonly recipientService: RecipientService,
  ) {}

  @Permission('notifications:create')
  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @Permission('notifications:find-all')
  @Get()
  findAll(
    @ReqUser() { permission }: Principal,
    @Query() query: ResourceScopeDto,
  ) {
    permission.scope.add(query, 'AND', ['recipients']);
    return this.notificationService.findAll(permission.scope.toPageOptions());
  }

  @Permission('notifications:find-one')
  @Get(':id')
  async findOne(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.add({ where: `id:${id}` });
    return this.notificationService.findOne(permission.scope.toOptions());
  }

  // ================================================================
  // Device token
  // ----------------------------------------------------------------
  @OptionalAuth()
  @Post('/device-tokens')
  registerDevice(
    @ReqClient() client: Client,
    @Body() createDeviceTokenDto: CreateDeviceTokenDto,
    @ReqUser() principal: Principal | undefined,
  ) {
    this.requireClientDeviceId(client);

    return this.deviceTokenService.createDeviceToken(
      client.deviceId!,
      createDeviceTokenDto,
      principal?.user.id,
    );
  }

  @Public()
  @Patch('/device-tokens/:token')
  updateDeviceToken(
    @ReqClient() client: Client,
    @Param('token') token: string,
    @Body() updateDeviceTokenDto: UpdateDeviceTokenDto,
  ) {
    this.requireClientDeviceId(client);
    return this.deviceTokenService.updateDeviceToken(
      client.deviceId!,
      token,
      updateDeviceTokenDto,
    );
  }

  @Public()
  @Delete('/device-tokens/:token')
  unregisterDevice(@ReqClient() client: Client, @Param('token') token: string) {
    this.requireClientDeviceId(client);
    return this.deviceTokenService.deleteDeviceToken(client.deviceId!, token);
  }

  // ================================================================
  // Local utils
  // ----------------------------------------------------------------
  private requireClientDeviceId(client: Client) {
    if (!client.deviceId)
      throw new BadRequestException('Device initialization required');
  }
}
