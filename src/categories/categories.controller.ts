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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create.dto';
import { UpdateCategoryDto } from './dto/update.dto';
import { Category } from './entity/category.entity';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @ApiUnauthorizedResponse()
  @ApiOkResponse({ type: Category })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.create(createCategoryDto);
  }

  @ApiUnauthorizedResponse()
  @ApiResponse({ status: 200, description: 'Return `{success: true}`' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':categoryId')
  update(
    @Param('categoryId') categoryId: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<{ success: boolean }> {
    return this.categoriesService.update(categoryId, updateCategoryDto);
  }

  @ApiUnauthorizedResponse()
  @ApiOkResponse({ type: [Category] })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('all')
  findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @ApiUnauthorizedResponse()
  @ApiOkResponse({ type: Category })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':categoryId')
  findOne(@Param('categoryId') categoryId: number): Promise<Category> {
    return this.categoriesService.findOne(categoryId);
  }

  @ApiUnauthorizedResponse()
  @ApiResponse({ status: 200, description: 'Return `{success: true}`' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':categoryId')
  delete(
    @Param('categoryId') categoryId: number,
  ): Promise<{ success: boolean }> {
    return this.categoriesService.delete(categoryId);
  }
}
