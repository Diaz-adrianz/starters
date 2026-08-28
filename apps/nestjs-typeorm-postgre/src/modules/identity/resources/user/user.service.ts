import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserRolesAction } from './dto/update-user.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { In } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { DatabaseKeys } from '../../../../database/database-keys.constant';
import { User } from '../../entities/user.entity';
import { AppDataSource } from '../../../../database/typeorm/app-data-source';
import { AppRepository } from '../../../../database/typeorm/app-repository';
import { CacheService } from '../../../../infra/cache/cache.service';
import { ResourceScope } from '../../../../shared/classes/resource-scope.class';
import { UserRole } from '../../../access-control/entities/user-role.entity';
import { EventService } from '../../../../infra/event/event.service';

@Injectable()
export class UserService {
  constructor(
    @InjectDataSource(DatabaseKeys.DEFAULT) private dataSource: AppDataSource,
    @InjectRepository(User, DatabaseKeys.DEFAULT)
    private userRepo: AppRepository<User>,
    private cache: CacheService,
    private event: EventService,
  ) {}

  // ================================================================
  // Basic CRUD
  // ----------------------------------------------------------------
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

    const user = this.userRepo.create({
      email,
      username,
      password,
      enabled: true,
    });
    await this.userRepo.save(user);
    return user;
  }

  findMany(scope: ResourceScope) {
    return this.userRepo.findAndCount({
      ...scope.toFindOptions(),
      relations: { roles: { role: true } },
      select: {
        ...this.userRepo.select([
          'id',
          'username',
          'email',
          'enabled',
          'avatar',
        ]),
        roles: { id: true, role: { id: true, name: true } },
      },
    });
  }

  findOne(scope: ResourceScope) {
    return this.userRepo.findOneOrFail({
      ...scope.toFindOptions(),
      relations: { roles: { role: true } },
      select: {
        ...this.userRepo.select('*'),
        roles: { id: true, role: { id: true, name: true } },
      },
    });
  }

  findById(id: string) {
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

  async update(scope: ResourceScope, updateUserDto: UpdateUserDto) {
    const { roles, ...payload } = updateUserDto;

    const result = await this.dataSource.transaction(async (manager) => {
      const options = scope.toFindOptions();
      const data = await manager.findOneOrFail(User, options);
      const result = await manager.update(User, options.where, payload, {
        returning: ['id'],
      });

      if (roles) {
        const { items, action } = roles;

        if (action === UpdateUserRolesAction.SET) {
          await manager.delete(UserRole, { userId: data.id });
          await manager.insert(
            UserRole,
            items.map((i) => ({
              userId: data.id,
              roleId: i.roleId,
            })),
          );
        } else if (action === UpdateUserRolesAction.ADD)
          await manager.upsert(
            UserRole,
            items.map((i) => ({
              userId: data.id,
              roleId: i.roleId,
            })),
            ['userId', 'roleId'],
          );
        else if (action === UpdateUserRolesAction.REM)
          await manager.delete(UserRole, {
            userId: data.id,
            roleId: In(items.map((i) => i.roleId)),
          });
      }

      return result;
    });
    this.event.emit('identity.user.updated', {
      users: result.raw as Pick<User, 'id'>[],
    });
    return result;
  }

  updateById(id: string, updateUserDto: UpdateUserDto) {
    const scope = new ResourceScope([{ field: 'id', op: 'where', value: id }]);
    return this.update(scope, updateUserDto);
  }

  async updatePassword(id: string, password: string) {
    const salt = await bcrypt.genSalt(10),
      hashed = await bcrypt.hash(password, salt);
    const result = await this.userRepo.update(
      id,
      { password: hashed },
      { returning: ['id'] },
    );
    this.event.emit('identity.user.updated', {
      users: result.raw as Pick<User, 'id'>[],
    });
    return result;
  }

  async archive(scope: ResourceScope) {
    const result = await this.userRepo.softDelete(scope.toFindOptions().where, {
      returning: ['id'],
    });
    this.event.emit('identity.user.updated', {
      users: result.raw as Pick<User, 'id'>[],
    });
    return result;
  }

  async restore(scope: ResourceScope) {
    const result = await this.userRepo.restore(scope.toFindOptions().where, {
      returning: ['id'],
    });
    this.event.emit('identity.user.updated', {
      users: result.raw as Pick<User, 'id'>[],
    });
    return result;
  }

  async delete(scope: ResourceScope) {
    const result = await this.userRepo.delete(scope.toFindOptions().where, {
      returning: ['id'],
    });
    this.event.emit('identity.user.deleted', {
      users: result.raw as Pick<User, 'id'>[],
    });
    return result;
  }
}
