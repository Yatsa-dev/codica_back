import * as bcrypt from 'bcrypt';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BCRYPT } from './users.constanst';
import { UsersService } from './users.service';
import { User } from './entity/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ConfigModule],
  providers: [
    {
      provide: BCRYPT,
      useValue: bcrypt,
    },
    UsersService,
  ],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
