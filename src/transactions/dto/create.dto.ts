import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
} from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsArray()
  categoryIds: number[];

  @IsNotEmpty()
  @IsNumber()
  bank: any;

  @IsOptional()
  @IsString()
  createdAt?: string;

  @IsOptional()
  @IsNumber()
  user?: number;
}
