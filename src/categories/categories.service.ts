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

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoriesRepository.save(createCategoryDto);
  }

  async update(
    categoryId: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<{ success: boolean }> {
    await this.categoriesRepository.update(
      { id: categoryId },
      updateCategoryDto,
    );
    return { success: true };
  }

  async findOne(categoryId: number): Promise<Category> {
    return this.categoriesRepository.findOneBy({ id: categoryId });
  }

  async findAll(): Promise<Category[]> {
    return this.categoriesRepository.find();
  }

  async delete(categoryId: number): Promise<{ success: boolean }> {
    await this.categoriesRepository.delete({ id: categoryId });
    return { success: true };
  }
}
