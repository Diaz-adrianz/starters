import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { IS_OPTIONAL_AUTH_KEY } from '../decorators/optional-auth.decorator';
import { JwtUser } from '../../modules/auth/strategies/jwt.strategy';
import { StoreService } from '../../infra/store/store.service';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private store: StoreService,
  ) {
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

  handleRequest<TUser = JwtUser>(
    err: any,
    user: TUser | false | null | undefined,
    _info: any,
    context: ExecutionContext,
  ): TUser | undefined {
    const isOptional = this.reflector.getAllAndOverride<boolean>(
      IS_OPTIONAL_AUTH_KEY,
      [context.getHandler(), context.getClass()],
    );

    if ((err || !user) && !isOptional)
      throw err || new UnauthorizedException('Session expired');

    if (user) {
      const actor = user as unknown as JwtUser;
      this.store.set('actor', {
        type: 'user',
        id: actor.id,
        name: actor.name,
        roles: actor.roles,
      });
      this.store.set('session', { id: actor.session.id });
    }

    return user || undefined;
  }
}
