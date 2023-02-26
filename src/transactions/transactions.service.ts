import { omit } from 'lodash';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BanksService } from 'src/banks/banks.service';
import { USER_NOT_FOUND } from 'src/users/users.constanst';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create.dto';
import { Transaction } from './entity/transaction.entity';
import {
  CONSUMABLE,
  MOMENT,
  PROFITABLE,
  TRANSACTION_NOT_FOUND,
} from './transactions.constants';
import { StatisticsService } from 'src/statistics/statistics.service';
import { Inject } from '@nestjs/common/decorators';

@Injectable()
export class TransactionsService {
  constructor(
    @Inject(MOMENT) private moment,
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    private usersServise: UsersService,
    private banksService: BanksService,
    private statisticsService: StatisticsService,
  ) {}

  async create(
    userId: number,
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const user = await this.usersServise.findById(userId);
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    createTransactionDto.user = user.id;
    createTransactionDto.createdAt = this.moment.utc().format('YYYY-MM-DD');

    const transaction = await this.transactionsRepository.save(
      createTransactionDto,
    );

    for (const id of createTransactionDto.categoryIds) {
      await this.statisticsService.create({
        transaction: transaction.id,
        category: id,
      });
    }

    switch (true) {
      case transaction.type === PROFITABLE:
        await this.banksService.incrementBalance(
          transaction.bank,
          transaction.amount,
        );
        break;
      case transaction.type === CONSUMABLE:
        await this.banksService.decrementBalance(
          transaction.bank,
          transaction.amount,
        );
        break;
    }

    return transaction;
  }

  async delete(transactionId: number): Promise<{ success: boolean }> {
    const transaction = await this.findOne(transactionId);

    if (!transaction) {
      throw new NotFoundException(TRANSACTION_NOT_FOUND);
    }

    switch (true) {
      case transaction.type === PROFITABLE:
        await this.banksService.decrementBalance(
          transaction.bank.id,
          transaction.amount,
        );
        break;
      case transaction.type === CONSUMABLE:
        await this.banksService.incrementBalance(
          transaction.bank.id,
          transaction.amount,
        );
        break;
    }
    await this.transactionsRepository.delete({ id: transaction.id });

    return { success: true };
  }

  async findOne(transactionId: number): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findOneBy({
      id: transactionId,
    });
    return omit(transaction, ['bank.balance', 'bank.name']);
  }

  async findAll(
    userId: number,
    offset?: number,
    limit?: number,
  ): Promise<Transaction[]> {
    const transactions = await this.transactionsRepository.find({
      where: { user: userId },
      order: {
        id: 'DESC',
      },
      skip: offset,
      take: limit,
    });

    return transactions.map((item) => omit(item, ['bank']));
  }
}
