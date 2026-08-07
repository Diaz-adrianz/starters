import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { PermissionService } from '../services/permission.service';
import { Permission } from '../../../common/decorators/permission.decorator';
import { ReqUser } from '../../../common/decorators/req-user.decorator';
import { Principal } from '../../../shared/classes/principal.class';
import { ResourceScopeDto } from '../../../shared/dto/resource-scope.dto';
import { UpdatePermissionDto } from '../dto/update-permission.dto';

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
    @Query() query: ResourceScopeDto,
  ) {
    permission.scope.add(query);
    return this.permissionService.findMany(permission.scope);
  }

  @Permission('permissions:read')
  @Get(':id')
  findOne(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.add({ where: `id:${id}` });
    return this.permissionService.findOne(permission.scope);
  }

  @Permission('permissions:update')
  @Patch(':id')
  update(
    @ReqUser() { permission }: Principal,
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    permission.scope.add({ where: `id:${id}` });
    return this.permissionService.update(permission.scope, updatePermissionDto);
  }

  @Permission('permissions:archive')
  @Patch(':id/archive')
  softDelete(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.add({ where: `id:${id}` });
    return this.permissionService.archive(permission.scope);
  }

  @Permission('permissions:restore')
  @Patch(':id/restore')
  restore(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.add({ where: `id:${id}` });
    return this.permissionService.restore(permission.scope);
  }
}
