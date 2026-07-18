import { Exclude } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[a-zA-Z][a-zA-Z0-9._]*$/, {
    message:
      'Username must start with a letter and contain only letters, numbers, dots, or underscores',
  })
  username?: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @Exclude()
  verifiedAt?: Date | null;

  @Exclude()
  verificationSentAt?: Date | null;

  @Exclude()
  resetPasswordSentAt?: Date | null;
}
