const TelegramBot = require('node-telegram-bot-api');

const TOKEN = '8673435121:AAE3dl1MLPNc1V7lss4_ygeGmu5eZQXP0bQ'; 
const MY_ID = 7594678193; 
const DB_URL = "https://antitheftbot-1cdf7-default-rtdb.firebaseio.com/devices";

const bot = new TelegramBot(TOKEN, {polling: true});

console.log("✅ Бот іске қосылды! Команда күтілуде...");

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (chatId !== MY_ID) {
        bot.sendMessage(chatId, "Рұқсат жоқ! ❌");
        return;
    }

    if (text === '/start') {
        bot.sendMessage(chatId, "Сәлем, Алмас! 🛡️\n\nБасқару командалары:\n/list - Құрылғыларды көру\n/stolen ID - Блоктау (мысалы: /stolen 01)\n/safe ID - Ашу (мысалы: /safe 01)");
    }

    if (text === '/list') {
        try {
            const res = await fetch(`${DB_URL}.json`);
            const data = await res.json();
            
            if (!data) {
                bot.sendMessage(chatId, "📭 Тізім бос. Әлі ешқандай телефон базаға қосылмаған.");
                return;
            }

            let list = "📱 Тіркелген құрылғылар:\n\n";
            for (let id in data) {
                const info = data[id].info || {name: "Unknown", lastSeen: "N/A"};
                const status = data[id].status || "SAFE";
                list += `🆔 ID: ${id}\n📱 Модель: ${info.name}\n⏰ Онлайн: ${info.lastSeen}\n🚨 Статус: ${status}\n\n`;
            }
            bot.sendMessage(chatId, list);
        } catch (e) {
            bot.sendMessage(chatId, "❌ Базадан дерек алу мүмкін болмады.");
        }
    }

    if (text.startsWith('/stolen ')) {
        const id = text.split(' ')[1];
        await fetch(`${DB_URL}/${id}/status.json`, { method: 'PUT', body: JSON.stringify("STOLEN") });
        bot.sendMessage(chatId, `⚠️ Құрылғы ${id} БЛОКТАЛДЫ!`);
    }

    if (text.startsWith('/safe ')) {
        const id = text.split(' ')[1];
        await fetch(`${DB_URL}/${id}/status.json`, { method: 'PUT', body: JSON.stringify("SAFE") });
        bot.sendMessage(chatId, `✅ Құрылғы ${id} БҰҒАТТАН ШЫҒАРЫЛДЫ.`);
    }
});

