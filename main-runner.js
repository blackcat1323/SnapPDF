(async () => {
    if (!window.jspdf) {
        alert("jsPDF not loaded");
        return;
    }

    const { jsPDF } = window.jspdf;

    // ===== UI =====
    const overlay = document.createElement("div");
    overlay.style = `
        position:fixed;top:0;left:0;width:100%;height:100%;
        background:rgba(0,0,0,0.7);
        color:#fff;z-index:999999;
        display:flex;align-items:center;justify-content:center;
        flex-direction:column;font-size:18px;
    `;

    const text = document.createElement("div");
    const bar = document.createElement("div");
    bar.style = "width:300px;height:10px;background:#333;margin-top:10px;";
    const fill = document.createElement("div");
    fill.style = "height:100%;width:0;background:#4caf50;";
    bar.appendChild(fill);

    overlay.appendChild(text);
    overlay.appendChild(bar);
    document.body.appendChild(overlay);

    function update(p, msg) {
        fill.style.width = p + "%";
        text.textContent = msg || `Processing ${p}%`;
    }

    function done(msg) {
        text.textContent = msg || "Done!";
        setTimeout(() => overlay.remove(), 1000);
    }

    function fail(err) {
        text.textContent = "Error: " + err;
        fill.style.background = "red";
        console.error(err);
    }

    try {
        // ===== CONFIG =====
        const SCALE = 0.85;
        const QUALITY = 0.88;

        // ===== DETECT SOURCE =====
        function detectSource() {
            const imgs = Array.from(document.images);
        
            let data = 0, blob = 0, http = 0;
        
            imgs.forEach(img => {
                if (!img.src) return;
                if (img.src.startsWith("data:")) data++;
                else if (img.src.startsWith("blob:")) blob++;
                else if (img.src.startsWith("http")) http++;
            });
        
            
            if (blob > 0) return "blob";
            if (data > 0) return "data";
            if (http > 0) return "http";
        
            if (document.querySelectorAll("canvas").length > 0) return "canvas";
        
            return "unknown";
        }

        let source = detectSource();
        if (source === "unknown") {
            console.warn("Fallback to blob");
            source = "blob";
        }

        update(5, `Source: ${source}`);

        // ===== AUTO SCROLL (GOOGLE DRIVE) =====
        async function autoScrollDrive() {
            const pages = Array.from(
                document.querySelectorAll(".ndfHFb-c4YZDc-cYSp0e-DARUcf")
            );
        
            if (!pages.length) return pages;
        
            for (let i = 0; i < pages.length; i++) {
                pages[i].scrollIntoView();
        
                update(
                    Math.round((i / pages.length) * 20),
                    `Scrolling ${i + 1}/${pages.length}`
                );
        
                await new Promise(r => setTimeout(r, 120));
            }
        
            return pages;
        }


        async function autoScrollGeneric() {
            const elements = Array.from(document.images)
                .filter(img => img.src && (img.src.startsWith("data:") || img.src.startsWith("http")));
        
            if (!elements.length) return;
        
            console.log("Generic elements:", elements.length);
        
            for (let i = 0; i < elements.length; i++) {
                elements[i].scrollIntoView({
                    behavior: "instant",
                    block: "center"
                });
        
                update(
                    Math.round((i / elements.length) * 20),
                    `Scrolling ${i + 1}/${elements.length}`
                );
        
                await new Promise(r => setTimeout(r, 120));
            }
        }
        
        // ===== RUN =====
        let pageContainers = [];

        if (location.hostname.includes("drive.google.com")) {
            pageContainers = await autoScrollDrive();
        }else {
            await autoScrollGeneric();
            await new Promise(r => setTimeout(r, 500));
        }

        // ===== WAIT =====
        async function waitImagesStable() {
            let prev = 0;
            let stable = 0;

            while (stable < 3) {
                const count = document.images.length;
                if (count === prev) stable++;
                else {
                    stable = 0;
                    prev = count;
                }
                await new Promise(r => setTimeout(r, 500));
            }
        }

                // ===== WAIT =====
        async function waitBlobReady(pageCount) {
            const start = Date.now();

            while (Date.now() - start < 15000) {
                const imgs = Array.from(
                    document.querySelectorAll("img[src^='blob:']")
                ).filter(i => i.complete);

                update(10, `Loading ${imgs.length}/${pageCount}`);

                if (imgs.length >= pageCount) return;

                await new Promise(r => setTimeout(r, 400));
            }
        }

        if (source === "blob") {
            await waitBlobReady(pageContainers.length || 1);
        } else {
            await waitImagesStable();
        }

        await new Promise(r => setTimeout(r, 300));

        // ===== COLLECT =====
        let imgs = [];

        if (source === "data") {
            imgs = Array.from(document.images)
                .filter(img => img.src.startsWith("data:image"))
                .map((img, i) => ({
                    el: img,
                    top: img.getBoundingClientRect().top + window.scrollY,
                    i
                }));
        }

        else if (source === "blob" && pageContainers.length) {
            for (let i = 0; i < pageContainers.length; i++) {
                const img = pageContainers[i].querySelector("img");
        
                if (img && img.src.startsWith("blob:")) {
                    imgs.push({
                        el: img,
                        i
                    });
                }
            }
        }

        else if (source === "http") {
            imgs = Array.from(document.images)
                .filter(img => img.src.startsWith("http"))
                .map((img, i) => ({
                    el: img,
                    top: img.getBoundingClientRect().top + window.scrollY,
                    i
                }));
        }

        else if (source === "canvas") {
            imgs = Array.from(document.querySelectorAll("canvas"))
                .map((c, i) => ({
                    canvas: c,
                    top: c.getBoundingClientRect().top + window.scrollY,
                    i
                }));
        }

        if (!imgs.length) throw "No images found";

        // ===== DEDUPE =====
        const seen = new Set();
        imgs = imgs.filter(item => {
            const key = item.el ? item.el.src : item.canvas;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });

        // ===== SORT =====
        imgs.sort((a, b) => {
            if (Math.abs(a.top - b.top) < 5) return a.i - b.i;
            return a.top - b.top;
        });

        // ===== PDF =====
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        let pdf;
        let page = 0;

        for (const item of imgs) {
            page++;

            let w, h;

            if (item.canvas) {
                w = item.canvas.width;
                h = item.canvas.height;

                canvas.width = w;
                canvas.height = h;

                ctx.drawImage(item.canvas, 0, 0);
            } else {
                const img = item.el;

                if (!img.complete || img.naturalWidth === 0) {
                    await new Promise(res => {
                        img.onload = res;
                        img.onerror = res;
                    });
                }

                w = img.naturalWidth;
                h = img.naturalHeight;

                if (!w || !h) continue;

                const w2 = Math.floor(w * SCALE);
                const h2 = Math.floor(h * SCALE);

                canvas.width = w2;
                canvas.height = h2;

                ctx.drawImage(img, 0, 0, w2, h2);

                w = w2;
                h = h2;
            }

            const jpeg = canvas.toDataURL("image/jpeg", QUALITY);

            if (!pdf) {
                pdf = new jsPDF({
                    unit: "pt",
                    format: [w, h],
                    orientation: w >= h ? "landscape" : "portrait",
                    compress: true
                });
            } else {
                pdf.addPage([w, h], w >= h ? "landscape" : "portrait");
            }

            pdf.addImage(jpeg, "JPEG", 0, 0, w, h);

            const percent = Math.round((page / imgs.length) * 90);
            update(percent, `Page ${page}/${imgs.length}`);

            if (page % 5 === 0) {
                await new Promise(r => setTimeout(r, 0));
            }
        }

        if (!pdf) throw "No valid pages";

        update(95, "Building PDF...");

        const blob = pdf.output("blob");

        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);

        // ===== SMART FILENAME =====
        function generateFileName() {
            let name = "";

            const custom = document.getElementById("doc-title");
            if (custom && custom.textContent.trim()) {
                name = custom.textContent.trim();
            }

            if (!name && location.hostname.includes("drive.google.com")) {
                const el =
                    document.querySelector(".ndfHFb-c4YZDc-Wrql6b") || // title chuẩn Drive
                    document.querySelector("[aria-label][role='heading']");

                if (el && el.textContent.trim()) {
                    name = el.textContent.trim();
                }
            }

            if (!name) {
                const meta = document.querySelector("meta[property='og:title']");
                if (meta && meta.content) {
                    name = meta.content.trim();
                }
            }

            if (!name && document.title) {
                name = document.title.trim();
            }

            if (!name) {
                name = location.hostname.replace("www.", "");
            }

            name = name
                .replace(/[\\/:*?"<>|]/g, "")
                .replace(/\s+/g, " ")
                .trim();

            if (name.length > 80) {
                name = name.slice(0, 80) + "...";
            }

            const now = new Date();
            const ts = now.toISOString().slice(0, 19).replace(/[:T]/g, "-");

            return `${name} - ${ts}.pdf`;
        }

        a.download = generateFileName();
        a.click();

        done("Download complete");

    } catch (err) {
        fail(err);
    }
})();