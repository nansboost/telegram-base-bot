// lib/tiktok-lovetik.js
// Integrasi sederhana ke Lovetik untuk ambil link TikTok

const axios = require('axios');

const clean = (data = '') => {
  if (!data) return '';
  let regex = /(<([^>]+)>)/gi;
  data = data.replace(/(<br?\s?\/>)/gi, ' \n');
  return data.replace(regex, '');
};

async function shortener(url) {
  // placeholder kalau nanti mau pakai shortener
  return url;
}

async function fetchLovetik(query) {
  const res = await axios('https://lovetik.com/api/ajax/search', {
    method: 'POST',
    data: new URLSearchParams({ query }),
  });

  const d = res.data || {};
  const result = {};

  result.creator = 'YNTKTS';
  result.title = clean(d.desc || '');
  result.author = clean(d.author || '');

  const links = d.links || [];

  // Beberapa implementasi Lovetik menaruh:
  // links[0] = video dengan watermark
  // links[1] = video tanpa watermark
  result.watermark = links[0]?.a
    ? await shortener((links[0].a || '').replace('https', 'http'))
    : null;

  result.nowm = links[1]?.a
    ? await shortener((links[1].a || '').replace('https', 'http'))
    : null;

  result.audio = links[2]?.a
    ? await shortener((links[2].a || '').replace('https', 'http'))
    : null;

  result.thumbnail = d.cover || '';

  return result;
}

module.exports = { fetchLovetik };
