# Daily Brief — Progress Checkpoint

**Last updated:** 2026-04-12 (end of session)

## Where we are

Pivoted the project from "ChemE × AI evidence-based radar" to **personal AI + finance daily briefing** with a patient-teacher voice. The whole pipeline is built and the first manual run worked end-to-end. Now wiring up the GitHub Actions cron for daily automation.

## What's working ✅

- [x] Supabase project live at `oqveovumfkianekagtra.supabase.co`
- [x] Schema: `user_profile`, `curriculum`, `daily_digests`, `sources` — all created + seeded
- [x] Claude Managed Agent "Daily Brief v2" (Sonnet 4.6) created
- [x] Supabase MCP wired to agent (execute_sql tool available)
- [x] First manual run from Console: wrote real digest to `daily_digests`, ticked `inflation-cpi` as taught, used 9 real sources from CNBC/TechCrunch/etc
- [x] Render page at `/brief/` (`brief.html`) — reads Supabase via anon key, renders 4 sections + source list
- [x] Pre-fetch script (`scripts/prefetch-news.mjs`) working locally: 10 AI + 20 finance stories + 11/11 market quotes
- [x] GitHub Actions workflow `.github/workflows/daily-brief.yml` in place
- [x] 3 GitHub secrets added (note: named without underscores — ANTHROPICAPIKEY, CLAUDEAGENTID, CLAUDEENVIRONMENTID)
- [x] Workflow file maps those secret names to proper env vars (ANTHROPIC_API_KEY, CLAUDE_AGENT_ID, CLAUDE_ENVIRONMENT_ID) for the Node script

## Currently blocking ⚠️

**Unverified:** the full end-to-end run on GitHub Actions.

The last attempted run hit a 404 on `/v1/beta/sessions` because the script still had the wrong endpoint path. Fixed in commit `f12a867`:
- Endpoint is `/v1/sessions` (no /beta/)
- Field is `agent` not `agent_id`
- Event type is `user.message` not `user_message`
- Content is `[{"type":"text","text":"..."}]` array, not a plain string

**The "re-run failed jobs" trap:** re-running an old failed workflow uses the ORIGINAL commit, not the latest. Must click "Run workflow" (the dropdown on the workflow page) to start a fresh run on `main`.

## Next steps — pick up here tomorrow

### 1. Run a FRESH workflow on GitHub Actions
- Go to https://github.com/jincinga24-hue/ai-daily-digest/actions/workflows/daily-brief.yml
- Click **Run workflow** dropdown → branch `main` → green **Run workflow** button
- Click into the new run (commit should be `f12a867` or newer)
- Watch the `Trigger Daily Brief agent` step logs

### 2. If status polling terminal values are wrong
The script recognises these as terminal-OK: `completed`, `complete`, `done`, `finished`, `idle`, `stopped`. If the polling loop logs something else forever (like `status: running` that never changes, or an unknown status like `waiting`/`ready`), widen the set in `scripts/run-brief.mjs`.

### 3. Verify the digest was written
After the workflow goes green, run in Supabase SQL Editor:
```sql
select digest_date, length(ai_section), length(markets_section), length(personal_takeaway)
from daily_digests order by digest_date desc limit 2;

select slug, taught_at from curriculum where taught_at is not null order by taught_at desc;
```
Should show today's row + `inflation-cpi` marked taught from yesterday's run (and optionally `interest-rates` marked today if the agent ran on a new day).

### 4. Verify the render page works
The Jekyll site needs to be deployed somewhere to be visible on the web. **TBD — not deployed yet.**
Options:
- **GitHub Pages** (free, 5 min): repo → Settings → Pages → Source = GitHub Actions or main branch
- **Netlify / Vercel** (free): connect the repo, auto-deploys on push

For local preview right now:
```bash
cd "/Users/jincinga24/Vs Code/First Project/ai-daily-digest"
bundle exec jekyll serve
# open http://localhost:4000/brief/
```
Or just double-click `brief.html` in Finder — it's self-contained and works offline once the page JS fetches from Supabase.

### 5. Schedule lockdown
Cron is already set for `0 21 * * *` UTC (21:00 UTC daily). Melbourne in AEST = 7am, AEDT = 8am. Leave it running for a week and come back if anything drifts.

## Known TODOs (not urgent)

- [ ] Rotate the Anthropic API key — it was pasted in a Claude chat transcript earlier, technically compromised. Takes 10 sec at console.anthropic.com/settings/keys.
- [ ] Deploy the Jekyll site (GitHub Pages or Netlify) so `/brief/` is accessible from anywhere
- [ ] Seed more curriculum rows (currently 5 — inflation-cpi, interest-rates, stocks-vs-bonds, exchange-rates, pe-ratio). Target: 30 concepts for a full month without repeats
- [ ] Add "Day 6-30" concepts: gdp, qe, bull/bear, etf, dividend-vs-growth, shorting, options-basics, earnings-season, commodities, yield-curve, leverage, bubble, safe-haven, rate-impact-chain, rba-vs-fed-on-aud, au-housing, crypto-basics, stablecoin, vc-valuation, unicorn, ipo, tech-vs-value, inflation-expectations, recession-signals, etc.
- [ ] Spot-check one source URL from yesterday's digest (Mythos/TechCrunch) to confirm it resolves — the brief was grounded by real web searches but we never verified it
- [ ] Consider pre-fetch refinements: Simon Willison feed sometimes times out (10s limit), add retry; HN tag feed hit 429 rate limit, remove or throttle

## Cost budget

Estimated **$7–8/month** with pre-fetch enabled. Set a hard cap of $20/month in the Claude Console → Usage & Limits as a safety net.

## Files touched this session

Committed to `main`:
- `.github/workflows/daily-brief.yml` — cron + workflow
- `scripts/prefetch-news.mjs` — RSS + quotes fetcher
- `scripts/run-brief.mjs` — agent session trigger
- `brief.html` — Jekyll-served render page
- `package.json` — added `rss-parser` dep, `npm run brief` command
- `CHECKPOINT.md` — this file

Not committed (local only):
- `.env.local` — secrets (gitignored ✓)
- `scripts/news-cache.json` — generated each run (should be gitignored)

## Latest commits

```
f12a867  fix: use correct Managed Agents API endpoints and event shape
9d4b4c0  fix: match GitHub secret names (no underscores) to workflow env mapping
9de1e60  fix: prefetch script feed URLs and Yahoo Finance endpoint
0044893  feat: pivot to Daily Brief — Managed Agent + Supabase + render page
```
