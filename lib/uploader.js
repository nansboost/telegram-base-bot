// lib/uploader.js
// Fitur upload file ke idweb.tech (image/video/all files) dan balikin URL
// Bergaya sama seperti di telebot-wa

const fetch = require('node-fetch');
const FormData = require('form-data');
const { fileTypeFromBuffer } = require('file-type');

/**
 * Upload buffer ke idweb.tech dan balikin URL file
 * @param {Buffer} buffer
 * @returns {Promise<string>} url file
 */
module.exports = async (buffer) => {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    throw new Error('Buffer tidak valid untuk upload');
  }

  const info = await fileTypeFromBuffer(buffer);
  const ext = info?.ext || 'bin';

  const bodyForm = new FormData();
  bodyForm.append('file', buffer, 'file.' + ext);

  const response = await fetch('https://idweb.tech/api/upload.php', {
    method: 'POST',
    body: bodyForm,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Upload gagal: ${response.status} ${text}`);
  }

  const result = await response.json();
  if (!result?.file?.url) {
    throw new Error('Response upload tidak berisi file.url');
  }

  return result.file.url;
};
