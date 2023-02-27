import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create.dto';
import { UpdateCategoryDto } from './dto/update.dto';
import { Category } from './entity/category.entity';

describe('CategoriesService', () => {
  let categoriesService: CategoriesService;
  let categoriesRepository: Repository<Category>;
  let module: TestingModule;

  const mockCategory: CreateCategoryDto = {
    name: 'auto',
  };
  const mockCategory2: CreateCategoryDto = {
    name: 'sport',
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Category],
          synchronize: true,
          logging: false,
        }),
        TypeOrmModule.forFeature([Category]),
      ],
      providers: [CategoriesService],
    }).compile();

    categoriesService = module.get<CategoriesService>(CategoriesService);
    categoriesRepository = module.get<Repository<Category>>(
      getRepositoryToken(Category),
    );
  });

  describe('Create', () => {
    it('should create new object', async () => {
      expect(categoriesService.create(mockCategory)).resolves.toMatchObject(
        mockCategory,
      );
    });
  });

  describe('Update', () => {
    it('should update name', async () => {
      const category = await categoriesService.create(mockCategory);
      const newName: UpdateCategoryDto = {
        name: 'newCategoryName',
      };
      await categoriesService.update(category.id, newName);

      expect(
        (await categoriesRepository.findOneBy({ id: category.id })).name,
      ).toEqual(newName.name);
    });
  });

  describe('FindOne', () => {
    it('should return bank object by id', async () => {
      const category = await categoriesService.create(mockCategory);

      expect(categoriesService.findOne(category.id)).resolves.toEqual({
        name: category.name,
        id: category.id,
      });
    });
  });

  describe('FindAll', () => {
    it('should return array of banks by user id', async () => {
      const category = await categoriesService.create(mockCategory);
      const category2 = await categoriesService.create(mockCategory2);

      expect(categoriesService.findAll()).resolves.toEqual([
        {
          name: category.name,
          id: category.id,
        },
        {
          name: category2.name,
          id: category2.id,
        },
      ]);
    });
  });

  describe('Delete', () => {
    it('should delete bank object by id', async () => {
      const category = await categoriesService.create(mockCategory);
      await categoriesService.delete(category.id);

      expect(
        categoriesRepository.findOneBy({ id: category.id }),
      ).resolves.toEqual(null);
    });
  });

  afterAll(async () => {
    module.close();
  });
});
