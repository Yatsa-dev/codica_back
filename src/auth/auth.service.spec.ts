import * as moment from 'moment';
import * as bcrypt from 'bcrypt';
import { ConfigModule } from '@nestjs/config';
import { Repository } from 'typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import configuration from '../config/configuration';
import { User } from '../users/entity/users.entity';
import { AuthService } from './auth.service';
import {
  BCRYPT,
  INVALID_CREDENTIALS,
  MOMENT,
  WRONG_PASSWORD,
} from './auth.constants';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create.dto';

describe('AuthService', () => {
  let userRepository: Repository<User>;
  let authService: AuthService;
  let userService: UsersService;
  let jwtService: JwtService;
  let module: TestingModule;

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
          entities: [User],
          logging: false,
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User]),
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration],
        }),
        JwtModule.registerAsync({
          useFactory: () => {
            return {
              secret: 'jwt.jwtSecret',
            };
          },
        }),
        UsersModule,
      ],
      providers: [
        AuthService,
        {
          provide: MOMENT,
          useValue: moment,
        },
        {
          provide: BCRYPT,
          useValue: bcrypt,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });
  describe('Validate', () => {
    it(`should reject with error if username wrong`, async () => {
      const username = 'undefined';
      const password = 'undefined';

      expect(authService.validateUser(username, password)).rejects.toEqual(
        new UnauthorizedException(INVALID_CREDENTIALS),
      );
    });

    it('should reject with error if password wrong', async () => {
      const user = await userService.create(mockUser);
      const wrongPassword = '12341234';
      expect(
        authService.validateUser(user.username, wrongPassword),
      ).rejects.toEqual(new UnauthorizedException(WRONG_PASSWORD));
    });

    it(`should check success validate`, async () => {
      const created = await userRepository.save({
        username: 'test',
        email: 'test@gmail.com',
        password:
          '$2a$10$dMojQPSEDuzWmPStL3DKM.8zNECVyxl4zMNfUB4lmWlN2sB2eT40u',
      });

      expect(
        authService.validateUser(created.username, 'test'),
      ).resolves.toMatchObject(mockUser);
    });
  });

  describe('Login', () => {
    it('should return valid credentials', async () => {
      const created = await userRepository.save(mockUser);

      const credentials = await authService.login(created);

      expect(credentials.access_token).toBeDefined();
      expect(credentials.expires_at).toBeDefined();

      const payload = await jwtService.decode(credentials.access_token);

      expect(payload).toMatchObject({
        userId: created.id,
        username: created.username,
      });
    });
  });
  afterAll(async () => {
    module.close();
  });
});
