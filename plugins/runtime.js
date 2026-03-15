// plugins/runtime.js
// Menampilkan berapa lama bot aktif sejak start

const { getUptime } = require('../lib/runtime');

module.exports = {
  name: 'runtime',
  commands: ['runtime', 'uptime'],

  async handler(bot, x) {
    const up = getUptime();
    await x.reply(`⏱ Bot aktif selama: ${up}`);
  },
};
