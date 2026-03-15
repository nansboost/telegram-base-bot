// lib/nvidia-ai.js
// Wrapper sederhana untuk NVIDIA AI (OpenAI-compatible API)

const OpenAI = require('openai');
require('dotenv').config();

const apiKey = process.env.NVIDIA_API_KEY;

if (!apiKey || apiKey === 'ISI_KEY_NVAPI_MILIK_KAMU_SENDIRI') {
  console.warn('⚠️ NVIDIA_API_KEY belum di-set di .env, fitur /ai tidak aktif.');
}

const client = apiKey
  ? new OpenAI({
      apiKey,
      baseURL: 'https://integrate.api.nvidia.com/v1',
    })
  : null;

async function askNvidia(messages, opts = {}) {
  if (!client) throw new Error('NVIDIA API belum dikonfigurasi.');

  const {
    model = 'openai/gpt-oss-120b',
    temperature = 0.7,
    top_p = 0.9,
    max_tokens = 800,
  } = opts;

  const completion = await client.chat.completions.create({
    model,
    messages,
    temperature,
    top_p,
    max_tokens,
    stream: false,
  });

  const content = completion.choices?.[0]?.message?.content || '';
  return content;
}

module.exports = { askNvidia };
