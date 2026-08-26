import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { OptionalAuth } from '../../../../common/decorators/optional-auth.decorator';
import { ReqClient } from '../../../../common/decorators/req-client.decorator';
import { Client } from '../../../../shared/classes/client.class';
import { Public } from '../../../../common/decorators/public.decorator';
import { Permission } from '../../../../common/decorators/permission.decorator';
import { PushTokenService } from './push-token.service';
import { RegisterPushTokenDto } from './dto/register-push-token.dto';
import { ResourceQueryDto } from '../../../../shared/dto/resource-query.dto';
import { StoreService } from '../../../../infra/store/store.service';

@Controller('notification/push-tokens')
export class PushTokenController {
  constructor(
    private readonly pushTokenService: PushTokenService,
    private store: StoreService,
  ) {}

  @OptionalAuth()
  @Post('register')
  register(@ReqClient() client: Client, @Body() dto: RegisterPushTokenDto) {
    return this.pushTokenService.register(
      this.store.get('actor')?.id,
      dto,
      client,
    );
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
  @Permission('notification:push-token:read')
  @Get()
  findMany(@Query() query: ResourceQueryDto) {
    const scope = this.store.buildResourceScope();
    scope.addQuery(query);
    return this.pushTokenService.findMany(scope);
  }
}
