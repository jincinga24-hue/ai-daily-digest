# Project Progress: The Daily AI Shift — Chemical Engineering x AI

**Generated:** 2026-03-30
**Status:** MVP COMPLETE — ready for deployment
**Audience:** Australian chemical engineers (students + professionals)
**Brand:** IMPACT

---

## What Is This

An evidence-based AI intelligence platform for Australian chemical engineers. 6 pages:

1. **Blog** — Calendar view of daily ChemE AI digests
2. **Radar** — Spider chart + sparkline trends + citable evidence base across 12 ChemE sub-sectors
3. **Learn** — Curated resources (articles, YouTube, GitHub, podcasts) with topic card grid
4. **Community** — Field reports from real ChemEs about AI tools they've used
5. **Jobs** — Internships + grad roles + research positions with AI relevance context
6. **Readiness** — AI exposure scores for 6 ChemE roles with animated counters

## The Moat

The radar is backed by `radar-evidence.json` — every score is traceable to citable sources (company deployments, product launches, research papers, hiring signals). Click any sector, see the evidence. No one else has structured, evidence-based AI adoption data for Australian ChemE sub-sectors.

## What's Done

| Feature | Status |
|---------|--------|
| Calendar blog with post preview | DONE |
| Evidence-based radar (12 sub-sectors, 23 evidence entries) | DONE |
| Trend sparklines (6 weeks history) | DONE |
| Knowledge graph + related posts | DONE |
| Learn & Adapt topic cards with detail panel | DONE |
| Community field reports (6 reports) | DONE |
| Jobs & internships (10 listings, filters) | DONE |
| Readiness scores (6 roles, animated counters) | DONE |
| Dark/light mode toggle | DONE |
| Smooth filter transitions | DONE |
| RSS feed (feed.xml) | DONE |
| Empty calendar states + post count | DONE |
| Nav fixed (no IMPACT/BLOG duplicate) | DONE |
| CSP headers on all pages | DONE |
| XSS protection (escapeHtml) | DONE |
| Mobile responsive | DONE |
| Daily pipeline (ai-blog, ai-publish, ai-auto) | DONE |
| Job scraping in daily pipeline | DONE |
| Evidence-based score adjustment rules | DONE |
| Weekly radar history snapshot | DONE |
| Australia localisation (en-AU) | DONE |

## Roast Results

| Test | Score | Key Feedback |
|------|-------|-------------|
| Vibe Harness (15 cycles) | 8.95/10 | Solid technical execution |
| Skill Roast (5 personas) | 48/100 | Evidence system, mobile, distribution |
| VC Gauntlet (roastmymvp) | 22/100 | "Evidence radar could be genuinely differentiated" |
| Community Test (10 users) | NO-GO | Loved niche specificity, wanted RSS + better nav |

## How to Run

```bash
cd ~/Vs\ Code/First\ Project/ai-daily-digest
python3 -m http.server 8090
# Open http://localhost:8090
```

## Daily Usage

```bash
source ~/.zshrc
ai-blog      # research + write today's draft + update all JSON data
ai-publish   # approve and push
ai-auto      # skip review, auto-publish
```

---

## What's Left (Next Session)

### Must Do Before Launch
- [ ] Get a real domain (thedailyaishift.com.au or similar)
- [ ] Create GitHub repo + enable GitHub Pages
- [ ] Post daily for 2 weeks to fill the calendar
- [ ] Add email subscription (Buttondown or Substack embed)

### Dynamic UI To Add (from backlog)
- [ ] Radar chart animates in — sectors draw one by one on scroll
- [ ] Sparklines animate — draw left to right when scrolled into view
- [ ] Evidence panel slides open — smooth height animation
- [ ] Scroll progress bar — thin blue bar on blog posts showing read progress
- [ ] Nav shrinks on scroll — compact nav as you scroll down
- [ ] Calendar day hover preview — tooltip showing title without clicking
- [ ] Typing effect on hero — "Chemical Engineering x AI" types out

### Product Improvements
- [ ] Search across all posts
- [ ] Tag-based filtering on blog calendar
- [ ] Email newsletter integration
- [ ] SEO: sitemap.xml, proper canonical URLs, OG images as PNG
- [ ] Convert Tailwind CDN to local build (remove unsafe-eval from CSP)
- [ ] Add proper headless test runner (jest + jsdom)
- [ ] Mobile calendar: consider list view on < 640px instead of 7-col grid

### Content
- [ ] Backfill community reports with more real examples
- [ ] Add more job listings from GradConnection
- [ ] Update readiness scores quarterly based on evidence
- [ ] Consider B2B pivot: quarterly mining intelligence brief at $500-1000/report

### Evidence Pipeline
- [ ] Automate SEEK job count scraping per sector (weekly)
- [ ] Track IP Australia patent filings mentioning AI + chemical engineering
- [ ] Monitor company press releases via RSS for AI keywords
- [ ] Count academic papers per sub-sector (Google Scholar)

---

## File Structure

```
ai-daily-digest/
├── index.html              # Blog calendar (home)
├── radar.html              # AI Impact Radar + trends + evidence
├── learn.html              # Curated resources (topic cards)
├── community.html          # ChemE field reports
├── jobs.html               # Internships & grad roles
├── readiness.html          # AI readiness scores by role
├── feed.xml                # RSS feed
├── posts/                  # Blog post HTML files
├── assets/
│   ├── css/main.css
│   ├── js/
│   │   ├── utils.js        # renderNav, renderRelatedPosts, escapeHtml, formatDate, dark mode
│   │   ├── blog.js         # Calendar renderer
│   │   ├── radar.js        # Chart.js radar + trends + evidence panel
│   │   ├── learn.js        # Topic cards + detail panel + filters
│   │   ├── community.js    # Field reports + filters
│   │   └── jobs.js         # Job listings + filters
│   └── data/
│       ├── posts.json          # Blog post index
│       ├── radar-data.json     # 12 ChemE sub-sectors, current scores
│       ├── radar-history.json  # Weekly snapshots (sparklines)
│       ├── radar-evidence.json # 23 evidence entries backing every score
│       ├── knowledge-graph.json # 16 entities connecting posts
│       ├── resources.json      # Curated links
│       ├── community.json      # 6 field reports
│       ├── jobs.json           # 10 job listings
│       └── readiness-scores.json # 6 role assessments
├── scripts/
│   ├── ai-blog.sh          # Daily draft generator
│   ├── ai-publish.sh       # Publish approved draft
│   ├── ai-auto.sh          # Auto-publish
│   ├── create-post.sh      # Post template generator
│   └── blog-prompt.md      # Master prompt (ChemE-focused)
├── tests/test.html         # Smoke tests
├── CLAUDE.md
├── ROAST-REPORT.md
├── ROAST-REAL-3.md
├── COMMUNITY-REPORT.md
└── PROGRESS.md
```
