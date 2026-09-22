import { registerDecorator, ValidationOptions } from 'class-validator';
import {
  Condition,
  Operator,
  OPERATORS,
  Scalar,
} from '../../interfaces/condition.interface';

const isScalar = (v: unknown): v is Scalar =>
  v === null ||
  typeof v === 'string' ||
  typeof v === 'number' ||
  typeof v === 'boolean' ||
  v instanceof Date;

function isValidCondition(value: unknown): value is Condition {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    return false;

  return Object.values(value).every((opMap) => {
    if (typeof opMap !== 'object' || opMap === null) return false;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return Object.entries(opMap).every(([op, val]) => {
      if (!OPERATORS.includes(op as Operator)) return false;
      if (Array.isArray(val)) return val.every(isScalar);
      return isScalar(val);
    });
  });
}

export function IsConditionObject(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isCondition',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          return isValidCondition(value);
        },
        defaultMessage() {
          return `${propertyName} must be a valid Condition object (e.g. { field: { eq: value } })`;
        },
      },
    });
  };
}
