import { Injectable, NestMiddleware } from '@nestjs/common';
import { StoreService } from '../../infra/store/store.service';
import { Request, Response } from 'express';
import { HeaderKeys } from '../../shared/constants/header-keys.constant';

@Injectable()
export class RequestMiddleware implements NestMiddleware {
  constructor(private store: StoreService) {}

  use(req: Request, _: Response, next: () => void) {
    const requestId =
      (req.headers[HeaderKeys.REQUEST_ID] as string) ||
      this.generateRequestId();

    this.store.set('requestId', requestId);
    next();
  }

  private generateRequestId() {
    return `req_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  }
}
