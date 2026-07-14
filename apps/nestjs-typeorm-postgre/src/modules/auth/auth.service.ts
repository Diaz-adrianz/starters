import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { AccessTokenPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '../../config/env.config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService<EnvConfig>,
  ) {}

  async signIn(user: User) {
    const payload: AccessTokenPayload = { sub: user.id, usn: user.username };
    const accessToken = await this.signAccessToken(payload);

    return {
      user: user,
      tokens: { accessToken },
    };
  }

  // auth validations
  async validateLocalStrategy(username: string, password: string) {
    const user = await this.usersService.findByUsernameOrEmail(username);

    if (!user.password)
      throw new UnauthorizedException(
        'This account is not registered with a password. Please try using another method.',
      );

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) return null;

    this.checkUserActive(user);
    return user;
  }

  // utils
  private checkUserActive(user: User) {
    if (!user.isActive())
      throw new ForbiddenException('Account suspended or not verified.');
  }

  signAccessToken(payload: AccessTokenPayload) {
    return this.jwtService.signAsync(
      { sub: payload.sub },
      {
        secret: this.configService.getOrThrow('jwt.access.secret', {
          infer: true,
        }),
        expiresIn: this.configService.getOrThrow('jwt.access.expire', {
          infer: true,
        }),
        issuer: this.configService.getOrThrow('jwt.issuer', { infer: true }),
      },
    );
  }
}
