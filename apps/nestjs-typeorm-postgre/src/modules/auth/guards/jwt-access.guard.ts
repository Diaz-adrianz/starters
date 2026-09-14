import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { OPTIONAL_AUTH_KEY } from '../../../common/decorators/optional-auth.decorator';
import { StoreService } from '../../../infra/store/store.service';
import { JwtAccessAuthResult } from '../interfaces/jwt-access.interface';
import { NO_AUTH_KEY } from '../../../common/decorators/no-auth.decorator';

@Injectable()
export class JwtAccessGuard extends AuthGuard('jwt-access') {
  constructor(
    private reflector: Reflector,
    private store: StoreService,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const noAuth = this.reflector.getAllAndOverride<boolean>(NO_AUTH_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (noAuth) return true;

    return super.canActivate(context);
  }

  handleRequest<TUser = JwtAccessAuthResult>(
    err: any,
    authResult: TUser | false | null | undefined,
    _info: any,
    context: ExecutionContext,
  ): TUser | undefined {
    const optionalAuth = this.reflector.getAllAndOverride<boolean>(
      OPTIONAL_AUTH_KEY,
      [context.getHandler(), context.getClass()],
    );

    if ((err || !authResult) && !optionalAuth)
      throw err || new UnauthorizedException('Session expired');

    if (authResult) {
      const { payload } = authResult as unknown as JwtAccessAuthResult;
      this.store.set('actor', {
        type: 'user',
        id: payload.user.id,
        name: payload.user.name,
      });
      this.store.set('session', { id: payload.session.id });
    }

    return authResult || undefined;
  }
}
