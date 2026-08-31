import { Inject, Injectable } from '@nestjs/common';
import { AUTH_CONFIG_KEY, type AuthConfig } from '../../config/auth.config';
import { JwtService } from '@nestjs/jwt';
import { JwtAccessPayload } from '../../modules/auth/interfaces/jwt-access.interface';

@Injectable()
export class WebsocketService {
  private userSockets = new Map<string, Set<string>>();

  constructor(
    @Inject(AUTH_CONFIG_KEY) private authConfig: AuthConfig,
    private jwt: JwtService,
  ) {}

  // ================================================================
  // Authentication
  // ----------------------------------------------------------------
  verifyJwtAccess(token: string) {
    return this.jwt.verify<JwtAccessPayload>(token, {
      secret: this.authConfig.jwt.access.secret,
    });
  }

  // ================================================================
  // User sockets / rooms
  // ----------------------------------------------------------------
  add(userId: string, socketId: string) {
    if (!this.userSockets.has(userId)) this.userSockets.set(userId, new Set());
    this.userSockets.get(userId)!.add(socketId);
  }

  remove(userId: string, socketId: string) {
    this.userSockets.get(userId)?.delete(socketId);
  }

  getSocketIds(userId: string): Set<string> | undefined {
    return this.userSockets.get(userId);
  }
}
