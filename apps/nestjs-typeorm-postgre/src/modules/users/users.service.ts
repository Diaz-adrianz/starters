import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import {
  UpdateUserRolesAction,
  UpdateUserRolesDto,
} from './dto/update-user-role.dto';
import { UserRole } from './entities/user-role.entity';
import { DefaultCacheService } from '../../lib/cache/default/default-cache.service';
import { ResourceScopePageOptions } from '../../shared/classes/resource-scope.class';
import { BaseService } from '../../common/classes/base/service.base';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(UserRole) private userRoleRepo: Repository<UserRole>,
    private cacheService: DefaultCacheService,
  ) {
    super(userRepo);
  }

  async clearCache(userIds: string[]) {
    if (!userIds.length) return;

    const keys = userIds.map((userId) =>
      this.cacheService.resolveKey((k) => k.user(userId)),
    );
    await this.cacheService.delMany(keys);
  }

  async create(createUserDto: CreateUserDto) {
    const { email, username, password } = createUserDto;
    const sameEmail = await this.userRepo.count({
      where: { email: email },
    });
    if (sameEmail) throw new BadRequestException('Email has been registered');

    const sameUsername = await this.userRepo.count({
      where: { username: username },
    });
    if (sameUsername) throw new BadRequestException('Username already exist');

    const user = this.userRepo.create({ email, username, password });
    await this.userRepo.save(user);
    return user;
  }

  findAll(options: ResourceScopePageOptions) {
    return this.userRepo.findAndCount(options);
  }

  findOne(id: string) {
    return this.userRepo.findOneOrFail({
      where: { id },
      relations: { roles: { role: true } },
    });
  }

  findByUsernameOrEmail(value: string) {
    return this.userRepo.findOneOrFail({
      where: [{ username: value }, { email: value }],
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const result = await this.userRepo.update({ id }, updateUserDto);
    await this.clearCache([id]);
    return result;
  }

  async updatePassword(id: string, password: string) {
    const salt = await bcrypt.genSalt(10),
      hashed = await bcrypt.hash(password, salt);
    return this.userRepo.update(id, { password: hashed });
  }

  async updateUserRoles(id: string, { action, roles }: UpdateUserRolesDto) {
    const userRoles = this.userRoleRepo.create(
      roles.map((ur) => ({
        userId: id,
        roleId: ur.roleId,
      })),
    );

    await this.clearCache([id]);

    if (action == UpdateUserRolesAction.ADD) {
      return this.userRoleRepo.insert(userRoles);
    } else if (action == UpdateUserRolesAction.REMOVE) {
      return this.userRoleRepo.delete({
        userId: id,
        roleId: In(roles.map((ur) => ur.roleId)),
      });
    } else if (action == UpdateUserRolesAction.SET) {
      await this.userRoleRepo.delete({ userId: id });
      return this.userRoleRepo.insert(userRoles);
    }
  }

  async softDelete(id: string) {
    const result = this.userRepo.softDelete({ id });
    await this.clearCache([id]);
    return result;
  }

  async restore(id: string) {
    const result = this.userRepo.restore({ id });
    await this.clearCache([id]);
    return result;
  }

  async delete(id: string) {
    const result = this.userRepo.delete({ id });
    await this.clearCache([id]);
    return result;
  }
}
