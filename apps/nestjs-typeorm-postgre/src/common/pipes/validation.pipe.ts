import {
  Injectable,
  ValidationPipe as NestValidationPipe,
  ValidationError,
} from '@nestjs/common';
import { ValidationException } from '../classes/exceptions/validation.exception';

@Injectable()
export class ValidationPipe extends NestValidationPipe {
  constructor() {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        return new ValidationException(errors);
      },
    });
  }
}
