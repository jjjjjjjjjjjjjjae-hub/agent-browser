const DB_URL = "https://antitheftbot-1cdf7-default-rtdb.firebaseio.com/status.json";

async function checkAlarm() {
    try {
        const response = await fetch(DB_URL);
        const data = await response.json();
        
        if (data === "STOLEN") {
            document.body.innerHTML = `
                <div style="background:red; color:white; height:100vh; width:100vw; display:flex; align-items:center; justify-content:center; font-size:30px; font-weight:bold; text-align:center; position:fixed; top:0; left:0; z-index:999999;">
                    ТЕЛЕФОН ҰРЛАНДЫ! <br> БҰЛ ҚҰРЫЛҒЫ БЛОКТАЛҒАН!
                </div>
            `;
            if (navigator.vibrate) navigator.vibrate([1000, 500, 1000]);
        }
    } catch (e) {
        console.log("Firebase error");
    }
}

setInterval(checkAlarm, 5000);

