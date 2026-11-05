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
import { UserStatus } from '../../enums/user-status.enum';
import { InviteUserDto } from './dto/invite-user.dto';
import { TokenService } from '../token/token.service';
import { generateOtp } from '../../../../shared/utils/number.util';
import { sha256 } from '../../../../shared/utils/string.util';
import { TokenType } from '../../enums/token-type.enum';
import { Token } from '../../entities/token.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User, DatabaseKeys.DEFAULT)
    private userRepo: AppRepository<User>,
    private tokenService: TokenService,
    private event: EventService,
  ) {}

  async invite(dto: InviteUserDto) {
    const user = await this.create({
      email: dto.email,
      username: dto.username,
      roles: dto.roles,
      status: UserStatus.INVITED,
    });

    await this.issueInvitation(user);
    return user;
  }

  async resendInvite(id: string) {
    const user = await this.userRepo.findOneByOrFail({ id });

    if (user.status !== UserStatus.INVITED)
      throw new BadRequestException('User is not in invited state');

    const token = await this.tokenService
      .findActiveByUser(user.id, TokenType.INVITATION)
      .catch(() => undefined);
    await this.issueInvitation(user, token);
  }

  findByUsernameOrEmail(value: string) {
    return this.userRepo.findOneOrFail({
      where: [{ username: value }, { email: value }],
    });
  }

  findById(id: string) {
    return this.userRepo.findOneOrFail({ where: { id } });
  }

  async updatePasswordById(id: string, password: string) {
    const result = await this.userRepo.update(
      id,
      { password: await this.hashPassword(password) },
      { returning: ['id'] },
    );
    this.event.emit('identity.user.updated', {
      target: result.raw as Pick<User, 'id'>[],
    });
    return result;
  }

  async updateStatusById(id: string, status: UserStatus) {
    const result = await this.userRepo.update(
      id,
      { status },
      { returning: ['id'] },
    );
    this.event.emit('identity.user.updated', {
      target: result.raw as Pick<User, 'id'>[],
    });
    return result;
  }

  // Base
  // ----------------------------------------------------------------
  async create(createUserDto: CreateUserDto) {
    const { email, username, password, roles, status } = createUserDto;
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
      password: password ? await this.hashPassword(password) : undefined,
      status: status ?? UserStatus.ACTIVE,
    });
    await this.userRepo.save(user);
    this.event.emit('identity.user.created', {
      target: { id: user.id },
      payload: {
        id: user.id,
        username: username,
        roles: roles,
      },
    });
    return user;
  }

  findMany(q: ResourceQuery) {
    return this.userRepo.findAndCount({
      ...q.toFindOptions(),
      relations: { profile: true },
      select: {
        ...this.userRepo.select([
          'id',
          'username',
          'email',
          'status',
          'avatar',
          'createdAt',
        ]),
        profile: {
          id: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
          gender: true,
        },
      },
    });
  }

  findOne(rq: ResourceQuery) {
    return this.userRepo.findOneOrFail({
      ...rq.toFindOptions(),
      relations: { profile: true },
      select: {
        ...this.userRepo.select('*'),
        profile: {
          id: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
          gender: true,
        },
      },
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

  // Utils
  // ----------------------------------------------------------------
  private async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  private async issueInvitation(user: User, token?: Token) {
    const otp = generateOtp(6),
      otpHash = sha256(otp);

    const expire = 86400, // 1d
      expiresAt = new Date(Date.now() + expire * 1000);

    if (token) await this.tokenService.refresh(token.id, otpHash, expiresAt);
    else
      await this.tokenService.issue(
        user.id,
        TokenType.INVITATION,
        otpHash,
        expiresAt,
      );

    this.event.emit('identity.user.invited', {
      id: user.id,
      email: user.email,
      username: user.username,
      otp: { code: otp, expiresIn: `${expire / 60 / 60} hours` },
    });
  }
}
