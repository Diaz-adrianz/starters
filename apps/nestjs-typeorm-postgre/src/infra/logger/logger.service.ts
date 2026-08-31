import {
  Inject,
  Injectable,
  LoggerService as NestLoggerService,
} from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { StoreService } from '../store/store.service';

@Injectable()
export class LoggerService implements NestLoggerService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly store: StoreService,
  ) {}

  private meta(context: string, extra: Record<string, any> = {}) {
    return { context, requestId: this.store.get('requestId'), ...extra };
  }

  log(message: any, context: string) {
    this.logger.info(message, this.meta(context));
  }

  debug(message: any, context: string) {
    this.logger.debug(message, this.meta(context));
  }

  verbose(message: any, context: string) {
    this.logger.verbose(message, this.meta(context));
  }

  private logWithError(
    level: 'warn' | 'error',
    arg1: any,
    arg2: unknown,
    arg3?: string,
  ) {
    const isErrorObj = arg2 instanceof Error;
    const err = isErrorObj ? arg2 : arg1 instanceof Error ? arg1 : undefined;
    const context = isErrorObj ? arg3! : (arg2 as string);
    const text = err
      ? isErrorObj
        ? `${arg1}${err.message}`
        : err.message
      : (arg1?.message ?? arg1);

    this.logger[level](text, this.meta(context, { stack: err?.stack }));
  }

  warn(message: any, errorOrContext: unknown, context?: string) {
    this.logWithError('warn', message, errorOrContext, context);
  }

  error(message: any, errorOrContext: unknown, context?: string) {
    this.logWithError('error', message, errorOrContext, context);
  }

  fatal(message: any, errorOrContext: unknown, context?: string) {
    this.logWithError('error', message, errorOrContext, context);
  }
}
