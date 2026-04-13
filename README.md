# 📄 SnapPDF – Webpage to PDF (Google Drive, blob, data, canvas)

> Capture any webpage into a clean PDF — automatically.

---

## 🚀 Overview

**SnapPDF** is a Chrome extension that lets you download and convert any webpage into a clean PDF.

It is especially useful for:
- Google Drive preview (no download button)
- Protected PDF viewers
- Long scrolling pages
- Lazy-loaded content

It intelligently detects how content is rendered and adapts automatically:

- ✅ Blob images (Google Drive, document viewers)
- ✅ Data URLs (base64 images)
- ✅ HTTP images
- ✅ Canvas-rendered pages

Everything runs **locally in your browser** — no uploads, no tracking.

---

## 💡 Use Cases

- Download PDF from Google Drive without download button
- Save long webpages as PDF
- Export dynamic/lazy-loaded content
- Capture protected document viewers

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

## 📌 Pin Extension (Highly Recommended)

To use SnapPDF faster, you should pin it to the toolbar:

1. Click the **Extensions (🧩 icon)** in Chrome
2. Find **SnapPDF**
3. Click the **📌 Pin icon**

👉 The SnapPDF button will now always be visible on your browser toolbar.
---

## 🧑‍💻 How to Use

1. Open any webpage (example: Google Drive preview)
2. ⚠️ **Scroll down to the bottom of the document**
3. Click the **SnapPDF** extension
4. Click **"Generate PDF"**
5. Wait for processing → file will download automatically

---

~~## ⚠️ Important (Read This)~~

~~### 👉 You MUST scroll to the bottom before generating PDF~~

~~Many modern websites (especially Google Drive) use **lazy loading**.~~

~~If you don’t scroll:~~
~~- ❌ Only partial pages will be captured~~
~~- ❌ Missing content in final PDF~~

### 👉 Auto-scroll is now built-in

SnapPDF now automatically scrolls through the page to load all content before exporting.

✔️ You **do NOT need to scroll manually anymore**  
~~You MUST scroll to the bottom before generating PDF~~

---

### ⚠️ However, some pages may still require attention

Due to how certain websites implement lazy loading:

- Some content may load slower than expected
- Extremely long or complex pages may require a second run

---

### ❗ If you encounter missing pages:

- Wait a few seconds before clicking the button
- Try running the export again
- Ensure the page is fully visible (not minimized/background)

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
