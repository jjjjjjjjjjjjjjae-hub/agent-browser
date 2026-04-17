const DB_URL = "https://antitheftbot-1cdf7-default-rtdb.firebaseio.com/status.json";

setInterval(async () => {
    try {
        const res = await fetch(DB_URL);
        const status = await res.json();
        if (status === "STOLEN") {
            document.body.innerHTML = `
                <div style="background:red; color:white; height:100vh; width:100vw; display:flex; align-items:center; justify-content:center; font-size:30px; font-weight:bold; position:fixed; top:0; left:0; z-index:999999;">
                    ТЕЛЕФОН ҰРЛАНДЫ!
                </div>`;
            if (navigator.vibrate) navigator.vibrate([1000, 500, 1000]);
        }
    } catch (e) {}
}, 5000);

