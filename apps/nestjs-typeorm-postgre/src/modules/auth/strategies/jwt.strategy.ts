import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { JwtTokenPayload } from '../interfaces/jwt-payload.interface';
import { UserService } from '../../user/user.service';
import { DefaultCacheService } from '../../../lib/cache/default/default-cache.service';
import { Principal } from '../../../shared/classes/principal.class';
import { AuthService } from '../auth.service';
import { AUTH_CONFIG_KEY, type AuthConfig } from '../../../config/auth.config';

type UserCache = {
  id: string;
  username: string;
  roles: string[];
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(AUTH_CONFIG_KEY) private authConfig: AuthConfig,
    private cacheService: DefaultCacheService,
    private userService: UserService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authConfig.jwt.access.secret,
    });
  }

  async validate(payload: JwtTokenPayload): Promise<Principal | undefined> {
    let userCache = await this.cacheService.get<UserCache>((k) =>
      k.user(payload.sub),
    );

    if (!userCache) {
      const user = await this.userService.findById(payload.sub);
      this.authService.checkUserActive(user);

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
  }
}
