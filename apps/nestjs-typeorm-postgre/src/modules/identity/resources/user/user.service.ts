import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { DatabaseKeys } from '../../../../database/database-keys.constant';
import { User } from '../../entities/user.entity';
import { EventService } from '../../../../infra/event/event.service';
import { ResourceQuery } from '../../../../shared/classes/resource-query.class';
import { UserStatus } from '../../enums/user-status.enum';
import { InviteUserDto } from './dto/invite-user.dto';
import { TokenService } from '../token/token.service';
import { generateOtp } from '../../../../shared/utils/number.util';
import { sha256 } from '../../../../shared/utils/string.util';
import { TokenType, TokenTypeExpire } from '../../enums/token-type.enum';
import { Token } from '../../entities/token.entity';
import { UserNotInvitedException } from '../../classes/exceptions/user.exception';
import { UpdateUserAvatarDto } from './dto/update-user-avatar.dto';
import { DefaultStorageService } from '../../../../lib/storage/default/default-storage.service';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { ResourceService } from '../../../../common/services/resource.service';

@Injectable()
export class UserService extends ResourceService<User> {
  constructor(
    @InjectRepository(User, DatabaseKeys.DEFAULT)
    private userRepo: Repository<User>,
    private tokenService: TokenService,
    private event: EventService,
    private storage: DefaultStorageService,
  ) {
    super(userRepo);
  }

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

    if (user.status !== UserStatus.INVITED) throw new UserNotInvitedException();

    const token = await this.tokenService
      .findActiveByUser(user.id, TokenType.INVITATION)
      .catch(() => undefined);
    await this.issueInvitation(user, token);
  }

  async findByUsernameOrEmail(value: string) {
    return this.userRepo.findOneOrFail({
      where: [{ username: value }, { email: value }],
    });
  }

  async findById(id: string) {
    return this.userRepo.findOneOrFail({ where: { id } });
  }

  // Base extension
  // ----------------------------------------------------------------
  async updateById(id: string, dto: UpdateUserDto) {
    const rq = new ResourceQuery([['id', 'eq', id]]);
    return this.update(rq, dto);
  }

  async updateAvatar(rq: ResourceQuery, dto: UpdateUserAvatarDto) {
    const user = await this.load(rq.toFindOptions());

    const avatar = await this.storage.moveObject(
      dto.avatar.key,
      `public/identity/user-avatars/${user.id}/${randomUUID()}`,
      dto.avatar.etag,
      'public, max-age=31536000, immutable',
    );

    try {
      const result = await this.update(rq, { avatar: avatar.key });
      if (user.avatar) await this.storage.deleteObject(user.avatar).catch();
      return result;
    } catch (e) {
      await this.storage.deleteObject(avatar.key).catch();
      throw e;
    }
  }

  // Base
  // ----------------------------------------------------------------
  async create(dto: CreateUserDto) {
    const { email, username, password, roles = [], status } = dto;
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
    const res = await this.userRepo.save(user);
    this.event.emit('identity.user.created', {
      id: user.id,
      username: username,
      roles: roles,
    });
    return res;
  }

  async findMany(q: ResourceQuery) {
    return this.userRepo.findAndCount({
      ...q.toFindOptions(),
      relations: { profile: true },
      select: {
        ...this.select([
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

  async findOne(rq: ResourceQuery) {
    return this.userRepo.findOneOrFail({
      ...rq.toFindOptions(),
      relations: { profile: true },
      select: {
        ...this.select('*'),
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

  async update(rq: ResourceQuery, { password, ...dto }: UpdateUserDto) {
    const data = await this.load(rq.toFindOptions());
    this.userRepo.merge(data, dto);
    if (password !== undefined)
      data.password = password ? await this.hashPassword(password) : null;

    const res = await this.userRepo.save(data);
    this.event.emit('identity.user.updated', {
      id: res.id,
      username: res.username,
      password: !!password,
    });
    return res;
  }

  async archive(rq: ResourceQuery) {
    const data = await this.load(rq.toFindOptions()),
      res = await this.userRepo.softRemove(data);
    this.event.emit('identity.user.archived', { id: res.id });
    return res;
  }

  async restore(rq: ResourceQuery) {
    rq.setTrash(true);
    const data = await this.load(rq.toFindOptions()),
      res = await this.userRepo.recover(data);
    this.event.emit('identity.user.restored', { id: res.id });
    return res;
  }

  async delete(rq: ResourceQuery) {
    rq.setTrash(true);
    const data = await this.load(rq.toFindOptions()),
      res = await this.userRepo.remove(data);
    this.event.emit('identity.user.deleted', { id: res.id });
    return res;
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

    const expire = TokenTypeExpire.invitation,
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

  async issueSetPassword(user: User, token?: Token) {
    const otp = generateOtp(6),
      otpHash = sha256(otp);

    const expire = TokenTypeExpire.set_password,
      expiresAt = new Date(Date.now() + expire * 1000);

    if (token) await this.tokenService.refresh(token.id, otpHash, expiresAt);
    else
      await this.tokenService.issue(
        user.id,
        TokenType.SET_PASSWORD,
        otpHash,
        expiresAt,
      );

    this.event.emit('identity.user.forgotPassword', {
      id: user.id,
      email: user.email,
      username: user.username,
      otp: { code: otp, expiresIn: `${expire / 60} minutes` },
    });
  }
}
