# telebot-clean

Bot Telegram modular berbasis Node.js (CommonJS) dengan fitur:

- Auto menu dari daftar plugin (`/menu`, `/start`)
- Upload file ke CDN idweb (`/up`)
- Fetch URL / get file dari URL (`/get`, `/fetch`)
- TikTok downloader no‑watermark via Lovetik (`/tt`)
- Sticker maker dari foto (`/sticker`)
- AFK system (`/afk`, `/back`)
- Runtime / uptime bot (`/runtime`, `/uptime`)
- Did-you-mean suggestion untuk command typo
- Prompt optimizer Lyra (`/promt`) via NVIDIA AI (OpenAI-compatible API)
- Tsundere AI assistant Nero (`/nero`) via NVIDIA AI

---

## 1. Persiapan

### Requirement

- Node.js 18+ (disarankan)
- NPM
- Akun Telegram + Bot Token dari BotFather
- (Opsional) API key NVIDIA untuk fitur AI (`/promt`, `/nero`)

### Clone / copy project

Misal kamu sudah punya folder di Desktop:

```bash
git clone https://github.com/nansboost/telegram-base-bot

cd telegram-base-bot
```

Install dependency:

```bash
npm install
```

> Catatan: ini akan menginstall semua package yang dibutuhkan (termasuk `openai` untuk integrasi NVIDIA AI).

---

## 2. Konfigurasi `.env`

File `.env` ada di root project. Contoh isi minimal:

```env
BOT_TOKEN=ISI_BOT_TOKEN_TELEGRAM_KAMU
NVIDIA_API_KEY=ISI_API_KEY_NVIDIA_KAMU
```

Keterangan:

- `BOT_TOKEN` → token bot Telegram dari BotFather
- `NVIDIA_API_KEY` → API key dari NVIDIA untuk fitur `/promt` dan `/nero`

Pastikan `.env` **tidak di-commit** ke repo publik.

---

## 3. Cara Dapat API Key NVIDIA

Fitur `/promt` dan `/nero` dan `/ai` menggunakan NVIDIA AI yang compatible dengan API OpenAI. Langkah umum untuk ambil key:

1. Buka situs NVIDIA NIM / NVIDIA AI Foundation Models
   - Kunjungi: https://build.nvidia.com/ atau dashboard NVIDIA AI (sesuai akun kamu)
2. Login / daftar akun NVIDIA
   - Pakai akun NVIDIA yang aktif.
3. Buka bagian **API Models**
   - ada tab models dan cari model bahasa openai/gpt-oss-120b
4. Generate API key
   - klik model dan Buat key baru, simpan value‑nya (string mirip `nvapi-xxxxx...`).
5. Tempel ke `.env`

   ```env
   NVIDIA_API_KEY=nvapi-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```

6. Simpan file `.env` dan restart bot.

> Catatan: UI/letak menu di dashboard NVIDIA bisa berubah, tapi pola utamanya sama: login → cari API Models → generate key → pakai sebagai `NVIDIA_API_KEY`.

Bot ini menggunakan base URL:

```js
baseURL: 'https://integrate.api.nvidia.com/v1'
```

Jadi selagi API key valid dan punya akses ke model yang digunakan (`openai/gpt-oss-120b`, dll.), `/promt` dan `/nero` dan `/ai` akan jalan.

---

## 4. Cara Menjalankan Bot

Dari folder project:

```bash
npm start
```

Di `package.json` sudah diset agar `npm start` menjalankan `nodemon` (auto‑reload) terhadap `main.js`.

Pastikan hanya **satu instance** bot yang jalan untuk satu `BOT_TOKEN` agar tidak kena error `409 Conflict: terminated by other getUpdates request`.

Jika mau jalan tanpa nodemon:

```bash
node main.js
```

---

## 5. Command Utama

### Menu & dasar

- `/start` → sapa awal + tampilkan menu
- `/menu` → daftar semua fitur dari plugin yang terdeteksi

### Upload & fetch

- `/up` → upload file/media yang kamu kirim ke CDN idweb, lalu balikin URL
- `/get <url>` / `/fetch <url>` → ambil resource dari URL (teks/JSON/file). Untuk file, akan dikirim ke Telegram.

### TikTok

- `/tt <url TikTok>` → download video TikTok no‑watermark via Lovetik dan kirim sebagai video.

### Sticker

- `/sticker` → reply ke foto/gambar dengan command ini untuk ubah jadi sticker.

### AFK

- `/afk <alasan opsional>` → set status AFK; kalau ada yang mention kamu, bot kasih info AFK + durasi.
- `/back` → hilangkan status AFK.

### Runtime

- `/runtime` atau `/uptime` → lihat sudah berapa lama bot hidup.

### Prompt optimizer (Lyra)

- `/promt <deskripsi>` → minta Lyra bikin prompt yang sudah dioptimasi:

  Contoh:
  ```
  /promt bikin prompt buat AI yang jelasin dasar-dasar Docker untuk pemula
  ```

  Output biasanya:
  - **Your Optimized Prompt:** …
  - **What Changed:** …

### Tsundere assistant (Nero)

- `/nero <pertanyaan>` → tanya apa saja dengan jawaban gaya tsundere tapi tetap teknis dan benar.

  Contoh:
  ```
  /nero jelaskan perbedaan null dan undefined di JavaScript
  ```

---

## 6. Struktur Project Singkat

- `main.js` → entry bot Telegram, load plugin dan middleware
- `handler.js` → loader plugin + routing command
- `config.js` → config dasar
- `.env` → token & API key (JANGAN dishare)
- `lib/` → logic helper (afk, runtime, uploader, didyoumean, tiktok-lovetik, nvidia-ai, dll.)
- `plugins/` → satu file per fitur command (`menu`, `upload`, `fetch`, `sticker`, `afk`, `runtime`, `tiktok`, `promt`, `nero`, dll.)
- `media/` → folder kosong untuk file statis (kalau dibutuhkan)

---

## 7. Troubleshooting Singkat

- **Bot tidak merespon**
  - Cek terminal: ada error `BOT_TOKEN` invalid? Perbaiki `.env`.
  - Pastikan hanya satu proses bot yang jalan.

- **/promt atau /nero error: NVIDIA API belum dikonfigurasi**
  - Pastikan `.env` berisi `NVIDIA_API_KEY` yang valid.
  - Restart bot setelah mengubah `.env`.

- **Limit / error dari NVIDIA**
  - Bisa terjadi jika key sudah habis kuota / tidak punya akses model tertentu.
  - Coba ganti model di `lib/nvidia-ai.js` / plugin terkait, atau cek dashboard NVIDIA.

Silakan modif README ini sesuai kebutuhanmu ke depan (tambah fitur, ubah command, dsb.).
