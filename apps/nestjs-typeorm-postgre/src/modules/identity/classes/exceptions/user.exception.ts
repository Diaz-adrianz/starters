import { ForbiddenException, UnauthorizedException } from '@nestjs/common';

export class UserDisabledException extends ForbiddenException {
  constructor() {
    super('Account has been suspended');
  }
}

export class UserNotVerifiedException extends ForbiddenException {
  constructor() {
    super('Account is not verified yet');
  }
}

export class UserNoPasswordException extends UnauthorizedException {
  constructor() {
    super(
      'This account is not registered with a password. Please try using another method.',
    );
  }
}
