import { Matches, ValidationOptions } from 'class-validator';

const ORDER_PATTERN_REGEX =
  /^[a-zA-Z0-9_]+:(asc|desc)(;[a-zA-Z0-9_]+:(asc|desc))*$/i;

export const OrderPattern = (validationOptions?: ValidationOptions) =>
  Matches(ORDER_PATTERN_REGEX, {
    message: ($property) =>
      `${$property.property} must match pattern "field:asc+field2:desc"`,
    ...validationOptions,
  });
