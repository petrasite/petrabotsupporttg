const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_ID = process.env.ADMIN_ID; // укажи свой TG ID в .env

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

const userMessages = {}; // userId -> lastMessageId

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Пользователь — пересылаем админу
  if (String(chatId) !== ADMIN_ID) {
    userMessages[chatId] = msg.message_id;
    bot.sendMessage(ADMIN_ID, `📩 Сообщение от ${chatId}:\n${text}`);
  } else {
    // Админ — проверяем команду
    const match = text.match(/^\/ответ (\d+) (.+)/);

    if (match) {
      const targetId = match[1];
      const replyText = match[2];

      bot.sendMessage(targetId, `💬 Ответ от поддержки:\n${replyText}`)
        .then(() => {
          bot.sendMessage(ADMIN_ID, `✅ Ответ отправлен пользователю ${targetId}`);
        })
        .catch((err) => {
          bot.sendMessage(ADMIN_ID, `❌ Ошибка при отправке ответа: ${err.message}`);
        });
    } else {
      bot.sendMessage(ADMIN_ID, `⚠️ Неверный формат. Используй:\n/ответ ID сообщение`);
    }
  }
});

// Express-заглушка (для Render)
app.get('/', (req, res) => {
  res.send('Бот работает.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущен на http://localhost:${PORT}`));
