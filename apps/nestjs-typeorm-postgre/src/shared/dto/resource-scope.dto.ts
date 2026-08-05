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
import { ResourceScopeIntf } from '../interfaces/resource-scope.interface';

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;

const CLAUSE_PATTERN_REGEX =
  /^[\w]+(?:\.[\w]+)*:[\w$]+(?:[.,][\w$]+)*(?:;[\w]+(?:\.[\w]+)*:[\w$]+(?:[.,][\w$]+)*)*$/;

const ClausePattern = (validationOptions?: ValidationOptions) =>
  Matches(CLAUSE_PATTERN_REGEX, {
    message: ($property) =>
      `${$property.property} must match pattern "field:value1,value2;field2:value1,value2"`,
    ...validationOptions,
  });

const ORDER_PATTERN_REGEX =
  /^[\w]+(?:\.[\w]+)*:(?:asc|desc)(?:;[\w]+(?:\.[\w]+)*:(?:asc|desc))*$/i;

const OrderPattern = (validationOptions?: ValidationOptions) =>
  Matches(ORDER_PATTERN_REGEX, {
    message: ($property) =>
      `${$property.property} must match pattern "field:asc+field2:desc"`,
    ...validationOptions,
  });

export class ResourceScopeBaseDto implements ResourceScopeIntf {
  @IsOptional()
  @ClausePattern()
  search?: string;

  @IsOptional()
  @ClausePattern()
  starts?: string;

  @IsOptional()
  @ClausePattern()
  where?: string;

  @IsOptional()
  @ClausePattern()
  in?: string;

  @IsOptional()
  @ClausePattern()
  nin?: string;

  @IsOptional()
  isnull?: string;

  @IsOptional()
  notnull?: string;

  @IsOptional()
  @ClausePattern()
  gte?: string;

  @IsOptional()
  @ClausePattern()
  lte?: string;

  @IsOptional()
  @ClausePattern()
  between?: string;
}
export class ResourceScopeDto
  extends ResourceScopeBaseDto
  implements ResourceScopeIntf
{
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(5)
  @Max(50)
  limit?: number = DEFAULT_LIMIT;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = DEFAULT_PAGE;

  @IsOptional()
  @OrderPattern()
  order?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  trash?: boolean;
}
