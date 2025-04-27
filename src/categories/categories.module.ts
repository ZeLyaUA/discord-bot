// src/categories/categories.module.ts
import { Module } from '@nestjs/common';
import { DiscordModule } from '../discord/discord.module';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

@Module({
  imports: [DiscordModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
