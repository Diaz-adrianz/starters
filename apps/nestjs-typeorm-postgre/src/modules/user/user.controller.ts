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
import { ResourceScopeDto } from '../../shared/dto/resource-scope.dto';

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
    const data = await this.userService.findOne(permission.scope.toOptions());
    return this.storageService.getSignedUploadUrl(
      (k) => k.tmp(k.avatar(data.id)),
      mimeType,
      UserAvatarMaxBytes,
    );
  }

  @Permission('users:find-all')
  @Get()
  findAll(
    @ReqUser() { permission }: Principal,
    @Query() query: ResourceScopeDto,
  ) {
    permission.scope.add(query);
    return this.userService.findAll(permission.scope.toPageOptions());
  }

  @Permission('users:find-one')
  @Get(':id')
  async findOne(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.add({ where: `id:${id}` });
    return this.userService.findOne(permission.scope.toOptions());
  }

  @Permission('users:update')
  @Patch(':id')
  update(
    @ReqUser() { permission }: Principal,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    permission.scope.add({ where: `id:${id}` });
    return this.userService.update(permission.scope.toOptions(), updateUserDto);
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
    await this.userService.findOne(permission.scope.toOptions());
    return this.userService.updateUserRoles(id, updateUserRolesDto);
  }

  @Patch(':id/avatar')
  async updateAvatar(
    @ReqUser() { permission }: Principal,
    @Param('id') id: string,
    @Body() updateUserAvatarDto: UpdateUserAvatarDto,
  ) {
    permission.scope.add({ where: `id:${id}` });
    const data = await this.userService.findOne(permission.scope.toOptions());
    const avatar = await this.storageService.moveObject(
      updateUserAvatarDto.avatar,
      (k) => k.avatar(data.id),
    );
    return this.userService.updateById(data.id, {
      avatar: avatar.key,
    });
  }

  @Permission('users:soft-delete')
  @Delete(':id/soft')
  softDelete(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.add({ where: `id:${id}` });
    return this.userService.softDelete(permission.scope.toOptions());
  }

  @Permission('users:restore')
  @Patch(':id/restore')
  restore(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.add({ where: `id:${id}`, trash: true });
    return this.userService.restore(permission.scope.toOptions());
  }

  @Permission('users:delete')
  @Delete(':id')
  delete(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.add({ where: `id:${id}` });
    return this.userService.delete(permission.scope.toOptions());
  }
}
