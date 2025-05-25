require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const requests = {};

bot.on('message', msg => {
  if (msg.text.startsWith('/reply')) return;

  const code = 'Q' + Math.floor(1000 + Math.random() * 9000);

  requests[code] = {
    chatId: msg.chat.id,
    user: msg.from.first_name || 'Без имени',
    text: msg.text
  };

  bot.sendMessage(process.env.ADMIN_ID, `📩 Новый вопрос от ${requests[code].user}:\n"${msg.text}"\nКод: ${code}`);
  bot.sendMessage(msg.chat.id, `✅ Ваш вопрос принят!\nКод: ${code}\nОжидайте ответа.`);
});

bot.onText(/\/reply (\w+) (.+)/, (msg, match) => {
  const code = match[1];
  const answer = match[2];

  if (requests[code]) {
    const targetId = requests[code].chatId;
    bot.sendMessage(targetId, `💬 Ответ от поддержки:\n${answer}`);
    bot.sendMessage(msg.chat.id, `✅ Ответ по коду ${code} отправлен.`);
  } else {
    bot.sendMessage(msg.chat.id, `❌ Код ${code} не найден.`);
  }
});
