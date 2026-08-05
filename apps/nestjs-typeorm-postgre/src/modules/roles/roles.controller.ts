import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateRolePermissionsDto } from './dto/update-role-permission.dto';
import { ResSuccess } from '../../common/decorators/res-success.decorator';
import { Permission } from '../../common/decorators/permission.decorator';
import { ResourceScopeDto } from '../../shared/dto/resource-scope.dto';
import { ReqUser } from '../../common/decorators/req-user.decorator';
import { Principal } from '../../shared/classes/principal.class';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Permission('roles:create')
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Permission('roles:find-all')
  @Get()
  findAll(
    @ReqUser() { permission }: Principal,
    @Query() query: ResourceScopeDto,
  ) {
    permission.scope.add(query);
    return this.rolesService.findAll(permission.scope.toPageOptions());
  }

  @Permission('roles:find-one')
  @Get(':id')
  findOne(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.add({ where: `id:${id}` });
    return this.rolesService.findOne(permission.scope.toOptions());
  }

  @Permission('roles:update')
  @Patch(':id')
  async update(
    @ReqUser() { permission }: Principal,
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    permission.scope.add({ where: `id:${id}` });
    await this.rolesService.findOne(permission.scope.toOptions());
    return this.rolesService.update(id, updateRoleDto);
  }

  @Permission('roles:update-permissions')
  @ResSuccess({ allowNoAffected: true })
  @Patch(':id/permissions')
  async updatePermissions(
    @ReqUser() { permission }: Principal,
    @Param('id') id: string,
    @Body() updateRolePermissionsDto: UpdateRolePermissionsDto,
  ) {
    permission.scope.add({ where: `id:${id}` });
    await this.rolesService.findOne(permission.scope.toOptions());
    return this.rolesService.updatePermissions(id, updateRolePermissionsDto);
  }

  @Permission('roles:soft-delete')
  @Delete(':id/soft')
  async softDelete(
    @ReqUser() { permission }: Principal,
    @Param('id') id: string,
  ) {
    permission.scope.add({ where: `id:${id}` });
    await this.rolesService.findOne(permission.scope.toOptions());
    return this.rolesService.softDelete(id);
  }

  @Permission('roles:restore')
  @Patch(':id/restore')
  async restore(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.add({ where: `id:${id}` });
    await this.rolesService.findOne(permission.scope.toOptions());
    return this.rolesService.restore(id);
  }

  @Permission('roles:delete')
  @Delete(':id')
  async delete(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.add({ where: `id:${id}` });
    await this.rolesService.findOne(permission.scope.toOptions());
    return this.rolesService.delete(id);
  }
}
