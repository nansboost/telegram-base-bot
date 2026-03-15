// plugins/afk.js
// Fitur AFK sederhana ala telebot-wa
// Perintah:
//   /afk [alasan]  → set status AFK
//   /back          → hapus status AFK (opsional, selain auto clear di message)

const { setAfk, clearAfk } = require('../lib/afk');

module.exports = {
  name: 'afk',
  commands: ['afk', 'back'],

  async handler(bot, x) {
    const ctx = x.ctx;
    const text = x.text.trim();
    const [cmd, ...rest] = text.split(/\s+/);
    const reason = rest.join(' ').trim();
    const userId = ctx.from?.id;
    const name = ctx.from?.first_name || ctx.from?.username || '';

    if (!userId) return;

    if (cmd === '/afk') {
      setAfk(userId, name, reason);
      return x.reply(
        '📴 Kamu sekarang AFK' + (reason ? `: ${reason}` : '.')
      );
    }

    if (cmd === '/back') {
      const info = clearAfk(userId);
      if (info) {
        const now = Date.now();
        const diff = now - info.at;
        const seconds = Math.floor(diff / 1000) % 60;
        const minutes = Math.floor(diff / (1000 * 60)) % 60;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const parts = [];
        if (hours) parts.push(`${hours} jam`);
        if (minutes) parts.push(`${minutes} menit`);
        if (seconds || parts.length === 0) parts.push(`${seconds} detik`);
        const dur = parts.join(' ');
        const usernameMention = ctx.from?.username
          ? `@${ctx.from.username}`
          : (info.name || ctx.from?.first_name || 'kamu');
        return x.reply(`👋 ${usernameMention} sudah AFK selama ${dur}.`);
      } else {
        return x.reply('Kamu tidak sedang AFK.');
      }
    }
  },
};
