require('dotenv').config();

const config = {
  botToken: process.env.BOT_TOKEN,
  downloaderApiKey: process.env.DOWNLOADER_API_KEY || '',
};

if (!config.botToken || config.botToken === 'ISI_TOKEN_BOT_TELEGRAM_KAMU') {
  console.error('❌ BOT_TOKEN belum di-set di file .env');
  process.exit(1);
}

module.exports = config;
