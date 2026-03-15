// lib/simple.js
// Helper untuk membungkus Telegraf ctx menjadi objek yang lebih enak dipakai plugin.

function wrapContext(ctx) {
  return {
    ctx,
    chatId: ctx.chat?.id,
    fromId: ctx.from?.id,
    text: ctx.message?.text || '',
    reply: (text, extra) => ctx.reply(text, extra),
    replyWithMarkdown: (text, extra) => ctx.replyWithMarkdown(text, extra),
    replyWithDocument: (file, extra) => ctx.replyWithDocument(file, extra),
    replyWithVideo: (file, extra) => ctx.replyWithVideo(file, extra),
  };
}

module.exports = { wrapContext };
