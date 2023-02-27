import * as moment from 'moment';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BanksModule } from 'src/banks/banks.module';
import { StatisticsModule } from 'src/statistics/statistics.module';
import { UsersModule } from 'src/users/users.module';
import { Transaction } from './entity/transaction.entity';
import { MOMENT } from './transactions.constants';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    UsersModule,
    BanksModule,
    StatisticsModule,
  ],
  providers: [
    {
      provide: MOMENT,
      useValue: moment,
    },
    TransactionsService,
  ],
  controllers: [TransactionsController],
  exports: [TransactionsService],
})
export class TransactionsModule {}
