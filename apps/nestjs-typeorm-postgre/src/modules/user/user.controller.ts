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
export class UserController {
  constructor(
    private readonly userService: UserService,
    private storageService: DefaultStorageService,
  ) {}

  @Permission('users:create')
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Permission('users:update-avatar')
  @Post(':id/avatar/upload-url')
  async createAvatarUploadUrl(
    @ReqUser() { permission }: Principal,
    @Param('id') id: string,
    @Body() { mimeType }: CreateUserAvatarUploadUrlDto,
  ) {
    permission.scope.add({ where: `id:${id}` });
    await this.userService.existByScope(permission.scope);
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
    permission.scope.add(query);
    return this.userService.findAll(permission.scope.toPageOptions());
  }

  @Permission('users:find-one')
  @Get(':id')
  async findOne(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.add({ where: `id:${id}` });
    await this.userService.existByScope(permission.scope);
    return this.userService.findOne(id);
  }

  @Permission('users:update')
  @Patch(':id')
  async update(
    @ReqUser() { permission }: Principal,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    permission.scope.add({ where: `id:${id}` });
    await this.userService.existByScope(permission.scope);
    return this.userService.update(id, updateUserDto);
  }

  @Permission('users:update-roles')
  @ResSuccess({ allowNoAffected: true })
  @Patch(':id/roles')
  async updateRoles(
    @ReqUser() { permission }: Principal,
    @Param('id') id: string,
    @Body() updateUserRolesDto: UpdateUserRolesDto,
  ) {
    permission.scope.add({ where: `id:${id}` });
    await this.userService.existByScope(permission.scope);
    return this.userService.updateUserRoles(id, updateUserRolesDto);
  }

  @Patch(':id/avatar')
  async updateAvatar(
    @ReqUser() { permission }: Principal,
    @Param('id') id: string,
    @Body() updateUserAvatarDto: UpdateUserAvatarDto,
  ) {
    permission.scope.add({ where: `id:${id}` });
    await this.userService.existByScope(permission.scope);
    const avatar = await this.storageService.moveObject(
      updateUserAvatarDto.avatar,
      (k) => k.avatar(id),
    );
    return this.userService.update(id, {
      avatar: avatar.key,
    });
  }

  @Permission('users:soft-delete')
  @Delete(':id/soft')
  async softDelete(
    @ReqUser() { permission }: Principal,
    @Param('id') id: string,
  ) {
    permission.scope.add({ where: `id:${id}` });
    await this.userService.existByScope(permission.scope);
    return this.userService.softDelete(id);
  }

  @Permission('users:restore')
  @Patch(':id/restore')
  async restore(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.add({ where: `id:${id}` });
    await this.userService.existByScope(permission.scope);
    return this.userService.restore(id);
  }

  @Permission('users:delete')
  @Delete(':id')
  async delete(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.add({ where: `id:${id}` });
    await this.userService.existByScope(permission.scope);
    return this.userService.delete(id);
  }
}
