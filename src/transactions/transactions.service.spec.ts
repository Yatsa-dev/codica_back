import * as moment from 'moment';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { CreateBankDto } from '../banks/dto/create.dto';
import { Bank } from '../banks/entity/bank.entity';
import { Category } from '../categories/entity/category.entity';
import { Statistic } from '../statistics/entity/statistics.entity';
import { User } from '../users/entity/users.entity';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create.dto';
import { Transaction } from './entity/transaction.entity';
import {
  CONSUMABLE,
  MOMENT,
  PROFITABLE,
  TRANSACTION_NOT_FOUND,
} from './transactions.constants';
import { UsersModule } from '../users/users.module';
import { BanksModule } from '../banks/banks.module';
import { StatisticsModule } from '../statistics/statistics.module';
import { TransactionsService } from './transactions.service';
import { CreateUserDto } from '../users/dto/create.dto';
import { NotFoundException } from '@nestjs/common';
import { USER_NOT_FOUND } from '../users/users.constanst';

describe('TransactionsService', () => {
  let transactionsRepository: Repository<Transaction>;
  let banksRepository: Repository<Bank>;
  let userRepository: Repository<User>;
  let transactionsService: TransactionsService;
  let module: TestingModule;

  const mockTransaction: CreateTransactionDto = {
    amount: 300,
    bank: 1,
    categoryIds: [1, 2],
    type: PROFITABLE,
    createdAt: '2023-02-25',
  };
  const mockTransaction2: CreateTransactionDto = {
    amount: 100,
    bank: 1,
    categoryIds: [1, 2],
    type: CONSUMABLE,
    createdAt: '2023-02-25',
  };
  const mockTransaction3: CreateTransactionDto = {
    amount: 200,
    bank: 1,
    categoryIds: [1, 2],
    type: PROFITABLE,
    createdAt: '2023-02-26',
  };
  const mockTransaction4: CreateTransactionDto = {
    amount: 200,
    bank: 1,
    categoryIds: [1, 2],
    type: CONSUMABLE,
    createdAt: '2023-02-26',
  };

  const mockBank: CreateBankDto = {
    name: 'testBank',
  };
  const mockUser: CreateUserDto = {
    username: 'test',
    password: 'test',
    email: 'test@gmail.com',
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Transaction, Statistic, Category, Bank, User],
          synchronize: true,
          logging: false,
        }),
        TypeOrmModule.forFeature([
          Transaction,
          Statistic,
          Category,
          Bank,
          User,
        ]),
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
    }).compile();

    transactionsService = module.get<TransactionsService>(TransactionsService);
    transactionsRepository = module.get<Repository<Transaction>>(
      getRepositoryToken(Transaction),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    banksRepository = module.get<Repository<Bank>>(getRepositoryToken(Bank));
  });

  describe('FindOne', () => {
    it('should return object by id', async () => {
      const user = await userRepository.save(mockUser);
      const bank = await banksRepository.save({ ...mockBank, user: user.id });
      const transaction = await transactionsRepository.save(mockTransaction);

      await expect(
        transactionsService.findOne(transaction.id),
      ).resolves.toEqual({
        amount: transaction.amount,
        type: transaction.type,
        createdAt: transaction.createdAt,
        id: 1,
        bank: {
          id: bank.id,
          balance: bank.balance,
          name: bank.name,
        },
      });
    });
  });

  describe('FindAll', () => {
    it('should return array of transactions by userId skip one, limit 2', async () => {
      const user = await userRepository.save(mockUser);
      const bank = await banksRepository.save({ ...mockBank, user: user.id });
      const transaction = await transactionsRepository.save(mockTransaction);
      const transaction2 = await transactionsRepository.save(mockTransaction2);
      const transaction3 = await transactionsRepository.save(mockTransaction3);
      const transaction4 = await transactionsRepository.save(mockTransaction4);

      await expect(transactionsService.findAll(user.id, 1, 2)).resolves.toEqual(
        [
          {
            amount: transaction3.amount,
            type: transaction3.type,
            createdAt: transaction3.createdAt,
            id: transaction3.id,
          },
          {
            amount: transaction2.amount,
            type: transaction2.type,
            createdAt: transaction2.createdAt,
            id: transaction2.id,
          },
        ],
      );
    });
  });

  describe('Delete', () => {
    it('should reject with error if transaction not found', async () => {
      await expect(transactionsService.delete(100)).rejects.toEqual(
        new NotFoundException(TRANSACTION_NOT_FOUND),
      );
    });

    it('should decrement/increment balance in bank depend of type transaction', async () => {
      const user = await userRepository.save(mockUser);
      const transaction = await transactionsRepository.save(mockTransaction);
      const bank = await banksRepository.save({
        ...mockBank,
        user: user.id,
        balance: transaction.amount,
      });

      await transactionsService.delete(transaction.id);

      await expect(
        (
          await banksRepository.findOneBy({ id: bank.id })
        ).balance,
      ).toEqual(0);
    });
  });

  describe('Create', () => {
    it('should create new transaction by user and user`s bank', async () => {
      const user = await userRepository.save(mockUser);
      const bank = await banksRepository.save({ ...mockBank, user: user.id });

      await expect(
        transactionsService.create(user.id, mockTransaction),
      ).resolves.toMatchObject({
        ...mockTransaction,
        createdAt: '2023-02-27',
        bank: bank.id,
      });
    });

    it('should reject with error if user not found', async () => {
      await expect(
        transactionsService.create(5, mockTransaction),
      ).rejects.toEqual(new NotFoundException(USER_NOT_FOUND));
    });

    it('should be decrement/increment balance in bank depend of type transaction', async () => {
      const user = await userRepository.save(mockUser);
      const bank = await banksRepository.save({
        ...mockBank,
        user: user.id,
      });
      await transactionsService.create(user.id, mockTransaction);

      expect(
        (await banksRepository.findOneBy({ id: bank.id })).balance,
      ).toEqual(300);
    });
  });

  afterAll(async () => {
    module.close();
  });
});
