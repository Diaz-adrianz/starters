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

@Catch()
export class ExceptionFilter implements NestExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private configService: ConfigService<EnvConfig>,
  ) {}

  catch(exception: Error, host: ArgumentsHost): void {
    const isProd =
      this.configService.getOrThrow('mode', { infer: true }) == 'production';

    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const body: ExceptionResponseDto = {
      statusCode: httpStatus,
      message: 'Internal server error',
    };

    if (exception instanceof ValidationException) {
      body.statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
      body.message = 'Validation error';
      body.errors = exception.formatErrors();
    }

    if (!isProd) {
      body.stack = exception.stack?.split('\n');
    }

    httpAdapter.reply(ctx.getResponse(), body, httpStatus);
  }
}
