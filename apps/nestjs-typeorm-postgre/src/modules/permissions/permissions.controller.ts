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
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from '../../common/decorators/permission.decorator';
import { ResourceScope } from '../../shared/classes/resource-scope.class';
import { ResourceScopeQueryDto } from '../../shared/dto/resource-scope.dto';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Permission('permissions:create')
  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Permission('permissions:find-all')
  @Get()
  findAll(@Query() query: ResourceScopeQueryDto) {
    const q = new ResourceScope(query, 'AND');
    return this.permissionsService.findAll(q.toOptions());
  }

  @Permission('permissions:find-one')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Permission('permissions:update')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @Permission('permissions:soft-delete')
  @Delete(':id/soft')
  softDelete(@Param('id') id: string) {
    return this.permissionsService.softDelete(id);
  }

  @Permission('permissions:restore')
  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    return this.permissionsService.restore(id);
  }

  @Permission('permissions:delete')
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.permissionsService.delete(id);
  }
}
