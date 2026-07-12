import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { EntityNotFoundError, TypeORMError } from 'typeorm';
import { ExceptionResponseDto } from '../../shared/dto/exception-response.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '../../config/env.config';

@Catch(TypeORMError)
export class TypeormFilter implements ExceptionFilter {
  constructor(private configService: ConfigService<EnvConfig>) {}

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
    }

    res.status(body.statusCode).json(body);
  }
}
