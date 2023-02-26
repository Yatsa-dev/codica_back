import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create.dto';
import { User } from './entity/users.entity';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOkResponse({ type: User })
  @Post('signup')
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @ApiUnauthorizedResponse()
  @ApiBearerAuth()
  @ApiOkResponse({ type: [User] })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  finAll(): Promise<User[]> {
    return this.usersService.find();
  }
}
