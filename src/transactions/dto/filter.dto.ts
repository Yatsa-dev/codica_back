import { Transform, Type } from 'class-transformer';
import { IsOptional, IsNumber, IsArray, IsString } from 'class-validator';
export class QueryFilter {
  @IsString()
  @IsOptional()
  from?: string;

  @IsString()
  @IsOptional()
  to?: string;

  @IsOptional()
  @Type(() => IsNumber)
  @IsArray()
  @Transform(({ value }) => value.toString().split(',').map(Number))
  categoryIds?: number[];
}
