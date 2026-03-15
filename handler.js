// handler.js
// Loader plugin dan router command sederhana.

const fs = require('fs');
const path = require('path');
const { wrapContext } = require('./lib/simple');

function loadPlugins() {
  const pluginsDir = path.join(__dirname, 'plugins');
  const files = fs.readdirSync(pluginsDir).filter(f => f.endsWith('.js'));
  const plugins = [];

  for (const file of files) {
    const full = path.join(pluginsDir, file);
    try {
      const plugin = require(full);
      if (plugin && plugin.name && Array.isArray(plugin.commands) && typeof plugin.handler === 'function') {
        plugins.push(plugin);
      }
    } catch (err) {
      console.error('❌ Gagal load plugin', file, err.message);
    }
  }

  return plugins;
}

function setupHandlers(bot) {
  const plugins = loadPlugins();
  console.log('✅ Plugins termuat:', plugins.map(p => p.name));

  // Simpan daftar plugin di bot.context supaya bisa diakses dari plugin lain (misal menu)
  bot.context._plugins = plugins;

  // Daftarkan semua commands dari setiap plugin
  for (const plugin of plugins) {
    for (const cmd of plugin.commands) {
      bot.command(cmd, async (ctx) => {
        const x = wrapContext(ctx);
        try {
          await plugin.handler(bot, x);
        } catch (err) {
          console.error(`Error di plugin ${plugin.name}/${cmd}:`, err);
          await ctx.reply('❌ Terjadi error di sisi bot.');
        }
      });
    }
  }
}

module.exports = { setupHandlers };
