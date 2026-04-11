// scripts/run-brief.mjs
// Triggers the Daily Brief Managed Agent, waits for it to finish, exits.
// Run via: node scripts/run-brief.mjs
// Requires env: ANTHROPIC_API_KEY, CLAUDE_AGENT_ID, CLAUDE_ENVIRONMENT_ID

import { readFileSync, existsSync } from 'node:fs';

const API = 'https://api.anthropic.com';
const BETA = 'managed-agents-2026-04-01';

const KEY = process.env.ANTHROPIC_API_KEY;
const AGENT_ID = process.env.CLAUDE_AGENT_ID;
const ENV_ID = process.env.CLAUDE_ENVIRONMENT_ID;

if (!KEY || !AGENT_ID || !ENV_ID) {
  console.error('Missing env vars. Need ANTHROPIC_API_KEY, CLAUDE_AGENT_ID, CLAUDE_ENVIRONMENT_ID.');
  process.exit(1);
}

// Read pre-fetched news blob if present (produced by prefetch-news.mjs)
let prefetchedContext = '';
if (existsSync('scripts/news-cache.json')) {
  const cache = JSON.parse(readFileSync('scripts/news-cache.json', 'utf8'));
  prefetchedContext = `
=============================
PRE-FETCHED SOURCES
=============================
The following articles were already fetched for you from trusted sources.
Use these as your primary content. Only call web_search if you need to
verify a specific number or if a critical story is missing.

${JSON.stringify(cache, null, 2)}
`;
}

const headers = {
  'x-api-key': KEY,
  'anthropic-beta': BETA,
  'content-type': 'application/json',
};

async function post(path, body) {
  const r = await fetch(`${API}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`POST ${path} failed: ${r.status} ${await r.text()}`);
  return r.json();
}

async function get(path) {
  const r = await fetch(`${API}${path}`, { headers });
  if (!r.ok) throw new Error(`GET ${path} failed: ${r.status} ${await r.text()}`);
  return r.json();
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ---------- run ----------
(async () => {
  console.log('→ Creating session…');
  const session = await post('/v1/sessions', {
    agent: AGENT_ID,
    environment_id: ENV_ID,
    title: `Daily Brief ${new Date().toISOString().slice(0, 10)}`,
  });
  const sessionId = session.id;
  console.log(`  session id: ${sessionId}`);

  const userMessageText = `Run today's daily brief. Fetch yesterday's top AI and financial news, write all four sections, and persist the digest to Supabase. Follow the system prompt exactly.

${prefetchedContext}`;

  console.log('→ Sending initial user.message event…');
  await post(`/v1/sessions/${sessionId}/events`, {
    type: 'user.message',
    content: [
      { type: 'text', text: userMessageText },
    ],
  });

  console.log('→ Polling session status…');
  const start = Date.now();
  const MAX = 15 * 60 * 1000; // 15 min

  const TERMINAL_OK = new Set(['completed', 'complete', 'done', 'finished', 'idle', 'stopped']);
  const TERMINAL_BAD = new Set(['failed', 'error', 'errored', 'cancelled', 'canceled']);

  while (Date.now() - start < MAX) {
    await sleep(10_000);
    const s = await get(`/v1/sessions/${sessionId}`);
    const status = s.status || s.state || 'unknown';
    console.log(`  status: ${status}`);

    if (TERMINAL_OK.has(status)) {
      console.log('✓ Session reached terminal OK state');
      // Optional: verify the digest was actually written by checking events
      process.exit(0);
    }
    if (TERMINAL_BAD.has(status)) {
      console.error('✗ Session failed:', JSON.stringify(s, null, 2));
      process.exit(1);
    }
  }
  console.error('✗ Timed out after 15 minutes');
  process.exit(1);
})().catch(e => {
  console.error('✗ Run failed:', e.message);
  process.exit(1);
});
