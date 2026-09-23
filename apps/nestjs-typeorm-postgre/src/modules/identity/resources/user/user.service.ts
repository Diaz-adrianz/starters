import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { DatabaseKeys } from '../../../../database/database-keys.constant';
import { User } from '../../entities/user.entity';
import { AppRepository } from '../../../../database/typeorm/app-repository';
import { EventService } from '../../../../infra/event/event.service';
import { ResourceQuery } from '../../../../shared/classes/resource-query.class';

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
      target: result.raw as Pick<User, 'id'>[],
    });
    return result;
  }

  // Base extensions
  // ----------------------------------------------------------------
  findById(id: string) {
    const rq = new ResourceQuery([{ field: 'id', op: 'eq', value: id }]);
    return this.findOne(rq);
  }

  updateById(id: string, updateUserDto: UpdateUserDto) {
    const rq = new ResourceQuery([{ field: 'id', op: 'eq', value: id }]);
    return this.update(rq, updateUserDto);
  }

  // Base
  // ----------------------------------------------------------------
  async create(createUserDto: CreateUserDto) {
    const { email, username, password, roleName } = createUserDto;
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
    this.event.emit('identity.user.created', {
      target: { id: user.id },
      payload: {
        id: user.id,
        username: username,
        roleName: roleName,
      },
    });
    return user;
  }

  findMany(q: ResourceQuery) {
    return this.userRepo.findAndCount({
      ...q.toFindOptions(),
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

  findOne(rq: ResourceQuery) {
    return this.userRepo.findOneOrFail({
      ...rq.toFindOptions(),
    });
  }

  async update(rq: ResourceQuery, updateUserDto: UpdateUserDto) {
    const result = await this.userRepo.update(
      rq.toFindOptions().where,
      updateUserDto,
      { returning: ['id'] },
    );
    this.event.emit('identity.user.updated', {
      target: result.raw as Pick<User, 'id'>[],
      payload: { username: updateUserDto.username },
    });
    return result;
  }

  async archive(rq: ResourceQuery) {
    const result = await this.userRepo.softDelete(rq.toFindOptions().where, {
      returning: ['id'],
    });
    this.event.emit('identity.user.updated', {
      target: result.raw as Pick<User, 'id'>[],
    });
    return result;
  }

  async restore(rq: ResourceQuery) {
    const result = await this.userRepo.restore(rq.toFindOptions().where, {
      returning: ['id'],
    });
    this.event.emit('identity.user.updated', {
      target: result.raw as Pick<User, 'id'>[],
    });
    return result;
  }

  async delete(rq: ResourceQuery) {
    const result = await this.userRepo.delete(rq.toFindOptions().where, {
      returning: ['id'],
    });
    this.event.emit('identity.user.deleted', {
      target: result.raw as Pick<User, 'id'>[],
    });
    return result;
  }
}
