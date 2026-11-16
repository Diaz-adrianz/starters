import { ValidateIf } from 'class-validator';

export function IsNullable() {
  return ValidateIf((_, value) => value !== null);
}
