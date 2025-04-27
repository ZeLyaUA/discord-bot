// src/discord/discord.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscordService } from './discord.service';
import { GuildsController } from './guilds.controller';

@Module({
  imports: [ConfigModule],
  controllers: [GuildsController],
  providers: [DiscordService],
  exports: [DiscordService],
})
export class DiscordModule {}
