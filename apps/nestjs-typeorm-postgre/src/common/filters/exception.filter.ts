import {
  ExceptionFilter as NestExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ExceptionResponseDto } from '../../shared/dto/exception-response.dto';
import { ValidationException } from '../classes/exceptions/validation.exception';
import { APP_CONFIG_KEY, type AppConfig } from '../../config/app.config';
import { LoggerService } from '../../infra/logger/logger.service';

@Catch()
export class ExceptionFilter implements NestExceptionFilter {
  constructor(
    @Inject(APP_CONFIG_KEY) private appConfig: AppConfig,
    private readonly httpAdapterHost: HttpAdapterHost,
    private logger: LoggerService,
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

      // Controller handler not found
      if (
        exception instanceof NotFoundException &&
        exception.message.startsWith('Cannot')
      ) {
        body.message = 'Requested resource not found';
      }
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
      this.logger.error(
        'Unhandled exception: ',
        exception,
        this.constructor.name,
      );

    httpAdapter.reply(ctx.getResponse(), body, body.statusCode);
  }
}
