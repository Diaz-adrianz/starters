import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../../../common/decorators/public.decorator';
import { IS_OPTIONAL_AUTH_KEY } from '../../../common/decorators/optional-auth.decorator';
import { StoreService } from '../../../infra/store/store.service';
import { JwtAccessAuthResult } from '../interfaces/jwt-access.interface';

@Injectable()
export class JwtAccessGuard extends AuthGuard('jwt-access') {
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

  handleRequest<TUser = JwtAccessAuthResult>(
    err: any,
    authResult: TUser | false | null | undefined,
    _info: any,
    context: ExecutionContext,
  ): TUser | undefined {
    const isOptional = this.reflector.getAllAndOverride<boolean>(
      IS_OPTIONAL_AUTH_KEY,
      [context.getHandler(), context.getClass()],
    );

    if ((err || !authResult) && !isOptional)
      throw err || new UnauthorizedException('Session expired');

    if (authResult) {
      const { payload } = authResult as unknown as JwtAccessAuthResult;
      this.store.set('actor', {
        type: 'user',
        id: payload.user.id,
        name: payload.user.name,
        roles: payload.roles,
      });
      this.store.set('session', { id: payload.session.id });
    }

    return authResult || undefined;
  }
}
