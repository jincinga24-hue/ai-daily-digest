# Harness State

## Config
- **Idea:** The Daily AI Shift — daily AI news blog with industry impact radar and curated resource feed
- **MVP Features:** 1) Daily Blog Digest, 2) AI Industry Impact Radar, 3) Learn & Adapt Resource Feed
- **Success Metric:** All 3 pages fully functional, mobile responsive, data-driven from JSON files
- **Kill Metric:** If after 10 cycles blog can't render posts and radar chart doesn't display, pivot
- **Tech Stack:** Vanilla HTML/CSS/JS + Chart.js (CDN) + GitHub Pages
- **Total Cycles:** 15
- **Current Phase:** GENERATING

## Cycle Log

### Cycle 1
- **Generator Action:** Reviewed all existing code. Blog feature already functional, no changes needed.
- **Files Changed:** none
- **Scores:** Functionality=6, MVP=6, Runnability=7, Quality=6, Delta=5
- **Overall Score:** 6.1
- **Verdict:** CONTINUE
- **Feedback:**
  1. Add .catch() to every fetch() call — all three JS files silently fail on network error
  2. Add package.json with "start": "npx serve ." script for easy dev server
  3. Enable Chart.js tooltips on the radar chart — 22 labels are unreadable without hover
  4. Populate real URLs in resources.json or mark as null with disabled UI state
  5. Guard against missing fields in blog.js — post.tags.map() crashes if tags key missing
- **MVP Status:** Blog=PARTIAL, Radar=PARTIAL, Resources=PARTIAL

### Cycle 2
- **Generator Action:** Fixed all 5 evaluator items: .catch() on all fetches, defensive null guards, Chart.js tooltips, package.json, README
- **Files Changed:** assets/js/blog.js, assets/js/radar.js, assets/js/learn.js, package.json (new), README.md (new)
- **Scores:** Functionality=8.5, MVP=9, Runnability=8, Quality=7.5, Delta=8
- **Overall Score:** 8.4
- **Verdict:** POLISH
- **Feedback:**
  1. Fix duplicate heading bug in radar.js renderChanges() — already exists in HTML
  2. Replace placeholder resource URLs in resources.json with real links
  3. Add dev server setup instruction to README/package.json
  4. Extract shared formatDate utility to utils.js
  5. Add a second blog post to demonstrate multi-post rendering
- **MVP Status:** Blog=DONE, Radar=DONE, Resources=DONE

### Cycle 3
- **Generator Action:** Fixed duplicate heading, replaced placeholder URLs with real ones, extracted formatDate to utils.js, added 2nd blog post, updated README
- **Files Changed:** radar.js, resources.json, utils.js (new), blog.js, learn.js, index.html, radar.html, learn.html, posts.json, posts/2026-03-28-frontier-model-launches.html (new), README.md
- **Scores:** Functionality=8, MVP=10, Runnability=8.5, Quality=7.5, Delta=8
- **Overall Score:** 8.65
- **Verdict:** POLISH
- **Feedback:**
  1. Missing null-guard on radarChart canvas element
  2. Change dates in renderChanges not formatted through formatDate()
  3. Dead asset guides.json — remove or wire up
  4. innerHTML with unescaped strings — add escapeHtml utility
  5. allData variable in learn.js is dead — remove it
- **MVP Status:** Blog=DONE, Radar=DONE, Resources=DONE

### Cycle 4
- **Generator Action:** Added null-guard on radarChart, formatted change dates, deleted dead guides.json, added escapeHtml utility, removed dead allData variable
- **Files Changed:** radar.js, utils.js, blog.js, learn.js, guides.json (deleted)
- **Scores:** Functionality=8.5, MVP=10, Runnability=8.5, Quality=8, Delta=7
- **Overall Score:** 8.75
- **Verdict:** POLISH
- **Feedback:**
  1. Add serve script and usage note for new users
  2. Verify 2nd post page has rich content (not a stub)
  3. Upgrade var to const/let throughout
  4. Add empty-state for zero posts on blog page
  5. Radar legend is HTML-only — clicking does nothing, may confuse users
- **MVP Status:** Blog=DONE, Radar=DONE, Resources=DONE

### Cycle 5
- **Generator Action:** Upgraded all var to const/let, added empty-state for zero posts, made radar legend interactive with dataset toggling, verified 2nd post has rich content
- **Files Changed:** utils.js, nav.js, blog.js, radar.js, learn.js
- **Scores:** Functionality=8, MVP=10, Runnability=8.5, Quality=8.5, Delta=7.5
- **Overall Score:** 8.70
- **Verdict:** POLISH
- **Feedback:**
  1. No mechanism to auto-generate post HTML pages from data — manual duplication needed
  2. formatDate timezone bug — use string split instead of Date constructor
  3. Some resource URLs may be speculative/invented — verify or mark as placeholder
  4. No setup instruction visible for file:// users who see blank pages
  5. Dead style.css file exists alongside main.css — remove it
- **MVP Status:** Blog=DONE, Radar=DONE, Resources=DONE

### Cycle 6
- **Generator Action:** Fixed formatDate timezone bug, deleted dead style.css and Jekyll files, created create-post.sh template generator, added noscript tag
- **Files Changed:** utils.js, index.html, create-post.sh (new), style.css (deleted), _config.yml/Gemfile/index.md/about.md/_layouts/_includes (deleted)
- **Scores:** Functionality=8.5, MVP=10, Runnability=8.5, Quality=7.5, Delta=7
- **Overall Score:** 8.70
- **Verdict:** POLISH
- **Feedback:**
  1. create-post.sh has wrong POSTS_JSON path — should be assets/data/posts.json not docs/posts.json
  2. Nav HTML copy-pasted across 4 files — extract to shared renderNav()
  3. Add loading skeleton/shimmer before fetch resolves
  4. Move inline styles from JS to CSS utility classes
  5. Validate resource URLs to reject non-http schemes
- **MVP Status:** Blog=DONE, Radar=DONE, Resources=DONE

### Cycle 7
- **Generator Action:** Fixed create-post.sh path, extracted nav to renderNav() in utils.js, added loading skeletons, moved inline styles to CSS classes, added URL validation in learn.js
- **Files Changed:** create-post.sh, utils.js, index.html, radar.html, learn.html, blog.js, radar.js, learn.js, main.css
- **Scores:** Functionality=8.5, MVP=10, Runnability=9, Quality=8, Delta=8
- **Overall Score:** 8.95
- **Verdict:** POLISH
- **Feedback:**
  1. Modernise JS — use const/let, arrow functions, template literals, .map().join()
  2. Fix renderNav base-path detection — pass depth parameter instead of DOM heuristic
  3. Add SRI hash to Chart.js CDN script tag
  4. Replace html += string concatenation with .map().join()
  5. Add smoke tests for escapeHtml, formatDate, and filter logic
- **MVP Status:** Blog=DONE, Radar=DONE, Resources=DONE

### Cycle 8
- **Generator Action:** Modernised all JS to arrow functions/template literals, fixed renderNav with basePath param, added SRI to Chart.js, replaced html+= with .map().join(), added smoke tests
- **Files Changed:** utils.js, nav.js, blog.js, radar.js, learn.js, radar.html, tests/test.html (new)
- **Scores:** Functionality=8.3, MVP=10, Runnability=8.5, Quality=8, Delta=7.5
- **Overall Score:** 8.74
- **Verdict:** POLISH
- **Feedback:**
  1. CRITICAL: Nav toggle broken on mobile — nav.js runs before renderNav injects the button
  2. CRITICAL: ai-publish.sh writes to _posts/ but site reads from posts/ — broken pipeline
  3. Test coverage minimal — only escapeHtml and formatDate tested
  4. formatDate has no guard for malformed date strings — produces garbage
  5. Progress delta modest — plateauing around 8.7-8.9
- **MVP Status:** Blog=DONE, Radar=DONE, Resources=DONE

### Cycle 9
- **Generator Action:** Deleted nav.js (moved toggle into renderNav), fixed ai-publish.sh and ai-auto.sh paths, added formatDate guard, expanded tests
- **Files Changed:** utils.js, nav.js (deleted), index.html, radar.html, learn.html, ai-publish.sh, ai-auto.sh, tests/test.html
- **Scores:** Functionality=7.5, MVP=10, Runnability=8, Quality=7.5, Delta=7
- **Overall Score:** 8.30
- **Verdict:** CONTINUE
- **Feedback:**
  1. CRITICAL: nav.js deleted but post pages + create-post.sh still reference it — mobile nav broken on posts
  2. create-post.sh slug mismatch — writes title-only slug but file is DATE-slug.html
  3. Post pages use static nav, not renderNav() — will drift from other pages
  4. No unit tests for page-level JS render functions
  5. learn.js scope inconsistency — renderFeed is module-level but setupFilters is inside DOMContentLoaded
- **MVP Status:** Blog=DONE, Radar=DONE, Resources=DONE

### Cycle 10
- **Generator Action:** Fixed post pages to use renderNav with basePath '../', fixed create-post.sh template and slug, moved learn.js globals into DOMContentLoaded
- **Files Changed:** posts/2026-03-29-ai-daily-digest.html, posts/2026-03-28-frontier-model-launches.html, scripts/create-post.sh, assets/js/learn.js
- **Scores:** Functionality=8, MVP=10, Runnability=8.5, Quality=7.5, Delta=7.5
- **Overall Score:** 8.60
- **Verdict:** POLISH
- **Feedback:**
  1. Mobile nav doesn't close when tapping a link — add close-on-navigate
  2. ai-auto.sh saves as .md not .html — will break auto-publish pipeline
  3. No tests for blog.js, radar.js, learn.js render functions
  4. resources.json fields not validated — undefined type breaks filter matching
  5. No meta description on index/radar/learn pages — SEO gap
- **MVP Status:** Blog=DONE, Radar=DONE, Resources=DONE

### Cycle 11
- **Generator Action:** Fixed mobile nav close-on-navigate, fixed ai-auto/publish .md→.html, added meta descriptions, extracted testable pure functions, expanded test suite to 20+ assertions
- **Files Changed:** utils.js, ai-auto.sh, ai-publish.sh, index.html, radar.html, learn.html, learn.js, blog.js, tests/test.html
- **Scores:** Functionality=8.5, MVP=10, Runnability=7.5, Quality=8, Delta=7.5
- **Overall Score:** 8.60
- **Verdict:** POLISH
- **Feedback:**
  1. ai-publish.sh copies .md draft as .html without conversion — broken pipeline
  2. Add OG tags and canonical URLs for social sharing/SEO
  3. Add favicon to prevent 404s
  4. escapeHtml missing single quote — add &#x27; replacement
  5. Verify resources.json exists with seed data
- **MVP Status:** Blog=DONE, Radar=DONE, Resources=DONE
