import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { EntityNotFoundError, QueryFailedError, TypeORMError } from 'typeorm';
import { ExceptionResponseDto } from '../../shared/dto/exception-response.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '../../config/env.config';
import { DefaultLoggerService } from '../../lib/logger/default/default-logger.service';

@Catch(TypeORMError)
export class TypeormFilter implements ExceptionFilter {
  constructor(
    private configService: ConfigService<EnvConfig>,
    private loggerService: DefaultLoggerService,
  ) {}

  catch(exception: TypeORMError, host: ArgumentsHost) {
    const isProd =
      this.configService.getOrThrow('mode', { infer: true }) == 'production';

    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const body: ExceptionResponseDto = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: isProd ? 'Database error' : exception.message,
    };

    if (exception instanceof EntityNotFoundError) {
      body.statusCode = HttpStatus.NOT_FOUND;
      body.message = 'Entry not found';
      try {
        const match = exception.message.match(
          /Could not find any entity of type "(.*?)"/,
        );
        if (match) body.message = `${match[1]} not found.`;
      } catch {
        // silent
      }
    } else if (exception instanceof QueryFailedError) {
      if (
        exception.message.includes(
          'duplicate key value violates unique constraint',
        )
      ) {
        body.statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
        body.message = 'Duplicate entry detected';

        if ('detail' in exception) {
          try {
            const match = (exception?.detail as string).match(
              /Key \((\w+)\)=\((.*?)\) already exist/i,
            );
            if (match) {
              const [_, field, value] = match;
              body.message = `${field.charAt(0).toUpperCase() + field.slice(1)} ${value} already exists.`;
            }
          } catch {
            // silent
          }
        }
      }
    }

    if (!isProd) {
      body.stack = exception.stack?.split('\n');
    }

    if (body.statusCode === HttpStatus.INTERNAL_SERVER_ERROR.valueOf())
      this.loggerService.error(exception, 'Database');

    res.status(body.statusCode).json(body);
  }
}
