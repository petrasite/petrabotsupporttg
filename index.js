const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();

const token = process.env.BOT_TOKEN;
const adminId = process.env.ADMIN_ID;

const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
  if (msg.chat.id.toString() === adminId && msg.text.startsWith('/ответ')) {
    const parts = msg.text.split(' ');
    const targetId = parts[1];
    const reply = parts.slice(2).join(' ');
    bot.sendMessage(targetId, `Ответ модерации: ${reply}`);
  } else {
    bot.sendMessage(adminId, `Новый вопрос от ${msg.chat.id}:
${msg.text}`);
    bot.sendMessage(msg.chat.id, 'Ваш вопрос отправлен в поддержку. Ожидайте ответа.');
  }
});

app.get("/", (req, res) => res.send("Бот работает!"));
app.listen(3000);