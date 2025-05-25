const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();

const BOT_TOKEN = '7856283741:AAHWGZz4fk0F2AU7auwsv82p_xeOtr7N9LM';
const ADMIN_ID = '1315029047';

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

const userMessages = {}; // userId: lastMessageId

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Если это пользователь — пересылаем админу
  if (chatId != ADMIN_ID) {
    userMessages[chatId] = msg.message_id;
    bot.sendMessage(ADMIN_ID, `Сообщение от ${chatId}:\n${text}`);
  } else {
    // Если это админ — парсим сообщение вида "/ответ 123456789 текст"
    const match = text.match(/^\/ответ (\d+) (.+)/);
    if (match) {
      const targetId = match[1];
      const replyText = match[2];
      bot.sendMessage(targetId, `Ответ поддержки:\n${replyText}`);
    }
  }
});

// Express (на случай, если хочешь подключить к сайту)
app.get('/', (req, res) => {
  res.send('Бот работает');
});

app.listen(3000, () => console.log('Сервер запущен на http://localhost:3000'));
