// scripts/prefetch-news.mjs
// Pulls today's news from curated sources BEFORE the agent runs.
// Writes scripts/news-cache.json which the agent reads as context.
// This cuts the agent's web_search calls ~to zero = ~50% API cost savings.
//
// Run via: node scripts/prefetch-news.mjs
// Requires: npm install rss-parser

import Parser from 'rss-parser';
import { writeFileSync } from 'node:fs';

const parser = new Parser({ timeout: 10_000 });

// ---------- curated sources ----------
const AI_FEEDS = [
  { name: 'Hacker News front page',  url: 'https://hnrss.org/frontpage?points=150', category: 'ai-tech' },
  { name: 'Simon Willison',          url: 'https://simonwillison.net/atom/everything/', category: 'ai-blog' },
  { name: 'Anthropic news',          url: 'https://www.anthropic.com/news/rss.xml', category: 'ai-lab' },
  { name: 'OpenAI blog',             url: 'https://openai.com/blog/rss.xml', category: 'ai-lab' },
  { name: 'Google DeepMind',         url: 'https://deepmind.google/blog/rss.xml', category: 'ai-lab' },
  { name: 'Meta AI blog',            url: 'https://ai.meta.com/blog/rss/', category: 'ai-lab' },
];

const FINANCE_FEEDS = [
  { name: 'AFR markets',             url: 'https://www.afr.com/rss/markets.xml', category: 'au-markets' },
  { name: 'AFR companies',           url: 'https://www.afr.com/rss/companies.xml', category: 'au-companies' },
  { name: 'RBA announcements',       url: 'https://www.rba.gov.au/rss/rss-cb.xml', category: 'au-rates' },
  { name: 'Reuters markets',         url: 'https://www.reutersagency.com/feed/?best-topics=business-finance', category: 'global-markets' },
];

// Yahoo Finance quotes (free public API)
const TICKERS = ['^GSPC', '^IXIC', '^DJI', '^AXJO', 'AUDUSD=X', 'NVDA', 'MSFT', 'GOOG', 'META', 'AAPL', 'TSLA'];

// ---------- fetch helpers ----------
async function fetchFeed(feed) {
  try {
    const parsed = await parser.parseURL(feed.url);
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const items = (parsed.items || [])
      .filter(it => {
        const pubDate = it.isoDate ? new Date(it.isoDate).getTime() : now;
        return now - pubDate < dayMs * 1.5; // last ~36h
      })
      .slice(0, 5)
      .map(it => ({
        title: it.title,
        url: it.link,
        summary: (it.contentSnippet || it.content || '').slice(0, 400),
        published: it.isoDate,
      }));
    console.log(`  ✓ ${feed.name}: ${items.length} items`);
    return { source: feed.name, category: feed.category, items };
  } catch (e) {
    console.log(`  ✗ ${feed.name}: ${e.message}`);
    return { source: feed.name, category: feed.category, items: [], error: e.message };
  }
}

async function fetchQuotes() {
  try {
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${TICKERS.join(',')}`;
    const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!r.ok) throw new Error(`${r.status}`);
    const j = await r.json();
    const result = (j.quoteResponse?.result || []).map(q => ({
      symbol: q.symbol,
      name: q.shortName,
      price: q.regularMarketPrice,
      change: q.regularMarketChange,
      change_pct: q.regularMarketChangePercent,
      prev_close: q.regularMarketPreviousClose,
      market_state: q.marketState,
    }));
    console.log(`  ✓ Yahoo Finance: ${result.length} quotes`);
    return result;
  } catch (e) {
    console.log(`  ✗ Yahoo Finance: ${e.message}`);
    return [];
  }
}

// ---------- main ----------
(async () => {
  console.log('→ Pre-fetching AI feeds…');
  const aiResults = await Promise.all(AI_FEEDS.map(fetchFeed));

  console.log('→ Pre-fetching finance feeds…');
  const financeResults = await Promise.all(FINANCE_FEEDS.map(fetchFeed));

  console.log('→ Pre-fetching market quotes…');
  const quotes = await fetchQuotes();

  const cache = {
    fetched_at: new Date().toISOString(),
    date: new Date().toISOString().slice(0, 10),
    ai_stories: aiResults.flatMap(r => r.items.map(it => ({ ...it, source: r.source, category: r.category }))),
    finance_stories: financeResults.flatMap(r => r.items.map(it => ({ ...it, source: r.source, category: r.category }))),
    market_quotes: quotes,
  };

  writeFileSync('scripts/news-cache.json', JSON.stringify(cache, null, 2));
  console.log(`✓ Wrote scripts/news-cache.json`);
  console.log(`  ai stories:      ${cache.ai_stories.length}`);
  console.log(`  finance stories: ${cache.finance_stories.length}`);
  console.log(`  market quotes:   ${cache.market_quotes.length}`);
})();
