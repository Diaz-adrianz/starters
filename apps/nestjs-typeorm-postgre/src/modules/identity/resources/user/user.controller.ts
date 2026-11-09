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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResourceQueryDto } from '../../../../shared/dto/resource-query.dto';
import { StoreService } from '../../../../infra/store/store.service';
import { Permission } from '../../../access-control/decorators/permission.decorator';
import { AuditActivity } from '../../../audit/decorators/audit-activity.decorator';
import { InviteUserDto } from './dto/invite-user.dto';

@Controller('identity/users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private store: StoreService,
  ) {}

  @AuditActivity({ targetId: ({ res }) => res.id })
  @Permission('identity:user:invite')
  @Post('/invite')
  invite(@Body() dto: InviteUserDto) {
    return this.userService.invite(dto);
  }

  @AuditActivity({ targetId: ({ req }) => req.params.id })
  @Permission('identity:user:invite')
  @Post(':id/resend-invite')
  resendInvite(@Param('id') id: string) {
    return this.userService.resendInvite(id);
  }

  // ================================================================
  // Basic CRUD
  // ----------------------------------------------------------------
  @AuditActivity({
    targetId: ({ res }) => res.id,
    redact: ['password', 'matchPassword'],
  })
  @Permission('identity:user:create')
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Permission('identity:user:read')
  @Get()
  findMany(@Query() query: ResourceQueryDto) {
    const q = this.store
      .buildResourceQuery()
      .addFromDto(query, 'and', [
        'profile.firstName',
        'profile.lastName',
        'profile.phoneNumber',
      ]);
    return this.userService.findMany(q);
  }

  @Permission('identity:user:read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    const rq = this.store.buildResourceQuery().add([['id', 'eq', id]]);
    return this.userService.findOne(rq);
  }

  @AuditActivity({ targetId: ({ req }) => req.params.id, redact: [] })
  @Permission('identity:user:update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const rq = this.store.buildResourceQuery().add([['id', 'eq', id]]);
    return this.userService.update(rq, updateUserDto);
  }

  @AuditActivity({ targetId: ({ req }) => req.params.id })
  @Permission('identity:user:archive')
  @Patch(':id/archive')
  archive(@Param('id') id: string) {
    const rq = this.store.buildResourceQuery().add([['id', 'eq', id]]);
    return this.userService.archive(rq);
  }

  @AuditActivity({ targetId: ({ req }) => req.params.id })
  @Permission('identity:user:restore')
  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    const rq = this.store.buildResourceQuery().add([['id', 'eq', id]]);
    return this.userService.restore(rq);
  }

  @AuditActivity({ targetId: ({ req }) => req.params.id })
  @Permission('identity:user:delete')
  @Delete(':id')
  delete(@Param('id') id: string) {
    const rq = this.store.buildResourceQuery().add([['id', 'eq', id]]);
    return this.userService.delete(rq);
  }
}
