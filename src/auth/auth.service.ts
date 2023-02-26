import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto } from './dto/loginResponse.dto';
import { UsersService } from 'src/users/users.service';
import { PayloadDto } from './dto/payload.dto';
import { LoginDto } from './dto/login.dto';
import {
  BCRYPT,
  INVALID_CREDENTIALS,
  MOMENT,
  WRONG_PASSWORD,
} from './auth.constants';

@Injectable()
export class AuthService {
  constructor(
    @Inject(MOMENT) private moment,
    @Inject(BCRYPT) private bcrypt,
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUserName(username);
    if (!user) {
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    const passIsCorrect = await this.bcrypt.compare(password, user.password);

    if (!passIsCorrect) {
      throw new UnauthorizedException(WRONG_PASSWORD);
    }

    return user;
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.usersService.findByUserName(loginDto.username);

    const payload: PayloadDto = {
      userId: user.id,
      username: user.username,
    };

    return {
      access_token: this.jwtService.sign(payload),
      expires_at: this.moment()
        .add(this.configService.get<number>('jwt.jwtExpiresInt'), 'seconds')
        .unix(),
    };
  }
}
