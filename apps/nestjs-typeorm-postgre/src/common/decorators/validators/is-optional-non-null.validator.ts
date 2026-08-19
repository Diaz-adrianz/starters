import { ValidateIf, ValidationOptions } from 'class-validator';

export function IsOptionalNonNull(validationOptions?: ValidationOptions) {
  return ValidateIf((_, value) => value !== undefined, validationOptions);
}
