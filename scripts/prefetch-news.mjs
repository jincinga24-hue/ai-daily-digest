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
// NOTE: many vendor RSS feeds (Anthropic, Meta, Reuters, RBA) moved or got
// paywalled. We rely on aggregators (HN, Techmeme) + a few bloggers + AFR.
// HN front page filtered by points gives us AI model launches for free.
const AI_FEEDS = [
  { name: 'Hacker News front page',  url: 'https://hnrss.org/frontpage?points=150', category: 'ai-tech' },
  { name: 'Hacker News — AI tag',    url: 'https://hnrss.org/newest?q=AI+OR+LLM+OR+Claude+OR+GPT+OR+Anthropic+OR+OpenAI', category: 'ai-tech' },
  { name: 'Simon Willison',          url: 'https://simonwillison.net/atom/everything/', category: 'ai-blog' },
  { name: 'Techmeme',                url: 'https://www.techmeme.com/feed.xml', category: 'ai-aggregator' },
  { name: 'OpenAI blog',             url: 'https://openai.com/blog/rss.xml', category: 'ai-lab' },
  { name: 'Google DeepMind',         url: 'https://deepmind.google/blog/rss.xml', category: 'ai-lab' },
];

const FINANCE_FEEDS = [
  { name: 'AFR markets',             url: 'https://www.afr.com/rss/markets.xml', category: 'au-markets' },
  { name: 'ABC Business',            url: 'https://www.abc.net.au/news/feed/51892/rss.xml', category: 'au-markets' },
  { name: 'MarketWatch top',         url: 'https://feeds.marketwatch.com/marketwatch/topstories/', category: 'global-markets' },
  { name: 'CNBC top news',           url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html', category: 'global-markets' },
];

// Yahoo Finance v8 chart endpoint (still works without auth as of 2026)
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

async function fetchOneQuote(symbol) {
  // v8 chart endpoint — free, no auth, doesn't require cookies
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=5d`;
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' } });
    if (!r.ok) throw new Error(`${r.status}`);
    const j = await r.json();
    const m = j.chart?.result?.[0]?.meta;
    if (!m) throw new Error('no meta');
    const price = m.regularMarketPrice;
    const prev = m.chartPreviousClose ?? m.previousClose;
    const change = price - prev;
    const change_pct = (change / prev) * 100;
    return {
      symbol: m.symbol,
      name: m.longName || m.shortName || m.symbol,
      price: Number(price?.toFixed(2)),
      prev_close: Number(prev?.toFixed(2)),
      change: Number(change?.toFixed(2)),
      change_pct: Number(change_pct?.toFixed(2)),
      currency: m.currency,
      market_state: m.marketState,
    };
  } catch (e) {
    return { symbol, error: e.message };
  }
}

async function fetchQuotes() {
  const results = await Promise.all(TICKERS.map(fetchOneQuote));
  const ok = results.filter(r => !r.error);
  const bad = results.filter(r => r.error);
  console.log(`  ✓ Yahoo Finance: ${ok.length}/${TICKERS.length} quotes${bad.length ? ' (failed: ' + bad.map(b => b.symbol).join(',') + ')' : ''}`);
  return ok;
}

// ---------- GitHub trending AI repos ----------
async function fetchTrendingRepos() {
  // Search for repos with AI/LLM/ML topics, created or pushed in last 3 days, sorted by stars
  const since = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const queries = [
    `ai OR llm OR "large language model" OR "machine learning" pushed:>${since} stars:>50`,
    `agent OR rag OR embedding pushed:>${since} stars:>100`,
  ];
  const allRepos = [];
  for (const q of queries) {
    try {
      const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=10`;
      const r = await fetch(url, {
        headers: {
          'User-Agent': 'DailyBrief/1.0',
          Accept: 'application/vnd.github+json',
        },
      });
      if (!r.ok) { console.log(`  ✗ GitHub search: ${r.status}`); continue; }
      const j = await r.json();
      const repos = (j.items || []).map(repo => ({
        name: repo.full_name,
        url: repo.html_url,
        description: (repo.description || '').slice(0, 200),
        stars: repo.stargazers_count,
        language: repo.language,
        created: repo.created_at?.slice(0, 10),
        pushed: repo.pushed_at?.slice(0, 10),
        topics: (repo.topics || []).slice(0, 5),
      }));
      allRepos.push(...repos);
    } catch (e) {
      console.log(`  ✗ GitHub search: ${e.message}`);
    }
  }
  // Dedupe by name, sort by stars desc, take top 10
  const seen = new Set();
  const deduped = allRepos.filter(r => {
    if (seen.has(r.name)) return false;
    seen.add(r.name);
    return true;
  });
  deduped.sort((a, b) => b.stars - a.stars);
  const top = deduped.slice(0, 10);
  console.log(`  ✓ GitHub trending: ${top.length} repos`);
  return top;
}

// ---------- main ----------
(async () => {
  console.log('→ Pre-fetching AI feeds…');
  const aiResults = await Promise.all(AI_FEEDS.map(fetchFeed));

  console.log('→ Pre-fetching finance feeds…');
  const financeResults = await Promise.all(FINANCE_FEEDS.map(fetchFeed));

  console.log('→ Pre-fetching market quotes…');
  const quotes = await fetchQuotes();

  console.log('→ Pre-fetching GitHub trending AI repos…');
  const trendingRepos = await fetchTrendingRepos();

  const cache = {
    fetched_at: new Date().toISOString(),
    date: new Date().toISOString().slice(0, 10),
    ai_stories: aiResults.flatMap(r => r.items.map(it => ({ ...it, source: r.source, category: r.category }))),
    finance_stories: financeResults.flatMap(r => r.items.map(it => ({ ...it, source: r.source, category: r.category }))),
    market_quotes: quotes,
    trending_repos: trendingRepos,
  };

  writeFileSync('scripts/news-cache.json', JSON.stringify(cache, null, 2));
  console.log(`✓ Wrote scripts/news-cache.json`);
  console.log(`  ai stories:      ${cache.ai_stories.length}`);
  console.log(`  finance stories: ${cache.finance_stories.length}`);
  console.log(`  market quotes:   ${cache.market_quotes.length}`);
  console.log(`  trending repos:  ${cache.trending_repos.length}`);
  process.exit(0);
})();
