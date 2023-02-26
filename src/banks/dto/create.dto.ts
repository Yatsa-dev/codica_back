import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateBankDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNumber()
  user?: number;
}
