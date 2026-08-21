import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ReqUser } from '../../../../common/decorators/req-user.decorator';
import { Principal } from '../../../../shared/classes/principal.class';
import { ResourceQueryDto } from '../../../../shared/dto/resource-query.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionService } from './permission.service';
import { Permission } from '../../../../common/decorators/permission.decorator';

@Controller('access-control/permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Permission('permissions:read')
  @Get('/groups')
  findGroups() {
    return this.permissionService.findGroups();
  }

  // ================================================================
  // Basic CRUD
  // ----------------------------------------------------------------
  @Permission('permissions:read')
  @Get()
  findMany(
    @ReqUser() { permission }: Principal,
    @Query() query: ResourceQueryDto,
  ) {
    permission.scope.addQuery(query);
    return this.permissionService.findMany(permission.scope);
  }

  @Permission('permissions:read')
  @Get(':id')
  findOne(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.add([{ field: 'id', op: 'where', value: id }]);
    return this.permissionService.findOne(permission.scope);
  }

  @Permission('permissions:update')
  @Patch(':id')
  update(
    @ReqUser() { permission }: Principal,
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    permission.scope.add([{ field: 'id', op: 'where', value: id }]);
    return this.permissionService.update(permission.scope, updatePermissionDto);
  }
}
