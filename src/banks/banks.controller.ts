import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
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
import { BanksService } from './banks.service';
import { CreateBankDto } from './dto/create.dto';
import { UpdateBankDto } from './dto/update.dto';
import { Bank } from './entity/bank.entity';

@ApiTags('banks')
@Controller('banks')
export class BanksController {
  constructor(private banksService: BanksService) {}

  @ApiUnauthorizedResponse()
  @ApiOkResponse({ type: Bank })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  create(
    @User() user: PayloadDto,
    @Body() createBankDto: CreateBankDto,
  ): Promise<Bank> {
    return this.banksService.create(user.userId, createBankDto);
  }

  @ApiUnauthorizedResponse()
  @ApiResponse({ status: 200, description: 'Return `{success: true}`' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':bankId')
  update(
    @Param('bankId') bankId: number,
    @Body() updateBankDto: UpdateBankDto,
  ): Promise<{ success: boolean }> {
    return this.banksService.update(bankId, updateBankDto);
  }

  @ApiUnauthorizedResponse()
  @ApiBearerAuth()
  @ApiOkResponse({ type: [Bank] })
  @UseGuards(AuthGuard('jwt'))
  @Get('all')
  findAll(@User() user: PayloadDto): Promise<Bank[]> {
    return this.banksService.findAll(user.userId);
  }

  @ApiUnauthorizedResponse()
  @ApiOkResponse({ type: Bank })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':bankId')
  findOne(@Param('bankId') bankId: number): Promise<Bank> {
    return this.banksService.findOne(bankId);
  }

  @ApiUnauthorizedResponse()
  @ApiResponse({ status: 200, description: 'Return `{success: true}`' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':bankId')
  delete(@Param('bankId') bankId: number): Promise<{ success: boolean }> {
    return this.banksService.delete(bankId);
  }
}
