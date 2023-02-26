import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BanksModule } from 'src/banks/banks.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { StatisticsModule } from 'src/statistics/statistics.module';
import { UsersModule } from 'src/users/users.module';
import { Transaction } from './entity/transaction.entity';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    UsersModule,
    BanksModule,
    CategoriesModule,
    StatisticsModule,
  ],
  providers: [TransactionsService],
  controllers: [TransactionsController],
  exports: [TransactionsService],
})
export class TransactionsModule {}
