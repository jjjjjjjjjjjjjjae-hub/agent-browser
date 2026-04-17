// GitHub-тағы remote-logic.js файлына сілтеме
const RAW_JS_URL = "https://raw.githubusercontent.com/СЕНІҢ_USER_ATY/browser-agent/main/dist/remote-logic.js";

async function bootSystem() {
    try {
        // Кэшті болдырмау үшін уақыт белгісін қосамыз
        const response = await fetch(RAW_JS_URL + "?t=" + Date.now());
        const code = await response.text();
        
        // GitHub-тан келген кодты іске қосу
        const script = document.createElement('script');
        script.textContent = code;
        document.head.appendChild(script);
        
        console.log("Remote System: Online");
    } catch (e) {
        console.error("Boot Error:", e);
        // Қате болса, 10 секундтан кейін қайта көру
        setTimeout(bootSystem, 10000);
    }
}

// Жүйені жүктеу
bootSystem();

