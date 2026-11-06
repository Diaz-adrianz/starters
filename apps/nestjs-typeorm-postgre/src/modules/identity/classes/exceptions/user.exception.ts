import {
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';

export class UserNotActiveException extends ForbiddenException {
  constructor() {
    super('Account is not active.');
  }
}

export class UserNotInvitedException extends BadRequestException {
  constructor() {
    super('Account is not in invited state.');
  }
}

export class UserDisabledException extends ForbiddenException {
  constructor() {
    super('Account has been disabled.');
  }
}

export class UserInvitedException extends ForbiddenException {
  constructor() {
    super(
      "This account hasn't been set up yet. If you're the account owner, please check your email for the invitation.",
    );
  }
}

export class UserNoPasswordException extends UnauthorizedException {
  constructor() {
    super(
      'This account is not registered with a password. Please try using another method.',
    );
  }
}
