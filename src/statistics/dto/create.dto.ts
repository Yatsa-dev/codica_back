import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateStatisticDto {
  @IsNumber()
  @IsNotEmpty()
  transaction: any;

  @IsNumber()
  @IsNotEmpty()
  category: any;
}
