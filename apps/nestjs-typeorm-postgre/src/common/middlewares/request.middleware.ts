import { Injectable, NestMiddleware } from '@nestjs/common';
import { StoreService } from '../../infra/store/store.service';
import { Request, Response } from 'express';
import { HeaderKeys } from '../../shared/constants/header-keys.contant';

@Injectable()
export class RequestMiddleware implements NestMiddleware {
  constructor(private store: StoreService) {}

  use(req: Request, _: Response, next: () => void) {
    this.store.set(
      'requestId',
      (req.headers[HeaderKeys.REQUEST_ID] as string) ||
        this.generateRequestId(),
    );
    next();
  }

  generateRequestId() {
    return `req_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  }
}
