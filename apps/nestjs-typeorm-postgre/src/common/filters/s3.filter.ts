import { S3ServiceException } from '@aws-sdk/client-s3';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { EnvConfig } from '../../config/env.config';
import { ConfigService } from '@nestjs/config';
import { DefaultLoggerService } from '../../lib/logger/default/default-logger.service';
import { ExceptionResponseDto } from '../../shared/dto/exception-response.dto';
import { Response } from 'express';

@Catch(S3ServiceException)
export class S3Filter implements ExceptionFilter {
  constructor(
    private configService: ConfigService<EnvConfig>,
    private loggerService: DefaultLoggerService,
  ) {}

  catch(exception: S3ServiceException, host: ArgumentsHost) {
    const isProd =
      this.configService.getOrThrow('mode', { infer: true }) == 'production';

    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const body: ExceptionResponseDto = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: isProd ? 'Storage error' : exception.message,
    };

    if (
      exception.name === 'NotFound' ||
      exception.name === 'NoSuchKey' ||
      exception.$metadata.httpStatusCode === 404
    ) {
      body.statusCode = HttpStatus.NOT_FOUND;
      body.message = 'File object not found';
    }

    if (!isProd) {
      body.stack = exception.stack?.split('\n');
    }

    if (body.statusCode === HttpStatus.INTERNAL_SERVER_ERROR.valueOf())
      this.loggerService.error(exception, 'Storage');

    res.status(body.statusCode).json(body);
  }
}
