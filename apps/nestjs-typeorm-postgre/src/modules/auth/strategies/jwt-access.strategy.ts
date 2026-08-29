import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { AUTH_CONFIG_KEY, type AuthConfig } from '../../../config/auth.config';
import { CacheService } from '../../../infra/cache/cache.service';
import { LoggerService } from '../../../infra/logger/logger.service';
import { InjectDataSource } from '@nestjs/typeorm';
import { AppDataSource } from '../../../database/typeorm/app-data-source';
import { DatabaseKeys } from '../../../database/database-keys.constant';
import { User } from '../../identity/entities/user.entity';
import {
  JwtAccessAuthResult,
  JwtAccessPayload,
} from '../interfaces/jwt-access.interface';

type UserCache = {
  id: string;
  name: string;
  roles: { id: string; name: string }[];
};

const extractor = ExtractJwt.fromAuthHeaderAsBearerToken();

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(
    @Inject(AUTH_CONFIG_KEY) authConfig: AuthConfig,
    @InjectDataSource(DatabaseKeys.DEFAULT) private dataSource: AppDataSource,
    private cache: CacheService,
    private logger: LoggerService,
  ) {
    super({
      jwtFromRequest: extractor,
      ignoreExpiration: false,
      secretOrKey: authConfig.jwt.access.secret,
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    payload: JwtAccessPayload,
  ): Promise<JwtAccessAuthResult> {
    const token = extractor(req)!;
    let userCache = await this.cache.get<UserCache>((k) => k.user(payload.sub));

    if (!userCache) {
      this.logger.log('User cache missed', this.constructor.name);
      const userRepo = this.dataSource.getRepository(User);

      const user = await userRepo.findOneOrFail({
        where: { id: payload.sub },
        relations: { roles: { role: true } },
        select: {
          ...userRepo.select('*'),
          roles: { id: true, role: { id: true, name: true } },
        },
      });
      if (!user.isActive())
        throw new ForbiddenException('Account suspended or not verified yet');

      userCache = {
        id: user.id,
        name: user.username,
        roles: user.roles.map((r) => ({ id: r.role.id, name: r.role.name })),
      };

      await this.cache.set((k) => k.user(payload.sub), userCache, 0);
    }

    return {
      token,
      payload: {
        user: { id: userCache.id, name: userCache.name },
        roles: userCache.roles,
        session: { id: payload.sid },
      },
    };
  }
}
