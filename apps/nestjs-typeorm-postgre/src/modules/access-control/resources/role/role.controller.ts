import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ResourceQueryDto } from '../../../../shared/dto/resource-query.dto';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { StoreService } from '../../../../infra/store/store.service';
import { Permission } from '../../decorators/permission.decorator';
import { SetRoleUserDto } from './dto/set-role-user.dto';
import { SetRolePermissionDto } from './dto/set-role-permission.dto';
import { SetRolePageDto } from './dto/set-role-page.dto';

@Controller('access-control/roles')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private store: StoreService,
  ) {}

  @Permission('access-control:role:read')
  @Get(':id/pages')
  findManyPage(@Param('id') id: string, @Query() query: ResourceQueryDto) {
    const rq = this.store
      .buildResourceQuery()
      .addFromDto(query, 'and', ['page.description']);
    return this.roleService.findManyPage(id, rq);
  }

  @Permission('access-control:role:update')
  @Put(':id/pages')
  setPage(@Param('id') id: string, @Body() dto: SetRolePageDto) {
    return this.roleService.setPage(id, dto);
  }

  @Permission('access-control:role:read')
  @Get(':id/permissions')
  findManyPermission(
    @Param('id') id: string,
    @Query() query: ResourceQueryDto,
  ) {
    const rq = this.store
      .buildResourceQuery()
      .addFromDto(query, 'and', ['permission.description']);
    return this.roleService.findManyPermission(id, rq);
  }

  @Permission('access-control:role:update')
  @Put(':id/permissions')
  setPermission(@Param('id') id: string, @Body() dto: SetRolePermissionDto) {
    return this.roleService.setPermission(id, dto);
  }

  @Permission('access-control:role:read')
  @Get(':id/users')
  findManyUser(@Param('id') id: string, @Query() query: ResourceQueryDto) {
    const rq = this.store.buildResourceQuery().addFromDto(query);
    return this.roleService.findManyUser(id, rq);
  }

  @Permission('access-control:role:update')
  @Put(':id/users')
  setUser(@Param('id') id: string, @Body() dto: SetRoleUserDto) {
    return this.roleService.setUser(id, dto);
  }

  // ================================================================
  // Basic CRUD
  // ----------------------------------------------------------------
  @Permission('access-control:role:create')
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Permission('access-control:role:read')
  @Get()
  findMany(@Query() query: ResourceQueryDto) {
    const rq = this.store.buildResourceQuery().addFromDto(query);
    return this.roleService.findMany(rq);
  }

  @Permission('access-control:role:read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    const rq = this.store.buildResourceQuery().add([['id', 'eq', id]]);
    return this.roleService.findOne(rq);
  }

  @Permission('access-control:role:update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    const rq = this.store.buildResourceQuery().add([['id', 'eq', id]]);
    return this.roleService.update(rq, updateRoleDto);
  }

  @Permission('access-control:role:archive')
  @Patch(':id/archive')
  archive(@Param('id') id: string) {
    const rq = this.store.buildResourceQuery().add([['id', 'eq', id]]);
    return this.roleService.archive(rq);
  }

  @Permission('access-control:role:restore')
  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    const rq = this.store.buildResourceQuery().add([['id', 'eq', id]]);
    return this.roleService.restore(rq);
  }

  @Permission('access-control:role:delete')
  @Delete(':id')
  delete(@Param('id') id: string) {
    const rq = this.store.buildResourceQuery().add([['id', 'eq', id]]);
    return this.roleService.delete(rq);
  }
}
