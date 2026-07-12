import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { ValidationException } from '../classes/exceptions/validation.exception';
import { ExceptionResponseDto } from '../../shared/dto/exception-response.dto';
import { Response } from 'express';

@Catch(ValidationException)
export class ValidationFilter implements ExceptionFilter {
  catch(exception: ValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const body: ExceptionResponseDto = {
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      message: 'Validation error',
      errors: exception.formatErrors(),
    };

    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(body);
  }
}
