// lib/afk.js
// Penyimpanan status AFK sederhana di memory

const afkMap = new Map();

function setAfk(userId, name, reason) {
  afkMap.set(userId, {
    name: name || '',
    reason: reason || '',
    at: Date.now(),
  });
}

function clearAfk(userId) {
  const info = afkMap.get(userId);
  if (info) afkMap.delete(userId);
  return info || null;
}

function getAfk(userId) {
  return afkMap.get(userId) || null;
}

module.exports = { setAfk, clearAfk, getAfk };
