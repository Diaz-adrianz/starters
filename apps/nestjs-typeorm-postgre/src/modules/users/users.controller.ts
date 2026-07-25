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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllQueryDto } from '../../shared/dto/findall-query.dto';
import { FindAllQuery } from '../../shared/classes/findall-query.class';
import { UpdateUserRolesDto } from './dto/update-user-role.dto';
import { Permission } from '../../common/decorators/permission.decorator';
import { ResSuccess } from '../../common/decorators/res-success.decorator';
import {
  CreateUserAvatarUploadUrlDto,
  UpdateUserAvatarDto,
  UserAvatarMaxBytes,
} from './dto/update-user-avatar.dto';
import { ReqUser } from '../../common/decorators/req-user.decorator';
import { AuthContext } from '../../common/classes/auth-context.class';
import { DefaultStorageService } from '../../lib/storage/default/default-storage.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private storageService: DefaultStorageService,
  ) {}

  @Permission('users:create')
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('me/avatar/upload-url')
  createAvatarUploadUrl(
    @ReqUser() { userId }: AuthContext,
    @Body() { mimeType }: CreateUserAvatarUploadUrlDto,
  ) {
    return this.storageService.getSignedUploadUrl(
      (k) => k.tmp(k.avatar(userId)),
      mimeType,
      UserAvatarMaxBytes,
    );
  }

  @Permission('users:find-all')
  @Get()
  findAll(@Query() query: FindAllQueryDto) {
    const q = new FindAllQuery(query);
    return this.usersService.findAll(q.toOptions());
  }

  @Permission('users:find-one')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Permission('users:update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Permission('users:update-roles')
  @ResSuccess({ allowNoAffected: true })
  @Patch(':id/roles')
  updateRoles(
    @Param('id') id: string,
    @Body() updateUserRolesDto: UpdateUserRolesDto,
  ) {
    return this.usersService.updateUserRoles(id, updateUserRolesDto);
  }

  @Patch('me/avatar')
  async updateAvatar(
    @ReqUser() { userId }: AuthContext,
    @Body() updateUserAvatarDto: UpdateUserAvatarDto,
  ) {
    const avatar = await this.storageService.moveObject(
      updateUserAvatarDto.avatar,
      (k) => k.avatar(userId),
    );
    return this.usersService.update(userId, {
      avatar: avatar.key,
    });
  }

  @Permission('users:soft-delete')
  @Delete(':id/soft')
  softDelete(@Param('id') id: string) {
    return this.usersService.softDelete(id);
  }

  @Permission('users:restore')
  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    return this.usersService.restore(id);
  }

  @Permission('users:delete')
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
