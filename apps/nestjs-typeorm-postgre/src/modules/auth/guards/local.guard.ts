import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { SignInLocalDto } from '../dto/sign-in-local.dto';
import { ValidationException } from '../../../common/classes/exceptions/validation.exception';

@Injectable()
export class LocalGuard extends AuthGuard('local') {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const dto = plainToInstance(SignInLocalDto, req.body);
    const errors = validateSync(dto, { whitelist: true });
    if (errors.length > 0) {
      throw new ValidationException(errors);
    }
    return super.canActivate(context);
  }
}
