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
import { FindAllQueryDto } from '../../shared/dto/findall-query.dto';
import { FindAllQuery } from '../../shared/classes/findall-query.class';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  findAll(@Query() query: FindAllQueryDto) {
    const q = new FindAllQuery(query);
    return this.permissionsService.findAll(q.toOptions());
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @Delete(':id/soft')
  softDelete(@Param('id') id: string) {
    return this.permissionsService.softDelete(id);
  }

  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    return this.permissionsService.restore(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.permissionsService.delete(id);
  }
}
