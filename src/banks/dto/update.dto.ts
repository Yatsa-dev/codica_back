import { IsString, IsOptional } from 'class-validator';

export class UpdateBankDto {
  @IsOptional()
  @IsString()
  name?: string;
}
