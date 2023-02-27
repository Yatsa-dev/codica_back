import * as moment from 'moment';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/transactions/entity/transaction.entity';
import { Statistic } from './entity/statistics.entity';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { MOMENT } from './statistics.constants';

@Module({
  imports: [TypeOrmModule.forFeature([Statistic, Transaction])],
  providers: [
    {
      provide: MOMENT,
      useValue: moment,
    },
    StatisticsService,
  ],
  controllers: [StatisticsController],
  exports: [StatisticsService],
})
export class StatisticsModule {}
