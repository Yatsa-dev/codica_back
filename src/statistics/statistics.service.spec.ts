import * as moment from 'moment';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../transactions/entity/transaction.entity';
import { Statistic } from './entity/statistics.entity';
import { StatisticsService } from './statistics.service';
import { MOMENT } from './statistics.constants';
import { CreateCategoryDto } from '../categories/dto/create.dto';
import { CreateTransactionDto } from '../transactions/dto/create.dto';
import { CONSUMABLE, PROFITABLE } from '../transactions/transactions.constants';
import { Category } from '../categories/entity/category.entity';
import { Bank } from '../banks/entity/bank.entity';
import { User } from '../users/entity/users.entity';
import { CreateBankDto } from '../banks/dto/create.dto';
import { CreateUserDto } from '../users/dto/create.dto';
import { QueryFilter } from '../transactions/dto/filter.dto';
import { CategoriesModule } from '../categories/categories.module';
import { TransactionsService } from '../transactions/transactions.service';
import { TransactionsModule } from '../transactions/transactions.module';

describe('StatisticsService', () => {
  let transactionsService: TransactionsService;
  let transactionsRepository: Repository<Transaction>;
  let categoryRepository: Repository<Category>;
  let banksRepository: Repository<Bank>;
  let userRepository: Repository<User>;
  let statisticsService: StatisticsService;
  let module: TestingModule;

  const mockCategory: CreateCategoryDto = {
    name: 'auto',
  };
  const mockCategory2: CreateCategoryDto = {
    name: 'sport',
  };

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
        CategoriesModule,
        TransactionsModule,
      ],
      providers: [
        {
          provide: MOMENT,
          useValue: moment,
        },
        StatisticsService,
      ],
    }).compile();

    statisticsService = module.get<StatisticsService>(StatisticsService);
    transactionsRepository = module.get<Repository<Transaction>>(
      getRepositoryToken(Transaction),
    );
    categoryRepository = module.get<Repository<Category>>(
      getRepositoryToken(Category),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    banksRepository = module.get<Repository<Bank>>(getRepositoryToken(Bank));
    transactionsService = module.get<TransactionsService>(TransactionsService);
  });

  describe('Create', () => {
    it('should create new object', async () => {
      const category = await categoryRepository.save(mockCategory);
      const transaction = await transactionsRepository.save(mockTransaction);

      const result = {
        transaction: transaction.id,
        category: category.id,
        id: 1,
      };

      await expect(
        statisticsService.create({
          transaction: transaction.id,
          category: category.id,
        }),
      ).resolves.toMatchObject(result);
    });
  });

  describe('GetStatistics', () => {
    it('should return object with list categories and value to them', async () => {
      const user = await userRepository.save(mockUser);
      const bank = await banksRepository.save({ ...mockBank, user: user.id });

      const category = await categoryRepository.save(mockCategory);
      const category2 = await categoryRepository.save(mockCategory2);

      await transactionsService.create(user.id, mockTransaction);
      await transactionsService.create(user.id, mockTransaction2);
      await transactionsService.create(user.id, mockTransaction3);
      await transactionsService.create(user.id, mockTransaction4);

      const query: QueryFilter = { categoryIds: [1, 2] };

      await expect(
        statisticsService.getStatistics(user.id, query),
      ).resolves.toEqual({ [category.name]: 200, [category2.name]: 200 });
    });
  });

  afterAll(async () => {
    module.close();
  });
});
