const TelegramBot = require('node-telegram-bot-api');

// ОСЫ ЖЕРЛЕРДІ ӨЗГЕРТ:
const TOKEN = '8673435121:AAE3dl1MLPNc1V7lss4_ygeGmu5eZQXP0bQ'; 
const MY_ID = 7594678193 ; // @userinfobot-тан алған ID-ің
const DB_URL = "https://antitheftbot-1cdf7-default-rtdb.firebaseio.com/status.json";

const bot = new TelegramBot(TOKEN, {polling: true});
console.log("Бот күзетте тұр...");

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    if (chatId !== MY_ID) {
        bot.sendMessage(chatId, "Рұқсат жоқ! ❌");
        return;
    }

    if (msg.text === '/stolen') {
        await fetch(DB_URL, { method: 'PUT', body: JSON.stringify("STOLEN") });
        bot.sendMessage(chatId, "⚠️ ТЕЛЕФОН БЛОКТАЛДЫ!");
    }

    if (msg.text === '/safe') {
        await fetch(DB_URL, { method: 'PUT', body: JSON.stringify("SAFE") });
        bot.sendMessage(chatId, "✅ БЛОК ШЕШІЛДІ.");
    }
});

