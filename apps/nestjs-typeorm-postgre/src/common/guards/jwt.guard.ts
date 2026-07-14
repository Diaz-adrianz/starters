import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { type Session } from '../interfaces/session.interface';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest<TUser = Session>(
    err: any,
    user: TUser | false | null,
    _info: any,
  ): TUser {
    if (err || !user)
      throw err || new UnauthorizedException('Session expired.');
    return user;
  }
}
