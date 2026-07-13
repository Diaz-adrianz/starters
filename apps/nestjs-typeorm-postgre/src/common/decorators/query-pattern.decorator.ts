import { Matches, ValidationOptions } from 'class-validator';

const QUERY_PATTERN_REGEX =
  /^[a-zA-Z0-9_]+:[^:;,]+(,[^:;,]+)*(;[a-zA-Z0-9_]+:[^:;,]+(,[^:;,]+)*)*$/;

export const QueryPattern = (validationOptions?: ValidationOptions) =>
  Matches(QUERY_PATTERN_REGEX, {
    message: ($property) =>
      `${$property.property} must match pattern "field:value1,value2;field2:value1,value2"`,
    ...validationOptions,
  });
