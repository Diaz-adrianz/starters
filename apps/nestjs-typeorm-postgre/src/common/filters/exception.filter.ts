import {
  ExceptionFilter as NestExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ExceptionResponseDto } from '../../shared/dto/exception-response.dto';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '../../config/env.config';
import { ValidationException } from '../classes/exceptions/validation.exception';
import { LoggerService } from '../logger/logger.service';

@Catch()
export class ExceptionFilter implements NestExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private configService: ConfigService<EnvConfig>,
    private loggerService: LoggerService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const isProd =
      this.configService.getOrThrow('mode', { infer: true }) == 'production';

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
