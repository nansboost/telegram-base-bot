// plugins/tiktok.js
// Download video TikTok menggunakan Lovetik

const axios = require('axios');
const { fetchLovetik } = require('../lib/tiktok-lovetik');

module.exports = {
  name: 'tiktok',
  commands: ['tt'],

  async handler(bot, x) {
    const parts = x.text.trim().split(/\s+/);
    const link = parts[1];

    if (!link) {
      return x.reply('Format:\n/tt <url TikTok>');
    }

    await x.reply('🎬 Proses download TikTok via Lovetik...');

    try {
      const data = await fetchLovetik(link);

      if (!data.nowm) {
        return x.reply('❌ Tidak dapat menemukan link video dari Lovetik.');
      }

      // Download ke buffer lalu kirim sebagai video
      const res = await axios.get(data.nowm, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(res.data || []);
      if (!buffer.length) {
        throw new Error('File dari Lovetik kosong.');
      }

      await x.replyWithVideo({ source: buffer }, { caption: data.title || link });
    } catch (e) {
      console.error('Error TikTok Lovetik:', e);
      await x.reply('❌ Gagal download TikTok lewat Lovetik: ' + (e.message || e));
    }
  },
};
