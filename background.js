chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg?.type !== "FETCH_IMAGE" || !msg.url) return;

    (async () => {
        try {
            const res = await fetch(msg.url, {
                credentials: "omit",
                referrerPolicy: "no-referrer"
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const blob = await res.blob();
            const dataUrl = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = () => reject(new Error("Failed to read image"));
                reader.readAsDataURL(blob);
            });

            sendResponse({ ok: true, data: dataUrl });
        } catch (err) {
            sendResponse({ ok: false, error: err.message || String(err) });
        }
    })();

    return true;
});
