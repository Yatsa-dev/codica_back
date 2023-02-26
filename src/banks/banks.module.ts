import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BanksController } from './banks.controller';
import { BanksService } from './banks.service';
import { Bank } from './entity/bank.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bank])],
  providers: [BanksService],
  controllers: [BanksController],
  exports: [BanksService],
})
export class BanksModule {}
