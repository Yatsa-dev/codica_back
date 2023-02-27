import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFilter } from 'src/transactions/dto/filter.dto';
import { Transaction } from 'src/transactions/entity/transaction.entity';
import {
  CONSUMABLE,
  PROFITABLE,
} from 'src/transactions/transactions.constants';
import { In, Repository } from 'typeorm';
import { CreateStatisticDto } from './dto/create.dto';
import { Statistic } from './entity/statistics.entity';
import { MOMENT } from './statistics.constants';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Statistic)
    private statisticsRepository: Repository<Statistic>,
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    @Inject(MOMENT) private moment,
  ) {}

  async create(createStatisticDto: CreateStatisticDto): Promise<Statistic> {
    return this.statisticsRepository.save(createStatisticDto);
  }

  async getStatistics(userId: number, query: QueryFilter) {
    const dateTo = query.to || this.moment.utc().format('YYYY-MM-DD');
    const dateFrom =
      query.from || this.moment.utc().subtract(7, 'd').format('YYYY-MM-DD');

    const transactions = await this.transactionsRepository.find({
      where: [{ user: userId }, { createdAt: dateFrom }, { createdAt: dateTo }],
    });

    const transactionsIds = transactions.map((item) => item.id);
    const stats = await this.statisticsRepository.find({
      where: [{ transaction: In(transactionsIds) }],
    });

    const result = [];
    for (const id of query.categoryIds) {
      stats.filter((item) => {
        if (item.category.id === id) result.push(item);
      });
    }

    const modifiedResult = result.reduce((acc, item) => {
      let amount: number;
      if (item.transaction.type === PROFITABLE) {
        amount = item.transaction.amount;
      }
      if (item.transaction.type === CONSUMABLE) {
        amount = -item.transaction.amount;
      }
      return [...acc, { [item.category.name]: amount }];
    }, []);

    const totals = {};
    modifiedResult.forEach((item: { category: string; value: number }) => {
      const array = Object.entries(item);
      if (totals[array[0][0]]) {
        totals[array[0][0]] += array[0][1];
      } else {
        totals[array[0][0]] = array[0][1];
      }
    });

    return totals;
  }
}
