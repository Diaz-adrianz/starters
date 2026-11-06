import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PushToken } from '../../entities/push-token.entity';
import { DatabaseKeys } from '../../../../database/database-keys.constant';
import { AppRepository } from '../../../../database/typeorm/app-repository';
import { RegisterPushTokenDto } from './dto/register-push-token.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LoggerService } from '../../../../infra/logger/logger.service';
import { ResourceQuery } from '../../../../shared/classes/resource-query.class';

@Injectable()
export class PushTokenService {
  constructor(
    @InjectRepository(PushToken, DatabaseKeys.DEFAULT)
    private pushTokenRepo: AppRepository<PushToken>,
    private logger: LoggerService,
  ) {}

  register(dto: RegisterPushTokenDto) {
    return this.pushTokenRepo.upsert(dto, {
      conflictPaths: ['provider', 'token'],
    });
  }

  revoke(id: string) {
    return this.pushTokenRepo.update({ id }, { enabled: false });
  }

  revokeByToken(token: string) {
    return this.pushTokenRepo.update({ token }, { enabled: false });
  }

  // ================================================================
  // Base
  // ----------------------------------------------------------------
  findMany(rq: ResourceQuery) {
    return this.pushTokenRepo.findAndCount({
      ...rq.toFindOptions(),
      select: {
        ...this.pushTokenRepo.select(['token'], 'omit'),
      },
    });
  }

  delete(rq: ResourceQuery) {
    return this.pushTokenRepo.delete(rq.toFindOptions().where);
  }

  // ================================================================
  // Cron
  // ----------------------------------------------------------------
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupDisabled() {
    const rq = new ResourceQuery([['enabled', 'eq', false]]);
    const result = await this.delete(rq);
    this.logger.log(
      `Cleaned up ${result.affected ?? 0} disabled push token(s)`,
      this.constructor.name,
    );
  }
}
