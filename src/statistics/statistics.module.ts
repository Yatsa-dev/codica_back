import * as moment from 'moment';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../transactions/entity/transaction.entity';
import { Statistic } from './entity/statistics.entity';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { MOMENT } from './statistics.constants';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [
    CategoriesModule,
    TypeOrmModule.forFeature([Statistic, Transaction]),
  ],
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
