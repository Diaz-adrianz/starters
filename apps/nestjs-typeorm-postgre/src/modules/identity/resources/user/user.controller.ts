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
import {
  CreateUserAvatarUploadUrlDto,
  UpdateUserAvatarDto,
  UserAvatarMaxBytes,
} from './dto/update-user-avatar.dto';
import { DefaultStorageService } from '../../../../lib/storage/default/default-storage.service';
import { Permission } from '../../../../common/decorators/permission.decorator';
import { ReqUser } from '../../../../common/decorators/req-user.decorator';
import { Principal } from '../../../../shared/classes/principal.class';
import { ResourceScopeDto } from '../../../../shared/dto/resource-scope.dto';

@Controller('identity/users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private storageService: DefaultStorageService,
  ) {}

  // ================================================================
  // Update avatar S3
  // ----------------------------------------------------------------
  @Permission('users:update-avatar')
  @Post(':id/avatar/upload-url')
  async createAvatarUploadUrl(
    @ReqUser() { permission }: Principal,
    @Param('id') id: string,
    @Body() { mimeType }: CreateUserAvatarUploadUrlDto,
  ) {
    permission.scope.add({ where: `id:${id}` });
    const data = await this.userService.findOne(permission.scope);
    return this.storageService.getSignedUploadUrl(
      (k) => k.tmp(k.avatar(data.id)),
      mimeType,
      UserAvatarMaxBytes,
    );
  }

  @Permission('users:update-avatar')
  @Patch(':id/avatar')
  async updateAvatar(
    @ReqUser() { permission }: Principal,
    @Param('id') id: string,
    @Body() updateUserAvatarDto: UpdateUserAvatarDto,
  ) {
    permission.scope.add({ where: `id:${id}` });
    const data = await this.userService.findOne(permission.scope);
    const avatar = await this.storageService.moveObject(
      updateUserAvatarDto.avatar,
      (k) => k.avatar(data.id),
    );
    return this.userService.updateById(data.id, {
      avatar: avatar.key,
    });
  }

  // ================================================================
  // Basic CRUD
  // ----------------------------------------------------------------
  @Permission('users:create')
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Permission('users:read')
  @Get()
  findMany(
    @ReqUser() { permission }: Principal,
    @Query() query: ResourceScopeDto,
  ) {
    permission.scope.add(query);
    return this.userService.findMany(permission.scope);
  }

  @Permission('users:read')
  @Get(':id')
  findOne(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.add({ where: `id:${id}` });
    return this.userService.findOne(permission.scope);
  }

  @Permission('users:update')
  @Patch(':id')
  update(
    @ReqUser() { permission }: Principal,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    permission.scope.add({ where: `id:${id}` });
    return this.userService.update(permission.scope, updateUserDto);
  }

  @Permission('users:archive')
  @Patch(':id/archive')
  archive(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.add({ where: `id:${id}` });
    return this.userService.archive(permission.scope);
  }

  @Permission('users:restore')
  @Patch(':id/restore')
  restore(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.add({ where: `id:${id}`, trash: true });
    return this.userService.restore(permission.scope);
  }

  @Permission('users:delete')
  @Delete(':id')
  delete(@ReqUser() { permission }: Principal, @Param('id') id: string) {
    permission.scope.add({ where: `id:${id}` });
    return this.userService.delete(permission.scope);
  }
}
