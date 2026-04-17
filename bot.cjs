const TelegramBot = require('node-telegram-bot-api');
const TOKEN = '8673435121:AAE3dl1MLPNc1V7lss4_ygeGmu5eZQXP0bQ';
const MY_ID = 7594678193;
const DB_URL = "https://antitheftbot-1cdf7-default-rtdb.firebaseio.com/devices";

const bot = new TelegramBot(TOKEN, {polling: true});
console.log("🛡️ Басқару орталығы қосылды...");

bot.on('message', async (msg) => {
    if (msg.chat.id !== MY_ID) return;
    const text = msg.text;

    if (text === '/list') {
        const res = await fetch(`${DB_URL}.json`);
        const data = await res.json();
        let message = "📱 Қосулы құрылғылар:\n\n";
        for (let id in data) {
            message += `🆔 ID: ${id}\n📱 Модель: ${data[id].info.name}\n⏰ Соңғы рет: ${data[id].info.lastSeen}\n🚨 Статус: ${data[id].status}\n\n`;
        }
        bot.sendMessage(MY_ID, message || "Құрылғылар жоқ.");
    }

    if (text.startsWith('/stolen ')) {
        const id = text.split(' ')[1];
        await fetch(`${DB_URL}/${id}/status.json`, { method: 'PUT', body: JSON.stringify("STOLEN") });
        bot.sendMessage(MY_ID, `🔴 Құрылғы ${id} БҰҒАТТАЛДЫ.`);
    }

    if (text.startsWith('/safe ')) {
        const id = text.split(' ')[1];
        await fetch(`${DB_URL}/${id}/status.json`, { method: 'PUT', body: JSON.stringify("SAFE") });
        bot.sendMessage(MY_ID, `🟢 Құрылғы ${id} АШЫЛДЫ.`);
    }
});

