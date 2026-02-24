import http from 'node:http';

const PORT = Number(process.env.PORT || 8787);
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const PROXY_SHARED_TOKEN = process.env.GARDEN_PROXY_TOKEN || '';
const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

function json(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
      if (data.length > 512_000) {
        reject(new Error('Request too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}); }
      catch (err) { reject(err); }
    });
    req.on('error', reject);
  });
}

function sanitizeContext(ctx) {
  if (!ctx || typeof ctx !== 'object') return {};
  return ctx;
}

async function callProvider({ question, context, systemPrompt, model }) {
  if (!OPENAI_API_KEY) throw new Error('OPENAI_API_KEY missing');
  const payload = {
    model: model || DEFAULT_MODEL,
    temperature: 0.3,
    messages: [
      { role: 'system', content: systemPrompt || 'You are a gardening assistant.' },
      { role: 'user', content: `Question: ${question}\n\nGarden context JSON:\n${JSON.stringify(context, null, 2)}` },
    ],
  };
  const res = await fetch(OPENAI_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Provider error ${res.status}: ${txt.slice(0, 300)}`);
  }
  const data = await res.json();
  return String(data?.choices?.[0]?.message?.content || '').trim();
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, X-Garden-Proxy-Token',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    });
    return res.end();
  }

  if (req.url !== '/api/master-gardener' || req.method !== 'POST') {
    return json(res, 404, { error: 'Not found' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    if (PROXY_SHARED_TOKEN) {
      const token = req.headers['x-garden-proxy-token'];
      if (token !== PROXY_SHARED_TOKEN) return json(res, 401, { error: 'Unauthorized' });
    }

    const body = await readJson(req);
    const question = String(body?.question || '').trim();
    if (!question) return json(res, 400, { error: 'Missing question' });

    const context = sanitizeContext(body?.context);
    const answer = await callProvider({
      question,
      context,
      systemPrompt: String(body?.systemPrompt || ''),
      model: String(body?.model || DEFAULT_MODEL),
    });

    return json(res, 200, {
      answer,
      sources: ['Proxy AI', 'Garden Context Payload', 'Your Garden Data'],
    });
  } catch (err) {
    console.error('[master-gardener-proxy]', err);
    return json(res, 500, { error: 'Proxy request failed' });
  }
});

server.listen(PORT, () => {
  console.log(`Master Gardener proxy listening on http://localhost:${PORT}/api/master-gardener`);
});
