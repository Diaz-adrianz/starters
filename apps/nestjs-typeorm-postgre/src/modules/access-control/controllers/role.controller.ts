import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ReqUser } from '../../../common/decorators/req-user.decorator';
import { Principal } from '../../../shared/classes/principal.class';
import { Permission } from '../../../common/decorators/permission.decorator';
import { RoleService } from '../services/role.service';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { CreateRoleDto } from '../dto/create-role.dto';
import { ResourceQueryDto } from '../../../shared/dto/resource-query.dto';

@Controller('access-control/roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  // ================================================================
  // Basic CRUD
  // ----------------------------------------------------------------
  @Permission('roles:create')
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Permission('roles:read')
  @Get()
  findMany(
    @ReqUser() { permission }: Principal,
    @Query() query: ResourceQueryDto,
  ) {
    permission.scope.addQuery(query);
    return this.roleService.findMany(permission.scope);
  }

  @Permission('roles:read')
  @Get(':id')
  findOne(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.add([{ field: 'id', op: 'where', value: id }]);
    return this.roleService.findOne(permission.scope);
  }

  @Permission('roles:update')
  @Patch(':id')
  update(
    @ReqUser() { permission }: Principal,
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    permission.scope.add([{ field: 'id', op: 'where', value: id }]);
    return this.roleService.update(permission.scope, updateRoleDto);
  }

  @Permission('roles:archive')
  @Patch(':id/archive')
  archive(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.add([{ field: 'id', op: 'where', value: id }]);
    return this.roleService.archive(permission.scope);
  }

  @Permission('roles:restore')
  @Patch(':id/restore')
  restore(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.add([{ field: 'id', op: 'where', value: id }]);
    return this.roleService.restore(permission.scope);
  }

  @Permission('roles:delete')
  @Delete(':id')
  delete(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.add([{ field: 'id', op: 'where', value: id }]);
    return this.roleService.delete(permission.scope);
  }
}
