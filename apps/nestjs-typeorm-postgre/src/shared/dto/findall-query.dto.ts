import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator';
import { QueryPattern } from '../../common/decorators/query-pattern.decorator';
import { OrderPattern } from '../../common/decorators/order-pattern.decorator';

export class FindAllQueryDto {
  @IsOptional()
  @QueryPattern()
  search?: string;

  @IsOptional()
  @QueryPattern()
  starts?: string;

  @IsOptional()
  @QueryPattern()
  where?: string;

  @IsOptional()
  @QueryPattern()
  in?: string;

  @IsOptional()
  @QueryPattern()
  nin?: string;

  @IsOptional()
  isnull?: string;

  @IsOptional()
  @QueryPattern()
  gte?: string;

  @IsOptional()
  @QueryPattern()
  lte?: string;

  @IsOptional()
  @QueryPattern()
  between?: string;

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
