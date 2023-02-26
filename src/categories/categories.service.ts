import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create.dto';
import { UpdateCategoryDto } from './dto/update.dto';
import { Category } from './entity/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return this.categoriesRepository.save(createCategoryDto);
  }

  async update(categoryId: number, updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesRepository.update(
      { id: categoryId },
      updateCategoryDto,
    );
  }

  async findOne(categoryId: number) {
    return this.categoriesRepository.findOneBy({ id: categoryId });
  }

  async findAll() {
    return this.categoriesRepository.find();
  }

  async delete(categoryId: number) {
    return this.categoriesRepository.delete({ id: categoryId });
  }
}
