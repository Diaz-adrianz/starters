import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { DatabaseKeys } from '../../../../database/database-keys.constant';
import { User } from '../../entities/user.entity';
import { AppRepository } from '../../../../database/typeorm/app-repository';
import { ResourceScope } from '../../../../shared/classes/resource-scope.class';
import { EventService } from '../../../../infra/event/event.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User, DatabaseKeys.DEFAULT)
    private userRepo: AppRepository<User>,
    private event: EventService,
  ) {}

  // Misc / Used by other modules
  // ----------------------------------------------------------------
  findByUsernameOrEmail(value: string) {
    return this.userRepo.findOneOrFail({
      where: [{ username: value }, { email: value }],
    });
  }

  async updatePasswordById(id: string, password: string) {
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

  // Base extensions
  // ----------------------------------------------------------------
  findById(id: string) {
    const scope = new ResourceScope([{ field: 'id', op: 'where', value: id }]);
    return this.findOne(scope);
  }

  updateById(id: string, updateUserDto: UpdateUserDto) {
    const scope = new ResourceScope([{ field: 'id', op: 'where', value: id }]);
    return this.update(scope, updateUserDto);
  }

  // Base
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
      select: {
        ...this.userRepo.select([
          'id',
          'username',
          'email',
          'enabled',
          'avatar',
          'verifiedAt',
        ]),
      },
    });
  }

  findOne(scope: ResourceScope) {
    return this.userRepo.findOneOrFail({
      ...scope.toFindOptions(),
    });
  }

  async update(scope: ResourceScope, updateUserDto: UpdateUserDto) {
    const result = await this.userRepo.update(
      scope.toFindOptions().where,
      updateUserDto,
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
