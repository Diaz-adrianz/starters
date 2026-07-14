import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const RequestClientInfo = createParamDecorator(
  (_, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();
    return {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    };
  },
);
