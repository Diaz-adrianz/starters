import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsStrongPassword,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { MatchWith } from '../../../common/decorators/validators/match-with.validator';

export class SignUpLocalDto {
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[a-zA-Z][a-zA-Z0-9._]*$/, {
    message:
      'Username must start with a letter and contain only letters, numbers, dots, or underscores',
  })
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  // Note: IsStrongPassword default options
  // https://github.com/validatorjs/validator.js/blob/master/README.md
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  @MatchWith('password')
  matchPassword: string;

  @IsOptional()
  @IsIn(['User'])
  roleName: string = 'User';
}
