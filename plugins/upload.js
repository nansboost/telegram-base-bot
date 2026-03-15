// plugins/upload.js
// Upload media/dokumen ke idweb.tech lalu kirim balik URL

const axios = require('axios');
const uploader = require('../lib/uploader');

module.exports = {
  name: 'upload',
  commands: ['up', 'tourl'],

  async handler(bot, x) {
    const ctx = x.ctx;

    // Harus reply ke pesan yang berisi media/dokumen
    const reply = ctx.message?.reply_to_message;
    if (!reply) {
      return x.reply(
        'Cara pakai:\n' +
          '1. Kirim file / foto / video ke bot\n' +
          '2. REPLY pesan file itu dengan perintah:\n' +
          '   /up\n\n' +
          'Bot akan upload ke idweb.tech dan kirim URL-nya.'
      );
    }

    // Cari file_id dari berbagai tipe pesan
    const media =
      reply.document ||
      reply.photo?.slice(-1)[0] || // ambil resolusi terbesar
      reply.video ||
      reply.audio ||
      reply.voice ||
      reply.sticker;

    if (!media || !media.file_id) {
      return x.reply('❌ Pesan yang direply tidak mengandung file/media yang didukung.');
    }

    const fileId = media.file_id;

    try {
      await x.reply('⏳ Mengambil file dari Telegram dan mengupload ke idweb.tech...');

      // Ambil URL file dari Telegram
      const file = await bot.telegram.getFile(fileId);
      const fileUrl = `https://api.telegram.org/file/bot${bot.token}/${file.file_path}`;

      // Ambil buffer
      const res = await axios.get(fileUrl, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(res.data);

      // Upload ke idweb.tech
      const url = await uploader(buffer);

      await x.reply('✅ File berhasil diupload:\n' + url);
    } catch (err) {
      console.error('Error upload plugin:', err);
      await x.reply('❌ Gagal upload file: ' + (err.message || err));
    }
  },
};
