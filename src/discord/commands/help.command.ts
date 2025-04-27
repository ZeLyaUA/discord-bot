import { EmbedBuilder, Message } from 'discord.js';
import { Command } from '../interfaces/command.interface';

export class HelpCommand implements Command {
  name = 'help';
  description = 'Lists all available commands';

  constructor(private commands: Map<string, Command>) {}

  async execute(message: Message): Promise<void> {
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Available Commands')
      .setDescription('Here are all the available commands:');

    this.commands.forEach((command) => {
      embed.addFields({
        name: `!${command.name}`,
        value: command.description,
      });
    });

    await message.reply({ embeds: [embed] });
  }
}
