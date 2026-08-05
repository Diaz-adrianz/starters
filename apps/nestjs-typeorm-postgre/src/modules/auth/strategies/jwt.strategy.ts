import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '../../../config/env.config';
import { JwtTokenPayload } from '../interfaces/jwt-payload.interface';
import { UserService } from '../../user/user.service';
import { DefaultCacheService } from '../../../lib/cache/default/default-cache.service';
import { DefaultLoggerService } from '../../../lib/logger/default/default-logger.service';
import { Principal } from '../../../shared/classes/principal.class';

type UserCache = {
  id: string;
  username: string;
  roles: string[];
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService<EnvConfig>,
    private cacheService: DefaultCacheService,
    private loggerService: DefaultLoggerService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('jwt.access.secret', {
        infer: true,
      }),
    });
  }

  async validate(payload: JwtTokenPayload): Promise<Principal | undefined> {
    try {
      let userCache = await this.cacheService.get<UserCache>((k) =>
        k.user(payload.sub),
      );

      if (!userCache) {
        const user = await this.userService.findById(payload.sub);
        userCache = {
          id: user.id,
          username: user.username,
          roles: user.roles.map((r) => r.role.id) ?? [],
        };

        await this.cacheService.set((k) => k.user(payload.sub), userCache);
      }

      const principal = new Principal(
        { id: userCache.id, username: userCache.username },
        { id: payload.sid },
        userCache.roles.map((rId) => ({ id: rId })),
      );

      return principal;
    } catch (error) {
      this.loggerService.error(error, 'Auth');
    }
  }
}
