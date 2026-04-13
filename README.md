# 📄 SnapPDF

> Capture any webpage into a clean PDF — automatically.

---

## 🚀 Overview

**SnapPDF** is a lightweight Chrome extension that converts webpages into high-quality PDFs.

It intelligently detects how content is rendered and adapts automatically:

- ✅ Blob images (Google Drive, document viewers)
- ✅ Data URLs (base64 images)
- ✅ HTTP images
- ✅ Canvas-rendered pages

Everything runs **locally in your browser** — no uploads, no tracking.

---

## ✨ Features

- 🧠 Smart source detection (auto-detects page structure)
- 📄 Works with Google Drive preview & dynamic viewers
- ⚡ Optimized performance (low memory, fast export)
- 🎯 Clean PDF output (correct page order)
- 🔒 Privacy-first (no data leaves your device)

---

## 📦 Installation (Developer Mode)

1. Open Chrome  
2. Go to: `chrome://extensions`
3. Enable **Developer Mode**
4. Click **Load unpacked**
5. Select this project folder

---

## 🧑‍💻 How to Use

1. Open any webpage (example: Google Drive preview)
2. ⚠️ **Scroll down to the bottom of the document**
3. Click the **SnapPDF** extension
4. Click **"Generate PDF"**
5. Wait for processing → file will download automatically

---

## ⚠️ Important (Read This)

### 👉 You MUST scroll to the bottom before generating PDF

Many modern websites (especially Google Drive) use **lazy loading**.

If you don’t scroll:
- ❌ Only partial pages will be captured
- ❌ Missing content in final PDF

✔️ Always scroll until the end before clicking the button.

---

## 🧠 How It Works

SnapPDF uses different strategies depending on the page:

| Source Type | Strategy |
|------------|---------|
| `blob:` images | Uses DOM images directly |
| `data:` images | Extracts base64 directly |
| `http` images | Loads with CORS-safe method |
| `canvas` | Captures rendered content |

---

## 🛠️ Troubleshooting

### ❌ "No images found"

- Make sure you **scrolled fully**
- Try scrolling slower and wait 1–2 seconds
- Reload page and try again

---

### ❌ PDF missing pages

- Page not fully loaded
- Scroll again → re-run

---

### ❌ Nothing happens

- Refresh page
- Re-open extension
- Check DevTools console

---

## 🔒 Privacy

SnapPDF:
- ❌ Does NOT collect data
- ❌ Does NOT send requests to servers
- ✅ Runs entirely in your browser

---

## 🧩 Tech Stack

- Vanilla JavaScript
- Chrome Extension (Manifest V3)
- jsPDF

---

## 📌 Notes

This tool is optimized for:
- Document viewers
- Long scrolling pages
- Dynamic content

---

## ⭐ Future Improvements

- Auto-scroll detection
- Smart retry for missing pages
- Better UI with progress tracking
- Multi-document export

---

## 📬 Contributing

Feel free to fork and improve the project.

---

## 📄 License

MIT License