import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateStatisticDto {
  @IsNumber()
  @IsNotEmpty()
  transaction: number;

  @IsNumber()
  @IsNotEmpty()
  category: number;
}
