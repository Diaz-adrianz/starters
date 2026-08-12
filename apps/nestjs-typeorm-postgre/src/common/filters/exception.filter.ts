import {
  ExceptionFilter as NestExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ExceptionResponseDto } from '../../shared/dto/exception-response.dto';
import { ValidationException } from '../classes/exceptions/validation.exception';
import { DefaultLoggerService } from '../../lib/logger/default/default-logger.service';
import { APP_CONFIG_KEY, type AppConfig } from '../../config/app.config';

@Catch()
export class ExceptionFilter implements NestExceptionFilter {
  constructor(
    @Inject(APP_CONFIG_KEY) private appConfig: AppConfig,
    private readonly httpAdapterHost: HttpAdapterHost,
    private loggerService: DefaultLoggerService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const isProd = this.appConfig.mode == 'production';

    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const body: ExceptionResponseDto = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    };

    if (exception instanceof HttpException) {
      body.statusCode = exception.getStatus();
      body.message = exception.message;
    }

    if (exception instanceof ValidationException) {
      body.statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
      body.message = 'Validation error';
      body.errors = exception.formatErrors();
    }

    if (!isProd && exception instanceof Error) {
      body.stack = exception.stack?.split('\n');
    }

    if (body.statusCode === HttpStatus.INTERNAL_SERVER_ERROR.valueOf())
      this.loggerService.error(exception);

    httpAdapter.reply(ctx.getResponse(), body, body.statusCode);
  }
}
