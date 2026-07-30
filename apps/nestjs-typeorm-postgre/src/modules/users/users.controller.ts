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
import { UpdateUserRolesDto } from './dto/update-user-role.dto';
import { Permission } from '../../common/decorators/permission.decorator';
import { ResSuccess } from '../../common/decorators/res-success.decorator';
import {
  CreateUserAvatarUploadUrlDto,
  UpdateUserAvatarDto,
  UserAvatarMaxBytes,
} from './dto/update-user-avatar.dto';
import { ReqUser } from '../../common/decorators/req-user.decorator';
import { DefaultStorageService } from '../../lib/storage/default/default-storage.service';
import { Principal } from '../../shared/classes/principal.class';
import { ResourceScopeQueryDto } from '../../shared/dto/resource-scope.dto';

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

  @Permission('users:update-avatar')
  @Post(':id/avatar/upload-url')
  async createAvatarUploadUrl(
    @ReqUser() { permission }: Principal,
    @Param('id') id: string,
    @Body() { mimeType }: CreateUserAvatarUploadUrlDto,
  ) {
    permission.scope.push({ where: `id:${id}` }, 'AND');
    await this.usersService.existByScope(permission.scope);
    return this.storageService.getSignedUploadUrl(
      (k) => k.tmp(k.avatar(id)),
      mimeType,
      UserAvatarMaxBytes,
    );
  }

  @Permission('users:find-all')
  @Get()
  findAll(
    @ReqUser() { permission }: Principal,
    @Query() query: ResourceScopeQueryDto,
  ) {
    permission.scope.push(query, 'AND');
    return this.usersService.findAll(permission.scope.toPageOptions());
  }

  @Permission('users:find-one')
  @Get(':id')
  async findOne(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.push({ where: `id:${id}` }, 'AND');
    await this.usersService.existByScope(permission.scope);
    return this.usersService.findOne(id);
  }

  @Permission('users:update')
  @Patch(':id')
  async update(
    @ReqUser() { permission }: Principal,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    permission.scope.push({ where: `id:${id}` }, 'AND');
    await this.usersService.existByScope(permission.scope);
    return this.usersService.update(id, updateUserDto);
  }

  @Permission('users:update-roles')
  @ResSuccess({ allowNoAffected: true })
  @Patch(':id/roles')
  async updateRoles(
    @ReqUser() { permission }: Principal,
    @Param('id') id: string,
    @Body() updateUserRolesDto: UpdateUserRolesDto,
  ) {
    permission.scope.push({ where: `id:${id}` }, 'AND');
    await this.usersService.existByScope(permission.scope);
    return this.usersService.updateUserRoles(id, updateUserRolesDto);
  }

  @Patch(':id/avatar')
  async updateAvatar(
    @ReqUser() { permission }: Principal,
    @Param('id') id: string,
    @Body() updateUserAvatarDto: UpdateUserAvatarDto,
  ) {
    permission.scope.push({ where: `id:${id}` }, 'AND');
    await this.usersService.existByScope(permission.scope);
    const avatar = await this.storageService.moveObject(
      updateUserAvatarDto.avatar,
      (k) => k.avatar(id),
    );
    return this.usersService.update(id, {
      avatar: avatar.key,
    });
  }

  @Permission('users:soft-delete')
  @Delete(':id/soft')
  async softDelete(
    @ReqUser() { permission }: Principal,
    @Param('id') id: string,
  ) {
    permission.scope.push({ where: `id:${id}` }, 'AND');
    await this.usersService.existByScope(permission.scope);
    return this.usersService.softDelete(id);
  }

  @Permission('users:restore')
  @Patch(':id/restore')
  async restore(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.push({ where: `id:${id}` }, 'AND');
    await this.usersService.existByScope(permission.scope);
    return this.usersService.restore(id);
  }

  @Permission('users:delete')
  @Delete(':id')
  async delete(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.push({ where: `id:${id}` }, 'AND');
    await this.usersService.existByScope(permission.scope);
    return this.usersService.delete(id);
  }
}
