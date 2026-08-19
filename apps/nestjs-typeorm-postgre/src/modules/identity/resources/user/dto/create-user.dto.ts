import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { MatchWith } from '../../../../../common/decorators/validators/match-with.validator';

export class CreateUserDto {
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

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  @MatchWith('password')
  matchPassword: string;
}
