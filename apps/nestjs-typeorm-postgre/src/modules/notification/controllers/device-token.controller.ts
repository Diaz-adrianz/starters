import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { DeviceTokenService } from '../services/device-token.service';
import { OptionalAuth } from '../../../common/decorators/optional-auth.decorator';
import { ReqClient } from '../../../common/decorators/req-client.decorator';
import { Client } from '../../../shared/classes/client.class';
import { RegisterDeviceTokenDto } from '../dto/register-device-token.dto';
import { ReqUser } from '../../../common/decorators/req-user.decorator';
import { Principal } from '../../../shared/classes/principal.class';
import { Public } from '../../../common/decorators/public.decorator';
import { Permission } from '../../../common/decorators/permission.decorator';
import { ResourceScopeDto } from '../../../shared/dto/resource-scope.dto';

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

  // ================================================================
  // Basic CRUD
  // ----------------------------------------------------------------
  @Permission('notification-device-tokens:read')
  @Get()
  findMany(
    @ReqUser() { permission }: Principal,
    @Query() query: ResourceScopeDto,
  ) {
    permission.scope.add(query);
    return this.deviceTokenService.findMany(permission.scope);
  }
}
