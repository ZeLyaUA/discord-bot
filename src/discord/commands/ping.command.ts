import { Message } from 'discord.js';
import { Command } from '../interfaces/command.interface';

export class PingCommand implements Command {
  name = 'ping';
  description = 'Replies with Pong!';

  async execute(message: Message): Promise<void> {
    const latency = Date.now() - message.createdTimestamp;
    await message.reply(`Pong! Latency: ${latency}ms`);
  }
}
