const DEVICE_ID = "01"; 
const DEVICE_NAME = "My_Phone"; 
// Firebase сілтемесіне мұқият бол, соңында .json болуы тиіс!
const BASE_URL = `https://antitheftbot-1cdf7-default-rtdb.firebaseio.com/devices/${DEVICE_ID}`;

async function syncDevice() {
    setInterval(async () => {
        try {
            // 1. Ақпаратты серверге жіберу (PUT әдісімен)
            await fetch(`${BASE_URL}/info.json`, {
                method: 'PUT',
                body: JSON.stringify({
                    name: DEVICE_NAME,
                    lastSeen: new Date().toLocaleTimeString()
                })
            });

            // 2. Статусты тексеру
            const res = await fetch(`${BASE_URL}/status.json`);
            const status = await res.json();

            if (status === "STOLEN") {
                document.body.innerHTML = `<div style="background:red;color:white;height:100vh;display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:bold;position:fixed;top:0;left:0;width:100%;z-index:999999;">ТЕЛЕФОН ҰРЛАНДЫ!</div>`;
                if (navigator.vibrate) navigator.vibrate([1000, 500, 1000]);
            } else if (status === "SAFE") {
                location.reload(); // Блокты шешу үшін бетті жаңарту
            }
        } catch (e) { console.log("Серверге қосылу қатесі..."); }
    }, 5000);
}

syncDevice();

