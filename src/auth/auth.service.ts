import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import {
  BCRYPT,
  INVALID_CREDENTIALS,
  INVALID_REFRESH_TOKEN,
  MOMENT,
  WRONG_PASSWORD,
} from './auth.constants';
import { RefreshToken } from './entity/refreshToken.entity';

import { LoginResponseDto } from './dto/loginResponse.dto';
import { UsersService } from 'src/users/users.service';
import { PayloadDto } from './dto/payload.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(MOMENT) private moment,
    @Inject(BCRYPT) private bcrypt,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(RefreshToken)
    private refreshRepository: Repository<RefreshToken>,
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

  async createRefreshToken(userId: number): Promise<RefreshToken> {
    const refreshToken = await this.refreshRepository.save({
      createdAt: new Date(),
      userId,
    });

    return refreshToken;
  }

  async findRefreshTokenById(tokenId: string): Promise<RefreshToken> {
    const token = await this.refreshRepository.findOneBy({ id: tokenId });

    return token;
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.usersService.findByUserName(loginDto.username);

    const payload: PayloadDto = {
      userId: user.id,
      username: user.username,
    };

    const refreshToken = await this.createRefreshToken(user.id);

    return {
      access_token: this.jwtService.sign(payload),
      expires_at: this.moment()
        .add(this.configService.get<number>('jwt.jwtExpiresInt'), 'seconds')
        .unix(),
      refresh_token: refreshToken.id,
    };
  }

  async refresh(token: string): Promise<LoginResponseDto> {
    const refreshToken = await this.findRefreshTokenById(token);

    if (!refreshToken) {
      throw new BadRequestException(INVALID_REFRESH_TOKEN);
    }

    const user = await this.usersService.findById(refreshToken.userId);

    return this.login({ username: user.username, password: user.password });
  }

  async logout(userId: number): Promise<{ success: boolean }> {
    await this.refreshRepository.delete({ userId });

    return { success: true };
  }
}
