import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { JwtTokenPayload } from '../interfaces/jwt-payload.interface';
import { Principal } from '../../../shared/classes/principal.class';
import { AUTH_CONFIG_KEY, type AuthConfig } from '../../../config/auth.config';
import { CacheService } from '../../../infra/cache/cache.service';
import { LoggerService } from '../../../infra/logger/logger.service';
import { InjectDataSource } from '@nestjs/typeorm';
import { AppDataSource } from '../../../database/typeorm/app-data-source';
import { DatabaseKeys } from '../../../database/database-keys.contant';
import { User } from '../../identity/entities/user.entity';

type UserCache = {
  id: string;
  username: string;
  roles: [string, string][];
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(AUTH_CONFIG_KEY) private authConfig: AuthConfig,
    @InjectDataSource(DatabaseKeys.DEFAULT) private dataSource: AppDataSource,
    private cache: CacheService,
    private logger: LoggerService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authConfig.jwt.access.secret,
    });
  }

  async validate(payload: JwtTokenPayload): Promise<Principal | undefined> {
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
        username: user.username,
        roles: user.roles.map((r) => [r.role.id, r.role.name]) ?? [],
      };

      await this.cache.set((k) => k.user(payload.sub), userCache, 0);
    }

    const principal = new Principal(
      { id: userCache.id, username: userCache.username },
      { id: payload.sid },
      userCache.roles.map((role) => ({ id: role[0], name: role[1] })),
    );

    return principal;
  }
}
