import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '../../../config/env.config';
import { JwtTokenPayload } from '../interfaces/jwt-payload.interface';
import { AuthService } from '../auth.service';
import { Session } from '../../../common/classes/session.class';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService<EnvConfig>,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('jwt.access.secret', {
        infer: true,
      }),
    });
  }

  async validate(payload: JwtTokenPayload): Promise<Session | undefined> {
    const session = await this.authService.findSession(
      payload.sub,
      payload.sid,
    );
    return session;
  }
}
