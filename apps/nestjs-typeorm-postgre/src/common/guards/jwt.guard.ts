import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Session } from '../classes/session.class';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    return super.canActivate(context);
  }

  handleRequest<TUser = Session>(
    err: any,
    user: TUser | false | null | undefined,
    _info: any,
  ): TUser {
    if (err || !user)
      throw err || new UnauthorizedException('Session expired.');
    return plainToInstance(Session, user) as TUser;
  }
}
