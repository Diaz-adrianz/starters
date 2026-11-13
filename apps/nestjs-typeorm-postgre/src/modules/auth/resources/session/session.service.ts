import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from '../../entities/session.entity';
import { DatabaseKeys } from '../../../../database/database-keys.constant';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { createHash } from 'crypto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LoggerService } from '../../../../infra/logger/logger.service';
import { ResourceQuery } from '../../../../shared/classes/resource-query.class';
import { In, LessThanOrEqual, Not, Repository } from 'typeorm';
import { ResourceService } from '../../../../common/services/resource.service';

@Injectable()
export class SessionService extends ResourceService<Session> {
  constructor(
    @InjectRepository(Session, DatabaseKeys.DEFAULT)
    private sessionRepo: Repository<Session>,
    private logger: LoggerService,
  ) {
    super(sessionRepo);
  }

  async validate(id: string, refreshToken: string) {
    const session = await this.sessionRepo.findOne({
      where: { id, isActive: true },
    });
    if (!session) throw new UnauthorizedException('Active session not found');

    const isExpired = new Date() > session.expiresAt;
    if (isExpired) {
      await this.revokeById(session.id);
      throw new UnauthorizedException('Session has expired');
    }

    const isMatch =
      this.hashRefreshToken(refreshToken) === session.refreshTokenHash;
    if (!isMatch) throw new UnauthorizedException('Session does not match');

    return session;
  }

  async rotate(id: string, newRefreshToken: string) {
    return this.sessionRepo.update(
      { id },
      {
        refreshTokenHash: this.hashRefreshToken(newRefreshToken),
        lastUsedAt: new Date(),
      },
    );
  }

  async revokeById(id: string) {
    return this.sessionRepo.update({ id, isActive: true }, { isActive: false });
  }

  async revokeManyByUser(userId: string, excludedSessionIds: string[] = []) {
    return this.sessionRepo.update(
      {
        userId,
        isActive: true,
        ...(excludedSessionIds.length && {
          id: Not(In(excludedSessionIds)),
        }),
      },
      { isActive: false },
    );
  }

  // Base
  // ----------------------------------------------------------------
  async create(dto: CreateSessionDto) {
    const data = this.sessionRepo.create(dto);
    return this.sessionRepo.save(data);
  }

  async findMany(rq: ResourceQuery) {
    return this.sessionRepo.findAndCount({
      ...rq.toFindOptions(),
      select: this.select([
        'id',
        'clientId',
        'clientLabel',
        'clientType',
        'clientDevice',
        'browser',
        'os',
        'osVersion',
        'lastUsedAt',
        'isActive',
      ]),
    });
  }

  async findOne(rq: ResourceQuery) {
    return this.sessionRepo.findOneOrFail({
      ...rq.toFindOptions(),
    });
  }

  async update(rq: ResourceQuery, dto: UpdateSessionDto) {
    const data = await this.load(rq.toFindOptions());
    this.sessionRepo.merge(data, dto);
    return this.sessionRepo.save(data);
  }

  async delete(rq: ResourceQuery) {
    const data = await this.load(rq.toFindOptions());
    return this.sessionRepo.remove(data);
  }

  // Utils
  // ----------------------------------------------------------------
  hashRefreshToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  // Cron
  // ----------------------------------------------------------------
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupExpired() {
    const res = await this.sessionRepo.delete([
      { expiresAt: LessThanOrEqual(new Date()) },
      { isActive: false },
    ]);
    this.logger.log(
      `Cleaned ${res.affected ?? 0} sessions`,
      this.constructor.name,
    );
  }
}
