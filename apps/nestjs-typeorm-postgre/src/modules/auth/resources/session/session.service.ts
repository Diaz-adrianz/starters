import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from '../../entities/session.entity';
import { DatabaseKeys } from '../../../../database/database-keys.constant';
import { AppRepository } from '../../../../database/typeorm/app-repository';
import { ResourceScope } from '../../../../shared/classes/resource-scope.class';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { createHash } from 'crypto';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session, DatabaseKeys.DEFAULT)
    private sessionRepo: AppRepository<Session>,
  ) {}

  async validate(id: string, refreshToken: string) {
    const session = await this.sessionRepo.findOne({
      where: { id, isActive: true },
    });
    if (!session) throw new UnauthorizedException('Active session not found');

    const isExpired = new Date() > session.expiresAt;
    if (isExpired) {
      await this.revoke(
        new ResourceScope([{ field: 'id', op: 'where', value: session.id }]),
      );
      throw new UnauthorizedException('Session has expired');
    }

    const isMatch =
      this.hashRefreshToken(refreshToken) === session.refreshTokenHash;
    if (!isMatch) throw new UnauthorizedException('Session does not match');

    return session;
  }

  rotate(id: string, newRefreshToken: string) {
    const scope = new ResourceScope([{ field: 'id', op: 'where', value: id }]);
    return this.update(scope, {
      refreshTokenHash: this.hashRefreshToken(newRefreshToken),
      lastUsedAt: new Date(),
    });
  }

  // Base extensions
  // ----------------------------------------------------------------
  revoke(scope: ResourceScope) {
    scope.add([{ field: 'isActive', op: 'where', value: true }]);
    return this.update(scope, { isActive: false });
  }

  // Base
  // ----------------------------------------------------------------
  create(dto: CreateSessionDto) {
    const data = this.sessionRepo.create(dto);
    return this.sessionRepo.save(data);
  }

  findMany(scope: ResourceScope) {
    return this.sessionRepo.findAndCount({
      ...scope.toFindOptions(),
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

  findOne(scope: ResourceScope) {
    return this.sessionRepo.findOneOrFail({
      ...scope.toFindOptions(),
    });
  }

  update(scope: ResourceScope, dto: UpdateSessionDto) {
    return this.sessionRepo.update(scope.toFindOptions().where, dto);
  }

  delete(scope: ResourceScope) {
    return this.sessionRepo.delete(scope.toFindOptions().where);
  }

  // Base
  // ----------------------------------------------------------------
  hashRefreshToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }
}
