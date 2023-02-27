import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Delete, Param, Query } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PayloadDto } from '../auth/dto/payload.dto';
import { User } from '../decorators/user.decorator';
import { CreateTransactionDto } from './dto/create.dto';
import { PaginationParamsDto } from './dto/paginations.dto';
import { Transaction } from './entity/transaction.entity';
import { TransactionsService } from './transactions.service';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @ApiUnauthorizedResponse()
  @ApiOkResponse({ type: Transaction })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('webhook')
  create(
    @User() user: PayloadDto,
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    return this.transactionsService.create(user.userId, createTransactionDto);
  }

  @ApiUnauthorizedResponse()
  @ApiOkResponse({ type: [Transaction] })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('all')
  find(
    @User() user: PayloadDto,
    @Query() { offset, limit }: PaginationParamsDto,
  ): Promise<Transaction[]> {
    return this.transactionsService.findAll(user.userId, offset, limit);
  }

  @ApiUnauthorizedResponse()
  @ApiResponse({ status: 200, description: 'Return `{success: true}`' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':transactionId')
  delete(
    @Param('transactionId') transactionId: number,
  ): Promise<{ success: boolean }> {
    return this.transactionsService.delete(transactionId);
  }
}
