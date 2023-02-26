import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PayloadDto } from 'src/auth/dto/payload.dto';
import { User } from 'src/decorators/user.decorator';
import { QueryFilter } from 'src/transactions/dto/filter.dto';
import { StatisticsService } from './statistics.service';

@ApiTags('stats')
@Controller('stats')
export class StatisticsController {
  constructor(private statisticsService: StatisticsService) {}

  @ApiUnauthorizedResponse()
  @ApiResponse({
    status: 200,
    description: 'Return `{ category: value, category: value }`',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get()
  getStatistics(@User() user: PayloadDto, @Query() query: QueryFilter) {
    return this.statisticsService.getStatistics(user.userId, query);
  }
}
