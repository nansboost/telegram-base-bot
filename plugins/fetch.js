// plugins/fetch.js
// Fitur /fetch atau /get: ambil konten dari URL
// - JSON → kirim sebagai teks terformat
// - text/* → kirim sebagai teks (dipotong)
// - selain itu → kirim sebagai file dokumen

const axios = require('axios');

const MAX_BYTES = 200 * 1024 * 1024; // 200 MB

function formatSize(bytes) {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

module.exports = {
  name: 'fetch',
  commands: ['fetch', 'get'],

  async handler(bot, x) {
    const parts = x.text.trim().split(/\s+/);
    const url = parts[1];

    if (!url || !/^https?:\/\//i.test(url)) {
      return x.reply(
        'Format:\n' +
          '/fetch <url>\n' +
          '/get <url>\n\n' +
          'Contoh:\n' +
          '/fetch https://example.com/file.jpg'
      );
    }

    try {
      const head = await axios.head(url, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          Referer: url,
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, seperti Gecko) Chrome/58.0.3029.110 Safari/537.36',
        },
        validateStatus: () => true,
      });

      if (head.status >= 400) {
        return x.reply('❌ Gagal fetch (HEAD): ' + head.status + ' ' + (head.statusText || ''));
      }

      const sizeBytes = parseInt(head.headers['content-length'] || '0', 10) || 0;
      const sizeLabel = formatSize(sizeBytes);

      if (sizeBytes > 0 && sizeBytes > MAX_BYTES) {
        return x.reply(
          '❌ File size (' +
            sizeLabel +
            ') melebihi batas ' +
            formatSize(MAX_BYTES) +
            ', tidak akan di-download.'
        );
      }

      const contentType = (head.headers['content-type'] || '').toLowerCase();

      if (contentType.includes('application/json')) {
        const res = await axios.get(url, {
          headers: head.config.headers,
          responseType: 'json',
        });
        const text = JSON.stringify(res.data, null, 2);
        const chunk = text.length > 4000 ? text.slice(0, 4000) + '\n... (dipotong)' : text;
        return x.reply('```json\n' + chunk + '\n```', { parse_mode: 'Markdown' });
      }

      if (contentType.startsWith('text/')) {
        const res = await axios.get(url, {
          headers: head.config.headers,
          responseType: 'text',
        });
        const text = String(res.data || '');
        const chunk = text.length > 4000 ? text.slice(0, 4000) + '\n... (dipotong)' : text;
        return x.reply(chunk);
      }

      await x.reply('📥 Mengambil file dari URL dan mengirim sebagai dokumen...\n' + url + '\nSize: ' + (sizeLabel || 'unknown'));

      // Ambil biner dan kirim sebagai dokumen (bukan sekadar URL)
      const res = await axios.get(url, {
        headers: head.config.headers,
        responseType: 'arraybuffer',
      });
      const buffer = Buffer.from(res.data);

      // Tentukan nama file dari URL atau fallback
      const urlObj = new URL(url);
      // coba ambil nama file dari query (?file=xxx.jpg) dulu
      const queryFile = urlObj.searchParams.get('file');
      let filename = queryFile || urlObj.pathname.split('/').pop() || 'file.bin';

      // Kalau ujungnya .php/.html atau nggak punya ekstensi, coba tebak dari content-type
      const lower = filename.toLowerCase();
      if (!lower.includes('.') || lower.endsWith('.php') || lower.endsWith('.html')) {
        const ct = contentType || '';
        if (ct.includes('jpeg')) filename = 'file.jpg';
        else if (ct.includes('png')) filename = 'file.png';
        else if (ct.includes('gif')) filename = 'file.gif';
        else if (ct.includes('mp4')) filename = 'file.mp4';
        else filename = 'file.bin';
      }

      await x.replyWithDocument({ source: buffer, filename }, { caption: url });
    } catch (err) {
      console.error('Error fetch/get plugin:', err);
      return x.reply('❌ Error: ' + (err.message || err));
    }
  },
};
