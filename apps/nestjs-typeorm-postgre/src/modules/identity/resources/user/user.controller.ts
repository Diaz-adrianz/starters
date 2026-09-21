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
import { ResourceQueryDto } from '../../../../shared/dto/resource-query.dto';
import { StoreService } from '../../../../infra/store/store.service';
import { Permission } from '../../../access-control/decorators/permission.decorator';

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
    const rq = this.store
      .buildResourceQuery()
      .add([{ field: 'id', op: 'eq', value: id }]);
    const data = await this.userService.findOne(rq);
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
    const rq = this.store
      .buildResourceQuery()
      .add([{ field: 'id', op: 'eq', value: id }]);
    const data = await this.userService.findOne(rq);
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
    const q = this.store.buildResourceQuery().addFromDto(query);
    return this.userService.findMany(q);
  }

  @Permission('identity:user:read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    const rq = this.store
      .buildResourceQuery()
      .add([{ field: 'id', op: 'eq', value: id }]);
    return this.userService.findOne(rq);
  }

  @Permission('identity:user:update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const rq = this.store
      .buildResourceQuery()
      .add([{ field: 'id', op: 'eq', value: id }]);
    return this.userService.update(rq, updateUserDto);
  }

  @Permission('identity:user:archive')
  @Patch(':id/archive')
  archive(@Param('id') id: string) {
    const rq = this.store
      .buildResourceQuery()
      .add([{ field: 'id', op: 'eq', value: id }]);
    return this.userService.archive(rq);
  }

  @Permission('identity:user:restore')
  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    const rq = this.store
      .buildResourceQuery()
      .add([{ field: 'id', op: 'eq', value: id }]);
    return this.userService.restore(rq);
  }

  @Permission('identity:user:delete')
  @Delete(':id')
  delete(@Param('id') id: string) {
    const rq = this.store
      .buildResourceQuery()
      .add([{ field: 'id', op: 'eq', value: id }]);
    return this.userService.delete(rq);
  }
}
