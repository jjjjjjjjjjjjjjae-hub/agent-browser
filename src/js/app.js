// ӘР ТЕЛЕФОНҒА ӘРТҮРЛІ ID БЕР (МЫСАЛЫ: "01", "02")
const DEVICE_ID = "01"; 
const DEVICE_NAME = "Samsung_Galaxy_A51"; // Телефон моделі
const BASE_URL = `https://antitheftbot-1cdf7-default-rtdb.firebaseio.com/devices/${DEVICE_ID}`;

async function syncDevice() {
    setInterval(async () => {
        try {
            // 1. Базаға "мен онлайнмын" деп мәлімет жіберу
            await fetch(`${BASE_URL}/info.json`, {
                method: 'PUT',
                body: JSON.stringify({
                    name: DEVICE_NAME,
                    lastSeen: new Date().toLocaleTimeString()
                })
            });

            // 2. Статусты тексеру (Блоктау керек пе?)
            const res = await fetch(`${BASE_URL}/status.json`);
            const status = await res.json();

            if (status === "STOLEN") {
                showLock();
            } else {
                removeLock();
            }
        } catch (e) { console.log("Синхронизация қатесі"); }
    }, 5000); // Әр 5 секунд сайын тексереді
}

function showLock() {
    if (!document.getElementById('lock-screen')) {
        const el = document.createElement('div');
        el.id = 'lock-screen';
        el.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:red;color:white;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:999999;font-weight:bold;text-align:center;";
        el.innerHTML = `<h1>ТЕЛЕФОН ҰРЛАНДЫ!</h1><p>Құрылғы ID: ${DEVICE_ID}</p>`;
        document.body.appendChild(el);
        if (navigator.vibrate) navigator.vibrate([1000, 500, 1000]);
    }
}

function removeLock() {
    const el = document.getElementById('lock-screen');
    if (el) el.remove();
}

syncDevice();

