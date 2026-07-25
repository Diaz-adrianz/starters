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
import { FindAllQueryDto } from '../../shared/dto/findall-query.dto';
import { FindAllQuery } from '../../shared/classes/findall-query.class';
import { UpdateRolePermissionsDto } from './dto/update-role-permission.dto';
import { ResSuccess } from '../../common/decorators/res-success.decorator';
import { Permission } from '../../common/decorators/permission.decorator';

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
  findAll(@Query() query: FindAllQueryDto) {
    const q = new FindAllQuery(query);
    return this.rolesService.findAll(q.toOptions());
  }

  @Permission('roles:find-one')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Permission('roles:update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Permission('roles:update-permissions')
  @ResSuccess({ allowNoAffected: true })
  @Patch(':id/permissions')
  updatePermissions(
    @Param('id') id: string,
    @Body() updateRolePermissionsDto: UpdateRolePermissionsDto,
  ) {
    return this.rolesService.updatePermissions(id, updateRolePermissionsDto);
  }

  @Permission('roles:soft-delete')
  @Delete(':id/soft')
  softDelete(@Param('id') id: string) {
    return this.rolesService.softDelete(id);
  }

  @Permission('roles:restore')
  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    return this.rolesService.restore(id);
  }

  @Permission('roles:delete')
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.rolesService.delete(id);
  }
}
