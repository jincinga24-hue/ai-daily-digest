// scripts/send-telegram.mjs
// Reads today's digest from Supabase and sends it to Telegram.
// Runs AFTER the agent has finished writing to the DB.

const SUPABASE_URL = 'https://oqveovumfkianekagtra.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xdmVvdnVtZmtpYW5la2FndHJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5MDY4MzcsImV4cCI6MjA5MTQ4MjgzN30.vmzA7fo4VNNeIxQjVEg9r23f1nOPwIJFFCPs8e-sDQo';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!BOT_TOKEN || !CHAT_ID) {
  console.error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID');
  process.exit(1);
}

async function getLatestDigest() {
  const url = `${SUPABASE_URL}/rest/v1/daily_digests?select=*&order=digest_date.desc&limit=1`;
  const r = await fetch(url, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  if (!r.ok) throw new Error(`Supabase ${r.status}`);
  const rows = await r.json();
  return rows[0] || null;
}

async function sendTelegram(text) {
  // Telegram max message length is 4096 chars. Split if needed.
  const chunks = [];
  let remaining = text;
  while (remaining.length > 0) {
    if (remaining.length <= 4096) {
      chunks.push(remaining);
      break;
    }
    // Find last newline before 4096
    let cut = remaining.lastIndexOf('\n', 4096);
    if (cut <= 0) cut = 4096;
    chunks.push(remaining.slice(0, cut));
    remaining = remaining.slice(cut);
  }

  for (const chunk of chunks) {
    const r = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: chunk,
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      }),
    });
    if (!r.ok) {
      const err = await r.text();
      // Retry without Markdown if parsing fails
      if (err.includes("can't parse")) {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text: chunk,
            disable_web_page_preview: true,
          }),
        });
      } else {
        console.error(`Telegram error: ${err}`);
      }
    }
  }
}

(async () => {
  console.log('→ Fetching latest digest from Supabase…');
  const digest = await getLatestDigest();
  if (!digest) {
    console.error('No digest found');
    process.exit(1);
  }

  console.log(`  Found digest for ${digest.digest_date}`);

  const term = digest.term_of_day || {};
  const github = digest.github_trending || '';

  const msg = `☀️ *Daily Brief — ${digest.digest_date}*

🤖 *AI Today*
${digest.ai_section}

📈 *Markets at a Glance*
${digest.markets_section}

📚 *Term of the Day: ${term.title || ''}*
${term.body || ''}

🎯 *What This Means For You*
${digest.personal_takeaway}

🔥 *GitHub Trending*
${github || 'No trending repos today.'}`;

  console.log('→ Sending to Telegram…');
  await sendTelegram(msg);
  console.log('✓ Sent to Telegram');
  process.exit(0);
})().catch(e => {
  console.error('✗ Failed:', e.message);
  process.exit(1);
});
