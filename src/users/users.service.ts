import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create.dto';
import { User } from './entity/users.entity';
import { BCRYPT, USER_EXIST } from './users.constanst';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
    @Inject(BCRYPT) private bcrypt,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const isExist = await this.userRepository.findOneBy({
      username: createUserDto.username,
    });
    if (isExist) {
      throw new BadRequestException(USER_EXIST);
    }
    const hash = await this.bcrypt.hash(
      createUserDto.password,
      this.configService.get<number>('saltRounds'),
    );
    createUserDto.password = hash;

    const user = await this.userRepository.save(createUserDto);

    return user;
  }

  async findByUserName(username: string): Promise<User> {
    return this.userRepository.findOneBy({ username });
  }

  async findById(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  async find(): Promise<User[]> {
    return this.userRepository.find();
  }
}
