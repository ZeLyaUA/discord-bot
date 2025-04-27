// src/discord/discord.service.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, GatewayIntentBits, Guild, Message } from 'discord.js';
import { HelpCommand } from './commands/help.command';
import { PingCommand } from './commands/ping.command';
import { Command } from './interfaces/command.interface';

@Injectable()
export class DiscordService implements OnModuleInit {
  private readonly logger = new Logger(DiscordService.name);
  private client: Client;
  private commands: Map<string, Command> = new Map();
  private readonly prefix: string;

  constructor(private configService: ConfigService) {
    this.prefix = this.configService.get<string>('DISCORD_PREFIX') || '!';
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
      ],
    });

    this.registerCommands();
  }

  async onModuleInit() {
    await this.initializeBot();
  }

  private registerCommands() {
    const pingCommand = new PingCommand();
    this.commands.set(pingCommand.name, pingCommand);

    const helpCommand = new HelpCommand(this.commands);
    this.commands.set(helpCommand.name, helpCommand);
  }

  private async initializeBot() {
    const token = this.configService.get<string>('DISCORD_TOKEN');
    if (!token) {
      this.logger.error(
        'DISCORD_TOKEN is not defined in environment variables',
      );
      return;
    }

    this.client.on('ready', () => {
      this.logger.log(`Logged in as ${this.client.user?.tag}`);
    });

    this.client.on('messageCreate', (message: Message) => {
      void (async () => {
        if (message.author.bot) return;
        if (!message.content.startsWith(this.prefix)) return;

        const args = message.content
          .slice(this.prefix.length)
          .trim()
          .split(/ +/);
        const commandName = args.shift()?.toLowerCase();

        if (!commandName) return;

        const command = this.commands.get(commandName);
        if (!command) return;

        try {
          await command.execute(message, args);
        } catch (error) {
          this.logger.error(`Error executing command ${commandName}:`, error);
          await message.reply('There was an error executing that command!');
        }
      })();
    });

    try {
      await this.client.login(token);
    } catch (error) {
      this.logger.error('Failed to login to Discord:', error);
    }
  }

  getClient(): Client {
    return this.client;
  }

  getGuilds(): Guild[] {
    return Array.from(this.client.guilds.cache.values());
  }
}
