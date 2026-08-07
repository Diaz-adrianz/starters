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
import { UserRole } from '../access-control/entities/user-role.entity';
import { ResourceScope } from '../../shared/classes/resource-scope.class';
import { repoSelect } from '../../shared/utils/typeorm/repo-select.util';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(UserRole) private userRoleRepo: Repository<UserRole>,
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

    const user = this.userRepo.create({ email, username, password });
    await this.userRepo.save(user);
    return user;
  }

  findMany(scope: ResourceScope) {
    return this.userRepo.findAndCount({
      ...scope.toPageOptions(),
      relations: { roles: { role: true } },
      select: {
        ...repoSelect(this.userRepo, [
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
      ...scope.toOptions(),
      relations: { roles: { role: true } },
      select: {
        ...repoSelect(this.userRepo, '*'),
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

  update(scope: ResourceScope, updateUserDto: UpdateUserDto) {
    return this.userRepo.update(scope.where, updateUserDto);
  }

  updateById(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepo.update({ id }, updateUserDto);
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

  archive(scope: ResourceScope) {
    return this.userRepo.softDelete(scope.where);
  }

  restore(scope: ResourceScope) {
    return this.userRepo.restore(scope.where);
  }

  delete(scope: ResourceScope) {
    return this.userRepo.delete(scope.where);
  }
}
