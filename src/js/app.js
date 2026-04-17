import { Device } from '@capacitor/device';

const DB_URL = "https://antitheftbot-1cdf7-default-rtdb.firebaseio.com/devices";

async function startSystem() {
    try {
        // 1. Телефонның нақты атын және ID-ін алу
        const info = await Device.getInfo();
        const idInfo = await Device.getId();
        const DEVICE_ID = idInfo.identifier.substring(0, 6).toUpperCase();
        const DEVICE_NAME = `${info.manufacturer} ${info.model}`;

        // 2. Базамен байланыс орнату (әр 5 секунд сайын)
        setInterval(async () => {
            try {
                // Статусты тексеру (Бөгелген бе?)
                const res = await fetch(`${DB_URL}/${DEVICE_ID}/status.json`);
                const status = await res.json();

                // Онлайн екенін базаға айту
                await fetch(`${DB_URL}/${DEVICE_ID}/info.json`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        name: DEVICE_NAME,
                        lastSeen: new Date().toLocaleTimeString(),
                        status: status || "SAFE"
                    })
                });

                if (status === "STOLEN") {
                    showLock(DEVICE_ID);
                } else {
                    hideLock();
                }
            } catch (err) { console.log("Синхронизация..."); }
        }, 5000);
    } catch (e) { console.error(e); }
}

function showLock(id) {
    if (!document.getElementById('lock-screen')) {
        const el = document.createElement('div');
        el.id = 'lock-screen';
        el.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:black;color:red;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:999999;font-family:sans-serif;text-align:center;";
        el.innerHTML = `<h1 style="font-size:40px;">⚠️ БҰҒАТТАЛДЫ</h1><p>ID: ${id}</p><p>Бұл құрылғы иесі тарапынан жабылған.</p>`;
        document.body.appendChild(el);
        if (navigator.vibrate) navigator.vibrate([500, 500, 500]);
    }
}

function hideLock() {
    const el = document.getElementById('lock-screen');
    if (el) el.remove();
}

startSystem();

