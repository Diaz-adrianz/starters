import { applyDecorators } from '@nestjs/common';
import { IsString, Length, Matches } from 'class-validator';

const MIN = 3;
const MAX = 30;

export function IsUsername() {
  return applyDecorators(
    IsString(),
    Length(MIN, MAX, {
      message: `Username must be ${MIN}-${MAX} characters`,
    }),
    Matches(/^[a-zA-Z][a-zA-Z0-9._]*$/, {
      message:
        'Username must start with a letter and contain only letters, numbers, dots, or underscores',
    }),
  );
}
