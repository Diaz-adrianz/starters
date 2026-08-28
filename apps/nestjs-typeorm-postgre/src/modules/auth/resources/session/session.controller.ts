import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { Permission } from '../../../../common/decorators/permission.decorator';
import { ResourceQueryDto } from '../../../../shared/dto/resource-query.dto';
import { StoreService } from '../../../../infra/store/store.service';
import { SessionService } from './session.service';

@Controller('auth/sessions')
export class SessionController {
  constructor(
    private readonly sessionService: SessionService,
    private store: StoreService,
  ) {}

  @Permission('auth:session:revoke')
  @Patch(':id/revoke')
  revokeOne(@Param('id') id: string) {
    const scope = this.store.buildResourceScope();
    scope.add([{ field: 'id', op: 'where', value: id }]);
    return this.sessionService.revoke(scope);
  }

  // ================================================================
  // Basic CRUD
  // ----------------------------------------------------------------
  @Permission('auth:session:read')
  @Get()
  findMany(@Query() query: ResourceQueryDto) {
    const scope = this.store.buildResourceScope();
    scope.addQuery(query);
    return this.sessionService.findMany(scope);
  }

  @Permission('auth:session:read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    const scope = this.store.buildResourceScope();
    scope.add([{ field: 'id', op: 'where', value: id }]);
    return this.sessionService.findOne(scope);
  }
}
