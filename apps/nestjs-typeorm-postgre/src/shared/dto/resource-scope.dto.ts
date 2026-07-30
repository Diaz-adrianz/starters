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
import {
  ResourceScopeIntf,
  ResourceScopeQueryIntf,
} from '../interfaces/resource-scope.interface';

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

export class ResourceScopeDto implements ResourceScopeIntf {
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

export class ResourceScopeQueryDto
  extends ResourceScopeDto
  implements ResourceScopeQueryIntf
{
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(5)
  @Max(50)
  limit: number = 20;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @OrderPattern()
  order?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  trash: boolean = false;
}
