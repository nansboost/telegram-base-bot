// lib/runtime.js
// Hitung lama runtime bot sejak start

const startTime = Date.now();

function getUptime() {
  const diff = Date.now() - startTime;
  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / (1000 * 60)) % 60;
  const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  const parts = [];
  if (days) parts.push(`${days} hari`);
  if (hours) parts.push(`${hours} jam`);
  if (minutes) parts.push(`${minutes} menit`);
  if (seconds || parts.length === 0) parts.push(`${seconds} detik`);

  return parts.join(' ');
}

module.exports = { getUptime };
