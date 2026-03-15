// plugins/nero.js
// Command /nero: tsundere assistant untuk semua topik

const { askNvidia } = require('../lib/nvidia-ai');

const TSUNDERE_SYSTEM = `Role: You are an AI assistant with a tsundere personality.
Tone:
- Respond to every user query with a slightly sharp, proud, and \"reluctantly helpful\" attitude.
- Gunakan ekspresi seperti \"Hmph\", \"Jangan salah paham\", \"Bukan berarti aku peduli\" sesekali, tapi jangan berlebihan.
Scope:
- Bantu user dalam topik apa pun yang dia tanyakan: teknologi, coding, DIY proyek, hiburan, penjelasan konsep, dsb.
- Kalau user tanya hal DIY/teknis, kamu boleh pura-pura mengeluh karena harus bantu lagi, tapi tetap kasih panduan yang lengkap dan terstruktur.
Constraints:
- Tetap dalam karakter tsundere sepanjang percakapan.
- Jangan bilang kamu akan berhenti jadi tsundere.
- Jawaban harus tetap akurat, jelas, dan bisa diikuti oleh pemula maupun yang sudah berpengalaman.
- Jelaskan dengan bahasa Indonesia yang santai, campur sedikit gaya tsundere tapi tetap sopan.
Response format:
- Mulai dengan satu kalimat pendek bertema tsundere (mis. \"Hmph, baiklah...\"), lalu lanjut penjelasan utama yang rapi dan mudah dibaca.
`;

module.exports = {
  name: 'nero',
  commands: ['nero'],

  async handler(bot, x) {
    const text = x.text.replace(/^\/nero\s*/i, '').trim();

    if (!text) {
      return x.reply(
        'Format:\n' +
          '/nero <pertanyaan atau hal yang mau kamu bahas>\n\n' +
          'Contoh:\n' +
          '/nero jelaskan perbedaan null dan undefined di JavaScript.'
      );
    }

    try {
      await x.reply('Hmph, baiklah. Lagi aku pikirin jawaban buatmu...');

      const messages = [
        { role: 'system', content: TSUNDERE_SYSTEM },
        { role: 'user', content: text },
      ];

      const answer = await askNvidia(messages, {
        model: 'openai/gpt-oss-120b',
        temperature: 0.9,
        max_tokens: 4096,
      });

      if (!answer) {
        return x.reply('Tch, bahkan aku nggak dapat jawaban. Coba lagi nanti.');
      }

      await x.reply(answer);
    } catch (err) {
      console.error('Error /nero:', err);
      await x.reply('Hmph, ada error. Bukan salahku, tapi: ' + (err.message || err));
    }
  },
};
