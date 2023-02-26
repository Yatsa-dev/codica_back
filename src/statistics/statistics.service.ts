import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFilter } from 'src/transactions/dto/filter.dto';
import { Repository } from 'typeorm';
import { CreateStatisticDto } from './dto/create.dto';
import { Statistic } from './entity/statistics.entity';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Statistic)
    private statisticsRepository: Repository<Statistic>,
  ) {}

  async create(createStatisticDto: CreateStatisticDto) {
    return this.statisticsRepository.save(createStatisticDto);
  }

  // async getStatistics(userId: number, query: QueryFilter) {}
  // parseFilter(query: QueryFilter) {
  //   const filter = {} as any;
  //   if (query.from) filter.createdAt = query.from;
  //   if (query.to) filter.createdAt = query.to;
  //   if(query.categoryIds)filter.
  // }
}
