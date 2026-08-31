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
import { ResourceQueryDto } from '../../../../shared/dto/resource-query.dto';
import { StoreService } from '../../../../infra/store/store.service';

@Controller('identity/users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private storageService: DefaultStorageService,
    private store: StoreService,
  ) {}

  // ================================================================
  // Update avatar S3
  // ----------------------------------------------------------------
  @Permission('identity:user:update-avatar')
  @Post(':id/avatar/upload-url')
  async createAvatarUploadUrl(
    @Param('id') id: string,
    @Body() { mimeType }: CreateUserAvatarUploadUrlDto,
  ) {
    const scope = this.store.buildResourceScope();
    scope.add([{ field: 'id', op: 'where', value: id }]);
    const data = await this.userService.findOne(scope);
    return this.storageService.getSignedUploadUrl(
      (k) => k.tmp(k.avatar(data.id)),
      mimeType,
      UserAvatarMaxBytes,
    );
  }

  @Permission('identity:user:update-avatar')
  @Patch(':id/avatar')
  async updateAvatar(
    @Param('id') id: string,
    @Body() updateUserAvatarDto: UpdateUserAvatarDto,
  ) {
    const scope = this.store.buildResourceScope();
    scope.add([{ field: 'id', op: 'where', value: id }]);
    const data = await this.userService.findOne(scope);
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
  @Permission('identity:user:create')
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Permission('identity:user:read')
  @Get()
  findMany(@Query() query: ResourceQueryDto) {
    const scope = this.store.buildResourceScope();
    scope.addQuery(query);
    return this.userService.findMany(scope);
  }

  @Permission('identity:user:read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    const scope = this.store.buildResourceScope();
    scope.add([{ field: 'id', op: 'where', value: id }]);
    return this.userService.findOne(scope);
  }

  @Permission('identity:user:update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const scope = this.store.buildResourceScope();
    scope.add([{ field: 'id', op: 'where', value: id }]);
    return this.userService.update(scope, updateUserDto);
  }

  @Permission('identity:user:archive')
  @Patch(':id/archive')
  archive(@Param('id') id: string) {
    const scope = this.store.buildResourceScope();
    scope.add([{ field: 'id', op: 'where', value: id }]);
    return this.userService.archive(scope);
  }

  @Permission('identity:user:restore')
  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    const scope = this.store.buildResourceScope();
    scope.add([{ field: 'id', op: 'where', value: id }]);
    return this.userService.restore(scope);
  }

  @Permission('identity:user:delete')
  @Delete(':id')
  delete(@Param('id') id: string) {
    const scope = this.store.buildResourceScope();
    scope.add([{ field: 'id', op: 'where', value: id }]);
    return this.userService.delete(scope);
  }
}
