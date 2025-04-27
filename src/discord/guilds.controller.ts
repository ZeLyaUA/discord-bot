// src/discord/guilds.controller.ts
import { Controller, Get } from '@nestjs/common';
import { DiscordService } from './discord.service';

@Controller('api/guilds')
export class GuildsController {
  constructor(private readonly discordService: DiscordService) {}

  @Get()
  getGuilds() {
    const guilds = this.discordService.getGuilds();
    return guilds.map((guild) => ({
      id: guild.id,
      name: guild.name,
      icon: guild.iconURL(),
      memberCount: guild.memberCount,
    }));
  }
}
