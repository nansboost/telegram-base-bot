// main.js
// Entry point telebot versi bersih (Telegraf + handler + plugins)

const { Telegraf } = require('telegraf');
const config = require('./config');
const { setupHandlers } = require('./handler');
const afkStore = require('./lib/afk');
const { suggest } = require('./lib/didyoumean');

const bot = new Telegraf(config.botToken);

setupHandlers(bot);

// Middleware DidYouMean untuk command typo
bot.on('text', async (ctx, next) => {
  const text = ctx.message?.text || '';
  if (!text.startsWith('/')) return next();

  const cmd = text.split(/\s+/)[0].slice(1); // buang '/'
  if (!cmd) return next();

  const plugins = ctx._plugins || bot.context._plugins || [];
  const allCommands = [];
  for (const p of plugins) {
    for (const c of p.commands || []) {
      allCommands.push(c);
    }
  }

  // Kalau command valid, lanjut saja
  if (allCommands.includes(cmd)) return next();

  const suggestion = suggest(cmd, allCommands, 2);
  if (suggestion) {
    await ctx.reply(`Maksud kamu /${suggestion} ?`);
    // Tetap lanjut (biar kalau ada handler lain yang nangkep, jalan), atau bisa return tanpa next();
    return;
  }

  return next();
});

// Middleware global untuk AFK:
// - kalau user yang AFK kirim pesan biasa → clear AFK dan kasih info
// - kalau reply ke user AFK → beri tahu bahwa user tersebut sedang AFK
bot.on('message', async (ctx, next) => {
  const userId = ctx.from?.id;
  const isCommand = !!ctx.message?.text && ctx.message.text.startsWith('/');

  // Kalau user AFK kirim pesan non-command → clear AFK
  if (userId && !isCommand) {
    const cleared = afkStore.clearAfk(userId);
    if (cleared) {
      const now = Date.now();
      const diff = now - cleared.at;
      const seconds = Math.floor(diff / 1000) % 60;
      const minutes = Math.floor(diff / (1000 * 60)) % 60;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const parts = [];
      if (hours) parts.push(`${hours} jam`);
      if (minutes) parts.push(`${minutes} menit`);
      if (seconds || parts.length === 0) parts.push(`${seconds} detik`);
      const dur = parts.join(' ');
      const username = ctx.from?.username;
      const mention = username ? `@${username}` : (cleared.name || ctx.from?.first_name || 'kamu');
      await ctx.reply(`👋 ${mention} sudah AFK selama ${dur}.`);
    }
  }

  // Kalau reply ke seseorang yang sedang AFK
  const replied = ctx.message?.reply_to_message?.from;
  if (replied && replied.id) {
    const info = afkStore.getAfk(replied.id);
    if (info) {
      const minutes = Math.floor((Date.now() - info.at) / 60000);
      const dur = minutes > 0 ? `${minutes} menit` : 'baru saja';
      const reason = info.reason ? ` Alasan: ${info.reason}` : '';
      await ctx.reply(
        `${info.name || 'Dia'} lagi AFK (${dur}).${reason}`
      );
    }
  }

  await next();
});

bot.launch().then(() => {
  console.log('✅ telebot-clean berjalan dengan Telegraf...');
}).catch(err => {
  console.error('❌ Gagal launch bot:', err);
  process.exit(1);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
