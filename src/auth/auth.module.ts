import * as moment from 'moment';
import * as bcrypt from 'bcrypt';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';
import { BCRYPT, MOMENT } from './auth.constants';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from 'src/users/entity/users.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('jwt.jwtSecret'),
          signOptions: {
            expiresIn: configService.get<number>('jwt.jwtExpiresInt'),
          },
        };
      },
      inject: [ConfigService],
    }),
    PassportModule,
    ConfigModule,
    UsersModule,
  ],
  providers: [
    {
      provide: MOMENT,
      useValue: moment,
    },
    {
      provide: BCRYPT,
      useValue: bcrypt,
    },
    AuthService,
    JwtStrategy,
    LocalStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
