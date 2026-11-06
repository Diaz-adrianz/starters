import { Controller, Delete, Get, Param, Patch, Query } from '@nestjs/common';
import { ResourceQueryDto } from '../../../../shared/dto/resource-query.dto';
import { StoreService } from '../../../../infra/store/store.service';
import { SessionService } from './session.service';
import { Permission } from '../../../access-control/decorators/permission.decorator';
import { AuditActivity } from '../../../audit/decorators/audit-activity.decorator';

@Controller('auth/sessions')
export class SessionController {
  constructor(
    private readonly sessionService: SessionService,
    private store: StoreService,
  ) {}

  @AuditActivity({ targetId: ({ req }) => req.params.id })
  @Permission('auth:session:revoke')
  @Patch(':id/revoke')
  revokeOne(@Param('id') id: string) {
    return this.sessionService.revokeById(id);
  }

  // ================================================================
  // Basic CRUD
  // ----------------------------------------------------------------
  @Permission('auth:session:read')
  @Get()
  findMany(@Query() query: ResourceQueryDto) {
    const rq = this.store.buildResourceQuery().addFromDto(query);
    return this.sessionService.findMany(rq);
  }

  @Permission('auth:session:read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    const rq = this.store.buildResourceQuery().add([['id', 'eq', id]]);
    return this.sessionService.findOne(rq);
  }

  @AuditActivity({ targetId: ({ req }) => req.params.id })
  @Permission('auth:session:delete')
  @Delete(':id')
  delete(@Param('id') id: string) {
    const rq = this.store.buildResourceQuery().add([['id', 'eq', id]]);
    return this.sessionService.delete(rq);
  }
}
