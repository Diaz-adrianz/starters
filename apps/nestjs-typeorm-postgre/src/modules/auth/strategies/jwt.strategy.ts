import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '../../../config/env.config';
import { JwtTokenPayload } from '../interfaces/jwt-payload.interface';
import { AuthContext } from '../../../common/classes/auth-context.class';
import { UsersService } from '../../users/users.service';
import { DefaultCacheService } from '../../../cache/default/default-cache.service';
import { DefaultLoggerService } from '../../../lib/logger/default/default-logger.service';

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
    private logger: DefaultLoggerService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('jwt.access.secret', {
        infer: true,
      }),
    });
  }

  async validate(payload: JwtTokenPayload): Promise<AuthContext | undefined> {
    const authContext = new AuthContext();
    authContext.sessionId = payload.sid;

    try {
      let userCache = await this.cacheService.get<UserCache>((k) =>
        k.user(payload.sub),
      );

      if (!userCache) {
        const user = await this.usersService.findOne(payload.sub);
        userCache = {
          id: user.id,
          username: user.username,
          roles: user.roles.map((r) => r.role.id) ?? [],
        };

        await this.cacheService.set((k) => k.user(payload.sub), userCache);
      }

      authContext.userId = userCache.id;
      authContext.username = userCache.username;
      authContext.roles = userCache.roles;
    } catch (error) {
      this.logger.error(error, 'Auth');
    }

    return authContext;
  }
}
