// src/categories/categories.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { CategoryChannel, ChannelType } from 'discord.js';
import { DiscordService } from '../discord/discord.service';
import { CategoryDto, ChannelDto, CreateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(private discordService: DiscordService) {}

  async getAllCategories(guildId: string): Promise<CategoryDto[]> {
    const client = this.discordService.getClient();
    const guild = await client.guilds.fetch(guildId);

    const categories: CategoryDto[] = guild.channels.cache
      .filter(
        (channel): channel is CategoryChannel =>
          channel.type === ChannelType.GuildCategory,
      )
      .map(
        (category): CategoryDto => ({
          id: category.id,
          name: category.name,
          position: category.position,
          channels: category.children.cache.map(
            (ch): ChannelDto => ({
              id: ch.id,
              name: ch.name,
              type: ChannelType[ch.type], // Используем строковое представление из enum
            }),
          ),
        }),
      );

    return categories;
  }

  async createCategory(
    guildId: string,
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryDto> {
    const client = this.discordService.getClient();
    const guild = await client.guilds.fetch(guildId);

    const category = await guild.channels.create({
      name: createCategoryDto.name,
      type: ChannelType.GuildCategory,
      position: createCategoryDto.position,
    });

    return {
      id: category.id,
      name: category.name,
      position: category.position,
      channels: [],
    };
  }

  async updateCategory(
    guildId: string,
    categoryId: string,
    updateCategoryDto: CreateCategoryDto,
  ): Promise<CategoryDto> {
    const client = this.discordService.getClient();
    const guild = await client.guilds.fetch(guildId);
    const category = guild.channels.cache.get(categoryId);

    if (!category || category.type !== ChannelType.GuildCategory) {
      throw new Error('Category not found');
    }

    await category.setName(updateCategoryDto.name);
    if (updateCategoryDto.position !== undefined) {
      await category.setPosition(updateCategoryDto.position);
    }

    const updatedCategory = category;

    return {
      id: updatedCategory.id,
      name: updatedCategory.name,
      position: updatedCategory.position,
      channels: updatedCategory.children.cache.map((ch) => ({
        id: ch.id,
        name: ch.name,
        type: ch.type.toString(),
      })),
    };
  }

  async deleteCategory(guildId: string, categoryId: string): Promise<void> {
    const client = this.discordService.getClient();
    const guild = await client.guilds.fetch(guildId);
    const category = guild.channels.cache.get(categoryId);

    if (!category || category.type !== ChannelType.GuildCategory) {
      throw new Error('Category not found');
    }

    await category.delete();
  }
}
