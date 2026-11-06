import { applyDecorators } from '@nestjs/common';
import { IsString, Length, Matches } from 'class-validator';

export function IsOtp(len = 6) {
  return applyDecorators(
    IsString(),
    Length(len, len, {
      message: `OTP must be ${len} digits`,
    }),
    Matches(/^\d+$/, { message: 'OTP must be numeric' }),
  );
}
