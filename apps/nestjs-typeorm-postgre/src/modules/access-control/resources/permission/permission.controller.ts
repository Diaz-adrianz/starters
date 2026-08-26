import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ResourceQueryDto } from '../../../../shared/dto/resource-query.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionService } from './permission.service';
import { Permission } from '../../../../common/decorators/permission.decorator';
import { StoreService } from '../../../../infra/store/store.service';

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
    const scope = this.store.buildResourceScope();
    scope.addQuery(query);
    return this.permissionService.findMany(scope);
  }

  @Permission('access-control:permission:read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    const scope = this.store.buildResourceScope();
    scope.add([{ field: 'id', op: 'where', value: id }]);
    return this.permissionService.findOne(scope);
  }

  @Permission('access-control:permission:update')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    const scope = this.store.buildResourceScope();
    scope.add([{ field: 'id', op: 'where', value: id }]);
    return this.permissionService.update(scope, updatePermissionDto);
  }
}
