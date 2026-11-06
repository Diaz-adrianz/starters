import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { RoleUserService } from './role-user.service';
import { StoreService } from '../../../../infra/store/store.service';
import { AuditActivity } from '../../../audit/decorators/audit-activity.decorator';
import { Permission } from '../../decorators/permission.decorator';
import { CreateRoleUserDto } from './dto/create-role-user.dto';
import { ResourceQueryDto } from '../../../../shared/dto/resource-query.dto';

@Controller('access-control/role-users')
export class RoleUserController {
  constructor(
    private readonly roleUserService: RoleUserService,
    private store: StoreService,
  ) {}

  // Base
  // ----------------------------------------------------------------
  @AuditActivity({ targetId: ({ res }) => res.id })
  @Permission('access-control:role-user:create')
  @Post()
  create(@Body() dto: CreateRoleUserDto) {
    return this.roleUserService.create(dto);
  }

  @Permission('access-control:role-user:read')
  @Get()
  findMany(@Query() query: ResourceQueryDto) {
    const rq = this.store.buildResourceQuery().addFromDto(query);
    return this.roleUserService.findMany(rq);
  }

  @AuditActivity({ targetId: ({ req }) => req.params.id })
  @Permission('access-control:role-user:delete')
  @Delete(':id')
  delete(@Param('id') id: string) {
    const rq = this.store.buildResourceQuery().add([['id', 'eq', id]]);
    return this.roleUserService.delete(rq);
  }
}
