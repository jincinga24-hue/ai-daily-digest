# MVP Roast Report

**Date:** 2026-03-30
**Project:** The Daily AI Shift — Chemical Engineering x AI
**Overall Score:** 50/100
**Verdict:** NEEDS_WORK

---

## Score Breakdown

| Reviewer | Score | Verdict |
|----------|-------|---------|
| Power User (Raj) | 62/100 | MEH |
| Confused User (Liu Wei) | 31/100 | GAVE_UP |
| Skeptic (Nina) | 31/100 | QUESTIONABLE |
| Security | 72/100 | RISKY |
| Mobile | 62/100 | NEEDS_WORK |

Weighted average (30/25/20/15/10): **50/100**

---

## Top Issues (Must Fix)

1. **Navigation broken on 5 of 6 pages on mobile** — `renderNav()` is never called in index.html, radar.html, learn.html, community.html, readiness.html. Mobile users see an empty nav bar with zero links.
2. **Homepage "IMPACT" heading conveys nothing** — first-time visitors cannot tell what this site does in 10 seconds. Value proposition is buried below the fold.
3. **Radar evidence is narrative, not cited** — resources.json links to YouTube *search result pages*, not actual videos or papers. The core value prop ("evidence-based scores") does not survive a 30-second spot check.
4. **No distribution strategy exists** — GitHub Pages with no SEO, no email capture, no social plan. Three posts, seven pages, zero users.
5. **Scope bloat before core is solid** — Community, Jobs, Readiness, IMPACT pages added before Blog/Radar/Learn are done. Seven pages of content operations with zero audience.

---

## What Works (Praise)

1. **Calendar UX on the blog page** — posts as dots on a navigable monthly calendar with a preview panel is genuinely clever. Better than a plain list. Solid implementation.
2. **Jobs & Internships page** — only page a non-technical user understood in 5 seconds. Plain labels, obvious filters.
3. **AI Readiness by Role** — the most emotionally compelling feature for the target user. No competitor has built role-level exposure scores for Australian ChemE. If the methodology is credible, this is the real differentiator.

---

## Security Concerns

- **HIGH:** `learn.js` passes resource URLs into `href` attributes without `escapeHtml()` — the only place this sanitisation step is missing across the entire codebase
- **HIGH:** `ai-blog.sh` and `ai-auto.sh` pass `blog-prompt.md` content via shell interpolation — shell metacharacters in the prompt file evaluate in the shell
- **MEDIUM:** `ai-auto.sh` commits and pushes directly to `main` with no human review gate — AI agent with filesystem write access + web fetch = prompt injection risk on the entire repo
- **MEDIUM:** CSP meta tag exists only on `index.html`; all other pages including all post files are unprotected against CDN compromise
- **MEDIUM:** `basePath` in `renderNav()` is interpolated into `href` attributes without sanitisation

**One done right:** `escapeHtml()` is consistently applied to all JSON-sourced user-facing data across every JS file. Solid, deliberate default.

---

## Mobile Issues

- **CRITICAL:** `renderNav()` not called on 5 of 6 pages — those pages have no navigation on mobile whatsoever. No hamburger, no links, no way to get anywhere.
- Blog calendar `grid-cols-7` gives ~46px cells at 375px with `text-[10px]` day headers — below legibility threshold and tap targets too small
- Homepage `text-6xl` h1 has no mobile size override — "IMPACT" is enormous on a phone screen
- Jobs filter row has 4 select controls at `text-[11px]` with no min-height — hard to read and tap on iOS
- Readiness cards use `grid-cols-2 text-[10px]` inside cards — unreadable at 375px

**One that works:** `filter-btn` in main.css explicitly sets `min-height: 44px` — the Learn page pill filters meet the Apple/Google touch target spec.

---

## Individual Roasts

### Power User — Raj (62/100 — MEH)

The PRD specifies 3 pages; you built 6 with no acceptance criteria for the extras. The "dark theme" direction in the PRD (deep navy/black, indigo + cyan) is completely absent — you shipped a light theme with white cards and grey backgrounds. The resource feed filter buttons imply variety but 12 of 14 topic groups in resources.json are `article` type — filter by `youtube` or `podcast` and you get 1–3 results with no empty state. `knowledge-graph.json` is manually maintained and the generation pipeline almost certainly never updates it. Zero automated test coverage despite a `tests/` directory and explicit "testable outside DOMContentLoaded" comments throughout the code.

Architecture is genuinely clean for vanilla JS. Separation of pure helpers from DOM code is deliberate and correct. The data schema across posts.json, radar-data.json, radar-history.json, and radar-evidence.json is well-structured and maintainable. When this runs, it runs cleanly. It's a 6 not a 4 — but it's not ready to ship.

### Confused User — Liu Wei (31/100 — GAVE_UP)

"IMPACT" in giant letters. Impact of what? The calendar appears but no visual difference tells me which days have content — I click grey boxes wondering why nothing happens. On the radar page, a spider web with "Theoretical vs Observed Coverage" — I do not know what coverage means here. Red normally means danger; on the Readiness page, a high score is in red — is my job threatened? The Community page has filter buttons before I understand what the content is.

The Jobs page is the one exception. "JOBS & INTERNSHIPS" says exactly what it is. Plain filter labels. I understood it in 5 seconds.

### Skeptic — Nina (31/100 — QUESTIONABLE)

~15,000–20,000 practising Australian ChemEs. The slice who care about AI, are not already served by LinkedIn newsletters and vendor blogs, and will return daily to a GitHub Pages site is in the hundreds. The daily digest collapses if the operator skips a day — zero content moat, zero compounding. A competitor can replicate 75 posts in a weekend with the same prompt and same ChemE framing. The radar claims "evidence-based" but links point to YouTube search result pages. No distribution strategy exists in the PRD, PROGRESS, or HARNESS-STATE — success is defined as "pages render," not "users return." After 15 build cycles, there are three posts.

The Readiness page is the exception. A role-specific exposure score with cited methodology, distributed through one Australian university ChemE department — that is something real. Scrap the rest, make that credible.

### Security Review (72/100 — RISKY)

Static site with no backend — inherently lower attack surface. The automated pipeline is the real risk: `ai-auto.sh` grants an AI agent filesystem write access, fetches from the web (prompt injection vector), then auto-commits and pushes to `main` with no human gate. The `learn.js` href is the only place `escapeHtml()` is missing in an otherwise consistent codebase. CSP exists only on `index.html`.

### Mobile Review (62/100 — NEEDS_WORK)

The showstopper: `renderNav()` is never called in the `<script>` tags of 5 of 6 pages. Those pages have no navigation on mobile — no hamburger, no links, no way to get anywhere else on the site. This single bug makes most of the site non-functional on a phone. Fix this first. Then address the calendar tap target problem and the text sizing on readiness cards.

---

## Next Steps

Run `/vibe-harness` cycles focusing on:

1. **Mobile nav** — call `renderNav()` on all pages, verify at 375px
2. **Onboarding clarity** — replace "IMPACT" hero with a clear one-line value statement; 10-second test with a real person
3. **Radar credibility** — replace YouTube search URLs with real cited sources; add visible methodology section to the radar page

The Readiness feature is the real differentiator. Consider a focused sprint on that single page with cited methodology and a distribution partnership with one Australian ChemE student society before expanding anything else.
