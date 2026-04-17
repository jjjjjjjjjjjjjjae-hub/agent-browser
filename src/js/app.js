import { Device } from '@capacitor/device';

const DB_URL = "https://antitheftbot-1cdf7-default-rtdb.firebaseio.com/devices";

async function initSecurity() {
    try {
        // Телефонның нақты ақпаратын алу
        const info = await Device.getInfo();
        const idInfo = await Device.getId();
        
        // Құрылғының ID-і (ID-дің алғашқы 6 символы)
        const DEVICE_ID = idInfo.identifier.substring(0, 6).toUpperCase();
        const DEVICE_NAME = `${info.manufacturer} ${info.model}`;

        setInterval(async () => {
            try {
                // 1. Базаға ақпарат жіберу (Настройкадағы атпен)
                await fetch(`${DB_URL}/${DEVICE_ID}/info.json`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        name: DEVICE_NAME,
                        model: info.model,
                        os: info.operatingSystem,
                        lastSeen: new Date().toLocaleTimeString()
                    })
                });

                // 2. Блоктау статусын тексеру
                const res = await fetch(`${DB_URL}/${DEVICE_ID}/status.json`);
                const status = await res.json();

                if (status === "STOLEN") {
                    showLock(DEVICE_ID);
                } else {
                    hideLock();
                }
            } catch (e) {
                console.log("Sync error...");
            }
        }, 5000);
    } catch (err) {
        console.error("Device info error", err);
    }
}

function showLock(id) {
    if (!document.getElementById('lock-screen')) {
        const el = document.createElement('div');
        el.id = 'lock-screen';
        el.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:black;color:red;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:999999;font-weight:bold;text-align:center;font-family:sans-serif;";
        el.innerHTML = `<h1 style="font-size:40px;">⚠️ БҰҒАТТАЛДЫ</h1><p style="font-size:20px;">ID: ${id}</p><p>Бұл құрылғы иесі тарапынан бұғатталған.</p>`;
        document.body.appendChild(el);
        if (navigator.vibrate) navigator.vibrate([500, 500, 500]);
    }
}

function hideLock() {
    const el = document.getElementById('lock-screen');
    if (el) el.remove();
}

initSecurity();

