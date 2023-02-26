import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PayloadDto } from 'src/auth/dto/payload.dto';
import { User } from 'src/decorators/user.decorator';
import { BanksService } from './banks.service';
import { CreateBankDto } from './dto/create.dto';
import { UpdateBankDto } from './dto/update.dto';

@Controller('banks')
export class BanksController {
  constructor(private banksService: BanksService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  @UsePipes(new ValidationPipe())
  create(@User() user: PayloadDto, @Body() createBankDto: CreateBankDto) {
    return this.banksService.create(user.userId, createBankDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':bankId')
  @UsePipes(new ValidationPipe())
  update(
    @Param('bankId') bankId: number,
    @Body() updateBankDto: UpdateBankDto,
  ) {
    return this.banksService.update(bankId, updateBankDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('all')
  findAll(@User() user: PayloadDto) {
    return this.banksService.findAll(user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':bankId')
  findOne(@Param('bankId') bankId: number) {
    return this.banksService.findOne(bankId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':bankId')
  delete(@Param('bankId') bankId: number) {
    return this.banksService.delete(bankId);
  }
}
