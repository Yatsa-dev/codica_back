import { BadRequestException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import configuration from '../config/configuration';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create.dto';
import { User } from './entity/users.entity';
import { BCRYPT, USER_EXIST } from './users.constanst';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let userRepository: Repository<User>;
  let userService: UsersService;
  let hash: any;
  let module: TestingModule;

  const mockHash = 'dasdadawq23r23';
  const mockUser: CreateUserDto = {
    username: 'test',
    password: 'test',
    email: 'test@gmail.com',
  };
  const mockUser2: CreateUserDto = {
    username: 'test2',
    password: 'test2',
    email: 'test2@gmail.com',
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User],
          logging: false,
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User]),
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration],
        }),
      ],
      providers: [
        {
          provide: BCRYPT,
          useValue: { hash: jest.fn() },
        },
        UsersService,
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    hash = module.get(BCRYPT);
  });

  describe('Create', () => {
    it('should reject with error if username exist in db', async () => {
      await userRepository.save(mockUser);

      await expect(userService.create(mockUser)).rejects.toEqual(
        new BadRequestException(USER_EXIST),
      );
    });

    it('should be created new user', async () => {
      jest.spyOn(hash, 'hash').mockResolvedValueOnce(mockHash);

      expect(
        userService.create({ ...mockUser, password: mockHash }),
      ).resolves.toEqual({ ...mockUser, password: mockHash });
    });
  });

  describe('FindByUserName', () => {
    it('should return user object', async () => {
      const user = await userRepository.save(mockUser);

      await expect(userService.findByUserName(user.username)).resolves.toEqual(
        user,
      );
    });
  });

  describe('FindById', () => {
    it('should return user object', async () => {
      const user = await userRepository.save(mockUser);

      await expect(userService.findById(user.id)).resolves.toEqual(user);
    });
  });

  describe('Find', () => {
    it('should return array of users', async () => {
      const user = await userRepository.save(mockUser);
      const user2 = await userRepository.save(mockUser2);

      await expect(userService.find()).resolves.toEqual([user, user2]);
    });
  });

  afterAll(async () => {
    module.close();
  });
});
