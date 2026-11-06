import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { AUTH_CONFIG_KEY, type AuthConfig } from '../../../config/auth.config';
import {
  JwtAccessAuthResult,
  JwtAccessPayload,
} from '../interfaces/jwt-access.interface';
import { AuthService } from '../auth.service';

const extractor = ExtractJwt.fromAuthHeaderAsBearerToken();

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(
    @Inject(AUTH_CONFIG_KEY) authConfig: AuthConfig,
    private authService: AuthService,
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
    const user = await this.authService.validateJwtAccessStrategy(payload.sub);

    return {
      token,
      payload: {
        user: { id: user.id, name: user.name },
        session: { id: payload.sid },
      },
    };
  }
}
