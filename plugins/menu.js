// plugins/menu.js
// Menu otomatis berdasarkan daftar plugin yang termuat di handler

module.exports = {
  name: 'menu',
  commands: ['start', 'menu'],

  async handler(bot, x) {
    const plugins = x.ctx._plugins || bot.context._plugins || [];

    // Bentuk list command dari setiap plugin
    const lines = [];
    for (const p of plugins) {
      const cmds = (p.commands || []).map((c) => `/${c}`).join(', ');
      if (!cmds) continue;
      // skip menu sendiri biar nggak dobel kalau mau
      // if (p.name === 'menu') continue;
      lines.push(`• ${cmds}`);
    }

    const menuBody = lines.length
      ? lines.join('\n')
      : 'Belum ada plugin dengan command terdaftar.';

    const menuText = `*Telebot Clean*\n\n` +
      `Daftar perintah (berdasarkan plugin yang termuat):\n` +
      `${menuBody}`;

    if (x.text.startsWith('/start')) {
      await x.replyWithMarkdown(
        `Halo ${x.ctx.from?.first_name || ''}!\n\n` +
          `Ini bot Telegram clean base.\n\n` +
          menuText
      );
    } else {
      await x.replyWithMarkdown(menuText);
    }
  },
};
