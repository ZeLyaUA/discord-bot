// src/categories/categories.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoryDto, CreateCategoryDto } from './dto/category.dto';

@Controller('api/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get(':guildId')
  async getAllCategories(
    @Param('guildId') guildId: string,
  ): Promise<CategoryDto[]> {
    return await this.categoriesService.getAllCategories(guildId);
  }

  @Post(':guildId')
  async createCategory(
    @Param('guildId') guildId: string,
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryDto> {
    return await this.categoriesService.createCategory(
      guildId,
      createCategoryDto,
    );
  }

  @Put(':guildId/:categoryId')
  async updateCategory(
    @Param('guildId') guildId: string,
    @Param('categoryId') categoryId: string,
    @Body() updateCategoryDto: CreateCategoryDto,
  ): Promise<CategoryDto> {
    return await this.categoriesService.updateCategory(
      guildId,
      categoryId,
      updateCategoryDto,
    );
  }

  @Delete(':guildId/:categoryId')
  async deleteCategory(
    @Param('guildId') guildId: string,
    @Param('categoryId') categoryId: string,
  ): Promise<void> {
    return await this.categoriesService.deleteCategory(guildId, categoryId);
  }
}
