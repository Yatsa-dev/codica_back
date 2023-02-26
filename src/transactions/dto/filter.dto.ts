import { IsOptional, IsNumber, IsArray, IsDate } from 'class-validator';
export class QueryFilter {
  @IsDate()
  @IsOptional()
  from?: Date;

  @IsDate()
  @IsOptional()
  to?: Date;

  @IsNumber()
  @IsOptional()
  categoryIds?: number;
}
