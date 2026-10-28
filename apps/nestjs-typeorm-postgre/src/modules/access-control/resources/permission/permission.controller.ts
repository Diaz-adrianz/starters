import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ResourceQueryDto } from '../../../../shared/dto/resource-query.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionService } from './permission.service';
import { StoreService } from '../../../../infra/store/store.service';
import { Permission } from '../../decorators/permission.decorator';
import { AuditActivity } from '../../../audit/decorators/audit-activity.decorator';

@Controller('access-control/permissions')
export class PermissionController {
  constructor(
    private readonly permissionService: PermissionService,
    private store: StoreService,
  ) {}

  @Permission('access-control:permission:read')
  @Get('/modules')
  findModules() {
    return this.permissionService.findModules();
  }

  // ================================================================
  // Basic CRUD
  // ----------------------------------------------------------------
  @Permission('access-control:permission:read')
  @Get()
  findMany(@Query() query: ResourceQueryDto) {
    const rq = this.store.buildResourceQuery().addFromDto(query);
    return this.permissionService.findMany(rq);
  }

  @Permission('access-control:permission:read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    const rq = this.store.buildResourceQuery().add([['id', 'eq', id]]);
    return this.permissionService.findOne(rq);
  }

  @AuditActivity({ targetId: ({ req }) => req.params.id })
  @Permission('access-control:permission:update')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    const rq = this.store.buildResourceQuery().add([['id', 'eq', id]]);
    return this.permissionService.update(rq, updatePermissionDto);
  }
}
