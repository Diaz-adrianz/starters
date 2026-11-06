import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  Matches,
  Max,
  Min,
  ValidationOptions,
} from 'class-validator';
import { escapeRegex } from '../utils/transformer.util';
import {
  QUERY_SEPARATOR,
  CONDITION_SEPARATOR,
  FIELDS_SEPARATOR,
  VALUES_SEPARATOR,
  QueryDto,
} from '../interfaces/resource-query.interface';

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;

const FIELD_PATTERN = `[a-zA-Z_][a-zA-Z0-9_]*(?:${escapeRegex(FIELDS_SEPARATOR)}[a-zA-Z0-9_]*)*`;
const VALUE_PATTERN = String.raw`[^${VALUES_SEPARATOR}${CONDITION_SEPARATOR}${escapeRegex(QUERY_SEPARATOR)}]+`;
const CONDITION_PATTERN = `${FIELD_PATTERN}${CONDITION_SEPARATOR}${VALUE_PATTERN}(?:${VALUES_SEPARATOR}${VALUE_PATTERN})*`;

const CONDITION_PATTERN_REGEX = new RegExp(
  `^${CONDITION_PATTERN}(?:\\${QUERY_SEPARATOR}${CONDITION_PATTERN})*$`,
);

const ConditionPattern = (validationOptions?: ValidationOptions) =>
  Matches(CONDITION_PATTERN_REGEX, {
    message: ($property) =>
      `${$property.property} must match pattern "field:value1,value2;field2:value1,value2"`,
    ...validationOptions,
  });

const ORDER_PATTERN_REGEX = new RegExp(
  `^${FIELD_PATTERN}${CONDITION_SEPARATOR}(?:asc|desc)(?:\\${QUERY_SEPARATOR}${FIELD_PATTERN}${CONDITION_SEPARATOR}(?:asc|desc))*$`,
  'i',
);
const OrderPattern = (validationOptions?: ValidationOptions) =>
  Matches(ORDER_PATTERN_REGEX, {
    message: ($property) =>
      `${$property.property} must match pattern "field:asc+field2:desc"`,
    ...validationOptions,
  });

export class ResourceQueryDto implements QueryDto {
  @IsOptional()
  @ConditionPattern()
  eq?: string;

  @IsOptional()
  @ConditionPattern()
  neq?: string;

  @IsOptional()
  @ConditionPattern()
  lt?: string;

  @IsOptional()
  @ConditionPattern()
  lte?: string;

  @IsOptional()
  @ConditionPattern()
  gt?: string;

  @IsOptional()
  @ConditionPattern()
  gte?: string;

  @IsOptional()
  @ConditionPattern()
  in?: string;

  @IsOptional()
  @ConditionPattern()
  nin?: string;

  @IsOptional()
  @ConditionPattern()
  search?: string;

  @IsOptional()
  @OrderPattern()
  order?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(5)
  @Max(50)
  limit: number = DEFAULT_LIMIT;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = DEFAULT_PAGE;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  trash: boolean = false;
}
