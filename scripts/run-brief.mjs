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
  const session = await post('/v1/beta/sessions', {
    agent_id: AGENT_ID,
    environment_id: ENV_ID,
  });
  const sessionId = session.id;
  console.log(`  session id: ${sessionId}`);

  const userMessage = `Run today's daily brief. Fetch yesterday's top AI and financial news, write all four sections, and persist the digest to Supabase. Follow the system prompt exactly.

${prefetchedContext}`;

  console.log('→ Sending initial message…');
  await post(`/v1/beta/sessions/${sessionId}/events`, {
    type: 'user_message',
    content: userMessage,
  });

  console.log('→ Polling session status…');
  const start = Date.now();
  const MAX = 12 * 60 * 1000; // 12 min
  while (Date.now() - start < MAX) {
    const s = await get(`/v1/beta/sessions/${sessionId}`);
    console.log(`  status: ${s.status}`);
    if (s.status === 'completed') {
      console.log('✓ Brief complete');
      process.exit(0);
    }
    if (s.status === 'failed' || s.status === 'error') {
      console.error('✗ Session failed:', s.error || s);
      process.exit(1);
    }
    await sleep(10_000);
  }
  console.error('✗ Timed out after 12 minutes');
  process.exit(1);
})().catch(e => {
  console.error('✗ Run failed:', e.message);
  process.exit(1);
});
