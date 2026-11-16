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
import { InviteUserDto } from './dto/invite-user.dto';
import { UpdateUserAvatarDto } from './dto/update-user-avatar.dto';

@Controller('identity/users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private store: StoreService,
  ) {}

  @Permission('identity:user:invite')
  @Post('/invite')
  invite(@Body() dto: InviteUserDto) {
    return this.userService.invite(dto);
  }

  @Permission('identity:user:invite')
  @Post(':id/resend-invite')
  resendInvite(@Param('id') id: string) {
    return this.userService.resendInvite(id);
  }

  @Permission('identity:user:update-avatar')
  @Patch(':id/avatar')
  updateAvatar(@Param('id') id: string, @Body() dto: UpdateUserAvatarDto) {
    const rq = this.store.buildResourceQuery().add([['id', 'eq', id]]);
    return this.userService.updateAvatar(rq, dto);
  }

  // ================================================================
  // Basic CRUD
  // ----------------------------------------------------------------
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

  @Permission('identity:user:update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const rq = this.store.buildResourceQuery().add([['id', 'eq', id]]);
    return this.userService.update(rq, updateUserDto);
  }

  @Permission('identity:user:archive')
  @Patch(':id/archive')
  archive(@Param('id') id: string) {
    const rq = this.store.buildResourceQuery().add([['id', 'eq', id]]);
    return this.userService.archive(rq);
  }

  @Permission('identity:user:restore')
  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    const rq = this.store.buildResourceQuery().add([['id', 'eq', id]]);
    return this.userService.restore(rq);
  }

  @Permission('identity:user:delete')
  @Delete(':id')
  delete(@Param('id') id: string) {
    const rq = this.store.buildResourceQuery().add([['id', 'eq', id]]);
    return this.userService.delete(rq);
  }
}
