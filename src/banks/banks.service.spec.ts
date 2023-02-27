import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entity/users.entity';
import { BanksService } from './banks.service';
import { CreateBankDto } from './dto/create.dto';
import { UpdateBankDto } from './dto/update.dto';
import { Bank } from './entity/bank.entity';

describe('BanksService', () => {
  let banksRepository: Repository<Bank>;
  let banksService: BanksService;
  let module: TestingModule;
  const mockBank: CreateBankDto = {
    name: 'testBank',
  };
  const mockBank2: CreateBankDto = {
    name: 'testBank2',
  };
  const userId = 1;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Bank, User],
          synchronize: true,
          logging: false,
        }),
        TypeOrmModule.forFeature([Bank, User]),
      ],
      providers: [BanksService],
    }).compile();

    banksService = module.get<BanksService>(BanksService);
    banksRepository = module.get<Repository<Bank>>(getRepositoryToken(Bank));
  });

  describe('Create', () => {
    it('should create new object', async () => {
      expect(banksService.create(userId, mockBank)).resolves.toMatchObject(
        mockBank,
      );
    });
  });

  describe('Update', () => {
    it('should update name', async () => {
      const bank = await banksService.create(userId, mockBank);
      const newName: UpdateBankDto = {
        name: 'newBankName',
      };
      await banksService.update(bank.id, newName);

      expect((await banksRepository.findOneBy({ id: bank.id })).name).toEqual(
        newName.name,
      );
    });
  });

  describe('FindOne', () => {
    it('should return bank object by id', async () => {
      const bank = await banksService.create(userId, mockBank);

      expect(banksService.findOne(bank.id)).resolves.toEqual({
        name: bank.name,
        id: bank.id,
        balance: bank.balance,
      });
    });
  });

  describe('FindAll', () => {
    it('should return array of banks by user id', async () => {
      const bank = await banksService.create(userId, mockBank);
      const bank2 = await banksService.create(userId, mockBank2);

      expect(banksService.findAll(userId)).resolves.toEqual([
        {
          name: bank.name,
          id: bank.id,
          balance: bank.balance,
        },
        {
          name: bank2.name,
          id: bank2.id,
          balance: bank2.balance,
        },
      ]);
    });
  });

  describe('Delete', () => {
    it('should delete bank object by id', async () => {
      const bank = await banksService.create(userId, mockBank);
      await banksService.delete(bank.id);

      expect(banksRepository.findOneBy({ id: bank.id })).resolves.toEqual(null);
    });
  });

  describe('IncrementBalance', () => {
    it('should increment balaance in bank object by id', async () => {
      const bank = await banksService.create(userId, mockBank);
      await banksService.incrementBalance(bank.id, 500);

      expect(
        await (
          await banksRepository.findOneBy({ id: bank.id })
        ).balance,
      ).toEqual(500);
    });
  });

  describe('DecrementBalance', () => {
    it('should decrement balaance in bank object by id', async () => {
      const bank = await banksService.create(userId, mockBank);
      await banksService.decrementBalance(bank.id, 500);

      expect(
        await (
          await banksRepository.findOneBy({ id: bank.id })
        ).balance,
      ).toEqual(-500);
    });
  });

  afterAll(async () => {
    module.close();
  });
});
