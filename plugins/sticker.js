// plugins/sticker.js
// Fitur pembuat sticker sederhana dari foto/dokumen gambar
// Cara pakai:
// 1) Kirim foto / gambar ke bot
// 2) REPLY pesan itu dengan perintah: /sticker

const axios = require('axios');
const sharp = require('sharp');

module.exports = {
  name: 'sticker',
  commands: ['sticker'],

  async handler(bot, x) {
    const ctx = x.ctx;
    const reply = ctx.message?.reply_to_message;

    if (!reply) {
      return x.reply(
        'Cara pakai:\n' +
          '1. Kirim foto / gambar ke bot\n' +
          '2. REPLY pesan foto itu dengan: /sticker'
      );
    }

    const media =
      reply.photo?.slice(-1)[0] || // foto resolusi terbesar
      reply.document; // dukung dokumen gambar (jpg/png)

    if (!media || !media.file_id) {
      return x.reply('❌ Pesan yang direply tidak mengandung foto/gambar yang didukung.');
    }

    const fileId = media.file_id;

    try {
      await x.reply('🧩 Membuat sticker...');

      // Ambil file dari Telegram
      const file = await bot.telegram.getFile(fileId);
      const fileUrl = `https://api.telegram.org/file/bot${bot.token}/${file.file_path}`;

      const res = await axios.get(fileUrl, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(res.data);

      // Konversi ke WEBP ukuran max 512x512 (ketentuan Telegram)
      const webp = await sharp(buffer)
        .resize(512, 512, { fit: 'inside' })
        .webp({ quality: 100 })
        .toBuffer();

      await ctx.replyWithSticker({ source: webp });
    } catch (err) {
      console.error('Error sticker plugin:', err);
      await x.reply('❌ Gagal membuat sticker: ' + (err.message || err));
    }
  },
};
