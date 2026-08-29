import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  JwtRefreshAuthResult,
  JwtRefreshPayload,
} from '../interfaces/jwt-refresh.interface';
import { AUTH_CONFIG_KEY, type AuthConfig } from '../../../config/auth.config';

const extractor = ExtractJwt.fromAuthHeaderAsBearerToken();

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(@Inject(AUTH_CONFIG_KEY) authConfig: AuthConfig) {
    super({
      jwtFromRequest: extractor,
      ignoreExpiration: false,
      secretOrKey: authConfig.jwt.refresh.secret,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtRefreshPayload): JwtRefreshAuthResult {
    const token = extractor(req)!;
    return {
      token,
      payload: { user: { id: payload.sub }, session: { id: payload.sid } },
    };
  }
}
