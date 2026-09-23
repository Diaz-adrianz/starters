import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppRepository } from '../../../../database/typeorm/app-repository';
import { DatabaseKeys } from '../../../../database/database-keys.constant';
import { VerificationToken } from '../../entities/verification-token.entity';
import { UpdateVerificationTokenDto } from './dto/update-verification-token.dto';
import { CreateVerificationTokenDto } from './dto/create-verification-token.dto';
import { ResourceQuery } from '../../../../shared/classes/resource-query.class';
import { VerificationTokenType } from '../../enums/verification-token-type.enum';
import { IsNull } from 'typeorm';

@Injectable()
export class VerificationTokenService {
  constructor(
    @InjectRepository(VerificationToken, DatabaseKeys.DEFAULT)
    private verificationTokenRepo: AppRepository<VerificationToken>,
  ) {}

  // ================================================================
  // Misc / Shared
  // ----------------------------------------------------------------
  async findActiveByUser(userId: string, type: VerificationTokenType) {
    return this.verificationTokenRepo.findOneOrFail({
      where: { userId, type, consumedAt: IsNull() },
    });
  }

  async findActiveByHash(tokenHash: string, type: VerificationTokenType) {
    return this.verificationTokenRepo.findOneOrFail({
      where: { tokenHash, type, consumedAt: IsNull() },
    });
  }

  async issueOrRefresh(
    userId: string,
    type: VerificationTokenType,
    tokenHash: string,
    expiresAt: Date,
    existing?: VerificationToken,
  ) {
    if (existing) {
      await this.verificationTokenRepo.update(
        { id: existing.id },
        { tokenHash, expiresAt },
      );
      return existing;
    }
    return this.create({ userId, type, tokenHash, expiresAt });
  }

  async markConsumed(id: string) {
    return this.verificationTokenRepo.update(
      { id },
      { consumedAt: new Date() },
    );
  }

  async markSent(id: string) {
    return this.verificationTokenRepo.update({ id }, { sentAt: new Date() });
  }

  // ================================================================
  // Base
  // ----------------------------------------------------------------
  create(dto: CreateVerificationTokenDto) {
    return this.verificationTokenRepo.save(dto);
  }

  findMany(rq: ResourceQuery) {
    return this.verificationTokenRepo.findAndCount({
      ...rq.toFindOptions(),
      relations: { user: true },
      select: {
        ...this.verificationTokenRepo.select('*'),
        user: { id: true, username: true, avatar: true },
      },
    });
  }

  findOne(rq: ResourceQuery) {
    return this.verificationTokenRepo.findOneOrFail({
      ...rq.toFindOptions(),
    });
  }

  update(rq: ResourceQuery, dto: UpdateVerificationTokenDto) {
    return this.verificationTokenRepo.update(rq.toFindOptions().where, dto);
  }

  delete(rq: ResourceQuery) {
    return this.verificationTokenRepo.delete(rq.toFindOptions().where);
  }
}
