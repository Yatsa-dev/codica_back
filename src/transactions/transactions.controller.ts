import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Delete, Param, Query } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { PayloadDto } from 'src/auth/dto/payload.dto';
import { User } from 'src/decorators/user.decorator';
import { CreateTransactionDto } from './dto/create.dto';
import { PaginationParamsDto } from './dto/paginations.dto';
import { Transaction } from './entity/transaction.entity';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('webhook')
  @UsePipes(new ValidationPipe())
  create(
    @User() user: PayloadDto,
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    return this.transactionsService.create(user.userId, createTransactionDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  @Get('all')
  find(
    @User() user: PayloadDto,
    @Query() { offset, limit }: PaginationParamsDto,
  ): Promise<Transaction[]> {
    return this.transactionsService.findAll(user.userId, offset, limit);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':transactionId')
  delete(
    @Param('transactionId') transactionId: number,
  ): Promise<{ success: boolean }> {
    return this.transactionsService.delete(transactionId);
  }
}
