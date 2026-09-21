import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from '../../entities/session.entity';
import { DatabaseKeys } from '../../../../database/database-keys.constant';
import { AppRepository } from '../../../../database/typeorm/app-repository';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { createHash } from 'crypto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LoggerService } from '../../../../infra/logger/logger.service';
import { ResourceQuery } from '../../../../shared/classes/resource-query.class';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session, DatabaseKeys.DEFAULT)
    private sessionRepo: AppRepository<Session>,
    private logger: LoggerService,
  ) {}

  async validate(id: string, refreshToken: string) {
    const session = await this.sessionRepo.findOne({
      where: { id, isActive: true },
    });
    if (!session) throw new UnauthorizedException('Active session not found');

    const isExpired = new Date() > session.expiresAt;
    if (isExpired) {
      await this.revoke(
        new ResourceQuery([{ field: 'id', op: 'eq', value: session.id }]),
      );
      throw new UnauthorizedException('Session has expired');
    }

    const isMatch =
      this.hashRefreshToken(refreshToken) === session.refreshTokenHash;
    if (!isMatch) throw new UnauthorizedException('Session does not match');

    return session;
  }

  rotate(id: string, newRefreshToken: string) {
    const rq = new ResourceQuery([{ field: 'id', op: 'eq', value: id }]);
    return this.update(rq, {
      refreshTokenHash: this.hashRefreshToken(newRefreshToken),
      lastUsedAt: new Date(),
    });
  }

  // Base extensions
  // ----------------------------------------------------------------
  revoke(rq: ResourceQuery) {
    rq.add([{ field: 'isActive', op: 'eq', value: true }]);
    return this.update(rq, { isActive: false });
  }

  // Base
  // ----------------------------------------------------------------
  create(dto: CreateSessionDto) {
    const data = this.sessionRepo.create(dto);
    return this.sessionRepo.save(data);
  }

  findMany(rq: ResourceQuery) {
    return this.sessionRepo.findAndCount({
      ...rq.toFindOptions(),
      select: this.sessionRepo.select([
        'id',
        'deviceId',
        'deviceLabel',
        'deviceType',
        'browser',
        'os',
        'lastUsedAt',
        'isActive',
      ]),
    });
  }

  findOne(rq: ResourceQuery) {
    return this.sessionRepo.findOneOrFail({
      ...rq.toFindOptions(),
    });
  }

  update(rq: ResourceQuery, dto: UpdateSessionDto) {
    return this.sessionRepo.update(rq.toFindOptions().where, dto);
  }

  delete(rq: ResourceQuery) {
    return this.sessionRepo.delete(rq.toFindOptions().where);
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
    const rq = new ResourceQuery([
      { field: 'expiresAt', op: 'lte', value: new Date() },
    ]);
    const result = await this.delete(rq);
    this.logger.log(
      `Cleaned up ${result.affected ?? 0} expired session(s)`,
      this.constructor.name,
    );
  }
}
