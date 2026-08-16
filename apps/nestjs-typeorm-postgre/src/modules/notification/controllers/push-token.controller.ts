import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { OptionalAuth } from '../../../common/decorators/optional-auth.decorator';
import { ReqClient } from '../../../common/decorators/req-client.decorator';
import { Client } from '../../../shared/classes/client.class';
import { ReqUser } from '../../../common/decorators/req-user.decorator';
import { Principal } from '../../../shared/classes/principal.class';
import { Public } from '../../../common/decorators/public.decorator';
import { Permission } from '../../../common/decorators/permission.decorator';
import { ResourceScopeDto } from '../../../shared/dto/resource-scope.dto';
import { PushTokenService } from '../services/push-token.service';
import { RegisterPushTokenDto } from '../dto/register-push-token.dto';

@Controller('notification/push-tokens')
export class PushTokenController {
  constructor(private readonly pushTokenService: PushTokenService) {}

  @OptionalAuth()
  @Post('register')
  register(
    @ReqClient() client: Client,
    @Body() dto: RegisterPushTokenDto,
    @ReqUser() principal: Principal | undefined,
  ) {
    return this.pushTokenService.register(principal?.user.id, dto, client);
  }

  @Public()
  @Patch(':id/revoke')
  revoke(@Param('id') id: string) {
    return this.pushTokenService.revoke(id);
  }

  @Public()
  @Patch(':token/revoke-by-token')
  revokeByToken(@Param('token') token: string) {
    return this.pushTokenService.revokeByToken(token);
  }

  // ================================================================
  // Basic CRUD
  // ----------------------------------------------------------------
  @Permission('notification-push-tokens:read')
  @Get()
  findMany(
    @ReqUser() { permission }: Principal,
    @Query() query: ResourceScopeDto,
  ) {
    permission.scope.add(query);
    return this.pushTokenService.findMany(permission.scope);
  }
}
