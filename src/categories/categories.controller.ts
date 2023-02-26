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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create.dto';
import { UpdateCategoryDto } from './dto/update.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  @UsePipes(new ValidationPipe())
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':categoryId')
  @UsePipes(new ValidationPipe())
  update(
    @Param('categoryId') categoryId: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(categoryId, updateCategoryDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('all')
  findAll() {
    return this.categoriesService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':categoryId')
  findOne(@Param('categoryId') categoryId: number) {
    return this.categoriesService.findOne(categoryId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':categoryId')
  delete(@Param('categoryId') categoryId: number) {
    return this.categoriesService.delete(categoryId);
  }
}
