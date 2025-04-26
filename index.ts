// index.ts
import { Client, Events, GatewayIntentBits } from 'discord.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Когда бот готов
client.once(Events.ClientReady, c => {
  console.log(`✅ Бот запущен как ${c.user.tag}`);
});

// Простой ответ на сообщения
client.on(Events.MessageCreate, message => {
  // Игнорируем сообщения от ботов
  if (message.author.bot) return;

  // Отвечаем на "ping"
  if (message.content.toLowerCase() === 'ping') {
    message.reply('Pong! 🏓');
  }

  // Отвечаем на "привет"
  if (message.content.toLowerCase().includes('привет')) {
    message.reply('Привет! 👋');
  }
});

// Запуск бота (Bun автоматически подхватывает .env)
client.login(process.env.DISCORD_TOKEN);
