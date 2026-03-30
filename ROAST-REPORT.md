# MVP Roast Report

**Date:** 2026-03-30
**Project:** The Daily AI Shift — Chemical Engineering x AI
**Overall Score:** 48/100
**Verdict:** NEEDS_WORK

---

## Score Breakdown

| Reviewer | Score | Verdict |
|----------|-------|---------|
| Power User (Raj) | 62/100 | MEH |
| Confused User (Liu Wei) | 32/100 | CONFUSED |
| Skeptic (Nina) | 34/100 | DEAD_ON_ARRIVAL |
| Security | 72/100 | RISKY |
| Mobile (375px) | 42/100 | NEEDS_WORK |

**Weighted:** 62×30% + 32×25% + 34×20% + 72×15% + 42×10% = **48/100**

---

## Top Issues (Must Fix)

1. **Evidence system is theater** — `radar-evidence.json` exists but is never wired up. Users click sectors expecting source data, get nothing. Kills credibility on your biggest differentiator.
2. **Calendar grid breaks on mobile** — 7-column `grid-cols-7` with no breakpoint gives ~38px cells at 375px. Homepage is borderline unusable on phone.
3. **Zero distribution or monetisation model** — ~10,000 person total addressable universe, no way to reach them, no mechanism to charge, no email list, no SEO domain. Product exists in a vacuum.
4. **Completely opaque to non-specialists** — "Theoretical Coverage," "Exposure Score," "Disruption Levels" have no explanations. Anyone outside ChemE/AI bounces in 10 seconds.
5. **Daily post pipeline is fragile and unsustainable** — Shell scripts hardcode `$HOME/Vs Code/First Project/ai-daily-digest`, use regex HTML parsing, no error recovery. Will break on any other machine or when life gets busy.

---

## What Works (Praise)

1. **Consistent design system** — Tailwind theme, typography, skeleton loaders, and empty states are coherent. Looks like a real product at first glance. (Raj)
2. **Hero value prop actually lands** — "The Daily AI Shift — Chemical Engineering x AI" is instantly clear. Specialist audiences self-select immediately. (Liu Wei)
3. **Real pivot opportunity exists** — Quarterly B2B mining intelligence brief at $500–1000/report targeting BHP/Rio/Fortescue ops managers. 10–20 paying subscribers = $10–20k/year. Actually defensible. (Nina)

---

## Security Concerns

- `'unsafe-inline'` and `'unsafe-eval'` in CSP across all HTML files — defeats the purpose
- URL validation only checks `http://` prefix, not `javascript:` or `data:` schemes
- Shell scripts interpolate variables with inconsistent quoting
- SVG sparklines built via string concatenation in `radar.js:256-260`
- `escapeHtml()` applied to URLs but doesn't block `javascript://` scheme

---

## Mobile Issues

- `grid-cols-7` calendar gives ~38px cells at 375px — below 44px minimum touch target
- Hero `text-6xl` wastes vertical space on mobile; no `sm:` breakpoint
- Job/Community filter row overflows at 375px (`whitespace-nowrap` + 4 selects)
- Radar chart legend `flex flex-wrap gap-8` crowds on small screens
- Filter select inputs are ~20px tall (py-1.5) — too small for touch

---

## Individual Roasts

### Power User — Raj (62/100 — MEH)
Functional MVP with good bones and clear ChemE intent. But: evidence system is broken (radar-evidence.json never wired up), jobs page has 5–6 listings (insulting for a jobs section), blog posts are hand-written HTML not JSON-templated, shell scripts hardcode `$HOME/Vs Code/First Project/ai-daily-digest` and use regex to parse HTML. 70% of a real product held together with duct tape.

### Confused User — Liu Wei (32/100 — CONFUSED)
Six nav links with no obvious start point. "AI Impact Radar" — is this a game? "Theoretical Coverage" vs "Observed Coverage" — what am I supposed to DO with this? Calendar says "click a date" but nothing appears if JS fails. No onboarding, no tooltips, no explanation of purpose. Users who don't already know ChemE/AI leave in under 30 seconds.

### Skeptic — Nina (34/100 — DEAD_ON_ARRIVAL)
TAM is ~10,000 people. Students can't pay. Professionals have Bloomberg and industry subscriptions. No user interviews, no evidence anyone asked for this. Daily posting is a treadmill — by month 3 you'll miss a day, then a week, then abandon it. Radar scores are hand-curated opinions dressed as data. Real pivot: quarterly B2B mining intelligence brief at $500–1000/report for BHP/Rio/Fortescue decision-makers. That's a real business.

### Security Review (72/100 — RISKY)
No hardcoded secrets. `escapeHtml()` used consistently throughout — good. But CSP with `unsafe-inline` + `unsafe-eval` is security theatre. URL validation doesn't block `javascript:` scheme. Static site keeps blast radius small. Fix CSP and URL validation before real users land.

### Mobile Review (42/100 — NEEDS_WORK)
Homepage calendar is the critical failure — 7 columns at 375px = cells too small to tap. Radar chart and job filters also problematic. Mobile nav toggle is the one genuinely good implementation (closes on navigate, proper touch target, backdrop blur). Everything else needs a mobile-first audit with device testing.

---

## Next Steps

Run more `/vibe-harness` cycles focusing on:

1. **Wire up the evidence system** — Match `radar-evidence.json` sector keys to `radar-data.json` labels exactly. Add click handlers that render sources. This is your core differentiator — it must work.
2. **Fix mobile calendar** — Replace `grid-cols-7` with a responsive layout (list on mobile, grid on ≥640px). Test on actual 375px viewport.
3. **Add onboarding copy** — One sentence per page explaining what it does and why it matters.
4. **Validate the business model** — Talk to 5 real Australian ChemEs before building more features. Consider the mining brief pivot.
5. **Rewrite shell scripts** — Remove hardcoded home directory paths. Add error checking. Test on a clean machine.
