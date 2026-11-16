import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../../entities/user.entity';

export class UserNotFoundException extends NotFoundException {
  constructor() {
    super('Account not found.');
  }
}

export class UserInvalidPasswordException extends UnauthorizedException {
  constructor(public user: Pick<User, 'id'>) {
    super('Password invalid.');
  }
}

export class UserNotInvitedException extends BadRequestException {
  constructor() {
    super('Account is not in invited state.');
  }
}

export class UserDisabledException extends ForbiddenException {
  constructor(public user: Pick<User, 'id'>) {
    super('Account has been disabled.');
  }
}

export class UserInvitedException extends ForbiddenException {
  constructor(public user: Pick<User, 'id'>) {
    super(
      "This account hasn't been set up yet. If you're the account owner, please check your email for the invitation.",
    );
  }
}

export class UserNoPasswordException extends UnauthorizedException {
  constructor(public user: Pick<User, 'id'>) {
    super(
      'This account is not registered with a password. Please try using another method.',
    );
  }
}
