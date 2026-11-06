import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppRepository } from '../../../../database/typeorm/app-repository';
import { DatabaseKeys } from '../../../../database/database-keys.constant';
import { ResourceQuery } from '../../../../shared/classes/resource-query.class';
import { IsNull } from 'typeorm';
import { Token } from '../../entities/token.entity';
import { TokenType } from '../../enums/token-type.enum';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token, DatabaseKeys.DEFAULT)
    private tokenRepo: AppRepository<Token>,
  ) {}

  findActiveByUser(userId: string, type: TokenType) {
    return this.tokenRepo.findOneOrFail({
      where: { userId, type, consumedAt: IsNull() },
      relations: { user: true },
      select: {
        ...this.tokenRepo.select('*'),
        user: { id: true, username: true, email: true },
      },
    });
  }

  findActiveByHash(hash: string, type: TokenType) {
    return this.tokenRepo.findOneOrFail({
      where: { hash, type, consumedAt: IsNull() },
      relations: { user: true },
      select: {
        ...this.tokenRepo.select('*'),
        user: { id: true, username: true, email: true },
      },
    });
  }

  issue(userId: string, type: TokenType, hash: string, expiresAt: Date) {
    const data = this.tokenRepo.create({
      userId,
      type,
      hash,
      expiresAt,
      refreshedAt: new Date(),
    });
    return this.tokenRepo.save(data);
  }

  refresh(id: string, hash: string, expiresAt: Date) {
    return this.tokenRepo.update(
      { id },
      { hash, expiresAt, refreshedAt: new Date() },
    );
  }

  markConsumed(id: string) {
    return this.tokenRepo.update({ id }, { consumedAt: new Date() });
  }

  // Base
  // ----------------------------------------------------------------
  findMany(rq: ResourceQuery) {
    return this.tokenRepo.findAndCount({
      ...rq.toFindOptions(),
      relations: { user: true },
      select: {
        ...this.tokenRepo.select([
          'id',
          'consumedAt',
          'createdAt',
          'expiresAt',
          'type',
        ]),
        user: { id: true, username: true, avatar: true },
      },
    });
  }

  findOne(rq: ResourceQuery) {
    return this.tokenRepo.findOneOrFail({
      ...rq.toFindOptions(),
      relations: { user: true },
      select: {
        ...this.tokenRepo.select('*'),
        user: { id: true, username: true, avatar: true },
      },
    });
  }
}
