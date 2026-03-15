// plugins/ai.js
// Command /ai untuk tanya ke NVIDIA AI (stepfun-ai/step-3.5-flash)

const { askNvidia } = require('../lib/nvidia-ai');

module.exports = {
  name: 'ai',
  commands: ['ai'],

  async handler(bot, x) {
    const ctx = x.ctx;
    const text = x.text.replace(/^\/ai\s*/i, '').trim();

    if (!text) {
      return x.reply(
        'Format:\n' +
          '/ai <pertanyaan>\n\n' +
          'Contoh:\n' +
          '/ai apa bedanya null dan undefined di JavaScript secara singkat.'
      );
    }

    try {
      await x.reply('Tunggu Sebentar...');

      const messages = [
  {
    role: 'system',
    content: ``,
  },
  {
    role: 'user',
    content: text,
  },
];


      const answer = await askNvidia(messages, {
        model: 'openai/gpt-oss-120b',
        temperature: 1,
        max_tokens: 4096,
      });

      if (!answer) {
        return x.reply('❌ Tidak ada jawaban dari model.');
      }

      await x.reply(answer);
    } catch (err) {
      console.error('Error /ai:', err);
      await x.reply('Eror: ' + (err.message || err));
    }
  },
};
