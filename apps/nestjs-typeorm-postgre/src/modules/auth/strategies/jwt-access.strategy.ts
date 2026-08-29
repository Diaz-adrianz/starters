import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { AUTH_CONFIG_KEY, type AuthConfig } from '../../../config/auth.config';
import { CacheService } from '../../../infra/cache/cache.service';
import { LoggerService } from '../../../infra/logger/logger.service';
import {
  JwtAccessAuthResult,
  JwtAccessPayload,
} from '../interfaces/jwt-access.interface';
import { AuthService } from '../auth.service';

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
    private authService: AuthService,
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
      const user = await this.authService.validateJwtAccessStrategy(
        payload.sub,
      );

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
