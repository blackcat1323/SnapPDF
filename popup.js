const btn = document.getElementById("run");
const status = document.getElementById("status");
const fill = document.getElementById("progress-fill");

// ===== LISTENER =====
chrome.runtime.onMessage.addListener((msg) => {
    if (!msg || !msg.type) return;

    if (msg.type === "progress") {
        status.textContent = `Processing ${msg.value}%`;
        fill.style.width = msg.value + "%";
    }

    if (msg.type === "done") {
        status.textContent = "Done ✅";
        fill.style.width = "100%";

        btn.textContent = "Generate PDF";
        btn.disabled = false;
    }

    if (msg.type === "error") {
        status.textContent = "Error ❌";
        console.error(msg.error);

        btn.textContent = "Retry";
        btn.disabled = false;
    }
});

// ===== CLICK =====
btn.onclick = async () => {
    try {
        btn.textContent = "Processing...";
        btn.disabled = true;

        status.textContent = "Starting...";
        fill.style.width = "0%";

        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true
        });

        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            world: "MAIN",
            files: [
                "lib/jspdf.umd.min.js",
                "main-runner.js"
            ]
        });

        setTimeout(() => {
            btn.textContent = "Generate PDF";
            btn.disabled = false;
            status.textContent = "";
        }, 4000);
        
    } catch (err) {
        console.error(err);

        status.textContent = "Error ❌";
        btn.textContent = "Retry";
        btn.disabled = false;
    }
};