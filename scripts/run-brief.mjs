// scripts/run-brief.mjs
// Triggers the Daily Brief Managed Agent session — fire and forget.
// The agent runs autonomously in Anthropic's cloud, writes to Supabase on its own.
// We just need to create the session and send the initial message.

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

PRE-FETCHED SOURCES (already fetched for you from trusted feeds)
Use these as your primary content. Only call web_search if you need to
verify a specific number or if a critical story seems missing.

${JSON.stringify(cache, null, 2)}
`;
  console.log(`→ Loaded news-cache.json (${cache.ai_stories?.length || 0} AI + ${cache.finance_stories?.length || 0} finance + ${cache.market_quotes?.length || 0} quotes)`);
}

const headers = {
  'x-api-key': KEY,
  'anthropic-version': '2023-06-01',
  'anthropic-beta': BETA,
  'content-type': 'application/json',
};

async function post(path, body) {
  const r = await fetch(`${API}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  const text = await r.text();
  if (!r.ok) throw new Error(`POST ${path} failed: ${r.status} ${text}`);
  return JSON.parse(text);
}

// ---------- run ----------
(async () => {
  // Step 1: Create session
  console.log('→ Creating session…');
  const session = await post('/v1/sessions', {
    agent: AGENT_ID,
    environment_id: ENV_ID,
    title: `Daily Brief ${new Date().toISOString().slice(0, 10)}`,
  });
  const sessionId = session.id;
  console.log(`  ✓ session id: ${sessionId}`);

  // Step 2: Send the initial message
  const userMessageText = `Run today's daily brief. Fetch yesterday's top AI and financial news, write all four sections, and persist the digest to Supabase via execute_sql. Follow the system prompt exactly.

${prefetchedContext}`;

  console.log('→ Sending user.message event…');
  await post(`/v1/sessions/${sessionId}/events`, {
    events: [
      {
        type: 'user.message',
        content: [
          { type: 'text', text: userMessageText },
        ],
      },
    ],
  });
  console.log('  ✓ Message sent');

  // Step 3: Done. The agent runs autonomously from here.
  // It will call web_search, read/write Supabase, and finish on its own.
  // Check results by querying daily_digests in Supabase.
  console.log('');
  console.log('✓ Agent triggered. It will run autonomously in the cloud.');
  console.log('  Check results in ~5 min: SELECT * FROM daily_digests ORDER BY digest_date DESC LIMIT 1;');
  console.log(`  Or view the session in Claude Console: ${sessionId}`);
  process.exit(0);
})().catch(e => {
  console.error('✗ Run failed:', e.message);
  process.exit(1);
});
