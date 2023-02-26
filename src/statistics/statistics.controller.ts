import {
  Controller,
  Get,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PayloadDto } from 'src/auth/dto/payload.dto';
import { User } from 'src/decorators/user.decorator';
import { QueryFilter } from 'src/transactions/dto/filter.dto';
import { StatisticsService } from './statistics.service';

@Controller('stats')
export class StatisticsController {
  constructor(private statisticsService: StatisticsService) {}

  // @UseGuards(AuthGuard('jwt'))
  // @UsePipes(new ValidationPipe())
  // @Get('statistics')
  // getStatistics(@User() user: PayloadDto, @Query() query: QueryFilter) {
  //   return this.statisticsService.getStatistics(user.userId, query);
  // }
}
